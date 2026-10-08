# Hunter Realms — v0.36 (cila taşları)

> Not: Oyun eskiden "Kara Diyar" adıyla geliştirildi, bu sürümde "Hunter Realms" olarak
> yeniden adlandırıldı. Kayıt dosyalarının iç anahtar isimleri değişmedi (bkz. CLAUDE.md).

Mir / Knight Online tarzı, tarayıcıda çalışan tek oyunculu av-ganimet RPG'si.
Kurulum yok, sunucu yok. Sadece HTML + CSS + JavaScript.

## Nasıl çalıştırılır
1. Zip'i telefonda bir klasöre çıkar.
2. `index.html` dosyasını tarayıcıda (Lemur) aç.
3. Hata olursa DevTools konsoluna bak; hata mesajı hangi dosya ve satır olduğunu söyler.

Kayıt tarayıcının localStorage'ına otomatik yapılır (10 saniyede bir ve her öldürmede).

## Dosyalar (script sırası önemli, index.html'deki sırayı bozma)
| Dosya | Ne işe yarar |
|---|---|
| js/veri.js             | Tüm sayılar: sınıflar, canavarlar, bölgeler, eşyalar, ek statlar, setler |
| js/ikon.js             | SVG ikonlar (emoji yerine). Kaynak: game-icons.net, CC BY 3.0 |
| js/ses.js              | Ses efektleri (dosya yok, Web Audio ile üretilir) |
| js/durum.js            | Oyuncu verisi, stat hesabı, seviye, kayıt ve eski kayıt göçü (gocEt) |
| js/esya.js             | Eşya üretme, kuşanma, satma, güçlendirme |
| js/savas.js            | Canavar alanı, otomatik savaş, boss, iksir |
| js/demirci.js          | Eritme, yeniden zarlama, kilit, eşya gücü |
| js/saha.js             | Serbest hareket, canavar gezinmesi, saldırgan canavarlar |
| js/maden.js            | Madencilik, enerji, ilahi silah |
| js/gorev.js            | Ana görev zinciri ve görev şeridi |
| js/meridyen.js         | Meridyen noktaları (kalıcı stat) |
| js/gunluk.js           | Günlük/haftalık görevler, aktiflik sandıkları |
| js/bolum.js            | Bölümler: aynı anda ilerleyen hedefler |
| js/kule.js             | Kule (süreli bekçi savaşı) ve rünler |
| js/galeri.js           | Galeri: canavar ansiklopedisi, öldürme kademeleri ve kalıcı statlar |
| js/mitik.js            | Efsanevi set: 10 ayrı yuva, parça düşmesi, takas, Kan Hırsı ve Muhafız Laneti |
| js/unvan.js            | Unvanlar: kazanma kontrolü, ilerleme, tak / çıkar |
| js/beceri.js           | Beceri etkileri, kitaplar, ustalık, geliştirme |
| js/yedek.js            | Kayıt dışa/içe aktarma (.json dosyası) |
| js/arayuz.js           | Ortak arayüz: üst bar, sekmeler, eşya kutusu, set detayı |
| js/arayuz-savas.js     | Savaş paneli |
| js/efekt.js            | Savaş efektleri: şimşek, alev, mermi, kılıç yayı, aura |
| js/arayuz-karakter.js  | Karakter (statlar, ilahi silah) ve Çanta sekmesindeki bebek |
| js/arayuz-canta.js     | Çanta ızgarası ve eşya penceresi |
| js/arayuz-kasaba.js    | Kasaba ekranı (iksirci, hurdacı) |
| js/arayuz-harita.js    | Büyük dünya haritası |
| js/arayuz-etkinlik.js  | Etkinlikler ve maden ekranı |
| js/arayuz-beceri.js    | Beceri listesi, önizleme, geliştirme |
| js/arayuz-demirci.js   | Demirci bölümü: arıtma, güçlendirme, eritme |
| js/arayuz-giris.js     | Karşılama, karakter seçimi, karakter oluşturma |
| js/ana.js              | Başlatma ve tüm tıklamalar (data-eylem) |

## Yeni canavar eklemek
`veri.js` içinde `G.CANAVARLAR`'a bir satır ekle, sonra `G.BOLGELER`'de
bir bölgenin `canavarlar` listesine id'sini yaz.

## Yeni eşya eklemek
`G.ESYALAR` listesinin **en sonuna** ekle. Araya eklersen eski kayıtlardaki eşyalar kayar.

## Yeni düğme eklemek
HTML'e `data-eylem="benimEylem"` yaz, `ana.js` içindeki `switch`'e
`case 'benimEylem': ... break;` ekle.

## Kayıt yapısı değişirse
`durum.js` → `surum` numarasını artır. Eski kayıt yüklenmez, oyun sıfırdan başlar.

## v0.2 değişiklikleri
- Eşyalara nadirliğe göre 0-4 rastgele ek stat (kritik, can çalma, altın/tecrübe bonusu...)
- 4 set (Kurt, Engerek, İblis, Ejder). Bölgenin bossundan %60, normal canavardan %1.5 düşer
- Eşya penceresinde "Kuşanırsan GP +/-" karşılaştırması
- Ek stat aralıkları ve set bonusları: veri.js'in en altında

## v0.3 değişiklikleri
- Eritme: Nadir ve üstü eşya → Ruh Tozu (+ yüksek nadirlikte Arıtma Taşı)
- Zarlama: Ruh Tozu + altınla ek statları yeniden at. 🔒 ile istediğin statları koru
- Kilit: kilitli eşya satılamaz ve eritilemez
- Çanta sıralama (en yeni, eşya gücü, nadirlik, yuva) ve filtre (GP artıranlar, setler...)
- ▲ işareti: kuşanınca GP'ni artıran eşya
- Kayıt yapısına yeni alan eklersen durum.js → G.gocEt içine de ekle

## v0.4 değişiklikleri
- 22 beceri: her sınıfa 6 özel, 5 genel. Aktif etkiler: hasar, sersemletme, süreli hasar, iyileşme, kalkan, güç
- 3 aktif yuva (seviye 1, 6, 12), 2 pasif yuva (seviye 4, 10)
- Kitaplar canavarlardan düşer ve otomatik öğrenilir. Seviye 5'e kadar kademeli gelişir
- Bekleme süreleri, otomatik beceri seçeneği (yuva sırasıyla kullanır)
- Yeni beceri eklemek: veri.js → G.BECERILER'e bir satır

## v0.5 değişiklikleri
- Canavarlar seviyeye göre güçlenir, bosslar x2 can ve %30 canın altında öfkelenir
- İksirler arası 3 tur bekleme (sınırsız iyileşme bitti)
- Otomatik mana iksiri: mana en ucuz becerine yetmeyince içilir
- Mana iksiri artık canavarlardan düşer
- Seviye atlamak daha uzun sürer, başlangıç becerileri 2 turda bir
- Tüm zorluk ayarları: veri.js → G.ZORLUK ve G.DUSME

## v0.6 değişiklikleri
- Saha: karakter serbest yürür. Boş yere dokun = git, canavara dokun = yürü ve saldır
- Saldırgan canavarlar (kırmızı !) yaklaşınca üstüne gelir
- Bölge zinciri sahanın altında. Kasabalar güvenli; iksir sadece kasabada satılır
- Ölünce son kasabada uyanırsın. Dönüş Parşömeni seni son kasabaya götürür
- 12 bölge (4 kasaba), içerik seviye 42'ye kadar. Yeni canavarlar ve eşyalar
- Dünya haritası sekmesi, seviyen yetmeyen bölgeler sisli
- Yeni bölge eklemek: veri.js → G.BOLGELER listesinde istediğin yere ekle (zincir sırası = liste sırası)
- Saha ayarları: veri.js → G.SAHA

## v0.7 değişiklikleri
- Saha görünmez 5x5 ızgara. Çizgi yok, kartlar karelerin içine oturur
- Çoklu savaş: sana saldıran (kırmızı çerçeveli) her canavar yanındaysa vurur. Köşede dur, daha az canavar ulaşsın
- Menzil: savaşçı 1, büyücü ve okçu 3 kare uzaktan vurur
- Beceri şekilleri: tek, yarımay (öndeki 3 kare), kasırga (etraftaki 8), alan (3x3), çizgi (4 kare delici)
- Alan becerileri vurduğu kareleri kısa süre parlatır
- Yeni beceriler: Hilal Kesiği (mana harcamaz), Kasırga, Göktaşı, Delici Ok, Çifte Darbe (tetiklenen pasif)
- "Tehlikede" = sana saldıran canavar var. Bu durumda bölge değiştiremez, parşömen okuyamaz, can yenilemezsin
- Izgara ve saha ayarları: veri.js → G.IZGARA ve G.SAHA. Menziller: G.SINIFLAR.x.menzil

## v0.7.1 düzeltmeleri
- Her saldırıda efekt: savaşçı kılıç izi, büyücü uçan ateş, okçu uçan ok. Vurulunca kartın kırmızı yanar
- Yanındaki her canavar saldırır. "!" işaretliler seni 2 kareden fark eder
- Pasif canavarlar gezinirken yanına girmez
- Otomatik savaş kapalıyken karakter kendi kendine yürümez, sadece menzildekilere karşılık verir

## v0.8 değişiklikleri
- Eşyalar sınıfa göre farklı ad ve simgeyle görünür (büyücü asa/cübbe, okçu yay/deri). Statlar aynı
  Yeni görünüm eklemek: veri.js → G.SINIF_GORUNUM (anahtar eşyanın asıl adı)
- Kasabalarda Eski Maden: 4 kat, enerjiyle kazı, maden bekçileri. Enerji oyun kapalıyken de dolar
- Madenci Çayı: altınla enerji (fiyat seviyeyle artar)
- İlahi silah (Karakter sekmesi): cevher + altınla 30 seviye. Seviye 5/15/25'te sınıfa özel tetiklenen beceri
- Efektler daha uzun görünür
- Ayarlar: veri.js → G.MADEN, G.MADEN_KATLARI, G.ILAHI


## v0.10 değişiklikleri
- Yeni alt sekme: Etkinlik. Eski Maden buradan girilir (kasabadaki maden kaldırıldı)
- Maden arka planda çalışır: bir ocak kap (10 enerji), her dakika 1 enerji harcanır ve cevher zarlanır
  Sen avlanırken, hatta oyun kapalıyken de sürer. "Kazıyı bitir ve topla" ile biriken hesabına geçer
- Rakip madenciler: dolu ocakları yağmalayabilirsin (yüzde = kazanma şansın). Onlar da senin ocağına saldırabilir
- Enerji en fazla 1000, günde 480 dolar. Madenci Çayı +100
- Bütün canavarlar sana koşar; yer yoksa arkada sıraya girer
- Saldırı altındayken de bölge değiştirebilir, parşömen okuyabilir, boss çağırabilirsin
- Otomatik modda büyücü ve okçu, kuşatılınca daha güvenli kareye geri adım atar
- Maden ayarları: veri.js → G.MADEN ve G.MADEN_KATLARI (en alttaki v0.10 bölümü)

## v0.11 değişiklikleri
- Karakter ekranı: ortada sınıfına göre silüet, iki yanda 10 ekipman yuvası (2 yüzük, 2 bileklik)
  Yeni eşya türü: bileklik. İkinci yüzük/bileklik boş yuvaya, yoksa en zayıfının yerine giyilir
- Çanta Karakter ekranına taşındı (alt menü 5 sekme). Tümü / Eşya / Ekipman sekmeleri
- İksir, taş, toz ve parşömenler çantada yığın sayısıyla görünür; dokununca kullanılabilir
- Çantayı altınla genişletme (+5 yuva, en fazla 80)
- Alt sekmeler: Ekipman, Statlar, İlahi silah
- Yuva düzeni: veri.js → G.YUVALAR. Çanta ayarları: G.CANTA

## v0.11.1
- Karakter bebeği Çanta sekmesine taşındı (referans oyundaki gibi): üstte bebek, altta çanta
- Karakter sekmesi: Statlar ve İlahi silah. Alt menü 6 sekme

## v0.12 değişiklikleri
- Her becerinin kendi efekti: ateş küresi, alevler, göktaşı, buz, şimşek, kılıç yayları, kasırga, ok yağmuru, delici ışın, auralar
- Beceri kullanınca adı karakterin üstünde parlayarak yükselir
- Hasar sayıları: "-115" biçiminde, kalın ve eğik. Kritik sarı ve büyük, zehir/yanma yeşil
- Yanan/zehirlenen canavarın kartında küçük alevler
- Becerinin efektini değiştirmek: veri.js → en alttaki v0.12 listesi. Yeni efekt: efekt.js → G.FX

## v0.13 değişiklikleri
- Karşılama ekranı: dağlar, sis, yükselen korlar, Duyurular (sürüm notları)
- Karakter seçimi: 3 kemerli kapı, seçili karakter meşalelerle aydınlanır. Ad, seviye, sınıf. Sil
- Karakter oluşturma: sınıf seçimi, kaide üstünde silüet, sınıf hikayesi, zar ile rastgele ad
- Aynı cihazda 3 karakter. Eski kayıt otomatik 1. yuvaya taşınır
- Oyun içinde Karakter → Statlar'ın altında "Karakter seçimine dön"
- Duyuru eklemek: veri.js → G.DUYURULAR. Rastgele ad parçaları: G.AD_PARCALARI

## v0.14 değişiklikleri
- Beceri yuvaları kalktı: öğrenilen her beceri etkin (pasiflerin hepsi birlikte işler)
- En yüksek seviye 8. Geliştirmek için: ustalık + o becerinin kitabı + Kitap Sayfası + altın
  Ustalık: aktif beceri her kullanımda +10, pasif her öldürmede +1
- Önizle: becerinin 1-8 tüm seviyelerdeki etkisi, mevcut seviye vurgulu
- Her aktif beceride "Otomatik" kutucuğu. Kapalı olan sadece elle (savaş ekranında dokununca) kullanılır
- Savaş ekranında öğrenilen tüm aktif beceriler küçük düğmeler olarak
- Yeni eşya: Kitap Sayfası (canavarlardan düşer)
- Ayarlar: veri.js → G.USTALIK_GEREK, G.SAYFA_CARPAN, G.ALTIN_CARPAN, G.DUSME.sayfa

## v0.15 değişiklikleri
- Ana ekran referans düzeninde: üst bar (sınıf rozeti, altın, ad, seviye, GP, tecrübe), büyük saha,
  boss plakası, beceri şeridi, süslü iksir çubuğu (Can, Mana, Dönüş, Kaç), Otomatik ve BOSS yuvarlak düğmeleri,
  kayıt, görev şeridi, küçük bölge haritası (önerilen GP, Ayarlar, Bilgi) ve bölge zinciri
- Alt menünün ortasında can/mana küresi (dokununca savaşa döner)
- Ana görev zinciri: 22 ödüllü görev, seviye 42'ye kadar yol gösterir
- Otomatik iksir/beceri seçenekleri Ayarlar penceresinde
- Görev eklemek: veri.js → G.ANA_GOREV

## v0.15.1
- Savaş ekranı tek ekrana sığar, kaydırma yok. Saha kalan boşluğu doldurur
- Beceri düğmeleri ana ekrandan kalktı (beceriler otomatik; Beceri sekmesinden seçilir)
- Alt menü ekranın altında sabit, küre içinde. Boss plakası sahanın üstünde
- Arka arkaya kullanılan becerilerin adları üst üste binmez

## v0.15.2
- Canavar kartlarının can çubuğunda sayılar, karakter kartında can ve mana sayıları (referanstaki gibi)
- Beceri adları arası mesafe açıldı

## v0.15.3
- Kart düzeni: simge arkada üstte, isim altta çubuğun üstünde (kalın, açık gölgeli), çubuk en altta. İsimler artık kapanmaz

## v0.15.4
- Saha kartları daha uzun (genişlik aynı)
- Uzun isimler kesilmek yerine küçülüp iki satıra bölünür

## v0.16 değişiklikleri
- Alt menü: Karakter, Çanta, küre, Etkinlik, Harita. Beceri, Karakter bölümüne taşındı
- Karakter bölümü (referanstaki gibi): alt menü Dön · Beceri · Meridyen · İlahi Silah · Statlar
- Meridyen: 6 kademe (Taş, Tunç, Demir, Gümüş, Altın, Yıldız) x 10 nokta. Silüet üstünde parlayan noktalar,
  şu anki ve sonraki statlar, Meridyen Hapı + altınla yükselt. Her kademe bir seviyede açılır
- İlahi silah sayfasında büyük parlayan amblem
- Statlar: − / + ile dağıt, Kaydet ile onayla, Sıfırla ile vazgeç
- Yeni eşya: Meridyen Hapı (canavar, boss ve ana görevlerden)
- Ayarlar: veri.js → G.MERIDYEN

## v0.17 değişiklikleri
- Alt menüye Demirci (referanstaki "Cast"). Açınca alt menü: Dön · Arıtma · Güçlendirme · Eritme
- Solda eşya listesi (Kuşanılı / Çanta), sağda seçili eşyanın bilgisi
- Arıtma: arıtılabilir statlar tablosu, mevcut statlar (kilitlenebilir) → arıtılmış statlar önizlemesi, GP karşılaştırması
  "Arıt" sadece önizler, eşya değişmez. Beğenirsen "Kaydet"
- Eşya penceresindeki "Arıt" düğmesi demirciyi o eşya seçili açar

## v0.18 değişiklikleri
- Etkinlik → Günlük Görevler: Günlük (8 görev) ve Haftalık (7 görev) sekmeleri
- Biten görevde "Al" aktiflik puanı verir, bitmeyende "Git" ilgili yere götürür
- Aktiflik çubuğunda 25/50/75/100 sandıkları (ödüller seviyeyle büyür)
- Gün gece yarısı, hafta pazartesi sıfırlanır (telefonun saatine göre)
- Görev/sandık ayarları: veri.js → G.GUNLUK, G.HAFTALIK, G.SANDIK_GUNLUK, G.SANDIK_HAFTALIK

## v0.19 değişiklikleri
- Etkinlik → Bölümler (referanstaki "XP"): 5 bölüm, her birinde aynı anda ilerleyen 8-9 görev
- Görev türleri: seviye, GP, toplam güçlendirme, arıtma sayısı, belirli canavar öldürme, eşya nadirliği, boss, beceri, meridyen, ilahi silah, maden
- Her görevin kendi ödülü var. "Al" / "Git". Bölümün bütün ödülleri alınınca sonraki bölümün zinciri kırılır
- Kalıcı sayaçlar: canavar türüne göre öldürme, nadirliğe göre bulunan eşya, arıtma/maden sayısı
- Bölüm eklemek: veri.js → G.BOLUMLER

## v0.20 değişiklikleri
- Etkinlik → Kule: 8 kademe x 6 kat. Meydan Oku → tek bekçi, 2 dakika süre. Yenersen kat geçilir
  Kulede ölmek tecrübe kaybettirmez. Dönüş düğmesi = Pes et
- Kat ödülü (ilk geçişte): altın, Kitap Sayfası, Rün Özü, rün (her 3 katta kesin, diğerlerinde %35)
- Günlük kule ödülü: en yüksek kata göre, günde bir kez
- Karakter → Rünler: 6 tip (Saldırı, Koruma, Patlama, Sığınak, Katliam, Bağışıklık), her tipten bir rün
  4 nadirlik, Rün Özü ile 10 seviyeye kadar yükselt, gereksizleri erit
- Simülasyon: 12 saatte seviye 25-27, kule katı 28-30
- Ayarlar: veri.js → G.KULE, G.RUN_TUR, G.RUN_NADIR

## v0.20.1 değişiklikleri
- Ödül yazılarında "undefined" düzeldi (Rün Özü)
- Denge gerçek bir oyuncuya göre yeniden ayarlandı (bütün eşyaları güçlendirip set toplayan):
  - Canavarlar seviye 6'dan itibaren güçlenmeye başlar, seviye 14'ten sonra x1.8 can, x1.3 saldırı (kule bekçileri dahil)
  - Arıtma Taşı düşme şansı %8 → %3
  - Güçlendirme başarısı her + seviyede %10 düşer; +5'ten itibaren başarısızlık seviye düşürür
  - Seviye için gereken tecrübe azaldı (ilerleme hızı korunsun)
  - Önerilen GP değerleri yükseldi
- Ayarlar: veri.js → G.ZORLUK (hpCarpan, atkCarpan, carpanBasLv, carpanTamLv, guclendirDusus, guclendirDusmeArti)

## v0.21 değişiklikleri
- Kayıt artık .json dosyası olarak dışa aktarılabiliyor, başka bir cihazda/tarayıcıda içe aktarılabiliyor
  (localStorage temizlenirse/tarayıcı değişirse veri kaybolmasın diye)
- Karakter seçimi ekranı: doluysa "📤 Dışa Aktar" düğmesi, boşsa "📥 İçe Aktar" düğmesi
- Karakter oluşturma ekranı: "Zaten bir yedeğin mi var? İçe Aktar" linki (boş yuvaya başka slottan geldiğinde)
- Dosya indirme çalışmazsa (bazı mobil tarayıcılar) metin kutusundan elle kopyalanabiliyor
- İçe aktarırken geçersiz/bozuk dosya reddediliyor; eski kayıt sürümleri de G.gocEt ile otomatik güncelleniyor
- Yeni dosya: js/yedek.js

## v0.22 değişiklikleri (görsel ciddiyet — 1. adım)
- Telefonda (Chrome) oyun ekranı aşağı yukarı kayıyordu: `100vh` adres çubuğu gizliykenki yüksekliği
  verdiği için sayfa ekrandan uzun kalıyordu. Artık `100dvh` (o an görünen yükseklik) kullanılıyor
- Emoji yerine tek renkli, bronz tonlu SVG ikonlar (ilk grup):
  - Alt menü: Karakter (miğfer), Çanta, Demirci (örs), Etkinlik (defne tacı), Harita
  - Savaş çubuğu: Can / Mana iksiri (kırmızı / mavi şişe), Dönüş parşömeni, Kaç (kapı), Otomatik / Elle
  - Görev şeridi (maden, ödül sandığı, ayarlar) ve bölge kutusundaki Ayarlar / Bilgi
- Yeni dosya: js/ikon.js (veri.js'ten hemen sonra yüklenir). Yeni ikon eklemek: G.IKONLAR'a satır ekle,
  arayüzde G.ikon('ad') kullan
- İkonlar: game-icons.net (Lorc, Delapouite ve diğerleri), lisans CC BY 3.0 —
  https://game-icons.net · https://creativecommons.org/licenses/by/3.0/

### v0.22 — 2. adım: canavar ve sınıf ikonları
- 16 canavarın emojisi yerine karanlık siluet ikonlar (kurt, yaban domuzu, örümcek, engerek, gargoyl, ejder...).
  Savaş kartında, boss plakasında, BOSS düğmesinde, kule bekçisinde ve bölge bilgisinde görünür
- Sınıf ikonları: Savaşçı (çapraz kılıçlar), Büyücü (asa), Okçu (gerilmiş yay) — karakter oluşturma, üst bar, oyuncu kartı
- İsim düzeltmeleri (sadece görünen ad, iç id'ler aynı, kayıtlar etkilenmez):
  Dev Bokböceği → Kara Kınkanatlı, Kurt Kral → Kurt Kralı, Şahin → Kara Şahin
- Yeni canavara ikon vermek: veri.js'te `ikon: '🐺'` yerine `simge: 'ad'` yaz ve ikon.js → G.IKONLAR'a aynı adla ikonu ekle
  (simge yazılmazsa emoji eskisi gibi çalışır)

### v0.22 — 3a: kaynak, menü ve etkinlik ikonları
- Sarf malzemeleri ikonlu ve kendi renginde: Can/Mana İksiri, Dönüş Parşömeni, Arıtma Taşı (elmas), Ruh Tozu,
  Kitap Sayfası, Meridyen Hapı, Rün Özü (rün taşı). Çantada, dükkanda, demircide, ödüllerde aynı ikon
- Altın her yerde iki sikke ikonu (üst bar, bedeller, ödüller)
- Etkinlik listesi: Maden (kazma), Bölümler (cilt), Günlük Görevler (liste), Kule (taş kule), Arena (kılıçlar);
  aktiflik ve kule sandıkları, kilitli bölüm, Madenci Çayı, kasaba (köy), İksirci / Hurdacı başlıkları
- Karakter alt menüsü (Beceri, Meridyen, İlahi, Rünler, Statlar) ve Demirci alt menüsü (Arıtma, Güçlendirme, Eritme)
- Savaş günlüğündeki bölüm, beceri, kule, maden, görev ve sandık satırları da ikonlu
- veri.js → G.SARF'ta `ikon` yerine `simge` (renk alanı ikonu boyar); dükkan ürünleri ikonu G.SARF'tan alır

### v0.22 — 3b: eşya ikonları ve kalan canavarlar
- 70 eşyanın, 8 kuşanma yuvasının ve sınıfa özel görünümlerin (asa, yay, cübbe, taç, kukuleta...) emojisi yerine SVG ikon.
  Çantada, karakter bebeğinde, demircide ve eşya penceresinde görünür
- veri.js'teki eşya listesine DOKUNULMADI (sıra önemli). Bunun yerine ikon.js → G.EMOJI_IKON tablosu emojiyi ikona çevirir.
  Yeni eşyaya tablodaki bir emojiyi verirsen ikonu otomatik gelir; tabloda olmayan emoji olduğu gibi görünür
- 2. adımda atlanan 16 canavar (Bataklık, Buz Diyarı, Kor Dağı, Hiçlik Uçurumu) da ikonlu: kurbağa, timsah, trol, buz golemi,
  semender, kaya golemi, kara şövalye, dokunaç...

### v0.22 — 3c: beceriler, rünler, cevherler, ilahi silahlar
- 28 becerinin ikonu (beceri listesi, savaş düğmeleri, günlük): balta savuruşu, ateş topu, buz mızrağı, ok yağmuru, şifa...
- 6 rün tipi, 5 cevher (her biri kendi renginde: bakır, gümüş, altın, kara demir, mavi kristal), 3 ilahi silah
- Küçük arayüz ikonları: eşya ve stat kilitleri (kapalı/açık asma kilit), toplu sat/erit, çanta genişletme, Duyurular,
  Ayarlar, Dışa/İçe Aktar (kaydet/yükle), rastgele ad zarı, beceri kitabı, Meridyen Hapı bedeli
- veri.js → G.BECERILER, G.RUN_TUR, G.CEVHERLER, G.ILAHI.sinif'ta `ikon` yerine `simge` (cevherlerde ayrıca `renk`)
- Oyunda artık sadece ✓ ➤ ✦ gibi tipografik işaretler kaldı (bilerek)

## v0.23 değişiklikleri (vuruş hissi — sadece görsel, denge değişmedi)
- Beceri hasarı normal vuruştan ayrı görünür: buz beyazı, mavi parıltılı, daha büyük sayılar (ilahi silah vuruşu da)
- Kritik vuruş: sayının üstünde "KRİTİK" yazısı, kart bir an beyaz parlar, saha hafifçe sarsılır
- Canavar ölünce kart kızıl parlayıp küçülerek solar
- Canının %12'sinden fazlasını götüren darbe: saha sert sarsılır, kenarlarda kırmızı parlama
- Canın %30'un altındayken saha kenarları kırmızı nabız gibi atar
- Telefonda "hareketi azalt" (reduced motion) açıksa sarsıntılar kapalı
- Kod: arayuz-savas.js → G.sinifTekrar, G.sahaSars, G.olumEfekti; savas.js → G.vur'a "tur" parametresi

## v0.24 değişiklikleri (ses efektleri)
- Sesler: normal vuruş, beceri, kritik (metal çınlaması), canavar ölümü, sana gelen darbe (şiddetine göre),
  iksir, seviye atlama, boss ortaya çıkışı
- Ses dosyası YOK: hepsi tarayıcıda Web Audio ile üretiliyor (internetsiz ve lisanssız çalışır)
- Ayarlar → "Ses" ile kapatılabilir. Kayıtta yeni alan: o.ayar.ses (eski kayıtlar G.gocEt ile otomatik açık gelir)
- Tarayıcılar sesi ilk dokunuştan sonra açar; ana.js'teki tıklama dinleyicisi G.sesAc'ı çağırır
- Ayarlar: ses.js → G.SES (ana ses seviyesi, aynı sesin tekrar aralığı), sesler G.SESLER içinde

## v0.25 değişiklikleri (ana görev hikâyesi)
- Hikâye: kuzeydeki Hiçlik Uçurumu'ndan bir karanlık güneye yayılıyor; bölge bossları ona teslim olmuş eski bekçiler
- Dört kasabada dört anlatıcı görev verir: Tülek (Taşlıca Köyü yaşlısı), Sarıca (Kervansaray tüccarı),
  Bozdoğan (Demirkapı komutanı), Ayaz (Son Karakol nöbetçisi) — her birinin portresi var
- 22 ana görevin her birinin anlatıcı konuşması + bütün görevler bitince son söz
- Sadece görev şeridindeki sandık düğmesiyle açılan görev penceresinde görünür; oyunu kesmez
- 12 bölgenin açıklaması hikâyeye göre yeniden yazıldı (kasaba ekranı ve bölge bilgisi)
- Ayarlar: veri.js → G.ANLATICILAR, G.ANA_HIKAYE (sırası G.ANA_GOREV ile aynı), G.ANA_HIKAYE_SON

## v0.26 değişiklikleri (boss replikleri)
- 8 bölge bossunun 3 anı var: ortaya çıkınca, öfkelenince (can %30 altı) ve yenilince
- Hayvan bosslar için anlatı cümlesi; Zincirli İblis, Kara Ejder, Ayaz Devi, Kor Titanı ve Hiçlik Efendisi kendi sözleriyle konuşur
- Replik günlüğe italik düşer ve boss plakasının altında 5 saniye görünür (dokunmaları engellemez)
- Kule bekçilerinde replik çıkmaz
- Ayarlar: veri.js → G.BOSS_REPLIK (giris, ofke, olum). Yeni bossa replik: aynı biçimde bir satır ekle

## v0.27 değişiklikleri (canavar, eşya kökeni ve set açıklamaları)
- 32 canavarın her birine bir satırlık açıklama; bölge bilgi penceresinde canavar listesinin altında görünür
- Eşya penceresinde köken satırı: eşyanın seviyesine denk gelen bölgeden ("Kül Harabeleri'nin küllerinden çıkarılmış.").
  Eşya başına değil bölge başına yazıldı, böylece sınıfa özel görünümlerle (asa, yay...) çelişmez
- 4 setin hikâyesi eşya penceresindeki set kutusunda
- Ayarlar: veri.js → v0.27 bloğu (canavar açıklamaları, bölge esyaKoken, set aciklama). Statlar ve kayıt değişmedi

## v0.28 değişiklikleri (güçlendirme ritüeli — Knight Online'daki "+ basma" anı)
- Güçlendir'e basınca ritüel sahnesi: eşya örsün üstünde, çekiç 3 kez iner (kıvılcım + metal sesi), kısa bekleyiş, sonra sonuç
  - Başarılı: altın parlama, çan sesi · Başarısız: donuk gri · Kırıldı (seviye düştü): kırmızı çatlama, kırılma sesi
- +7 ve üstüne basarken bekleyiş uzar, arka plan kızarır, eşya nabız gibi parlar; başarı savaş günlüğüne düşer
- Her an dokununca sonuca atlar; sonuç ekranında dokununca kapanır (demirci ya da eşya penceresi geri gelir)
- KURALLAR DEĞİŞMEDİ: şans, bedel, +5 sonrası düşme aynı. Sonuç düğmeye basıldığı an hesaplanıp kaydedilir,
  sahne sadece gösterir (uygulamayı yarıda kapatmak sonucu değiştirmez)
- Ayarlar: arayuz-demirci.js → G.RITUEL (vuruş sayısı, aralık, bekleyiş, "yüksek" eşiği); sesler ses.js → cekic, basari, bos, kirilma

## v0.29 değişiklikleri (elit canavarlar — Warriors and Adventure'daki mavi kenarlı canavarlar)
- Sahaya gelen her normal canavar %3 ihtimalle ELİT olur: mavi kenar ve parıltı, mavi isim, "ELİT" etiketi
- Elit: 10x can (referans oyundaki oran), 1.5x saldırı
- Ödül: 8x tecrübe ve altın, garanti bir eşya, nadirlik şansı 2.5 kat (normal 1, boss 4)
- Elit belirince ve öldürülünce günlüğe yazılır. Boss ve kule bekçileri elit olmaz
- Kayıt yapısı değişmedi (elitlik sadece sahadaki canavarda tutulur)
- Ayarlar: veri.js → G.ELIT (sans, hpCarpan, atkCarpan, odulCarpan, nadirBonus)

## v0.30 değişiklikleri (boss paneli ve yeniden doğma süreleri — Warriors and Adventure'daki BOSS listesi gibi)
- BOSS düğmesi artık boss panelini açar: 8 bölge bossu, bölgesi, durumu ("Hazır" ya da geri sayım), önerilen GP
  - Bulunduğun bölgenin bossu: "Çağır" · başka bölgedeki boss: "Işınlan" (bölgeye gider ve bossu çağırır) · seviye yetmiyorsa kilitli
- Boss yenilince yeniden doğma süresi başlar: Kurt Kralı 10 dk → Hiçlik Efendisi 60 dk. Gerçek zamanlı, oyun kapalıyken de işler
- Süre dolmadan boss çağrılamaz; sahadaki BOSS düğmesinde kırmızı geri sayım görünür
- Kule bekçileri bu sürelerden etkilenmez
- KAYIT: yeni alan o.bossZaman ({ bossId: doğacağı zaman }) — G.gocEt eski kayıtlara boş olarak ekler
- Ayarlar: veri.js → G.BOSS_SURE (dakika)

## v0.31 değişiklikleri (bosslar sahada kendiliğinden doğar — Warriors and Adventure'daki turuncu "lord"lar gibi)
- Süresi dolan boss, sen bölgesindeyken 4 saniye sonra sahada kendiliğinden belirir: oyuncudan uzakta, üst iki sırada değil
  (oraları boss plakası ve sözü kapatır). Sen saldırana kadar seni beklemez, sahada durur
- Görünüm: turuncu kenar ve nabız gibi atan alev parıltısı, turuncu isim; boss plakasında "Sahibi: <karakter adı>"
- Boss panelinde "Çağır" kalktı: bulunduğun bölgede "Burada", başka bölgede "Işınlan" (bölgeye gider ve bossu hemen getirir)
- Kasabada ve kulede boss doğmaz. Yenilince süre yeniden başlar (v0.30)
- Kayıt yapısı değişmedi. Ayarlar: veri.js → G.BOSS_DOGMA_GECIKME (saniye)

## v0.32 değişiklikleri (Galeri — Warriors and Adventure'daki "Gallery" gibi canavar ansiklopedisi)
- Etkinlik → Galeri: bölge sekmeleri, canavar kartları (5 yıldız = 5 kademe), seçili canavarın açıklaması ve hedefi
- Her canavarın 5 kademesi var: normal canavar 25 / 100 / 300 / 750 / 1500 öldürme, boss 1 / 3 / 8 / 15 / 30
- Kademe tamamlanınca "Al": altın + kalıcı stat. Stat türü bölgedeki sıraya göre (1. saldırı, 2. can, 3. savunma, boss saldırı + can)
- Güç "hafif": oyuncunun seviyesinde ulaşabildiği galerinin tamamı GP'yi yaklaşık %5-7 artırır (lv 16/25/40 için ölçüldü)
- Eski öldürmeler de sayılır (o.istatistik.oldurId). Hiç öldürülmemiş canavar "???" görünür
- Hazır ödül olan sekme ve kartlarda kırmızı nokta; Etkinlik listesinde bekleyen ödül sayısı
- KAYIT: yeni alan o.galeri ({ canavarId: alınan kademe }) — G.gocEt eski kayıtlara boş olarak ekler
- Ayarlar: veri.js → G.GALERI (hedef, sira, lvTaban, katsayi, bossKatsayi, altin). Yeni dosya: js/galeri.js

## v0.33 değişiklikleri (Efsanevi set — Warriors and Adventure'daki "Mythical" gibi)
- Karakter → Efsanevi: normal kuşanımdan ayrı 10 yuva (kılıç, zırh, miğfer, kolye, 2 bileklik, 2 yüzük, kemer, çizme)
- Her yuva kendi efsanevi parçasıyla bir kez etkinleştirilir. Parçalar bosslardan düşer: %4 + bossun seviyesi x %0.05
- Açık yuvalar kalıcı stat verir, oyuncu seviyesiyle büyür. 10 yuvanın hepsi açıkken GP yaklaşık %8-10 artar (lv 16/25/40 ölçüldü)
- Beceriler:
  - Kan Hırsı (kılıç; referanstaki "Bloodlust Blade"): hasar verirken %16 ihtimalle hasarın %6'sı cana döner, 10 sn'de bir
  - Muhafız Laneti (zırh): sana vuran canavar %15 ihtimalle lanetlenir, 3 tur %20 zayıf vurur (kartı mor görünür)
- Takas: açık yuvanın fazla parçası sökülünce 1 Efsane Özü; 3 özle istenen yuvanın parçası alınır
- KAYIT: yeni alan o.mitik ({ acik, parca, oz }) — G.gocEt eski kayıtlara boş olarak ekler
- Ayarlar: veri.js → G.MITIK (lvTaban, dusme, dusmeLv, sokOz, takasOz, yuvalar, beceriler). Yeni dosya: js/mitik.js

## v0.34 değişiklikleri (Unvanlar — Warriors and Adventure'daki "Title" gibi)
- Karakter → Statlar sayfasının altında yeni "Unvanlar" kutusu: 16 unvan, kazanılan / kilitli, ilerleme sayacı
- Unvanlar başarılarla kazanılır: canavar öldürme (100 / 2000 / 10000), her ana bölge bossunu ilk kez yenmek,
  toplam 50 boss, Sınav Kulesi 12. ve 48. kat, bir eşyayı +7 / +12 yapmak, 40 Galeri kademesi, 5 / 10 efsanevi yuva
- Aynı anda tek unvan takılır, yalnız takılı unvanın statı işler (ör. Usta Avcı +%3 saldırı, Hiçliği Yenen +%8 saldırı +%5 can)
- Takılı unvan üst çubukta karakter adının altında görünür
- Yeni unvan kazanılınca günlükte ve bildirimde duyurulur (kontrol her kayıtta yapılır; eski karakterler
  zaten tamamladıkları unvanları ilk kayıtta toplu kazanır)
- KAYIT: yeni alan o.unvan ({ kazanilan, takili }) — G.gocEt eski kayıtlara boş olarak ekler
- Ayarlar: veri.js → G.UNVANLAR (yeni unvan listenin SONUNA eklenir). Yeni dosya: js/unvan.js. Yeni ikon: unvan (defne)

## v0.35 değişiklikleri (Su Verme — Warriors and Adventure'daki "Quench" gibi)
- Demirci → yeni "Su Verme" sekmesi. Her eşyanın temel statlarına (saldırı, savunma, can, mana, hız) ayrı bir su verme bonusu var
- Cila değeri (%): bu bonusların en fazla değerlerine oranı. Tam cila temel statı (nadirlik dahil) %30 artırır,
  güçlendirme (+) çarpanı bunun da üstüne işler. Bütün kuşanım tam cilada GP yaklaşık %14-16 artar (lv 16/25/40 ölçüldü)
- Yeni düşen her eşya rastgele bir ilk cilayla gelir (çoğu düşük). Eşya penceresinde "Cila (su verme)" satırı görünür
- Su Ver: çantadaki aynı ad + aynı nadirlikte, cilası daha yüksek, kilitsiz bir eşya kurban edilir. Statlar yeniden
  zarlanır: her stat = eski oran + cila farkı x rastgele(-0.3 .. 1) — fark büyüdükçe artış büyür, bazen bir stat düşebilir
- Gelişmiş (+1 Su Verme Taşı): 1-2 stat kilitlenir, sadece kilitli statlar değişir ve yalnız artış kalır
- Sonuç önce önizlenir, beğenirsen Kaydet. Kurban edilen eşya her durumda gider
- Cilayı sıfırla (1 Su Verme Taşı): bonus %0 olur, böylece daha çok eşya kurban edilebilir hale gelir
- Yeni sarf malzemesi Su Verme Taşı: elit canavardan %25 şansla 1, bosstan 1-2; kasaba dükkanında 400 altın
- KAYIT: eşyalara yeni alan e.su, sarf'a o.sarf.suTasi — G.gocEt eski eşyalara da rastgele bir ilk cila verir
- Ayarlar: veri.js → G.SUVERME. Kod: esya.js (G.suMaks, G.suUret, G.cila), demirci.js (G.suVer, G.suKaydet, G.suSifirla),
  arayuz-demirci.js (G.suvermeHtml). Yeni ikonlar: suverme, su_tasi

## v0.36 değişiklikleri (Cila taşları — referanstaki gibi su verme taş istemez)
- Su verme artık hiç taş istemez: Su Ver ve Gelişmiş sadece altınla (Gelişmiş = normal bedelin 3 katı), Sıfırla da altınla
- Su Verme Taşı kalktı; yerine 5 kademe cila taşı: Ham (+1), Cila Taşı (+2), Parlak (+3), Usta (+10), Kusursuz (+20)
- Demirci → Su Verme → "Cilala": taş her statın oranını taşın gücü kadar artırır, cila da o kadar yükselir (en fazla %100)
- Düşme: elit canavardan %25 şansla 1 taş (+1/+2/+3), bosstan 1-2 taş (+2/+3 sık, +10 ara sıra, +20 nadir)
- Dükkan: Ham Cila Taşı 150, Cila Taşı 350 altın
- KAYIT: eşyadaki e.su (stat değeri) → e.so (yüzde oran, daha hassas); o.sarf.cila1..cila5.
  G.gocEt eski e.su'yu orana çevirir, eldeki her Su Verme Taşı 1 Parlak Cila Taşı (+3) olur
- Ayarlar: veri.js → G.SUVERME, G.CILA_TASLARI (ad, arti, renk, agirlikElit, agirlikBoss). Kod: demirci.js → G.cilala, G.cilaTasiSec
