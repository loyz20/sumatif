const crypto = require('crypto');
const { pool } = require('../../config/db');

async function listPtk({ search, page, limit, sortField, sortDirection, sekolahId }) {
	const filters = [];
	const values = [];

	if (sekolahId) {
		filters.push('sekolah_id = ?');
		values.push(sekolahId);
	}

	if (search) {
		filters.push(`(
			nama LIKE ? OR
			nik LIKE ? OR
			nip LIKE ? OR
			nuptk LIKE ? OR
			jenis_kelamin LIKE ? OR
			pendidikan_terakhir LIKE ?
		)`);

		const keyword = `%${search}%`;
		values.push(keyword, keyword, keyword, keyword, keyword, keyword);
	}

	const whereClause = filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';
	const [countRows] = await pool.query(
		`SELECT COUNT(*) AS total FROM ptk ${whereClause}`,
		values
	);

	const total = Number(countRows[0]?.total || 0);
	const offset = (page - 1) * limit;

	const [rows] = await pool.query(
		`SELECT id, sekolah_id, nama, nik, nip, nuptk, jenis_kelamin, tanggal_lahir, pendidikan_terakhir
		 FROM ptk
		 ${whereClause}
		 ORDER BY ${sortField} ${sortDirection}
		 LIMIT ? OFFSET ?`,
		[...values, limit, offset]
	);

	return {
		items: rows,
		pagination: {
			page,
			limit,
			total,
			total_pages: limit > 0 ? Math.ceil(total / limit) : 0,
		},
	};
}

async function findPtkById(id, sekolahId) {
	const [rows] = await pool.query(
		`SELECT id, sekolah_id, nama, nik, nip, nuptk, jenis_kelamin, tanggal_lahir, pendidikan_terakhir
		 FROM ptk
		 WHERE id = ? AND (sekolah_id = ? OR ? IS NULL)
		 LIMIT 1`,
		[id, sekolahId, sekolahId]
	);

	return rows[0] || null;
}

async function findPtkConflicts({ nik, nip, nuptk }, exceptId) {
	const conditions = [];
	const values = [];

	if (nik) {
		conditions.push('nik = ?');
		values.push(nik);
	}

	if (nip) {
		conditions.push('nip = ?');
		values.push(nip);
	}

	if (nuptk) {
		conditions.push('nuptk = ?');
		values.push(nuptk);
	}

	if (conditions.length === 0) {
		return [];
	}

	let query = `SELECT id, nik, nip, nuptk FROM ptk WHERE (${conditions.join(' OR ')})`;
	if (exceptId) {
		query += ' AND id <> ?';
		values.push(exceptId);
	}

	const [rows] = await pool.query(query, values);
	return rows;
}

async function createPtk(data) {
	const id = crypto.randomUUID();

	await pool.query(
		`INSERT INTO ptk (
			id, sekolah_id, nama, nik, nip, nuptk, jenis_kelamin, tanggal_lahir, pendidikan_terakhir
		) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		[
			id,
			data.sekolah_id,
			data.nama,
			data.nik || null,
			data.nip,
			data.nuptk || null,
			data.jenis_kelamin || null,
			data.tanggal_lahir || null,
			data.pendidikan_terakhir || null,
		]
	);

	return findPtkById(id);
}

const PTK_UPDATABLE_FIELDS = new Set([
	'sekolah_id', 'nama', 'nik', 'nip', 'nuptk',
	'jenis_kelamin', 'tanggal_lahir', 'pendidikan_terakhir',
]);

async function updatePtk(id, data, sekolahId) {
	const fields = [];
	const values = [];

	for (const [key, value] of Object.entries(data)) {
		if (PTK_UPDATABLE_FIELDS.has(key)) {
			fields.push(`${key} = ?`);
			// Convert empty string to null for optional fields
			if (['nik', 'nuptk', 'jenis_kelamin', 'tanggal_lahir', 'pendidikan_terakhir'].includes(key) && value === '') {
				values.push(null);
			} else {
				values.push(value);
			}
		}
	}

	if (fields.length === 0) {
		return findPtkById(id, sekolahId);
	}

	values.push(id, sekolahId);

	await pool.query(
		`UPDATE ptk SET ${fields.join(', ')} WHERE id = ? AND sekolah_id = ?`,
		values
	);

	return findPtkById(id, sekolahId);
}

async function deletePtk(id, sekolahId) {
	const [result] = await pool.query('DELETE FROM ptk WHERE id = ? AND sekolah_id = ?', [id, sekolahId]);
	return result.affectedRows > 0;
}

module.exports = {
	listPtk,
	findPtkById,
	findPtkConflicts,
	createPtk,
	updatePtk,
	deletePtk,
};
