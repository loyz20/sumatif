# Modules

Folder ini menjadi batas modular per domain fitur agar scalable.

## Struktur

Setiap module minimal memiliki `index.js` yang mengekspor:

- controller
- service
- model

Contoh:

```js
const { controller } = require('../../modules/siswa');
```

## Tujuan

- Mencegah ketergantungan silang yang tidak terkontrol
- Memudahkan relokasi internal file tanpa mengubah layer route
- Menyiapkan transisi ke pola `src/modules/<domain>/{controller,service,model}.js`
