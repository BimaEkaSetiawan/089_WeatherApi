const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/lokasi', async (req, res) => {
    const kota = req.query.kota;

    const apiKey = "TmW3n2IbOKaZxkghOoYB";

    const url = `https://api.maptiler.com/geocoding/${encodeURIComponent(kota)}.json?key=${apiKey}`;

    try {
        const response = await axios.get(url);

        const data = response.data;

        res.json({
            kota: data.features[0].text,
            koordinat: data.features[0].geometry.coordinates
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


