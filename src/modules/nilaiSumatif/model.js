const crypto = require('crypto');
const { pool } = require('../../config/db');
const { logActivity } = require('../../utils/logger');

async function upsertSumatif(data, components) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Calculate final score
    const nilaiAkhir = components.reduce((acc, curr) => acc + (Number(curr.nilai) * Number(curr.bobot)), 0) / 100;

    // 2. Get snapshots (Mapel & Guru)
    const [mapelRows] = await connection.query(
      `SELECT m.nama as mapel_nama, p.nama as guru_nama 
       FROM pembelajaran pb
       JOIN mata_pelajaran m ON pb.mata_pelajaran_id = m.id
       LEFT JOIN ptk p ON pb.ptk_id = p.id
       WHERE pb.id = ?`,
      [data.pembelajaran_id]
    );
    const snapshot = mapelRows[0] || { mapel_nama: '', guru_nama: '' };

    // 3. Check for existing record
    const [existing] = await connection.query(
      `SELECT id FROM nilai_sumatif 
       WHERE sekolah_id = ? AND peserta_didik_id = ? AND pembelajaran_id = ? AND semester_id = ?`,
      [data.sekolah_id, data.peserta_didik_id, data.pembelajaran_id, data.semester_id]
    );

    let sumatifId;
    if (existing.length > 0) {
      sumatifId = existing[0].id;
      // Update Header
      await connection.query(
        `UPDATE nilai_sumatif SET
          nilai_akhir = ?, predikat = ?, deskripsi = ?, 
          nama_mapel_snapshot = ?, nama_guru_snapshot = ?,
          status = ?, updated_by = ?
        WHERE id = ?`,
        [
          nilaiAkhir, data.predikat || '', data.deskripsi || '', 
          snapshot.mapel_nama, snapshot.guru_nama,
          data.status || 'draft', data.user_id, sumatifId
        ]
      );
      // Delete old components
      await connection.query('DELETE FROM komponen_nilai WHERE nilai_sumatif_id = ?', [sumatifId]);
    } else {
      sumatifId = crypto.randomUUID();
      // Insert Header
      await connection.query(
        `INSERT INTO nilai_sumatif (
          id, sekolah_id, peserta_didik_id, rombel_id, pembelajaran_id, semester_id,
          nilai_akhir, predikat, deskripsi, nama_mapel_snapshot, nama_guru_snapshot,
          status, created_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          sumatifId, data.sekolah_id, data.peserta_didik_id, data.rombel_id, data.pembelajaran_id, data.semester_id,
          nilaiAkhir, data.predikat || '', data.deskripsi || '', snapshot.mapel_nama, snapshot.guru_nama,
          data.status || 'draft', data.user_id
        ]
      );
    }

    // 4. Insert Components
    for (const comp of components) {
      await connection.query(
        `INSERT INTO komponen_nilai (id, sekolah_id, nilai_sumatif_id, jenis, nama, bobot, nilai)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [crypto.randomUUID(), data.sekolah_id, sumatifId, comp.jenis, comp.nama, comp.bobot, comp.nilai]
      );
    }

    await connection.commit();

    // Audit Log
    const [siswa] = await connection.query('SELECT nama FROM peserta_didik WHERE id = ?', [data.peserta_didik_id]);
    const namaSiswa = siswa[0]?.nama || 'Siswa';
    
    logActivity({
      user_id: data.user_id,
      action: existing.length > 0 ? 'UPDATE_NILAI' : 'CREATE_NILAI',
      entity_type: 'nilai_sumatif',
      entity_id: sumatifId,
      description: `${existing.length > 0 ? 'Mengubah' : 'Menginput'} nilai sumatif untuk ${namaSiswa} pada mata pelajaran ${snapshot.mapel_nama} (Nilai Akhir: ${nilaiAkhir.toFixed(2)})`
    });

    return sumatifId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function findSumatifById(id, sekolahId) {
  const [rows] = await pool.query(
    `SELECT ns.*, pd.nama as siswa_nama, pd.nis, pd.nisn
     FROM nilai_sumatif ns
     JOIN peserta_didik pd ON ns.peserta_didik_id = pd.id
     WHERE ns.id = ? AND ns.sekolah_id = ?`,
    [id, sekolahId]
  );
  if (!rows[0]) return null;

  const [components] = await pool.query(
    `SELECT * FROM komponen_nilai WHERE nilai_sumatif_id = ? AND sekolah_id = ?`,
    [id, sekolahId]
  );

  return { ...rows[0], komponen: components };
}

async function listSumatifByRombel(rombelId, semesterId, sekolahId) {
  const [rows] = await pool.query(
    `SELECT ns.*, pd.nama as siswa_nama, pd.nis
     FROM nilai_sumatif ns
     JOIN peserta_didik pd ON ns.peserta_didik_id = pd.id
     WHERE ns.rombel_id = ? AND ns.semester_id = ? AND ns.sekolah_id = ?
     ORDER BY pd.nama ASC`,
    [rombelId, semesterId, sekolahId]
  );

  if (rows.length === 0) return [];

  const sumatifIds = rows.map(r => r.id);
  const [components] = await pool.query(
    `SELECT * FROM komponen_nilai WHERE nilai_sumatif_id IN (?) AND sekolah_id = ?`,
    [sumatifIds, sekolahId]
  );

  // Group components by sumatif_id
  const compMap = components.reduce((acc, curr) => {
    if (!acc[curr.nilai_sumatif_id]) acc[curr.nilai_sumatif_id] = [];
    acc[curr.nilai_sumatif_id].push(curr);
    return acc;
  }, {});

  return rows.map(r => ({
    ...r,
    komponen: compMap[r.id] || []
  }));
}

module.exports = {
  upsertSumatif,
  findSumatifById,
  listSumatifByRombel,
};
