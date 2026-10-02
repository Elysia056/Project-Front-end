// Tugas Kelompok Front End Programming - Kalkulator BMI
 //   Kelompok 1
// - 535250056 - Elysia Nyoman
// - 535250058 - Richard Harris Yuwono
// - 535250066 - Meisa Putri Nadira
// - 535250074 - Stesa Aurel Titania
// - 535250100 - Surya Banyutama Suprapto 

// 1. SELEKSI ELEMEN DOM
// Mengambil elemen input, tombol pemicu, dan wadah output hasil
const selectGender = document.getElementById("select-gender");
const inputUsia = document.getElementById("input-usia");
const inputBerat = document.getElementById("input-berat");
const inputTinggi = document.getElementById("input-tinggi");
const tombolHitung = document.getElementById("tombol-hitung");
const tombolReset = document.getElementById("tombol-reset");

const panelLuaran = document.getElementById("panel-luaran");
const teksProfil = document.getElementById("teks-profil");
const teksSkor = document.getElementById("teks-skor");
const teksKlasifikasi = document.getElementById("teks-klasifikasi");
const teksBbIdeal = document.getElementById("teks-bb-ideal");
const keteranganTambahan = document.getElementById("keterangan-tambahan");
const gaugeMarker = document.getElementById("gauge-marker");

// 2. FUNGSI LOGIKA EVALUASI KESEHATAN (STEM - BIOLOGI & KESEHATAN)
// Menerima parameter:
// - nilaiBmi (float): skor hasil pembagian berat / tinggi kuadrat
// - gender (string): 'pria' atau 'wanita'
// - usia (number): usia pengguna dalam tahun
function evaluasiKondisiTubuh(nilaiBmi, gender, usia) {
    // Catatan khusus komposisi biologis tubuh berdasarkan gender
    const infoGender = gender === "pria" 
        ? "Sebagai pria, metabolisme basal cenderung dipengaruhi massa otot aktif." 
        : "Sebagai perempuan, tubuh secara alami memerlukan persentase lemak esensial yang sedikit lebih tinggi untuk keseimbangan hormonal.";

    // Pengkondisian bertingkat klasifikasi medis BMI (Standar WHO / Kemenkes)
    if (nilaiBmi < 18.5) {
        return {
            label: "Berat Badan Kurang (Underweight)",
            warna: "#dd6b20", // Warna oranye peringatan
            tips: `Status Anda tergolong underweight. ${infoGender} Di usia ${usia} tahun, prioritaskan asupan kalori surplus sehat melalui protein berkualitas (telur, daging, kacang-kacangan) dan latihan beban ringan agar massa tubuh yang naik berupa otot, bukan lemak jahat.`
        };
    } else if (nilaiBmi >= 18.5 && nilaiBmi <= 24.9) {
        return {
            label: "Normal / Ideal",
            warna: "#38a169", // Warna hijau stabil
            tips: `Selamat, komposisi tubuh Anda berada di rentang ideal! ${infoGender} Untuk mempertahankan performa fisik di usia ${usia} tahun, cukup jaga pola makan seimbang, penuhi hidrasi 2 liter per hari, dan lakukan aktivitas kardio teratur 150 menit per minggu.`
        };
    } else if (nilaiBmi >= 25.0 && nilaiBmi <= 29.9) {
        return {
            label: "Kelebihan Berat Badan (Overweight)",
            warna: "#d69e2e", // Warna kuning tua
            tips: `Tubuh Anda berada di batas overweight. ${infoGender} Mulailah batasi minuman manis berpemanis tinggi, kurangi gorengan, serta perbanyak jalan kaki atau jogging 30 menit setiap hari untuk menjaga stabilitas metabolisme tubuh.`
        };
    } else if (nilaiBmi >= 30.0 && nilaiBmi <= 34.9) {
        return {
            label: "Obesitas Tingkat I",
            warna: "#e53e3e", // Warna merah
            tips: `Terdeteksi risiko Obesitas Tingkat I. Pada umur ${usia} tahun, kondisi ini dapat meningkatkan risiko tekanan darah tinggi dan kolesterol. Disarankan menerapkan defisit kalori terukur dan mengganti camilan olahan dengan buah segar berserat tinggi.`
        };
    } else {
        return {
            label: "Obesitas Tingkat II (Sangat Tinggi)",
            warna: "#9b2c2c", // Warna merah tua / marun
            tips: `Perhatian: Nilai BMI masuk dalam kategori Obesitas Tingkat II. Sangat direkomendasikan untuk berkonsultasi langsung dengan ahli gizi atau dokter agar mendapatkan program penurunan berat badan yang aman tanpa membebani persendian.`
        };
    }
}

// 3. FUNGSI HITUNG RENTANG BERAT SEHAT
// Menghitung batas berat badan minimum dan maksimum yang ideal (BMI 18.5 - 24.9)
function hitungRentangIdeal(tinggiMeter) {
    const batasBawah = (18.5 * (tinggiMeter * tinggiMeter)).toFixed(1);
    const batasAtas = (24.9 * (tinggiMeter * tinggiMeter)).toFixed(1);
    return `${batasBawah} kg - ${batasAtas} kg`;
}

// 4. EVENT LISTENER: PERHITUNGAN DAN MANIPULASI DOM
tombolHitung.addEventListener("click", function () {
    const gender = selectGender.value;
    const usia = parseInt(inputUsia.value);
    const berat = parseFloat(inputBerat.value);
    const tinggiCm = parseFloat(inputTinggi.value);

    // Validasi kelengkapan dan keabsahan angka input
    if (isNaN(usia) || isNaN(berat) || isNaN(tinggiCm) || usia <= 0 || berat <= 0 || tinggiCm <= 0) {
        alert("Harap lengkapi semua kolom dengan angka positif yang valid!");
        return;
    }

    // Perhitungan nilai matematis BMI: Berat (kg) / (Tinggi (m))^2
    const tinggiMeter = tinggiCm / 100;
    const skorBmi = berat / (tinggiMeter * tinggiMeter);
    const skorFormatted = skorBmi.toFixed(1);

    // Dapatkan evaluasi klinis dan saran personalisasi
    const evaluasi = evaluasiKondisiTubuh(skorBmi, gender, usia);
    const rentangIdeal = hitungRentangIdeal(tinggiMeter);

    // Manipulasi Teks & Style DOM
    teksProfil.textContent = `${gender === "pria" ? "Laki-laki" : "Perempuan"}, ${usia} Tahun`;
    teksSkor.textContent = skorFormatted;
    teksKlasifikasi.textContent = evaluasi.label;
    teksKlasifikasi.style.color = evaluasi.warna;
    teksBbIdeal.textContent = rentangIdeal;
    keteranganTambahan.textContent = evaluasi.tips;

    // Ubah aksen warna border panel luaran
    panelLuaran.style.borderLeftColor = evaluasi.warna;

    // Buat Geser marker di gauge (skala BMI 15 - 40)
    const skorClamped = Math.min(Math.max(skorBmi, 15), 40);
    const persenPosisi = ((skorClamped - 15) / (40 - 15)) * 100;
    gaugeMarker.style.left = persenPosisi + "%";


    // Tampilkan panel luaran ke layar pengguna
    panelLuaran.classList.remove("sembunyikan");
});

// 5. EVENT LISTENER: RESET FORM
tombolReset.addEventListener("click", function () {
    inputUsia.value = "";
    inputBerat.value = "";
    inputTinggi.value = "";
    selectGender.selectedIndex = 0;
    panelLuaran.classList.add("sembunyikan");
    gaugeMarker.style.left = "0%"; 
});