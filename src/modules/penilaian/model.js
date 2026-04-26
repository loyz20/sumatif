const crypto = require('crypto');
const { pool } = require('../../config/db');
const { logActivity } = require('../../utils/logger');

/**
 * Kategori Penilaian (Master Bobot)
 */
async function createKategori(sekolah_id, ptk_id, data) {
    const id = crypto.randomUUID();
    await pool.query(
        'INSERT INTO kategori_penilaian (id, sekolah_id, ptk_id, nama, bobot) VALUES (?, ?, ?, ?, ?)',
        [id, sekolah_id, ptk_id, data.nama, data.bobot]
    );
    return id;
}

async function getKategoriByPtk(sekolah_id, ptk_id) {
    const [rows] = await pool.query(
        'SELECT * FROM kategori_penilaian WHERE sekolah_id = ? AND ptk_id = ? ORDER BY created_at ASC',
        [sekolah_id, ptk_id]
    );
    return rows;
}

async function updateKategori(id, sekolah_id, ptk_id, data) {
    await pool.query(
        'UPDATE kategori_penilaian SET nama = ?, bobot = ? WHERE id = ? AND sekolah_id = ? AND ptk_id = ?',
        [data.nama, data.bobot, id, sekolah_id, ptk_id]
    );
    return true;
}

async function deleteKategori(id, sekolah_id, ptk_id) {
    await pool.query(
        'DELETE FROM kategori_penilaian WHERE id = ? AND sekolah_id = ? AND ptk_id = ?',
        [id, sekolah_id, ptk_id]
    );
    return true;
}

/**
 * Penilaian (Header)
 */
async function createPenilaian(data, user_id) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const penilaianId = crypto.randomUUID();
        
        // 1. Insert Header
        await connection.query(
            `INSERT INTO penilaian (
                id, sekolah_id, rombel_id, pembelajaran_id, semester_id, kategori_id, nama, tanggal, created_by
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                penilaianId, data.sekolah_id, data.rombel_id, data.pembelajaran_id, 
                data.semester_id, data.kategori_id, data.nama, data.tanggal, user_id
            ]
        );

        // 2. Initial detail records for all students in the rombel
        const [students] = await connection.query(
            'SELECT peserta_didik_id FROM anggota_rombel WHERE rombel_id = ?',
            [data.rombel_id]
        );

        for (const s of students) {
            await connection.query(
                'INSERT INTO nilai_siswa (id, penilaian_id, peserta_didik_id, nilai) VALUES (?, ?, ?, ?)',
                [crypto.randomUUID(), penilaianId, s.peserta_didik_id, 0]
            );
        }

        await connection.commit();

        logActivity({
            user_id,
            action: 'CREATE_PENILAIAN',
            entity_type: 'penilaian',
            entity_id: penilaianId,
            description: `Membuat kegiatan penilaian baru: ${data.nama}`
        });

        return penilaianId;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

async function listPenilaian(sekolah_id, params) {
    let sql = `
        SELECT p.*, kp.nama as kategori_nama, kp.bobot as kategori_bobot,
               r.nama as rombel_nama, mp.nama as mapel_nama
        FROM penilaian p
        JOIN kategori_penilaian kp ON p.kategori_id = kp.id
        JOIN rombel r ON p.rombel_id = r.id
        JOIN pembelajaran pem ON p.pembelajaran_id = pem.id
        JOIN mata_pelajaran mp ON pem.mata_pelajaran_id = mp.id
        WHERE p.sekolah_id = ?
    `;
    const values = [sekolah_id];

    if (params.rombel_id) {
        sql += ' AND p.rombel_id = ?';
        values.push(params.rombel_id);
    }
    if (params.pembelajaran_id) {
        sql += ' AND p.pembelajaran_id = ?';
        values.push(params.pembelajaran_id);
    }
    if (params.semester_id) {
        sql += ' AND p.semester_id = ?';
        values.push(params.semester_id);
    }

    sql += ' ORDER BY p.tanggal DESC, p.created_at DESC';

    const [rows] = await pool.query(sql, values);
    return rows;
}

async function deletePenilaian(id, sekolah_id, user_id) {
    const [penilaian] = await pool.query('SELECT nama FROM penilaian WHERE id = ? AND sekolah_id = ?', [id, sekolah_id]);
    if (!penilaian[0]) return false;

    await pool.query('DELETE FROM penilaian WHERE id = ? AND sekolah_id = ?', [id, sekolah_id]);
    
    logActivity({
        user_id,
        action: 'DELETE_PENILAIAN',
        entity_type: 'penilaian',
        entity_id: id,
        description: `Menghapus kegiatan penilaian: ${penilaian[0].nama}`
    });
    
    return true;
}

/**
 * Nilai (Bulk Update)
 */
async function getNilaiSiswaByPenilaian(penilaianId) {
    const [rows] = await pool.query(
        `SELECT ns.*, pd.nama as siswa_nama, pd.nis
         FROM nilai_siswa ns
         JOIN peserta_didik pd ON ns.peserta_didik_id = pd.id
         WHERE ns.penilaian_id = ?
         ORDER BY pd.nama ASC`,
        [penilaianId]
    );
    return rows;
}

async function bulkUpdateNilai(penilaianId, items, user_id) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        for (const item of items) {
            await connection.query(
                'UPDATE nilai_siswa SET nilai = ? WHERE penilaian_id = ? AND peserta_didik_id = ?',
                [item.nilai, penilaianId, item.peserta_didik_id]
            );
        }

        await connection.commit();

        const [p] = await connection.query('SELECT nama FROM penilaian WHERE id = ?', [penilaianId]);
        logActivity({
            user_id,
            action: 'UPDATE_NILAI_BULK',
            entity_type: 'penilaian',
            entity_id: penilaianId,
            description: `Update nilai massal untuk penilaian: ${p[0]?.nama || penilaianId}`
        });

        return true;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

/**
 * Rekap Nilai Akhir (Calculation)
 * Rumus: Sum(Nilai * Bobot) / Sum(Bobot)
 */
async function getRekapNilai(sekolah_id, rombel_id, pembelajaran_id, semester_id) {
    // 1. Get all students in rombel
    const [students] = await pool.query(
        `SELECT pd.id as peserta_didik_id, pd.nama, pd.nis
         FROM anggota_rombel ar
         JOIN peserta_didik pd ON ar.peserta_didik_id = pd.id
         WHERE ar.rombel_id = ?
         ORDER BY pd.nama ASC`,
        [rombel_id]
    );

    // 2. Get the PTK ID for this pembelajaran to get the correct weights
    const [pembelajaran] = await pool.query('SELECT ptk_id FROM pembelajaran WHERE id = ?', [pembelajaran_id]);
    const ptkId = pembelajaran[0]?.ptk_id;

    // 3. Get all assessment categories and their weights for this specific teacher
    const categories = await getKategoriByPtk(sekolah_id, ptkId);
    const totalWeight = categories.reduce((sum, c) => sum + Number(c.bobot), 0);

    // 3. Get average grade per student per category
    const [grades] = await pool.query(
        `SELECT p.kategori_id, ns.peserta_didik_id, AVG(ns.nilai) as rata_rata
         FROM penilaian p
         JOIN nilai_siswa ns ON p.id = ns.penilaian_id
         WHERE p.sekolah_id = ? AND p.rombel_id = ? AND p.pembelajaran_id = ? AND p.semester_id = ?
         GROUP BY p.kategori_id, ns.peserta_didik_id`,
        [sekolah_id, rombel_id, pembelajaran_id, semester_id]
    );

    // 4. Map and Calculate
    return students.map(s => {
        let weightedSum = 0;
        const detailPerKategori = {};

        categories.forEach(cat => {
            const gradeEntry = grades.find(g => g.peserta_didik_id === s.peserta_didik_id && g.kategori_id === cat.id);
            const score = gradeEntry ? Number(gradeEntry.rata_rata) : 0;
            weightedSum += score * (Number(cat.bobot) / (totalWeight || 1));
            detailPerKategori[cat.nama] = score;
        });

        return {
            ...s,
            detail: detailPerKategori,
            nilai_akhir: weightedSum
        };
    });
}

module.exports = {
    createKategori,
    getKategoriByPtk,
    updateKategori,
    deleteKategori,
    createPenilaian,
    listPenilaian,
    deletePenilaian,
    getNilaiSiswaByPenilaian,
    bulkUpdateNilai,
    getRekapNilai
};
