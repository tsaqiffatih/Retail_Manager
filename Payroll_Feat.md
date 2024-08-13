Fitur yang Anda jelaskan masuk ke dalam **"Fitur Penggajian"** atau **"Payroll Management"** dalam sistem manajemen backend untuk toko dan karyawan. Berikut adalah penjelasan detail tentang fitur ini:

### **Fitur Penggajian (Payroll Management)**

**1. Pembuatan Record Payroll**
   - **Fungsi**: Secara otomatis membuat entri payroll untuk setiap karyawan setiap bulan, menggunakan data gaji dasar dari table `Employee`.
   - **Kegunaan**: Memastikan bahwa ada catatan gaji untuk setiap karyawan yang siap untuk dihitung dan diproses.

**2. Perhitungan Gaji**
   - **Fungsi**: Menghitung jumlah gaji berdasarkan data kehadiran, lembur, potongan, dan faktor lain jika diperlukan.
   - **Kegunaan**: Menyediakan jumlah gaji yang akurat berdasarkan aktivitas dan perhitungan tambahan.

**3. Pembayaran Gaji**
   - **Fungsi**: Memproses pembayaran gaji untuk karyawan sesuai dengan record `Payroll` yang ada.
   - **Kegunaan**: Memastikan karyawan menerima pembayaran yang sesuai dengan status dan jumlah yang ditetapkan.

**4. Pembaharuan Status**
   - **Fungsi**: Mengupdate status record payroll dari "UNPAID" menjadi "PAID" setelah pembayaran dilakukan.
   - **Kegunaan**: Menyediakan status terkini dari pembayaran gaji untuk keperluan pelaporan dan manajemen.

### **Komponen Utama dari Fitur Penggajian**

1. **Automatisasi Pembuatan Record**
   - Menjadwalkan dan membuat record payroll secara otomatis setiap bulan untuk seluruh karyawan.

2. **Perhitungan Gaji**
   - Menggunakan data dari table `Attendance` dan kolom `Salary` di table `Employee` untuk menghitung gaji.
   - Memperhitungkan lembur, potongan, dan tunjangan jika ada.

3. **Proses Pembayaran**
   - Menyediakan mekanisme untuk melakukan pembayaran gaji, baik secara manual oleh role berwenang atau melalui proses otomatis.

4. **Status Pembayaran**
   - Mengupdate status record payroll untuk mencerminkan apakah gaji sudah dibayar atau belum.

### **Contoh Implementasi Fitur Penggajian**

- **Antarmuka Pengguna (UI)**: Menyediakan antarmuka untuk memantau dan mengelola record payroll, perhitungan gaji, dan status pembayaran.
- **Laporan**: Membuat laporan mengenai pembayaran gaji, status, dan riwayat penggajian.
- **Notifikasi**: Mengirim notifikasi kepada pihak berwenang atau karyawan tentang status pembayaran atau kebutuhan tindakan.

### **Penggunaan dalam Aplikasi**

Fitur ini sangat penting dalam aplikasi manajemen SDM atau sistem ERP yang mencakup pengelolaan karyawan dan proses penggajian. Fitur ini memastikan bahwa semua aspek terkait gaji karyawan dikelola dengan efisien, mulai dari pembuatan record payroll hingga pembayaran dan pembaharuan status.

Dengan memanfaatkan fitur ini, Anda dapat mengelola proses penggajian secara otomatis dan efisien, serta memberikan transparansi dan akurasi dalam pengelolaan gaji karyawan.