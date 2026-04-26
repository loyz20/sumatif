const model = require('./model');

async function getKategori(sekolahId, ptkId) {
    return await model.getKategoriByPtk(sekolahId, ptkId);
}

async function saveKategori(sekolahId, ptkId, id, data) {
    if (id) {
        return await model.updateKategori(id, sekolahId, ptkId, data);
    }
    return await model.createKategori(sekolahId, ptkId, data);
}

async function removeKategori(id, sekolahId, ptkId) {
    return await model.deleteKategori(id, sekolahId, ptkId);
}

async function startPenilaian(data, userId) {
    if (!data.nama || !data.kategori_id || !data.rombel_id || !data.pembelajaran_id || !data.semester_id) {
        throw new Error('Data penilaian tidak lengkap');
    }
    return await model.createPenilaian(data, userId);
}

async function getPenilaianList(sekolahId, query) {
    return await model.listPenilaian(sekolahId, query);
}

async function getGradesForInput(penilaianId) {
    return await model.getNilaiSiswaByPenilaian(penilaianId);
}

async function saveGradesBulk(penilaianId, items, userId) {
    if (!Array.isArray(items)) throw new Error('Items harus berupa array');
    return await model.bulkUpdateNilai(penilaianId, items, userId);
}

async function getCalculation(sekolahId, rombelId, pembelajaranId, semesterId) {
    return await model.getRekapNilai(sekolahId, rombelId, pembelajaranId, semesterId);
}

async function removePenilaian(id, sekolahId, userId) {
    return await model.deletePenilaian(id, sekolahId, userId);
}

module.exports = {
    getKategori,
    saveKategori,
    removeKategori,
    startPenilaian,
    getPenilaianList,
    getGradesForInput,
    saveGradesBulk,
    getCalculation,
    removePenilaian
};
