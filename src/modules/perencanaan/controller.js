const model = require('./model');
const { successResponse } = require('../../utils/response');

/**
 * CAPAIAN PEMBELAJARAN (CP)
 */
async function getCP(req, res, next) {
    try {
        const { mapel_id, fase } = req.query;
        const result = await model.listCP({ mapel_id, fase });
        return successResponse(res, result);
    } catch (error) {
        next(error);
    }
}

async function createCP(req, res, next) {
    try {
        const id = await model.createCP(req.body);
        return successResponse(res, { id }, 'CP berhasil dibuat', 201);
    } catch (error) {
        next(error);
    }
}

async function updateCP(req, res, next) {
    try {
        await model.updateCP(req.params.id, req.body);
        return successResponse(res, null, 'CP berhasil diperbarui');
    } catch (error) {
        next(error);
    }
}

async function deleteCP(req, res, next) {
    try {
        await model.deleteCP(req.params.id);
        return successResponse(res, null, 'CP berhasil dihapus');
    } catch (error) {
        next(error);
    }
}

/**
 * TUJUAN PEMBELAJARAN (TP)
 */
async function getTP(req, res, next) {
    try {
        const { pembelajaran_id } = req.query;
        if (!pembelajaran_id) throw new Error('pembelajaran_id is required');
        const result = await model.listTP(pembelajaran_id);
        return successResponse(res, result);
    } catch (error) {
        next(error);
    }
}

async function createTP(req, res, next) {
    try {
        const id = await model.createTP(req.body);
        return successResponse(res, { id }, 'Tujuan Pembelajaran berhasil dibuat', 201);
    } catch (error) {
        next(error);
    }
}

async function updateTP(req, res, next) {
    try {
        await model.updateTP(req.params.id, req.body);
        return successResponse(res, null, 'Tujuan Pembelajaran berhasil diperbarui');
    } catch (error) {
        next(error);
    }
}

async function deleteTP(req, res, next) {
    try {
        await model.deleteTP(req.params.id);
        return successResponse(res, null, 'Tujuan Pembelajaran berhasil dihapus');
    } catch (error) {
        next(error);
    }
}

/**
 * ALUR TUJUAN PEMBELAJARAN (ATP)
 */
async function getATP(req, res, next) {
    try {
        const { pembelajaran_id } = req.query;
        const result = await model.getATP(pembelajaran_id);
        return successResponse(res, result);
    } catch (error) {
        next(error);
    }
}

async function saveATP(req, res, next) {
    try {
        const { pembelajaran_id } = req.params;
        const id = await model.saveATP(pembelajaran_id, req.body);
        return successResponse(res, { id }, 'Alur Tujuan Pembelajaran berhasil disimpan');
    } catch (error) {
        next(error);
    }
}

/**
 * MODUL AJAR
 */
async function getModulAjarList(req, res, next) {
    try {
        const { tp_id } = req.query;
        const result = await model.listModulAjar(tp_id);
        return successResponse(res, result);
    } catch (error) {
        next(error);
    }
}

async function getModulAjarDetail(req, res, next) {
    try {
        const result = await model.getModulAjar(req.params.id);
        return successResponse(res, result);
    } catch (error) {
        next(error);
    }
}

async function saveModulAjar(req, res, next) {
    try {
        const id = await model.saveModulAjar(req.body, req.user.id);
        return successResponse(res, { id }, 'Modul Ajar berhasil disimpan');
    } catch (error) {
        next(error);
    }
}

async function generateTP(req, res, next) {
    try {
        const { mapel, fase, cp } = req.body;
        if (!mapel || !fase || !cp) {
            throw new Error('Data mapel, fase, dan cp diperlukan untuk generate');
        }

        const ai = require('../../utils/ai');
        const result = await ai.generateTP({ mapel, fase, cp });
        
        return successResponse(res, result.tp, 'AI berhasil merumuskan TP');
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getCP, createCP, updateCP, deleteCP,
    getTP, createTP, updateTP, deleteTP,
    getATP, saveATP,
    getModulAjarList, getModulAjarDetail, saveModulAjar,
    generateTP
};
