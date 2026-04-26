const model = require('./model');

async function getJurnal(filters) {
    return await model.getJurnalList(filters);
}

async function getJurnalDetail(id) {
    return await model.getJurnalById(id);
}

async function saveJurnal(data) {
    let result;
    if (data.id) {
        result = await model.updateJurnal(data.id, data);
    } else {
        result = await model.createJurnal(data);
    }

    // --- Post-save notifications ---
    // Only for new journals or status changes? For now, let's keep it simple for new journals.
    if (!data.id && data.kehadiran && data.kehadiran.length > 0) {
        try {
            const absentSiswa = data.kehadiran.filter(k => k.status === 'Alpa');
            if (absentSiswa.length > 0) {
                const { pool } = require('../../config/db');
                const NotificationService = require('../notification/service');
                
                for (const k of absentSiswa) {
                    // Find user_id for this student
                    const [users] = await pool.query(
                        'SELECT id FROM users WHERE ref_id = ? AND role = "siswa"',
                        [k.peserta_didik_id]
                    );
                    
                    if (users.length > 0) {
                        await NotificationService.send(
                            users[0].id,
                            'Ketidakhadiran Dicatat',
                            `Anda tercatat Alpa pada mata pelajaran ${data.materi || 'terkait'} tanggal ${data.tanggal}.`,
                            'error'
                        );
                    }
                }
            }
        } catch (e) {
            console.error('Failed to send attendance notifications:', e);
        }
    }

    return result;
}

async function removeJurnal(id) {
    return await model.deleteJurnal(id);
}

async function getSiswaForJurnal(rombel_id) {
    return await model.getSiswaByRombel(rombel_id);
}

async function getRekapKehadiran(filters) {
    return await model.getRekapKehadiran(filters);
}

module.exports = {
    getJurnal,
    getJurnalDetail,
    saveJurnal,
    removeJurnal,
    getSiswaForJurnal,
    getRekapKehadiran
};
