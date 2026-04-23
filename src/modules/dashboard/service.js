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
  // Kita bisa membatasi response berdasarkan peran (role) pengguna jika diperlukan
  const [counts, recentLogs, pengumuman] = await Promise.all([
    dashboardModel.getDashboardCounts(),
    dashboardModel.getRecentActivities(5),
    dashboardModel.getPengumuman(5)
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

  // Ini hanya contoh balikan untuk mendukung UI di frontend
  return {
    stats: [
      {
        title: 'Total Siswa',
        value: counts.totalSiswa,
        trend: '+12%',
      },
      {
        title: 'Total Guru',
        value: counts.totalGuru,
        trend: '+2%',
      },
      {
        title: 'Mata Pelajaran',
        value: counts.totalMapel,
        trend: 'Tetap',
      },
      {
        title: 'Jadwal Hari Ini',
        value: 12, // Dummy value untuk jadwal
        trend: 'Berjalan',
      }
    ],
    activities: [
      { name: 'Sen', hadir: 1150, absen: 84 },
      { name: 'Sel', hadir: 1180, absen: 54 },
      { name: 'Rab', hadir: 1120, absen: 114 },
      { name: 'Kam', hadir: 1200, absen: 34 },
      { name: 'Jum', hadir: 1190, absen: 44 },
      { name: 'Sab', hadir: 1220, absen: 14 },
      { name: 'Min', hadir: 0, absen: 1234 }, // Libur
    ],
    recent_logs: formattedLogs,
    announcements: formattedPengumuman
  };
};

module.exports = {
  getDashboardSummary
};
