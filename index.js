import express from 'express';
import cors from 'cors';
import { supabase } from './supabaseClient.js';

// Inisialisasi aplikasi Express
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Mengizinkan Cross-Origin Resource Sharing
app.use(express.json()); // Mem-parsing body request sebagai JSON

// === DEFIINISI ENDPOINTS ===

// GET / (Root endpoint untuk tes)
app.get('/', (req, res) => {
  res.json({ message: 'Selamat datang di API Cuci Sepatu!' });
});

// GET /items (Membaca semua data + filter status)
app.get('/items', async (req, res) => {
  const { status } = req.query;

  try {
    let query = supabase.from('items').select('*');

    // Terapkan filter jika ada query 'status'
    if (status) {
      query = query.eq('status', status);
    }

    // Eksekusi query
    const { data, error } = await query.order('id', { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching items:', error.message);
    res.status(500).json({ message: 'Gagal mengambil data', error: error.message });
  }
});

// GET /items/:id (Membaca data spesifik)
app.get('/items/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('id', id)
      .single(); // .single() untuk mengambil satu objek, bukan array

    if (error) throw error;
    if (data) {
      res.json(data);
    } else {
      res.status(404).json({ message: 'Data tidak ditemukan' });
    }
  } catch (error) {
    console.error('Error fetching item by id:', error.message);
    res.status(500).json({ message: 'Gagal mengambil data', error: error.message });
  }
});

// POST /items (Membuat data baru)
app.post('/items', async (req, res) => {
  // Ambil data dari body
  const { nama, status, tanggalMasuk, tanggalSelesai } = req.body;

  // Validasi sederhana
  if (!nama || !status || !tanggalMasuk) {
    return res.status(400).json({
      message: `Data tidak lengkap. 'nama', 'status', dan 'tanggalMasuk' diperlukan.`,
    });
  }

  try {
    const { data, error } = await supabase
      .from('items')
      .insert([
        {
          nama,
          status,
          tanggalMasuk,
          tanggalSelesai: tanggalSelesai || null, // Set null jika tidak ada
        },
      ])
      .select(); // .select() untuk mengembalikan data yang baru dibuat

    if (error) throw error;
    res.status(201).json({
      message: 'Data sepatu berhasil ditambahkan.',
      data: data[0],
    });
  } catch (error) {
    console.error('Error creating item:', error.message);
    res.status(500).json({ message: 'Gagal menambah data', error: error.message });
  }
});

// PUT /items/:id (Memperbarui data)
app.put('/items/:id', async (req, res) => {
  const { id } = req.params;
  const { nama, status, tanggalMasuk, tanggalSelesai } = req.body;

  // Objek untuk update, hanya berisi field yang ada di body
  const updateData = {};
  if (nama) updateData.nama = nama;
  if (status) updateData.status = status;
  if (tanggalMasuk) updateData.tanggalMasuk = tanggalMasuk;
  // Memperbolehkan update tanggalSelesai menjadi null atau string
  if (tanggalSelesai !== undefined) updateData.tanggalSelesai = tanggalSelesai;

  // Cek jika tidak ada data untuk diupdate
  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ message: 'Tidak ada data untuk diperbarui' });
  }

  try {
    const { data, error } = await supabase
      .from('items')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) throw error;
    if (data.length === 0) {
      return res.status(404).json({ message: 'Data tidak ditemukan' });
    }

    res.json({
      message: 'Status sepatu berhasil diperbarui.',
      data: data[0],
    });
  } catch (error) {
    console.error('Error updating item:', error.message);
    res.status(500).json({ message: 'Gagal memperbarui data', error: error.message });
  }
});

// DELETE /items/:id (Menghapus data)
app.delete('/items/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { error, count } = await supabase
      .from('items')
      .delete({ count: 'exact' }) // Meminta Supabase mengembalikan jumlah baris
      .eq('id', id);

    if (error) throw error;
    if (count === 0) {
      return res.status(404).json({ message: 'Data tidak ditemukan' });
    }

    res.json({ message: 'Data sepatu berhasil dihapus.' });
  } catch (error) {
    console.error('Error deleting item:', error.message);
    res.status(500).json({ message: 'Gagal menghapus data', error: error.message });
  }
});

// Menjalankan server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});