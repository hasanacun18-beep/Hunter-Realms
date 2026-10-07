// ============================================================
// yedek.js — v0.21: Kayıt dışa/içe aktarma (cihaz değişince veri kaybolmasın)
// Karakter seçimi ekranından çalışır: seçili kapı doluysa "Dışa Aktar",
// boşsa "İçe Aktar" görünür. localStorage'daki slotu doğrudan okur/yazar.
// ============================================================

// Seçili yuvanın kaydını .json dosyası olarak indirir; indirme çalışmazsa
// metni bir kutuda gösterir (kopyalanabilir).
G.disaAktar = function (i) {
  var k = G.slotYukle(i);
  if (!k) return;
  var veri = JSON.stringify(k);
  var indirildi = false;
  try {
    var blob = new Blob([veri], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'hunterrealms-' + k.ad.replace(/[^a-zA-Z0-9ğüşıöçĞÜŞİÖÇ]+/g, '_') + '-' + new Date().toISOString().slice(0, 10) + '.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
    indirildi = true;
  } catch (e) { console.warn('Dosya indirme başarısız:', e); }

  G.$('modalIc').innerHTML = '<h3>📤 Dışa Aktar</h3>' +
    '<p class="kucuk-not">' + (indirildi
      ? 'Dosya indirildi (İndirilenler klasörüne bak). WhatsApp, Drive veya e-posta ile kendine göndererek yedekleyebilirsin.'
      : 'Otomatik indirme çalışmadı. Aşağıdaki metni kopyalayıp bir yere (ör. kendine mesaj olarak) kaydet.') + '</p>' +
    '<textarea id="yedekMetin" class="girdi" readonly rows="6">' + veri + '</textarea>' +
    '<div class="modal-dugmeler"><button data-eylem="yedekKopyala">📋 Metni Kopyala</button><button data-eylem="modalKapat">Kapat</button></div>';
  G.$('modal').classList.remove('gizli');
};

G.yedekKopyala = function () {
  var el = G.$('yedekMetin');
  if (!el) return;
  el.select();
  el.setSelectionRange(0, 999999);
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(el.value);
    else document.execCommand('copy');
    G.bildir('Panoya kopyalandı.');
  } catch (e) { G.bildir('Kopyalanamadı, elle seçip kopyala.'); }
};

// Seçili (boş) yuvaya bir yedek dosyası ya da yapıştırılan metni yükler.
G.iceAktarModal = function (i) {
  G.iceAktarHedef = i;
  G.$('modalIc').innerHTML = '<h3>📥 İçe Aktar</h3>' +
    '<p class="kucuk-not">Daha önce dışa aktardığın .json dosyasını seç, ya da içeriğini aşağıya yapıştır.</p>' +
    '<input type="file" id="yedekDosya" accept="application/json,.json,text/plain" style="width:100%;margin-bottom:8px;color:var(--kemik)">' +
    '<textarea id="yedekGirdi" class="girdi" rows="6" placeholder="...veya JSON metnini buraya yapıştır"></textarea>' +
    '<div class="modal-dugmeler"><button data-eylem="iceAktarOnayla">Yükle</button><button data-eylem="modalKapat">Vazgeç</button></div>';
  G.$('modal').classList.remove('gizli');
  G.$('yedekDosya').addEventListener('change', function (e) {
    var dosya = e.target.files[0];
    if (!dosya) return;
    var okuyucu = new FileReader();
    okuyucu.onload = function () { G.$('yedekGirdi').value = okuyucu.result; };
    okuyucu.readAsText(dosya);
  });
};

G.iceAktarOnayla = function () {
  var i = G.iceAktarHedef;
  var metin = (G.$('yedekGirdi').value || '').trim();
  if (!metin) { G.bildir('Önce bir dosya seç ya da metin yapıştır.'); return; }
  var veri;
  try { veri = JSON.parse(metin); }
  catch (e) { G.bildir('Bu geçerli bir kayıt dosyası değil.'); return; }
  if (!veri || typeof veri !== 'object' || !veri.ad || !veri.sinif || !G.SINIFLAR[veri.sinif]) {
    G.bildir('Bu bir Hunter Realms kayıt dosyası değil.'); return;
  }
  var mevcut = G.slotYukle(i);
  if (mevcut && !confirm('Bu yuvadaki "' + mevcut.ad + '" (seviye ' + mevcut.lv + ') SİLİNECEK ve yerine "' +
      veri.ad + '" (seviye ' + (veri.lv || 1) + ') yüklenecek. Emin misin?')) return;
  G.gocEt(veri);
  try { localStorage.setItem(G.slotAnahtar(i), JSON.stringify(veri)); }
  catch (e) { G.bildir('Kaydedilemedi: ' + e.message); return; }
  G.modalKapat();
  G.secimSlot = i;
  G.bildir('"' + veri.ad + '" yüklendi.');
  G.cizSecim();
};
