# 📚 Kütüphanem — Kurulum Rehberi

Kişisel kütüphane yönetim sistemi. Firebase Firestore + GitHub Pages üzerinde çalışır.

---

## 🚀 Adım Adım Kurulum

### 1. Firebase Projesi Oluştur

1. [https://console.firebase.google.com](https://console.firebase.google.com) adresine giriş yap
2. **"Proje Oluştur"** butonuna tıkla, projeye isim ver (örn: `kutuphane`)
3. Google Analytics'i isterseniz açabilirsiniz (zorunlu değil)

### 2. Authentication Aktif Et

1. Firebase Console → **Authentication** → **Başlarken**
2. **Sign-in method** sekmesi → **E-posta/Şifre** → Etkinleştir → Kaydet

### 3. Firestore Database Oluştur

1. Firebase Console → **Firestore Database** → **Veritabanı oluştur**
2. **Test modunda başlat** seçin (daha sonra kuralları güncelleyeceğiz)
3. Bölge: `europe-west1` (veya size en yakın)

### 4. Firestore Güvenlik Kurallarını Ayarla

Firebase Console → Firestore → **Kurallar** sekmesine şunu yapıştır:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Kullanıcılar: sadece kendi profilini görebilir, admin hepsini görebilir
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null;
      allow update: if request.auth != null &&
        (request.auth.uid == userId ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }

    // Kitaplar: onaylı kullanıcılar okuyabilir, admin yazabilir
    match /books/{bookId} {
      allow read: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.approved == true;
      allow write: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
      // readBy alanını herkes güncelleyebilsin
      allow update: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.approved == true &&
        request.resource.data.diff(resource.data).affectedKeys().hasOnly(['readBy']);
    }
  }
}
```

**Kaydet** butonuna tıkla.

### 5. Web Uygulaması Ekle ve Config Al

1. Firebase Console → ⚙️ **Proje Ayarları** → **Uygulamalarınız** bölümü
2. **"</> Web"** ikonuna tıkla
3. Uygulama adı gir (örn: `kutuphane-web`) → **Kayıt Et**
4. Aşağıdaki gibi bir `firebaseConfig` göreceksiniz:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "kutuphane-xxx.firebaseapp.com",
  projectId: "kutuphane-xxx",
  storageBucket: "kutuphane-xxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

### 6. Config Dosyasını Güncelle

`js/firebase-config.js` dosyasını açın ve yukarıdaki değerleri yapıştırın.

---

### 7. GitHub'a Yükle

1. GitHub'da **yeni bir repository** oluştur (Public veya Private)
2. Bu klasördeki tüm dosyaları commit edip push et:

```bash
git init
git add .
git commit -m "İlk commit — Kütüphanem"
git remote add origin https://github.com/KULLANICI_ADI/kutuphane.git
git push -u origin main
```

### 8. GitHub Pages Aktif Et

1. GitHub repository → **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: **main** → **/root** → **Save**
4. Birkaç dakika içinde siteniz şu adreste yayında olacak:  
   `https://KULLANICI_ADI.github.io/kutuphane/`

---

## 👤 İlk Admin Hesabı Oluşturma

1. Siteye git → **Kayıt Ol** ile bir hesap oluştur
2. Firebase Console → **Firestore** → `users` koleksiyonu → oluşturduğun kullanıcı belgesi
3. `approved: true` ve `role: "admin"` değerlerini elle ekle
4. Şimdi giriş yapabilir ve sistemi kullanabilirsin!

---

## 📂 Excel İçe Aktarma

Sisteme giriş yaptıktan sonra:
1. **Admin** menüsü → **Excel İçe Aktar** sekmesi
2. Excel dosyanız şu sütunları içermeli: `ISBN`, `Kitap Adı`, `Yazar`, `Yayınevi`
3. Dosyayı sürükleyip bırakın veya tıklayarak seçin
4. Önizlemeyi kontrol edin → **Kitapları Yükle**

3000 kitap için yaklaşık 1-2 dakika bekleyin.

---

## 📁 Proje Dosyaları

```
kutuphane/
├── index.html          # Giriş sayfası
├── dashboard.html      # Genel bakış & istatistikler
├── books.html          # Kitap listesi & arama
├── admin.html          # Admin paneli
├── css/
│   └── style.css       # Tüm stiller
├── js/
│   ├── firebase-config.js  # ← Firebase ayarları buraya
│   └── auth.js             # Kimlik doğrulama
└── README.md           # Bu dosya
```

---

## ❓ Sık Sorulan Sorular

**Kullanıcı giriş yapamıyor?**  
→ Firestore'da kullanıcı belgesinde `approved: true` olduğunu kontrol edin.

**"permission-denied" hatası?**  
→ Firestore güvenlik kurallarını 4. adımdaki gibi güncelleyin.

**Excel dosyam tanınmıyor?**  
→ Sütun başlıklarını kontrol edin: `ISBN`, `Kitap Adı`, `Yazar`, `Yayınevi`

**GitHub Pages güncellenmiyor?**  
→ Değişikliklerinizi commit edip push ettiğinizden emin olun. Yayınlanma 1-2 dakika sürebilir.
