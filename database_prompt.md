## Database Convention Naming
- Pisahkan Table master dan transaksi
- Gunakan snake_case untuk nama tabel dan kolom
- Primary key gunakan uuid
- Foreign key gunakan uuid
- nama tabel {{modul}}_mst_{{fitur}}, {{modul}}_trx_{{fitur}}, {{modul}}_log_{{fitur}}
- nama kolom {{fitur}}_{{jenis}}, {{fitur}}_id, {{fitur}}_name, {{fitur}}_code
- buat relasi antar tabel
- buatkan index untuk kolom yang sering digunakan untuk query
- buatkan unique constraint untuk kolom yang tidak boleh sama
- buatkan table general param, agar tidak ada harcoded value
- pisahkan DDL.sql, dan DML.sql

Koneksi Database
IP : 10.20.0.7
PORT : 25432
Database : {{database}}
Username : mkt
Pass : JRAEm66Ytw9H4HX9xoDV