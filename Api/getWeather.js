// File: Api/getWeather.js (Di dalam folder Api)
// Serverless Function Vercel untuk memanggil API Cuaca

// Library node-fetch sudah terinstal di langkah sebelumnya
const fetch = require('node-fetch'); 

// Mendapatkan API Key Rahasia dari Environment Variables Vercel
// INGAT: Anda harus tambahkan variabel ini di dashboard Vercel!
const API_KEY = process.env.OPENWEATHER_API_KEY; 

// Base URL untuk API Cuaca Eksternal
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// module.exports adalah standar untuk Serverless Function Vercel
module.exports = async (req, res) => {
    // Memastikan hanya metode GET yang diterima
    if (req.method !== 'GET') {
        res.status(405).send('Method Not Allowed. Only GET is supported.');
        return;
    }

    // Mendapatkan nama kota dari query URL (misal: /api/getWeather?city=Jakarta)
    const city = req.query.city;

    if (!city) {
        res.status(400).json({ error: 'Parameter "city" wajib disertakan.' });
        return;
    }

    try {
        // Memanggil API Cuaca Eksternal menggunakan API Key Rahasia Vercel
        const url = `${BASE_URL}?q=${city}&units=metric&appid=${API_KEY}`;
        
        const response = await fetch(url);
        
        // Cek jika API Cuaca Eksternal gagal (misal, kota tidak ditemukan)
        if (!response.ok) {
            const errorData = await response.json();
            res.status(response.status).json({ 
                error: `Gagal mengambil data cuaca untuk ${city}.`,
                details: errorData.message 
            });
            return;
        }

        const data = await response.json();

        // Mengembalikan data cuaca yang bersih ke Frontend
        res.status(200).json({
            city: data.name,
            country: data.sys.country,
            temp: data.main.temp,
            description: data.weather[0].description,
            icon: data.weather[0].icon,
            temp_min: data.main.temp_min,
            temp_max: data.main.temp_max
        });

    } catch (error) {
        console.error("Internal API Error:", error);
        res.status(500).json({ error: 'Terjadi kesalahan internal server.' });
    }
};