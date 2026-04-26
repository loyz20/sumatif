const { pool } = require('../../config/db');
const crypto = require('crypto');

async function createJurnal(data) {
    const id = crypto.randomUUID();
    const {
        sekolah_id,
        guru_id,
        rombel_id,
        pembelajaran_id,
        semester_id,
        tanggal,
        jam_ke,
        tp_id,
        materi,
        catatan,
        created_by,
        kehadiran // array of { peserta_didik_id, status, catatan }
    } = data;

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
        await connection.query(
            `INSERT INTO jurnal (
                id, sekolah_id, guru_id, rombel_id, pembelajaran_id, 
                semester_id, tanggal, jam_ke, tp_id, materi, catatan, created_by
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [id, sekolah_id, guru_id, rombel_id, pembelajaran_id, semester_id, tanggal, jam_ke, tp_id, materi, catatan, created_by]
        );

        if (kehadiran && kehadiran.length > 0) {
            const values = kehadiran.map(k => [
                crypto.randomUUID(),
                id,
                k.peserta_didik_id,
                k.status,
                k.catatan || null
            ]);
            await connection.query(
                `INSERT INTO jurnal_kehadiran (id, jurnal_id, peserta_didik_id, status, catatan) VALUES ?`,
                [values]
            );
        }

        await connection.commit();
        return { id };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

async function updateJurnal(id, data) {
    const {
        jam_ke,
        tp_id,
        materi,
        catatan,
        kehadiran
    } = data;

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
        await connection.query(
            `UPDATE jurnal SET jam_ke = ?, tp_id = ?, materi = ?, catatan = ? WHERE id = ?`,
            [jam_ke, tp_id, materi, catatan, id]
        );

        if (kehadiran && kehadiran.length > 0) {
            // Upsert or simple delete/insert
            await connection.query(`DELETE FROM jurnal_kehadiran WHERE jurnal_id = ?`, [id]);
            const values = kehadiran.map(k => [
                crypto.randomUUID(),
                id,
                k.peserta_didik_id,
                k.status,
                k.catatan || null
            ]);
            await connection.query(
                `INSERT INTO jurnal_kehadiran (id, jurnal_id, peserta_didik_id, status, catatan) VALUES ?`,
                [values]
            );
        }

        await connection.commit();
        return true;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

async function getJurnalList(filters) {
    const { sekolah_id, guru_id, rombel_id, pembelajaran_id, semester_id, start_date, end_date } = filters;
    let sql = `
        SELECT 
            j.*, 
            r.nama as rombel_nama, 
            mp.nama as mapel_nama,
            (SELECT COUNT(*) FROM jurnal_kehadiran WHERE jurnal_id = j.id AND status = 'Hadir') as count_hadir,
            (SELECT COUNT(*) FROM jurnal_kehadiran WHERE jurnal_id = j.id AND status IN ('Izin', 'Sakit')) as count_izin,
            (SELECT COUNT(*) FROM jurnal_kehadiran WHERE jurnal_id = j.id AND status = 'Alpa') as count_alpa,
            (SELECT COUNT(*) FROM jurnal_kehadiran WHERE jurnal_id = j.id) as total_siswa
        FROM jurnal j
        JOIN rombel r ON j.rombel_id = r.id
        JOIN pembelajaran p ON j.pembelajaran_id = p.id
        JOIN mata_pelajaran mp ON p.mata_pelajaran_id = mp.id
        WHERE j.sekolah_id = ?
    `;
    const params = [sekolah_id];

    if (guru_id) {
        sql += ` AND j.guru_id = ?`;
        params.push(guru_id);
    }
    if (rombel_id) {
        sql += ` AND j.rombel_id = ?`;
        params.push(rombel_id);
    }
    if (pembelajaran_id) {
        sql += ` AND j.pembelajaran_id = ?`;
        params.push(pembelajaran_id);
    }
    if (semester_id) {
        sql += ` AND j.semester_id = ?`;
        params.push(semester_id);
    }
    if (start_date) {
        sql += ` AND j.tanggal >= ?`;
        params.push(start_date);
    }
    if (end_date) {
        sql += ` AND j.tanggal <= ?`;
        params.push(end_date);
    }

    sql += ` ORDER BY j.tanggal DESC, j.created_at DESC`;

    const [rows] = await pool.query(sql, params);
    return rows;
}

async function getJurnalById(id) {
    const [jurnal] = await pool.query(`SELECT * FROM jurnal WHERE id = ?`, [id]);
    if (jurnal.length === 0) return null;

    const [kehadiran] = await pool.query(`
        SELECT jk.*, s.nama as siswa_nama, s.nis
        FROM jurnal_kehadiran jk
        JOIN peserta_didik s ON jk.peserta_didik_id = s.id
        WHERE jk.jurnal_id = ?
    `, [id]);

    return {
        ...jurnal[0],
        kehadiran
    };
}

async function deleteJurnal(id) {
    await pool.query(`DELETE FROM jurnal WHERE id = ?`, [id]);
    return true;
}

async function getRekapKehadiran(filters) {
    const { sekolah_id, guru_id, rombel_id, pembelajaran_id, semester_id } = filters;
    
    let whereClause = 'WHERE r.id = ?';
    const params = [sekolah_id];
    
    let joinFilter = 'AND j.sekolah_id = ?';
    if (guru_id) {
        joinFilter += ' AND j.guru_id = ?';
        params.push(guru_id);
    }
    if (pembelajaran_id) {
        joinFilter += ' AND j.pembelajaran_id = ?';
        params.push(pembelajaran_id);
    }
    if (semester_id) {
        joinFilter += ' AND j.semester_id = ?';
        params.push(semester_id);
    }
    params.push(rombel_id);

    const [rows] = await pool.query(`
        SELECT 
            pd.id as peserta_didik_id,
            pd.nama as siswa_nama,
            pd.nis,
            SUM(CASE WHEN jk.status = 'Hadir' THEN 1 ELSE 0 END) as hadir,
            SUM(CASE WHEN jk.status = 'Izin' THEN 1 ELSE 0 END) as izin,
            SUM(CASE WHEN jk.status = 'Sakit' THEN 1 ELSE 0 END) as sakit,
            SUM(CASE WHEN jk.status = 'Alpa' THEN 1 ELSE 0 END) as alpa,
            COUNT(jk.id) as total_pertemuan
        FROM peserta_didik pd
        JOIN anggota_rombel ar ON pd.id = ar.peserta_didik_id
        JOIN rombel r ON ar.rombel_id = r.id
        LEFT JOIN jurnal j ON j.rombel_id = r.id ${joinFilter}
        LEFT JOIN jurnal_kehadiran jk ON j.id = jk.jurnal_id AND jk.peserta_didik_id = pd.id
        ${whereClause}
        GROUP BY pd.id, pd.nama, pd.nis
        ORDER BY pd.nama ASC
    `, params);
    return rows;
}

async function getSiswaByRombel(rombel_id) {
    const [rows] = await pool.query(`
        SELECT pd.id as peserta_didik_id, pd.nama as siswa_nama, pd.nis
        FROM anggota_rombel ar
        JOIN peserta_didik pd ON ar.peserta_didik_id = pd.id
        WHERE ar.rombel_id = ?
        ORDER BY pd.nama ASC
    `, [rombel_id]);
    return rows;
}

module.exports = {
    createJurnal,
    updateJurnal,
    getJurnalList,
    getJurnalById,
    deleteJurnal,
    getSiswaByRombel,
    getRekapKehadiran
};
