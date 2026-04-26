const dashboardModel = require('./model');

// Helper to calculate relative time
const getRelativeTime = (date) => {
  const rtf = new Intl.RelativeTimeFormat('id', { numeric: 'auto' });
  const daysDifference = Math.round((new Date(date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const hoursDifference = Math.round((new Date(date).getTime() - new Date().getTime()) / (1000 * 60 * 60));
  
  if (Math.abs(hoursDifference) < 24) {
    return rtf.format(hoursDifference, 'hour');
  }
  return rtf.format(daysDifference, 'day');
};

const getDashboardSummary = async (user) => {
  const [counts, recentLogs, pengumuman, attendanceStats, bkStats, studentData] = await Promise.all([
    dashboardModel.getDashboardCounts(user.sekolah_id),
    user.role === 'admin' ? dashboardModel.getRecentActivities(user.sekolah_id, 5) : Promise.resolve([]),
    dashboardModel.getPengumuman(user.sekolah_id, 5),
    user.role === 'guru' ? dashboardModel.getAttendanceStats(user.sekolah_id, user.ref_id) : Promise.resolve([]),
    user.role === 'guru_bk' ? dashboardModel.getBKStats(user.sekolah_id) : Promise.resolve(null),
    (user.role === 'siswa' && user.ref_id) ? dashboardModel.getStudentDashboardData(user.sekolah_id, user.ref_id) : Promise.resolve(null)
  ]);

  // Format log untuk dikirim ke UI
  const formattedLogs = recentLogs.map(log => ({
    id: log.id,
    action: log.action,
    description: log.description,
    user: log.username || 'Sistem',
    role: log.role,
    time: log.created_at
  }));

  // Format pengumuman
  const formattedPengumuman = pengumuman.map(item => {
    let color = 'bg-blue-500';
    if (item.type === 'success') color = 'bg-emerald-500';
    if (item.type === 'warning') color = 'bg-orange-500';
    if (item.type === 'danger') color = 'bg-red-500';

    return {
      id: item.id,
      title: item.title,
      desc: item.content,
      time: getRelativeTime(item.created_at),
      color
    };
  });

  let stats = [];
  if (user.role === 'admin') {
    stats = [
      { title: 'Total Siswa', value: counts.totalSiswa, trend: '+12%' },
      { title: 'Total Guru', value: counts.totalGuru, trend: '+2%' },
      { title: 'Total Kelas', value: counts.totalKelas, trend: 'Tetap' },
      { title: 'Jadwal Hari Ini', value: 12, trend: 'Berjalan' }
    ];
  } else if (user.role === 'guru_bk') {
    stats = [
      { title: 'Siswa Pembinaan', value: bkStats.critical, trend: '> 50 Poin' },
      { title: 'Siswa Peringatan', value: bkStats.warning, trend: '> 20 Poin' },
      { title: 'Konseling Bulan Ini', value: bkStats.konselingMonth, trend: 'Bulan ini' },
      { title: 'Total Siswa', value: bkStats.total, trend: 'Aktif' }
    ];
  } else if (user.role === 'siswa' && studentData) {
    stats = [
      { title: 'Poin Net Saya', value: studentData.netPoin, trend: studentData.status },
      { title: 'Total Pelanggaran', value: studentData.totalPelanggaran, trend: 'Poin' },
      { title: 'Total Prestasi', value: studentData.totalReward, trend: 'Reward' },
      { title: 'Kehadiran', value: `${studentData.attendance.hadir}/${studentData.attendance.total}`, trend: 'Pertemuan' }
    ];
  } else {
    // Default / Guru
    stats = [
      { title: 'Total Siswa', value: counts.totalSiswa, trend: 'Aktif' },
      { title: 'Jadwal Mengajar', value: 4, trend: 'Hari ini' },
      { title: 'Jurnal Diisi', value: 24, trend: 'Bulan ini' },
      { title: 'Status Akun', value: 1, trend: 'Aktif' }
    ];
  }

  return {
    stats,
    distribution: (user.role === 'admin' || user.role === 'guru_bk') ? counts.distribution : [],
    activities: attendanceStats.length > 0 ? attendanceStats : [
      { name: 'N/A', hadir: 0, absen: 0 },
    ],
    recent_logs: formattedLogs,
    announcements: formattedPengumuman,
    role_data: { bkStats, studentData }
  };
};

module.exports = {
  getDashboardSummary
};
