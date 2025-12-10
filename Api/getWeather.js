// File: Api/getWeather.js - Serverless Function (FaaS) Vercel

const fetch = require('node-fetch'); 

// Mendapatkan API Key Rahasia dari Environment Variables Vercel
const API_KEY = process.env.OPENWEATHER_API_KEY; 

const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

module.exports = async (req, res) => {
    // Standard response for Vercel Serverless Function
    res.setHeader('Content-Type', 'application/json');

    if (req.method !== 'GET') {
        res.status(405).send(JSON.stringify({ error: 'Method Not Allowed. Only GET is supported.' }));
        return;
    }

    const city = req.query.city;

    if (!city) {
        res.status(400).send(JSON.stringify({ error: 'Parameter "city" wajib disertakan.' }));
        return;
    }

    if (!API_KEY) {
        res.status(500).send(JSON.stringify({ error: 'Server configuration error: API Key is missing.' }));
        return;
    }

    try {
        const url = `${BASE_URL}?q=${city}&units=metric&appid=${API_KEY}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            const errorData = await response.json();
            res.status(response.status).send(JSON.stringify({ 
                error: `Gagal mengambil data cuaca untuk ${city}.`,
                details: errorData.message 
            }));
            return;
        }

        const data = await response.json();

        // Mengembalikan data cuaca yang bersih
        res.status(200).send(JSON.stringify({
            city: data.name,
            country: data.sys.country,
            temp: data.main.temp,
            description: data.weather[0].description,
            icon: data.weather[0].icon,
            temp_min: data.main.temp_min,
            temp_max: data.main.temp_max
        }));

    } catch (error) {
        console.error("Internal API Error:", error);
        res.status(500).send(JSON.stringify({ error: 'Terjadi kesalahan internal server.' }));
    }
};