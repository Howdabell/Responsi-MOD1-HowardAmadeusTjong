# REST API Layanan Cuci Sepatu (ShoeClean)

## Deskripsi Umum Proyek

Proyek ini adalah implementasi backend RESTful API untuk studi kasus layanan cuci sepatu. Dibangun menggunakan Node.js dan Express.js, API ini menyediakan endpoint untuk operasi CRUD (Create, Read, Update, Delete) dan terhubung ke database Supabase (PostgreSQL) untuk persistensi data. Proyek ini dikonfigurasi untuk deployment ke Vercel.

## Tujuan dan Fitur Utama

### Tujuan

Tujuan utama dari API ini adalah untuk menyediakan sistem backend yang terstruktur untuk mengelola dan melacak data operasional cucian sepatu, yang nantinya dapat dikonsumsi oleh aplikasi front-end seperti dashboard admin atau aplikasi pelanggan.

### Fitur Utama

| Metode | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| `GET` | `/items` | Mengambil seluruh daftar sepatu (mendukung filter by status). |
| `GET` | `/items/:id` | Mengambil detail satu sepatu spesifik berdasarkan ID. |
| `POST` | `/items` | Menambahkan data sepatu baru ke dalam sistem. |
| `PUT` | `/items/:id` | Memperbarui data/status sepatu yang sudah ada (misal: dari 'Dicuci' menjadi 'Selesai'). |
| `DELETE` | `/items/:id` | Menghapus data sepatu dari database (misal: setelah diambil pelanggan). |

## Struktur Data

Data disimpan dalam tabel `items` di database Supabase. Penggunaan `BIGINT` sebagai *primary key* yang digenerasi otomatis adalah default yang efisien dari Supabase.

| Kolom | Tipe Data | Deskripsi |
| :--- | :--- | :--- |
| `id` | `BIGINT` (Primary Key) | ID unik numerik yang digenerasi otomatis oleh Supabase (`IDENTITY`). |
| `created_at` | `timestamptz` | Waktu dan tanggal kapan data pertama kali dibuat. |
| `nama` | `text` | Nama atau deskripsi singkat sepatu (misal: "Nike Air Force 1"). |
| `status` | `text` | Status progres pencucian (contoh: `Sedang Dicuci`, `Selesai`). |
| `tanggalMasuk` | `date` | Tanggal saat sepatu diterima oleh layanan cuci. |
| `tanggalSelesai` | `date` | Tanggal saat proses pencucian selesai (bisa `NULL`). |

## Contoh Request dan Response

### 1. Membuat Item Baru (CREATE)

Menambahkan data cucian sepatu baru.

- **Endpoint:** `POST /items`
- **Request Body:**
  ```json
  {
    "nama": "Adidas Samba",
    "status": "Sedang Dicuci",
    "tanggalMasuk": "2025-10-24"
  }
- Response Sukses (201 Created):
  ```json
  {
  "message": "Data sepatu berhasil ditambahkan.",
  "data": {
    "id": 1,
    "created_at": "2025-10-24T10:30:00Z",
    "nama": "Adidas Samba",
    "status": "Sedang Dicuci",
    "tanggalMasuk": "2025-10-24",
    "tanggalSelesai": null
    }
  }
