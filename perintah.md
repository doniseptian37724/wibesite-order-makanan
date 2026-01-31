# Perintah Implementasi Desain

Gunakan aset yang terdapat dalam folder `img` untuk membangun antarmuka web. Berikut adalah detail instruksinya:

## 1. Referensi Visual
- Gunakan file **`img/4290305.jpg`** sebagai acuan utama untuk tata letak (layout), skema warna, dan gaya elemen UI.
- File vektor (`.ai`, `.eps`) tersedia sebagai sumber grafis mentah jika diperlukan.

## 2. Tipografi
- Gunakan font **Montserrat** sesuai yang tertera pada `img/Fonts.txt`.
- Font ini dapat diakses melalui Google Fonts. Pastikan untuk mengimpor variasi ketebalan (weights) yang sesuai dengan desain (biasanya 400, 500, 700).

## 3. Lisensi & Atribusi
- Sesuai dengan `img/License free.txt`, proyek ini menggunakan lisensi gratis yang memerlukan atribusi.
- Tambahkan kode berikut pada bagian footer halaman web:
  ```html
  <a href="http://www.freepik.com">Designed by Freepik</a>
  ```

## 4. Langkah Implementasi
1. Analisis gambar `img/4290305.jpg` untuk mendefinisikan struktur grid dipalet warna.
2. Konfigurasi CSS global untuk menggunakan font Montserrat.
3. Bangun komponen-komponen UI agar sesuai dengan referensi visual.

## 5. Struktur Direktori Proyek
Buat struktur folder standar berikut:
```text
/
├── index.html        # Struktur HTML utama
├── css/
│   └── style.css     # Stylesheet utama (gunakan CSS variable untuk warna)
├── js/
│   └── script.js     # Logika interaktivitas (jika diperlukan)
└── img/              # Aset gambar (sudah ada)
```

## 6. Pedoman Teknis
- **HTML5 Semantik**: Gunakan tag seperti `<header>`, `<main>`, `<section>`, `<footer>` untuk struktur yang jelas.
- **CSS Variables**: Definisikan warna utama dari gambar `4290305.jpg` sebagai variabel CSS di `:root` untuk konsistensi.
  ```css
  :root {
    --primary-color: #......; /* Ambil dari gambar */
    --secondary-color: #......;
    --text-color: #333333;
    --bg-color: #ffffff;
    --font-main: 'Montserrat', sans-serif;
  }
  ```
- **Responsivitas**: Pastikan desain adaptif untuk perangkat Mobile dan Desktop (Media Queries).

## 7. Instruksi Pengembangan
1. **Setup**: Buat file `index.html` dan hubungkan dengan `style.css` serta Google Fonts.
2. **Layouting**: Buat kerangka layout dasar (Navbar, Hero Section, Content, Footer).
3. **Styling**: Terapkan detail visual (warna, spacing, typography) agar mirip dengan `img/4290305.jpg`.
4. **Finalisasi**: Cek apakah atribusi Freepik sudah terpasang.