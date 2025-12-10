// File: public/script.js (Di dalam folder public)

document.getElementById('fetch-weather-btn').addEventListener('click', async () => {
    const city = document.getElementById('city-input').value.trim();
    const outputDiv = document.getElementById('weather-output');
    
    if (!city) {
        outputDiv.innerHTML = '<p style="color: red;">Mohon masukkan nama kota!</p>';
        return;
    }

    outputDiv.innerHTML = `<p>Sedang mencari data cuaca untuk ${city}...</p>`;

    // Panggilan ke API Proxy Vercel Anda
    try {
        const response = await fetch(`/api/getWeather?city=${city}`);
        const data = await response.json();

        if (response.status !== 200) {
            // Menangani error dari Serverless Function (misal, kota tidak ditemukan)
            outputDiv.innerHTML = `
                <p style="color: red;">Gagal mencari cuaca:</p>
                <p>Status: ${response.status}</p>
                <p>Detail: ${data.details || data.error}</p>
            `;
            return;
        }

        // Menampilkan data yang berhasil dikembalikan dari API Proxy
        outputDiv.innerHTML = `
            <div class="weather-info">
                <h3>Cuaca di ${data.city}, ${data.country}</h3>
                <p>Suhu saat ini: <strong>${data.temp}°C</strong></p>
                <p>Deskripsi: ${data.description}</p>
                <p>Suhu Min/Max: ${data.temp_min}°C / ${data.temp_max}°C</p>
                <img src="https://openweathermap.org/img/wn/${data.icon}@2x.png" alt="Icon Cuaca">
            </div>
        `;

    } catch (error) {
        console.error("Fetch Error:", error);
        outputDiv.innerHTML = '<p style="color: red;">Terjadi kesalahan saat menghubungi server Vercel.</p>';
    }
});

// Catatan: Integrasi Firebase Auth dan Firestore akan ditambahkan di langkah selanjutnya.