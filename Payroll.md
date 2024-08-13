Payroll Feat

### **Alur Kerja Payroll**

1. **Pembuatan Record `Payroll` Secara Otomatis**

   - **Jadwalkan Pembuatan**: Setiap awal bulan, jadwalkan tugas otomatis untuk membuat record `Payroll` baru untuk setiap karyawan. 
   - **Isi Data Awal**: Untuk setiap karyawan, ambil data gaji dari kolom `Salary` di table `Employee` dan buat record `Payroll` dengan status "UNPAID".
     - **Tanggal**: Tanggal awal bulan atau periode penggajian.
     - **Jumlah Gaji**: Gunakan nilai dari kolom `Salary` untuk mengisi kolom `amount` pada table `Payroll`.

2. **Perhitungan Gaji (Jika Ada Modifikasi)**

   - **Jadwalkan Perhitungan**: Di pertengahan bulan atau mendekati tanggal penggajian, lakukan perhitungan gaji jika ada elemen tambahan seperti lembur atau potongan.
   - **Hitung Gaji**: Berdasarkan data kehadiran dari table `Attendance` dan kemungkinan modifikasi lainnya (seperti lembur, potongan, dll.), update nilai `amount` pada record `Payroll` jika perlu.
   - **Update Record Payroll**: Jika perhitungan modifikasi diperlukan, pastikan nilai `amount` pada record `Payroll` diperbarui sesuai hasil perhitungan.

3. **Pembayaran Gaji dan Pembaharuan Status**

   - **Lakukan Pembayaran**: Pada akhir bulan atau saat tanggal penggajian, role yang berwenang (misalnya, HR atau akuntan) melakukan pembayaran gaji.
   - **Update Status**: Setelah pembayaran dilakukan, perbarui status record `Payroll` dari "UNPAID" menjadi "PAID".
     - **Manual Update**: Pembayaran dapat dicatat secara manual oleh pihak berwenang melalui antarmuka admin.
     - **Otomatisasi**: Jika memungkinkan, implementasikan mekanisme otomatis untuk mengupdate status setelah pembayaran dilakukan.

### **Contoh Alur Kerja Secara Praktis**

1. **Scheduler (Awal Bulan)**:
   - **Tugas**: Membuat record `Payroll` baru untuk setiap karyawan.
   - **Output**: Record baru di table `Payroll` dengan status "UNPAID" dan `amount` diisi dengan nilai dari kolom `Salary` di table `Employee`.

2. **Scheduler (Pertengahan Bulan)**:
   - **Tugas**: Hitung dan modifikasi gaji jika ada elemen tambahan seperti lembur atau potongan.
   - **Output**: Update record `Payroll` dengan jumlah gaji yang tepat, jika ada perubahan.

3. **Manajer/Pihak Berwenang (Akhir Bulan)**:
   - **Tugas**: Memproses pembayaran dan mengupdate status record.
   - **Output**: Status record diubah menjadi "PAID" setelah pembayaran.

### **Langkah Detail**

1. **Pembuatan Record Payroll**
   - Ambil data gaji (`Salary`) dari table `Employee` untuk setiap karyawan.
   - Buat record baru di table `Payroll` dengan `amount` diisi sesuai `Salary`, dan status awal "UNPAID".

2. **Perhitungan Gaji**
   - Tentukan apakah ada perubahan pada gaji (misalnya lembur, potongan) menggunakan data dari table `Attendance`.
   - Update record `Payroll` dengan jumlah yang baru jika ada perubahan.

3. **Pembayaran dan Status**
   - Setelah pembayaran dilakukan, pastikan untuk mengupdate status record `Payroll` menjadi "PAID".

Dengan alur kerja ini, Anda memanfaatkan data gaji yang sudah ada di table `Employee` untuk mempermudah pembuatan record `Payroll` dan mengurangi langkah-langkah manual dalam perhitungan gaji. Ini juga menyederhanakan proses dan mengurangi kemungkinan kesalahan.