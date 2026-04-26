const service = require('./service');
const { successResponse, errorResponse } = require('../../utils/response');

async function getJurnal(req, res) {
    try {
        const filters = {
            sekolah_id: req.user.sekolah_id,
            guru_id: req.user.role === 'guru' ? req.user.ref_id : req.query.guru_id,
            ...req.query
        };
        const data = await service.getJurnal(filters);
        return successResponse(res, data);
    } catch (error) {
        return errorResponse(res, error.message);
    }
}

async function getJurnalDetail(req, res) {
    try {
        const data = await service.getJurnalDetail(req.params.id);
        if (!data) return errorResponse(res, 'Jurnal tidak ditemukan', 404);
        return successResponse(res, data);
    } catch (error) {
        return errorResponse(res, error.message);
    }
}

async function saveJurnal(req, res) {
    try {
        const data = {
            ...req.body,
            sekolah_id: req.user.sekolah_id,
            created_by: req.user.id
        };
        
        // If teacher, set guru_id automatically
        if (req.user.role === 'guru') {
            data.guru_id = req.user.ref_id;
        }

        const result = await service.saveJurnal(data);
        return successResponse(res, result, 'Jurnal berhasil disimpan');
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return errorResponse(res, 'Jurnal untuk mata pelajaran ini pada tanggal tersebut sudah ada.');
        }
        return errorResponse(res, error.message);
    }
}

async function removeJurnal(req, res) {
    try {
        await service.removeJurnal(req.params.id);
        return successResponse(res, null, 'Jurnal berhasil dihapus');
    } catch (error) {
        return errorResponse(res, error.message);
    }
}

async function getSiswaRombel(req, res) {
    try {
        const { rombel_id } = req.params;
        const data = await service.getSiswaForJurnal(rombel_id);
        return successResponse(res, data);
    } catch (error) {
        return errorResponse(res, error.message);
    }
}

async function getRekap(req, res) {
    try {
        const filters = {
            sekolah_id: req.user.sekolah_id,
            guru_id: req.user.role === 'guru' ? req.user.ref_id : req.query.guru_id,
            ...req.query
        };
        const data = await service.getRekapKehadiran(filters);
        return successResponse(res, data);
    } catch (error) {
        return errorResponse(res, error.message);
    }
}

module.exports = {
    getJurnal,
    getJurnalDetail,
    saveJurnal,
    removeJurnal,
    getSiswaRombel,
    getRekap
};
