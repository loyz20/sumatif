const service = require('./service');
const { successResponse, errorResponse } = require('../../utils/response');

async function getKategori(req, res) {
    try {
        const data = await service.getKategori(req.user.sekolah_id, req.user.ref_id);
        return successResponse(res, data);
    } catch (error) {
        return errorResponse(res, error.message);
    }
}

async function saveKategori(req, res) {
    try {
        const { id } = req.params;
        await service.saveKategori(req.user.sekolah_id, req.user.ref_id, id, req.body);
        return successResponse(res, { message: 'Kategori berhasil disimpan' });
    } catch (error) {
        return errorResponse(res, error.message);
    }
}

async function removeKategori(req, res) {
    try {
        await service.removeKategori(req.params.id, req.user.sekolah_id, req.user.ref_id);
        return successResponse(res, { message: 'Kategori berhasil dihapus' });
    } catch (error) {
        return errorResponse(res, error.message);
    }
}

async function createPenilaian(req, res) {
    try {
        const data = { ...req.body, sekolah_id: req.user.sekolah_id };
        const id = await service.startPenilaian(data, req.user.id);
        return successResponse(res, { id, message: 'Kegiatan penilaian berhasil dibuat' }, 201);
    } catch (error) {
        return errorResponse(res, error.message);
    }
}

async function getPenilaianList(req, res) {
    try {
        const data = await service.getPenilaianList(req.user.sekolah_id, req.query);
        return successResponse(res, data);
    } catch (error) {
        return errorResponse(res, error.message);
    }
}

async function deletePenilaian(req, res) {
    try {
        await service.removePenilaian(req.params.id, req.user.sekolah_id, req.user.id);
        return successResponse(res, { message: 'Kegiatan penilaian berhasil dihapus' });
    } catch (error) {
        return errorResponse(res, error.message);
    }
}

async function getGrades(req, res) {
    try {
        const data = await service.getGradesForInput(req.params.id);
        return successResponse(res, data);
    } catch (error) {
        return errorResponse(res, error.message);
    }
}

async function saveGrades(req, res) {
    try {
        await service.saveGradesBulk(req.params.id, req.body.items, req.user.id);
        return successResponse(res, { message: 'Nilai berhasil disimpan' });
    } catch (error) {
        return errorResponse(res, error.message);
    }
}

async function getRekap(req, res) {
    try {
        const { rombel_id, pembelajaran_id, semester_id } = req.query;
        const data = await service.getCalculation(req.user.sekolah_id, rombel_id, pembelajaran_id, semester_id);
        return successResponse(res, data);
    } catch (error) {
        return errorResponse(res, error.message);
    }
}

module.exports = {
    getKategori,
    saveKategori,
    removeKategori,
    createPenilaian,
    getPenilaianList,
    deletePenilaian,
    getGrades,
    saveGrades,
    getRekap
};
