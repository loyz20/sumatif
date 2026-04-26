const { pool } = require('../../config/db');
const crypto = require('crypto');

/**
 * CAPAIAN PEMBELAJARAN (CP)
 */
async function listCP(filters = {}) {
    let query = 'SELECT * FROM cp WHERE 1=1';
    const params = [];

    if (filters.mapel_id) {
        query += ' AND mapel_id = ?';
        params.push(filters.mapel_id);
    }

    if (filters.fase) {
        query += ' AND fase = ?';
        params.push(filters.fase);
    }

    const [rows] = await pool.query(query, params);
    return rows;
}

async function createCP(data) {
    const id = crypto.randomUUID();
    const { mapel_id, fase, deskripsi } = data;

    await pool.query(`
        INSERT INTO cp (id, mapel_id, fase, deskripsi)
        VALUES (?, ?, ?, ?)
    `, [id, mapel_id, fase, deskripsi]);
    
    return id;
}

async function updateCP(id, data) {
    const { mapel_id, fase, deskripsi } = data;
    await pool.query(`
        UPDATE cp SET mapel_id = ?, fase = ?, deskripsi = ?
        WHERE id = ?
    `, [mapel_id, fase, deskripsi, id]);
}

async function deleteCP(id) {
    await pool.query('DELETE FROM cp WHERE id = ?', [id]);
}

/**
 * TUJUAN PEMBELAJARAN (TP)
 */
async function listTP(pembelajaran_id) {
    const [rows] = await pool.query(`
        SELECT tp.*, cp.fase, cp.deskripsi as cp_deskripsi
        FROM tp
        JOIN cp ON tp.cp_id = cp.id
        WHERE tp.pembelajaran_id = ?
        ORDER BY tp.urutan ASC
    `, [pembelajaran_id]);
    return rows;
}

async function createTP(data) {
    const id = crypto.randomUUID();
    const { pembelajaran_id, cp_id, kode, deskripsi, urutan } = data;

    await pool.query(`
        INSERT INTO tp (id, pembelajaran_id, cp_id, kode, deskripsi, urutan)
        VALUES (?, ?, ?, ?, ?, ?)
    `, [id, pembelajaran_id, cp_id, kode, deskripsi, urutan || 0]);
    
    return id;
}

async function updateTP(id, data) {
    const { kode, deskripsi, urutan } = data;
    await pool.query(`
        UPDATE tp SET kode = ?, deskripsi = ?, urutan = ?
        WHERE id = ?
    `, [kode, deskripsi, urutan, id]);
}

async function deleteTP(id) {
    await pool.query('DELETE FROM tp WHERE id = ?', [id]);
}

/**
 * ALUR TUJUAN PEMBELAJARAN (ATP)
 */
async function getATP(pembelajaran_id) {
    const [rows] = await pool.query('SELECT * FROM atp WHERE pembelajaran_id = ?', [pembelajaran_id]);
    if (rows.length === 0) return null;

    const atp = rows[0];
    const [details] = await pool.query(`
        SELECT ad.*, tp.kode as tp_kode, tp.deskripsi as tp_deskripsi
        FROM atp_detail ad
        JOIN tp ON ad.tp_id = tp.id
        WHERE ad.atp_id = ?
        ORDER BY ad.minggu_ke ASC, ad.urutan ASC
    `, [atp.id]);

    return { ...atp, details };
}

async function saveATP(pembelajaran_id, data) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
        // 1. Get or Create ATP header
        const [existing] = await connection.query('SELECT id FROM atp WHERE pembelajaran_id = ?', [pembelajaran_id]);
        let atp_id;

        if (existing.length > 0) {
            atp_id = existing[0].id;
            await connection.query('UPDATE atp SET nama = ? WHERE id = ?', [data.nama, atp_id]);
        } else {
            atp_id = crypto.randomUUID();
            await connection.query('INSERT INTO atp (id, pembelajaran_id, nama) VALUES (?, ?, ?)', [atp_id, pembelajaran_id, data.nama]);
        }

        // 2. Clear existing details
        await connection.query('DELETE FROM atp_detail WHERE atp_id = ?', [atp_id]);

        // 3. Insert new details
        if (data.details && data.details.length > 0) {
            const values = data.details.map(d => [
                crypto.randomUUID(),
                atp_id,
                d.tp_id,
                d.minggu_ke,
                d.urutan || 0
            ]);
            await connection.query('INSERT INTO atp_detail (id, atp_id, tp_id, minggu_ke, urutan) VALUES ?', [values]);
        }

        await connection.commit();
        return atp_id;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

/**
 * MODUL AJAR
 */
async function listModulAjar(tp_id) {
    const [rows] = await pool.query('SELECT * FROM modul_ajar WHERE tp_id = ? ORDER BY created_at DESC', [tp_id]);
    return rows;
}

async function getModulAjar(id) {
    const [rows] = await pool.query('SELECT * FROM modul_ajar WHERE id = ?', [id]);
    return rows[0];
}

async function saveModulAjar(data, user_id) {
    const { id, tp_id, judul, konten_json, is_generated_ai } = data;
    
    if (id) {
        await pool.query(`
            UPDATE modul_ajar SET judul = ?, konten_json = ?, is_generated_ai = ?
            WHERE id = ?
        `, [judul, JSON.stringify(konten_json), is_generated_ai || false, id]);
        return id;
    } else {
        const newId = crypto.randomUUID();
        await pool.query(`
            INSERT INTO modul_ajar (id, tp_id, judul, konten_json, is_generated_ai, created_by)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [newId, tp_id, judul, JSON.stringify(konten_json), is_generated_ai || false, user_id]);
        return newId;
    }
}

module.exports = {
    listCP, createCP, updateCP, deleteCP,
    listTP, createTP, updateTP, deleteTP,
    getATP, saveATP,
    listModulAjar, getModulAjar, saveModulAjar
};
