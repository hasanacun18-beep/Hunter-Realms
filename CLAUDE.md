# Hunter Realms — Proje Rehberi

Bu dosyayı her session başında oku ve buradaki kurallara göre çalış.

(Not: Proje eskiden "Kara Diyar" adıyla geliştirildi, v0.21'de "Hunter Realms" olarak
yeniden adlandırıldı. Kodda hâlâ "Kara Diyar" döneminden kalma bazı iç/görünmez isimler
olabilir — bkz. "Kayıt (Save) Sistemi" bölümündeki not, bunlar BİLEREK değiştirilmedi.)

## Proje Nedir

Hunter Realms, Mir / Knight Online tarzı, tarayıcıda çalışan **tek oyunculu** av-ganimet
RPG'si. Amatör/hobi projesi, ticari amaç yok. Kurulum yok, sunucu yok, build adımı yok —
sadece HTML + CSS + vanilla JavaScript (ES5, modül yok). `index.html`'i tarayıcıda açmak yetiyor.

- Geliştirici: Hasan (tek kişi, amatör solo developer)
- Backend / sunucu: YOK. Tüm oyun durumu tarayıcının `localStorage`'ında tutulur.
- Hosting: Şu an yok — zip olarak dağıtılıyor, telefonda klasöre çıkarılıp açılıyor.
  GitHub'a yüklendiğinde GitHub Pages gibi statik bir hosting seçeneği değerlendirilebilir,
  ama bu henüz karara bağlanmadı — varsayım yapıp kurma, önce sor.
- İleride online/çok oyunculu bir oyuna çevrilmesi düşünülüyor ama bu **henüz başlamadı,
  kararlaştırılmadı**. Aksi açıkça istenmeden mimariyi online'a göre değiştirmeye çalışma.

## Referans / İlham Kaynağı

Hasan'ın bu oyunu tasarlarken referans aldığı oyun: **Warriors and Adventure**
Wiki: https://warriors-and-adventure.fandom.com/wiki/Warriors_and_Adventure_Wiki

Bu wiki adresine bu ortamdan (ağ erişim kısıtlaması nedeniyle) doğrudan girilemiyor —
Frontier Sovereign projesindeki Rival Regions wiki'siyle aynı durum. Bir mekanik
netleştirmek gerektiğinde Hasan'ın ekran görüntüsü veya metin olarak ilgili wiki
sayfasını paylaşması gerekiyor; kendi bilgisinden/tahmininden varsayım üretme.

Not: Oyun mekaniklerini (kuralları, sayıları, kategorileri) referans oyundan alman
telif sorunu değildir — sadece birebir metin/görsel kopyalama ve marka adı/logosu
kullanımından kaçın (Frontier Sovereign'daki aynı değerlendirme burada da geçerli).

## Klasör Yapısı

- `index.html` — tek HTML dosyası, tüm scriptleri sırayla yükler (sıra önemli, bkz. BENIOKU.md)
- `css/stil.css` — tüm görsel stil tek dosyada
- `js/veri.js` — TÜM sabit veri: sınıflar, canavarlar, bölgeler, eşyalar, becerler, setler,
  zorluk/düşme katsayıları. Yeni içerik eklemek genelde SADECE bu dosyaya satır eklemek demek.
- `js/durum.js` — oyuncu verisi, stat hesabı, seviye, kayıt/yükleme, eski kayıt göçü (`G.gocEt`)
- `js/yedek.js` — kayıt dışa/içe aktarma (.json dosyası, v0.21'de eklendi)
- Sistem dosyaları: `esya.js`, `savas.js`, `demirci.js`, `saha.js`, `maden.js`, `meridyen.js`,
  `beceri.js`, `gorev.js`, `gunluk.js`, `bolum.js`, `kule.js` — her biri kendi oyun sistemi
- Arayüz dosyaları (`arayuz*.js`) — ekran çizimi, sistem dosyalarından ayrı tutuluyor
- `js/ana.js` — başlatma + TÜM tıklamaların tek merkezi dispatch'i (`G.eylem` switch)
- `BENIOKU.md` — hem kurulum talimatı hem de **canlı değişiklik günlüğü** (her versiyon
  kendi bölümünde belgeleniyor). Yeni bir özellik eklediğinde buraya bir bölüm ekle.

## Kod Kuralları

- Dosya ve fonksiyon isimleri Türkçe (durum.js, savas.js, esyaOlustur gibi) — bu düzeni koru.
- Yorumlar Türkçe yazılıyor, aynı dilde devam et.
- **Global `G` nesnesi tek kaynak**: modül/import yok, her dosya `G.xxx = function(){...}`
  şeklinde `G`'ye fonksiyon/veri ekliyor. Script sırası (`index.html`'deki) bu yüzden önemli —
  `veri.js` en başta, `ana.js` en sonda olmalı.
- **Veri odaklı tasarım**: yeni canavar/eşya/bölge/beceri eklerken kod yazmak yerine
  `veri.js`'teki ilgili listeye (`G.CANAVARLAR`, `G.ESYALAR`, `G.BOLGELER`, `G.BECERILER`...)
  bir satır ekle. `G.ESYALAR`'a yeni eşya her zaman **sonuna** eklenir (araya eklersen eski
  kayıtlardaki eşya referansları kayar).
- **Tıklama/aksiyon eklemek**: HTML'e `data-eylem="eylemAdi"` yaz, `ana.js`'teki `G.eylem`
  switch'ine `case 'eylemAdi': G.fonksiyon(); break;` ekle. Başka yerde event listener
  bağlamaya çalışma, bu tek merkezi dispatch'i kullan.
- ES5 stili korunuyor (`var`, fonksiyon ifadeleri) — mevcut dosyalarda `const`/`let`/ok yok,
  tutarlılık için aynı stilde devam et.

## Kayıt (Save) Sistemi — DİKKAT

- Kayıt `localStorage`'da 3 karakter yuvasında tutulur. Anahtar isimleri hâlâ eski proje
  adından geliyor (`karadiyar_slot_0/1/2`, `karadiyar_aktif`) — isim değişikliğinde BİLEREK
  güncellenmedi, çünkü oyuncunun cihazında bu isimlerle kayıtlı gerçek bir ilerleme varsa
  anahtar değiştirmek o kaydı "kaybolmuş" gösterirdi. Bu görünmez bir iç detay, dokunma;
  gerçekten değiştirmek gerekirse önce eski anahtardan yeni anahtara GÖÇ (migration) yaz,
  asla doğrudan silip yeniden adlandırma.
- **Kayıt yapısına yeni bir alan eklersen MUTLAKA `durum.js` → `G.gocEt`'e de ekle**
  (`if (!o.yeniAlan) o.yeniAlan = ...`). Bu, eski kayıtların her yüklemede otomatik
  güncellenmesini sağlıyor — bu adımı atlarsan eski kayıtlar bozulur/hata verir.
- Kayıt yapısı KÖKTEN değişirse (eski veriyle uyumsuz bir alan şekli değişimi gibi):
  `durum.js` → `surum` numarasını artırmayı değerlendir (bu durumda eski kayıt
  sıfırdan başlar, geri dönüşü yok — Hasan'a sormadan bu yolu seçme).
- `js/yedek.js` ile dışa/içe aktarma var — büyük bir kayıt-yapısı değişikliği öncesi
  Hasan'a "önce yedek al" demeyi unutma.

## Çalışma Şekli (ÖNEMLİ — Frontier Sovereign ile AYNI kurallar)

- Görevleri küçük, tek bir özelliğe/hataya odaklı adımlarla yap. Tek seferde birden fazla
  sistemi aynı anda büyük ölçekte değiştirme.
- Bir değişiklik tamamlandığında commit etmeden ÖNCE ne değiştirdiğini kısaca özetle ve
  onay bekle. Onay gelmeden commit/push yapma.
- Onay geldikten sonra anlamlı, açıklayıcı commit mesajlarıyla commit et. Her mantıksal iş
  birimi için ayrı commit yap.
- Emin olmadığın bir konuda (oyun dengesi, hangi sistemin nasıl davranması gerektiği,
  referans oyundaki bir mekanik) varsayım yapmadan önce sor.
- Yeni bir versiyon/özellik tamamlandığında `BENIOKU.md`'ye ilgili bölümü eklemeyi unutma
  (mevcut `v0.X değişiklikleri` formatını koru).
- Build/test altyapısı yok — değişiklikten sonra en azından `node -c` ile syntax kontrolü
  yap, mümkünse bir tarayıcıda (ör. Playwright) gerçek tıklama testiyle doğrula.

## Deploy Notu

Şu an otomatik deploy YOK (statik dosyalar, build/CI yok). GitHub'a push etmek kendi
başına bir şeyi "canlıya" yansıtmıyor — eğer ileride GitHub Pages ya da benzer bir statik
hosting bağlanırsa bu bölüm güncellenmeli. O karar verilene kadar "push = canlıya yansıdı"
varsayımı yapma (Frontier Sovereign'daki gibi anlık/geri dönüşü zor bir deploy YOK).
