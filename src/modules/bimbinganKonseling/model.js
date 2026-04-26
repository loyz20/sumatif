const { pool } = require('../../config/db');

class BimbinganKonselingModel {
  static async listBySchool(sekolahId, filters = {}) {
    let query = `
      SELECT k.*, pd.nama as nama_siswa, g.nama as nama_guru
      FROM konseling k
      JOIN peserta_didik pd ON k.peserta_didik_id = pd.id
      LEFT JOIN ptk g ON k.guru_bk_id = g.id
      WHERE k.sekolah_id = ?
    `;
    const params = [sekolahId];

    if (filters.studentId) {
      query += ' AND k.peserta_didik_id = ?';
      params.push(filters.studentId);
    }

    if (filters.guruId) {
      query += ' AND k.guru_bk_id = ?';
      params.push(filters.guruId);
    }

    // Privacy logic: if not admin/BK, can only see if not private? 
    // Usually only BK/Admin see this anyway.

    query += ' ORDER BY k.tanggal DESC, k.created_at DESC';

    const [rows] = await pool.query(query, params);
    return rows;
  }

  static async findById(id, sekolahId) {
    const [rows] = await pool.query(
      `SELECT k.*, pd.nama as nama_siswa, g.nama as nama_guru
       FROM konseling k
       JOIN peserta_didik pd ON k.peserta_didik_id = pd.id
       LEFT JOIN ptk g ON k.guru_bk_id = g.id
       WHERE k.id = ? AND k.sekolah_id = ?`,
      [id, sekolahId]
    );
    return rows[0];
  }

  static async create(data) {
    const {
      id, sekolah_id, peserta_didik_id, guru_bk_id,
      tanggal, masalah, tindakan, catatan, is_private
    } = data;

    await pool.query(
      `INSERT INTO konseling (
        id, sekolah_id, peserta_didik_id, guru_bk_id,
        tanggal, masalah, tindakan, catatan, is_private
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id, sekolah_id, peserta_didik_id, guru_bk_id,
        tanggal, masalah, tindakan, catatan, is_private
      ]
    );
    return id;
  }

  static async update(id, sekolahId, data) {
    const fields = [];
    const params = [];

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key} = ?`);
        params.push(value);
      }
    });

    if (fields.length === 0) return false;

    params.push(id, sekolahId);
    const [result] = await pool.query(
      `UPDATE konseling SET ${fields.join(', ')} WHERE id = ? AND sekolah_id = ?`,
      params
    );
    return result.affectedRows > 0;
  }

  static async delete(id, sekolahId) {
    const [result] = await pool.query(
      'DELETE FROM konseling WHERE id = ? AND sekolah_id = ?',
      [id, sekolahId]
    );
    return result.affectedRows > 0;
  }
}

module.exports = BimbinganKonselingModel;
