"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryMap = exports.locationMap = void 0;
exports.generateStoreCodeTs = generateStoreCodeTs;
exports.getCategoryCode = getCategoryCode;
exports.getNameInitial = getNameInitial;
exports.getLocationCode = getLocationCode;
exports.getDateCode = getDateCode;
// Peta singkatan lokasi
exports.locationMap = {
    "Jakarta": 'JKT',
    "Banda Aceh": 'BAC',
    "Sabang": 'SAB',
    "Medan": 'MDN',
    "Binjai": 'BNJ',
    "Padang Sidempuan": 'PSP',
    "Sibolga": 'SBL',
    "Tebing Tinggi": 'TBT',
    "Padang": 'PDG',
    "Solok": 'SLK',
    "Bukittinggi": 'BKT',
    "Payakumbuh": 'PYK',
    "Pekanbaru": 'PKR',
    "Dumai": 'DUM',
    "Batam": 'BTM',
    "Tanjung Pinang": 'TPI',
    "Karimun": 'KRM',
    "Lingga": 'LG',
    "Natuna": 'NTN',
    "Jambi": 'JBI',
    "Sungai Penuh": 'SGP',
    "Palembang": 'PLG',
    "Lubuklinggau": 'LLG',
    "Pagar Alam": 'PAL',
    "Bengkulu": 'BKL',
    "Bandar Lampung": 'BL',
    "Metro": 'MET',
    "Jakarta Pusat": 'JKT-P',
    "Jakarta Utara": 'JKT-U',
    "Jakarta Selatan": 'JKT-S',
    "Jakarta Timur": 'JKT-T',
    "Jakarta Barat": 'JKT-B',
    "Bandung": 'BDG',
    "Bogor": 'BGR',
    "Bekasi": 'BKS',
    "Depok": 'DPK',
    "Cimahi": 'CMH',
    "Semarang": 'SMG',
    "Surakarta": 'SKR',
    "Salatiga": 'SLT',
    "Pekalongan": 'PKL',
    "Tegal": 'TGL',
    "Yogyakarta": 'YGY',
    "Surabaya": 'SBY',
    "Malang": 'MLG',
    "Kediri": 'KDR',
    "Probolinggo": 'PRB',
    "Blitar": 'BLT',
    "Denpasar": 'DPS',
    "Singaraja": 'SGR',
    "Mataram": 'MTR',
    "Bima": 'BIM',
    "Kupang": 'KPG',
    "Maumere": 'MAU',
    "Ende": 'ENE',
    "Pontianak": 'PNK',
    "Singkawang": 'SKW',
    "Palangka Raya": 'PLK',
    "Kotawaringin Barat": 'KWB',
    "Kotawaringin Timur": 'KWT',
    "Banjarmasin": 'BJM',
    "Banjarbaru": 'BBR',
    "Samarinda": 'SMD',
    "Balikpapan": 'BLK',
    "Bontang": 'BTG',
    "Tarakan": 'TRK',
    "Nunukan": 'NUN',
    "Manado": 'MND',
    "Bitung": 'BTG',
    "Tomohon": 'TMH',
    "Palu": 'PAL',
    "Donggala": 'DGL',
    "Makassar": 'MKS',
    "Parepare": 'PRP',
    "Palopo": 'LPP',
    "Kendari": 'KDI',
    "Baubau": 'BAU',
    "Mamuju": 'MJU',
    "Gorontalo": 'GRO',
    "Ambon": 'AMB',
    "Tual": 'TUL',
    "Ternate": 'TTE',
    "Tidore": 'TID',
    "Jayapura": 'JYP',
    "Sorong": 'SOR',
    "Merauke": 'MER',
    "Manokwari": 'MKW',
    "Fakfak": 'FKK',
    "Raja Ampat": 'RA',
    "Langsa": 'LGS',
    "Lhokseumawe": 'LKME',
    "Wamena": 'WMN',
    "Ruteng": 'RTG',
    "Labuan Bajo": 'LBB',
    "Tanjung Selor": 'TNSR',
    "Sampit": 'SPT',
    "Muara Teweh": 'MRTW',
    "Luwuk": 'LWK',
    "Tolitoli": 'TLT',
    "Cirebon": 'CRB',
    "Purwokerto": 'PWT',
    "Banjar": 'BNJ',
    "Batu": 'BTU',
    "Gunungsitoli": 'GST',
    "Kotamobagu": 'KMB',
    "Madiun": 'MDN',
    "Magelang": 'MGL',
    "Mojokerto": 'MJK',
    "Padangpanjang": 'PPJ',
    "Pariaman": 'PRM',
    "Pasuruan": 'PSR',
    "Pematangsiantar": 'PMS',
    "Prabumulih": 'PRB',
    "Sawahlunto": 'SWL',
    "Subulussalam": 'SBL',
    "Sukabumi": 'SKB',
    "Tanjungbalai": 'TJB',
    "Tanjungpinang": 'TPG',
    "Tasikmalaya": 'TSM',
    "Tidore Kepulauan": 'TID'
};
exports.categoryMap = {
    "grocery": "GR",
    "electronics": "EL",
    "clothing": "CL",
    "books and stationery": "BS",
    "beauty and personal care": "BP",
    "home furnishings": "HF",
    "toys": "TO",
    "sports and outdoors": "SO",
    "automotive": "AU",
    "gardening": "GA",
    "health and wellness": "HW",
    "kitchen and dining": "KD",
    "home improvement": "HI",
    "baby and kids": "BK",
    "travel and luggage": "TL"
};
// Fungsi utama untuk menghasilkan kode toko
function generateStoreCodeTs(ownerUsername, category, location, createdAt, ownerId) {
    let categoryCode = getCategoryCode(category);
    let ownerInitial = getNameInitial(ownerUsername);
    let locationCode = getLocationCode(location);
    let dateCode = getDateCode(createdAt);
    let storeCode = `${ownerInitial}-${locationCode}-${categoryCode}-${dateCode}-${ownerId}`;
    return storeCode.toUpperCase();
}
// Fungsi untuk mendapatkan singkatan kategori
function getCategoryCode(category) {
    return exports.categoryMap[category.toLowerCase()] || "OT";
}
// Fungsi untuk mendapatkan inisial nama pemilik
function getNameInitial(name) {
    const words = name.split(/\s+/);
    if (words.length === 1) {
        const singleWord = words[0].toUpperCase();
        return singleWord.slice(0, 2) + singleWord.slice(-2);
    }
    const firstWordInitial = words[0].slice(0, 2).toUpperCase();
    const secondWordInitial = words[1].slice(0, 2).toUpperCase();
    return firstWordInitial + secondWordInitial;
}
// Fungsi untuk mendapatkan singkatan lokasi
function getLocationCode(location) {
    // Gunakan singkatan dari peta atau ambil 3 karakter pertama jika tidak ada di peta
    return (exports.locationMap[location] ||
        location.replace(/\s+/g, "").substring(0, 3).toUpperCase());
}
// Fungsi untuk mendapatkan kode tanggal pembuatan
function getDateCode(date) {
    const d = new Date(date);
    const year = d.getFullYear().toString().slice(2);
    const month = ("0" + (d.getMonth() + 1)).slice(-2);
    const day = ("0" + d.getDate()).slice(-2);
    const hours = ("0" + d.getHours()).slice(-2);
    return `${year}-${month}-${day}-${hours}`;
}
//# sourceMappingURL=codeGenerator.js.map