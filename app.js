const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/lokasi', async (req, res) => {
    const kota = req.query.kota;

    const apiKey = "TmW3n2IbOKaZxkghOoYB";

    const url = `https://api.maptiler.com/geocoding/${encodeURIComponent(kota)}.json?key=${apiKey}&language=id`;

    try {
        const response = await axios.get(url);

        const data = response.data;

        if (data.features.length === 0) {
            return res.status(404).json({ error: 'Lokasi tidak ditemukan' });
        }

        const fitur = data.features[0];
        const context = fitur.context || [];

        // cari wilayah berdasarkan tipe id-nya (country, region, dst)
        const cari = (tipe) => {
            const hasil = context.find(c => c.id.startsWith(tipe));
            return hasil ? hasil.text : '-';
        };

        console.log(context); // cek tipe wilayah yang tersedia

        res.json({
            negara: cari('country'),
            provinsi: cari('region'),
            kecamatan: cari('municipality'),
            longitude: fitur.geometry.coordinates[0],
            latitude: fitur.geometry.coordinates[1]
        });
    } catch (error) {
        console.error(error.message);

        res.status(500).json({
            error: 'Gagal mengambil data dari MapTiler'
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});