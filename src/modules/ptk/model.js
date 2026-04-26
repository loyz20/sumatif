const crypto = require('crypto');
const { pool } = require('../../config/db');

async function listPtk({ 
	search, page, limit, sortField, sortDirection, sekolahId, 
	jenis_kelamin, pendidikan_terakhir 
}) {
	const filters = [];
	const values = [];

	if (sekolahId) {
		filters.push('sekolah_id = ?');
		values.push(sekolahId);
	}

	if (jenis_kelamin) {
		filters.push('jenis_kelamin = ?');
		values.push(jenis_kelamin);
	}

	if (pendidikan_terakhir) {
		filters.push('pendidikan_terakhir = ?');
		values.push(pendidikan_terakhir);
	}

	if (search) {
		filters.push(`(
			nama LIKE ? OR
			nip LIKE ? OR
			nuptk LIKE ?
		)`);

		const keyword = `%${search}%`;
		values.push(keyword, keyword, keyword);
	}

	const whereClause = filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';
	const [countRows] = await pool.query(
		`SELECT COUNT(*) AS total FROM ptk ${whereClause}`,
		values
	);

	const total = Number(countRows[0]?.total || 0);
	const offset = (page - 1) * limit;

	const [rows] = await pool.query(
		`SELECT id, sekolah_id, nama, nip, nuptk, jenis_kelamin, tanggal_lahir, pendidikan_terakhir
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
		`SELECT id, sekolah_id, nama, nip, nuptk, jenis_kelamin, tanggal_lahir, pendidikan_terakhir
		 FROM ptk
		 WHERE id = ? AND (sekolah_id = ? OR ? IS NULL)
		 LIMIT 1`,
		[id, sekolahId, sekolahId]
	);

	return rows[0] || null;
}

async function findPtkConflicts({ nip, nuptk }, exceptId) {
	const conditions = [];
	const values = [];

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

	let query = `SELECT id, nip, nuptk FROM ptk WHERE (${conditions.join(' OR ')})`;
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
			id, sekolah_id, nama, nip, nuptk, jenis_kelamin, tanggal_lahir, pendidikan_terakhir
		) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
		[
			id,
			data.sekolah_id,
			data.nama,
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
	'sekolah_id', 'nama', 'nip', 'nuptk',
	'jenis_kelamin', 'tanggal_lahir', 'pendidikan_terakhir',
]);

async function updatePtk(id, data, sekolahId) {
	const fields = [];
	const values = [];

	for (const [key, value] of Object.entries(data)) {
		if (PTK_UPDATABLE_FIELDS.has(key)) {
			fields.push(`${key} = ?`);
			// Convert empty string to null for optional fields
			if (['nuptk', 'jenis_kelamin', 'tanggal_lahir', 'pendidikan_terakhir'].includes(key) && value === '') {
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

async function getPtkStats(sekolahId) {
	const [totalRows] = await pool.query(
		'SELECT COUNT(*) as total FROM ptk WHERE sekolah_id = ?',
		[sekolahId]
	);

	const [genderRows] = await pool.query(
		'SELECT jenis_kelamin, COUNT(*) as count FROM ptk WHERE sekolah_id = ? GROUP BY jenis_kelamin',
		[sekolahId]
	);

	const [pendidikanRows] = await pool.query(
		'SELECT pendidikan_terakhir, COUNT(*) as count FROM ptk WHERE sekolah_id = ? GROUP BY pendidikan_terakhir',
		[sekolahId]
	);

	return {
		total: totalRows[0].total,
		gender: genderRows,
		pendidikan: pendidikanRows
	};
}

module.exports = {
	listPtk,
	findPtkById,
	findPtkConflicts,
	createPtk,
	updatePtk,
	deletePtk,
	getPtkStats,
};
