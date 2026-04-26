-- Fix collation mismatch for BK tables
ALTER TABLE konseling CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE reward_siswa CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Also ensure columns are updated specifically if CONVERT doesn't handle all cases (though it should)
ALTER TABLE konseling 
  MODIFY id VARCHAR(36) COLLATE utf8mb4_unicode_ci,
  MODIFY sekolah_id VARCHAR(36) COLLATE utf8mb4_unicode_ci,
  MODIFY peserta_didik_id VARCHAR(36) COLLATE utf8mb4_unicode_ci,
  MODIFY guru_bk_id VARCHAR(36) COLLATE utf8mb4_unicode_ci;

ALTER TABLE reward_siswa
  MODIFY id VARCHAR(36) COLLATE utf8mb4_unicode_ci,
  MODIFY sekolah_id VARCHAR(36) COLLATE utf8mb4_unicode_ci,
  MODIFY peserta_didik_id VARCHAR(36) COLLATE utf8mb4_unicode_ci;
