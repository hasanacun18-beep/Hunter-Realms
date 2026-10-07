# Hunter Realms — v0.24 (ses efektleri)

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
