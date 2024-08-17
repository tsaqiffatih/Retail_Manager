Tidak perlu selalu melakukan **create, migrate, dan seeding data ulang** untuk setiap file tes yang Anda buat. Pendekatan ini bisa sangat mempengaruhi waktu eksekusi tes, terutama jika Anda memiliki banyak tes atau dataset besar. Berikut adalah beberapa praktik terbaik dan pendekatan yang lebih efisien:

### 1. **Penggunaan Setup dan Teardown Global**

**Setup dan teardown global** yang dilakukan di awal dan akhir siklus pengujian dapat membantu menghindari kebutuhan untuk mengatur dan membersihkan data untuk setiap file tes.

**Contoh Global Setup di Jest:**

**File `jest.setup.ts`** (atau bisa diganti dengan `beforeAll` dan `afterAll` di file tes utama):
```typescript
import { sequelize } from './config/database'; // atau file konfigurasi Sequelize Anda

beforeAll(async () => {
  // Inisialisasi koneksi database
  await sequelize.authenticate();
  // Setup skema atau migrasi jika diperlukan
  await sequelize.sync({ force: true }); // Buat semua tabel dari model
});

afterAll(async () => {
  // Tutup koneksi database
  await sequelize.close();
});
```

**Konfigurasi `jest.config.js` untuk setup:**
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/src/jest.setup.ts'], // Atau lokasi file setup Anda
};
```

### 2. **Penggunaan Transaksi untuk Isolasi Data**

Menggunakan **transaksi** untuk pengujian memungkinkan Anda untuk melakukan rollback perubahan setelah setiap tes, sehingga data tetap bersih dan terisolasi antar tes.

**Contoh dengan Transaksi di Jest:**

**File `userModel.test.ts`:**
```typescript
import { sequelize } from '../config/database';
import { User } from '../models/User';

describe('User Model', () => {
  let transaction: any;

  beforeAll(async () => {
    await sequelize.authenticate();
    await sequelize.sync({ force: true }); // Setup awal jika diperlukan
  });

  beforeEach(async () => {
    transaction = await sequelize.transaction();
  });

  afterEach(async () => {
    await transaction.rollback();
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('should create a user', async () => {
    const user = await User.create({ name: 'John Doe' }, { transaction });
    expect(user.name).toBe('John Doe');
  });
});
```

### 3. **Penggunaan Database In-Memory atau Test Database**

Jika Anda menggunakan database PostgreSQL untuk pengujian, mungkin Anda perlu membuat atau menggunakan **database khusus untuk pengujian** dan **mengatur ulang** database ini sebelum setiap pengujian.

**Contoh Mengatur Database Khusus:**

1. **Setup Database**: Ciptakan atau reset database khusus untuk tes di awal pengujian.

2. **Seeding Data**: Anda bisa melakukan seeding data sekali di awal pengujian jika dataset diperlukan untuk semua tes.

**File `jest.setup.ts`:**
```typescript
import { sequelize } from './config/database';

beforeAll(async () => {
  await sequelize.authenticate();
  await sequelize.sync({ force: true }); // Buat semua tabel baru
  await seedData(); // Seed data awal jika diperlukan
});

afterAll(async () => {
  await sequelize.close();
});
```

**File `seedData.ts`:**
```typescript
import { User } from './models/User';

export async function seedData() {
  await User.bulkCreate([
    { name: 'Alice' },
    { name: 'Bob' },
  ]);
}
```

### 4. **Optimasi Pengujian dan Setup Data**

- **Seeding Hanya Sekali**: Jika Anda memerlukan data awal, lakukan seeding hanya sekali di `beforeAll` atau `setup` global, dan pastikan data ini cukup untuk semua tes.
- **Setup Data Minimal**: Pastikan bahwa data yang di-seed adalah minimal dan relevan untuk pengujian yang dilakukan.

### Kesimpulan

- **Global Setup dan Teardown**: Lakukan setup dan teardown global di file konfigurasi Jest untuk menghindari pengulangan setup di setiap file tes.
- **Transaksi**: Gunakan transaksi untuk mengisolasi tes dan memastikan data tetap bersih antar tes.
- **Database Khusus**: Pertimbangkan menggunakan database khusus untuk pengujian atau setup database dengan cara yang efisien.
- **Seeding Data**: Seed data yang diperlukan sekali di awal pengujian jika diperlukan oleh beberapa tes.

Dengan pendekatan ini, Anda dapat menjaga efisiensi dalam pengujian dan menghindari waktu eksekusi yang lama akibat setup yang berlebihan.