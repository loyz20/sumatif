const waliKelasModel = require('./model');
const { createError } = require('../shared/service');

async function getClassDashboardStats(ptkId, sekolahId) {
  const myClass = await waliKelasModel.getMyClass(ptkId, sekolahId);
  if (!myClass) {
    throw createError('Anda tidak terdaftar sebagai wali kelas aktif', 404);
  }

  const today = new Date().toISOString().split('T')[0];
  
  const [students, attendance, topViolations, upcomingBirthdays] = await Promise.all([
    waliKelasModel.getClassStudents(myClass.id),
    waliKelasModel.getClassAttendanceStats(myClass.id, today),
    waliKelasModel.getTopViolationClass(myClass.id),
    waliKelasModel.getClassUpcomingBirthdays(myClass.id)
  ]);

  return {
    class_info: myClass,
    total_students: students.length,
    gender_stats: {
        L: students.filter(s => s.jenis_kelamin === 'L').length,
        P: students.filter(s => s.jenis_kelamin === 'P').length
    },
    attendance_today: attendance,
    top_violations: topViolations,
    upcoming_birthdays: upcomingBirthdays,
    students: students // Optional: might want to separate this for large classes
  };
}

async function getMyStudents(ptkId, sekolahId) {
    const myClass = await waliKelasModel.getMyClass(ptkId, sekolahId);
    if (!myClass) throw createError('Anda bukan wali kelas', 404);
    
    return waliKelasModel.getClassStudents(myClass.id);
}

async function getAttendanceRecap(ptkId, sekolahId, month, year) {
    const myClass = await waliKelasModel.getMyClass(ptkId, sekolahId);
    if (!myClass) throw createError('Anda bukan wali kelas', 404);
    
    return waliKelasModel.getClassAttendanceRecap(myClass.id, month, year);
}

module.exports = {
  getClassDashboardStats,
  getMyStudents,
  getAttendanceRecap,
};
