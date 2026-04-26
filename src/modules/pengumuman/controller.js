const pengumumanModel = require('./model');
const { successResponse } = require('../../utils/response');

async function getPengumuman(req, res, next) {
    try {
        const { role } = req.user;
        const includeInactive = role === 'admin';
        const result = await pengumumanModel.listPengumuman(req.user.sekolah_id, role, includeInactive);
        return successResponse(res, result);
    } catch (error) {
        next(error);
    }
}

async function savePengumuman(req, res, next) {
    try {
        const { id, title, content, type, target_role, is_active } = req.body;
        const sekolahId = req.user.sekolah_id;

        if (id) {
            await pengumumanModel.updatePengumuman(id, sekolahId, req.body);
            return successResponse(res, { id }, 'Pengumuman berhasil diperbarui');
        } else {
            const newId = await pengumumanModel.createPengumuman(sekolahId, req.body, req.user.id);
            
            // Trigger notification only if active
            if (is_active !== false) {
                const NotificationService = require('../notification/service');
                await NotificationService.broadcast(sekolahId, {
                    title: `Pengumuman: ${title}`,
                    message: content.substring(0, 100) + (content.length > 100 ? '...' : ''),
                    type: type === 'danger' ? 'error' : type === 'warning' ? 'warning' : 'info',
                    targetRole: target_role
                });
            }
            
            return successResponse(res, { id: newId }, 'Pengumuman berhasil dibuat', 201);
        }
    } catch (error) {
        next(error);
    }
}

async function removePengumuman(req, res, next) {
    try {
        await pengumumanModel.deletePengumuman(req.params.id, req.user.sekolah_id);
        return successResponse(res, null, 'Pengumuman berhasil dihapus');
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getPengumuman,
    savePengumuman,
    removePengumuman
};
