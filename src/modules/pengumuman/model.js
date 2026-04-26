const { pool } = require('../../config/db');
const crypto = require('crypto');

async function listPengumuman(sekolah_id, role = 'all', includeInactive = false) {
    let query = `
        SELECT p.*, u.username as creator_name 
        FROM pengumuman p
        LEFT JOIN users u ON p.created_by = u.id
        WHERE p.sekolah_id = ?
    `;
    const params = [sekolah_id];

    if (role !== 'admin') {
        query += ` AND (p.target_role = 'all' OR p.target_role = ?)`;
        params.push(role);
    }

    if (!includeInactive) {
        query += ` AND p.is_active = TRUE`;
    }

    query += ` ORDER BY p.created_at DESC`;

    const [rows] = await pool.query(query, params);
    return rows;
}

async function createPengumuman(sekolah_id, data, user_id) {
    const id = crypto.randomUUID();
    const { title, content, type, target_role } = data;
    
    await pool.query(`
        INSERT INTO pengumuman (id, sekolah_id, title, content, type, target_role, created_by)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [id, sekolah_id, title, content, type || 'info', target_role || 'all', user_id]);
    
    return id;
}

async function updatePengumuman(id, sekolah_id, data) {
    const { title, content, type, target_role, is_active } = data;
    
    await pool.query(`
        UPDATE pengumuman 
        SET title = ?, content = ?, type = ?, target_role = ?, is_active = ?
        WHERE id = ? AND sekolah_id = ?
    `, [title, content, type, target_role, is_active, id, sekolah_id]);
}

async function deletePengumuman(id, sekolah_id) {
    await pool.query(`DELETE FROM pengumuman WHERE id = ? AND sekolah_id = ?`, [id, sekolah_id]);
}

module.exports = {
    listPengumuman,
    createPengumuman,
    updatePengumuman,
    deletePengumuman
};
