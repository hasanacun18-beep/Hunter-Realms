// ============================================================
// ana.js — Başlatma ve tüm tıklamaların yönetimi
// ============================================================
G.eylem = function (ad, d) {
  switch (ad) {
    // giriş ekranları
    case 'baslikBasla': G.cizSecim(); break;
    case 'baslikDon': G.cizBaslik(); break;
    case 'duyurular': G.duyuruModal(); break;
    case 'secimSlot': G.secimSlotSec(+d.i); break;
    case 'oyunaGir':  G.oyunaGir(); break;
    case 'karakterSil': G.karakterSil(+d.i); break;
    case 'disaAktar':   G.disaAktar(+d.i); break;
    case 'iceAktarModal': G.iceAktarModal(+d.i); break;
    case 'iceAktarOnayla': G.iceAktarOnayla(); break;
    case 'yedekKopyala': G.yedekKopyala(); break;
    case 'olusturSinif': G.secilenSinif = d.s; G.cizOlustur(); break;
    case 'zar':       G.rastgeleAd(); break;
    case 'olusturOnay': G.olusturOnay(); break;
    case 'secimDon':  G.cizSecim(); break;
    case 'secimeDon': G.secimeDon(); break;
    case 'sekme':     G.sekmeAc(d.s); break;
    // savaş
    case 'saldir':    if (d.i !== 'B') G.hedefSec(+d.i); break;
    case 'git':       G.bolgeGit(d.b); break;
    case 'bolgeBilgi':G.bolgeModal(d.b); break;
    case 'parsomen':  G.parsomenOku(); break;
    case 'beceri':    G.beceriKullan(d.b); break;
    case 'onizle':    G.onizleAcik = G.onizleAcik === d.b ? null : d.b; G.cizBeceri(); break;
    case 'gelistir':  G.beceriGelistir(d.b); break;
    case 'otoAc':     G.otoDegistir(d.b); break;
    case 'iksir':     G.iksir(d.t); break;
    case 'kac':       G.kac(); break;
    case 'boss':      G.bossListeModal(); break;
    case 'bossIsinlan': G.bossIsinlan(d.id); break;
    case 'galeriBolge': G.galeriBolge = d.b; G.galeriSecili = null; G.cizEtkinlik(); break;
    case 'galeriSec':   G.galeriSecili = d.id; G.cizEtkinlik(); break;
    case 'galeriAl':    G.galeriAl(d.id); break;
    case 'mitikSec':    G.mitikSecili = d.id; G.cizKarakter(); break;
    case 'mitikAc':     G.mitikAc(d.id); break;
    case 'mitikSok':    G.mitikSok(d.id); break;
    case 'mitikTakas':  G.mitikTakas(d.id); break;
    case 'unvanTak':    G.unvanTak(d.id); break;
    case 'unvanCikar':  G.unvanCikar(); break;
    // karakter
    case 'stat':      G.statArtir(d.k); break;
    case 'bosSlot':   G.bildir('Bu yuva boş. Çantadan eşya kuşanabilirsin.'); break;
    // eşya
    case 'esyaAc':    G.esyaModal(+d.id); break;
    case 'kusan':     G.kusan(+d.id); break;
    case 'cikar':     G.cikar(d.slot); break;
    case 'guclendir': G.guclendir(+d.id); break;
    case 'rituelDokun': G.rituelDokun(); break;
    case 'sat':       G.sat(+d.id); break;
    case 'topluSat':  G.topluSat(); break;
    // demirci (v0.3)
    case 'erit':      G.erit(+d.id); break;
    case 'topluErit': G.topluErit(); break;
    case 'zarla':     G.zarla(+d.id); break;
    case 'zarKilit':  G.zarKilitDegistir(+d.id, d.k); break;
    case 'kilit':     G.kilitDegistir(+d.id); break;
    // diğer
    case 'satinAl':   G.satinAl(d.t, +d.n); break;
    case 'karakterAlt': G.karakterAlt = d.s; G.cizKarakter(); window.scrollTo(0, 0); G.$('icerik').scrollTop = 0; break;
    case 'meridyenYukselt': G.meridyenYukselt(); break;
    case 'demirciAc': G.demirciAc(+d.id); break;
    case 'demirciAlt': G.demirciAlt = d.s; G.aritma = null; G.suSecimSifirla(); G.ruhOnizleme = null; G.cizDemirci(); break;
    case 'demirciSec': G.demirciSecili = +d.id; G.aritma = null; G.suSecimSifirla(); G.ruhOnizleme = null; G.cizDemirci(); break;
    case 'demirciKaynak': G.demirciKaynak = d.k; G.demirciSecili = null; G.aritma = null; G.suSecimSifirla(); G.ruhOnizleme = null; G.cizDemirci(); break;
    case 'arit': G.aritOnizle(+d.id); break;
    case 'aritKaydet': G.aritKaydet(); break;
    // su verme (v0.35)
    case 'suTeklif':  G.suSecim.teklif = +d.id; G.suOnizleme = null; G.cizDemirci(); break;
    case 'suKilit':   G.suKilitDegistir(d.k); break;
    case 'suVer':     G.suVer(+d.id, false); break;
    case 'suGelismis':G.suVer(+d.id, true); break;
    case 'suKaydet':  G.suKaydet(); break;
    case 'suSifirla': G.suSifirla(+d.id); break;
    case 'cilala':    G.cilala(+d.id, d.t); break;
    // ruh dökümü (v0.42)
    case 'ruhDok':    G.ruhDok(+d.id); break;
    case 'ruhKaydet': G.ruhKaydet(); break;
    case 'statArti': G.statDegis(d.k, 1); break;
    case 'statEksi': G.statDegis(d.k, -1); break;
    case 'statKaydet': G.statKaydet(); break;
    case 'statSifirla': G.statSifirla(); break;
    case 'ilahiAc':   G.karakterAlt = 'ilahi'; G.sekmeAc('karakter'); break;
    case 'cantaSekme':G.cantaSekme = d.s; G.cizCanta(); break;
    case 'sarfAc':    G.sarfModal(d.t); break;
    case 'sarfKullan':G.modalKapat(); if (d.t === 'parsomen') G.parsomenOku(); else { G.iksir(d.t); G.cizCanta(); } break;
    case 'cantaArti': G.cantaArtiModal(); break;
    case 'cantaGenislet': G.cantaGenislet(); break;
    case 'cay':       G.cayIc(); break;
    case 'ayarlar':   G.ayarlarModal(); break;
    case 'gorevAl':   G.modalKapat(); G.gorevAl(); break;
    case 'gorevBilgi':G.gorevBilgiModal(); break;
    case 'madenKisayol': G.etkinlikGorunum = 'maden'; G.sekmeAc('etkinlik'); break;
    case 'otoSavasDegis': G.o.ayar.otoSavas = !G.o.ayar.otoSavas; G.kaydet(); G.cizSavas(); G.bildir(G.o.ayar.otoSavas ? 'Otomatik savaş açık' : 'Elle oynuyorsun'); break;
    case 'etkinlikAc':G.etkinlikGorunum = d.e; G.cizEtkinlik(); window.scrollTo(0, 0); break;
    case 'etkinlikGeri': G.etkinlikGorunum = 'liste'; G.cizEtkinlik(); break;
    case 'madenKat':  G.madenKatSecili = +d.k; G.cizEtkinlik(); break;
    case 'ocak':      G.ocakSec(+d.k, +d.n); break;
    case 'kuleGir':   G.kuleGir(); break;
    case 'kuleGunluk':G.kuleGunlukAl(); break;
    case 'runAc':     G.runModal(+d.id); break;
    case 'runYuva':   G.runYuvaModal(d.tur); break;
    case 'runTak':    G.runTak(+d.id); break;
    case 'runCikar':  G.runCikar(+d.id); break;
    case 'runYukselt':G.runYukselt(+d.id); break;
    case 'runErit':   G.runErit(+d.id); break;
    case 'bolumAc':   G.bolumAcik = G.bolumAcik === +d.i ? null : +d.i; G.cizEtkinlik(); break;
    case 'bolumAl':   G.bolumAl(d.id); break;
    case 'bolumGit':  G.bolumGit(d.id); break;
    case 'gunlukAl':  G.gunlukAl(d.tur, d.id); break;
    case 'gunlukGit': G.gunlukGit(d.git); break;
    case 'sandikAc':  G.sandikAc(d.tur, +d.esik); break;
    case 'gunlukSekme': G.gunlukSekme = d.tur; G.cizEtkinlik(); break;
    case 'madenBitir':G.madenBitir('Kazıyı sen bitirdin'); break;
    case 'ilahi':     G.ilahiYukselt(); break;
    case 'modalKapat':G.modalKapat(); break;
  }
};

G.olayBagla = function () {
  document.addEventListener('click', function (e) {
    G.sesAc();   // v0.24: tarayıcı sesi ancak bir dokunuştan sonra açar
    if (e.target.id === 'modal') { G.modalKapat(); return; }
    var t = e.target.closest('[data-eylem]');
    if (!t) { if (e.target.closest('#saha')) G.sahaDokun(e); return; }
    if (t.disabled) return;
    G.eylem(t.dataset.eylem, t.dataset);
  });
  document.addEventListener('change', function (e) {
    var id = e.target.id, v = e.target.value;
    if (id === 'otoIksir') { G.o.ayar.otoIksir = e.target.checked; G.kaydet(); }
    else if (id === 'otoBeceri') { G.o.ayar.otoBeceri = e.target.checked; G.kaydet(); }
    else if (id === 'ses') { G.o.ayar.ses = e.target.checked; G.kaydet(); G.sesCal('vurus'); }
    else if (id === 'otoSavas') { G.o.ayar.otoSavas = e.target.checked; G.kaydet(); if (G.sekme === 'savas') G.cizSavas(); }
    else if (id === 'cantaSira') { G.o.ayar.canta.sira = v; G.kaydet(); G.cizCanta(); }
    else if (id === 'cantaFiltre') { G.o.ayar.canta.filtre = v; G.kaydet(); G.cizCanta(); }
  });
  document.addEventListener('visibilitychange', function () { if (document.hidden) G.kaydet(); });
  window.addEventListener('pagehide', G.kaydet);
};

G.oyunBaslat = function () {
  G.gocEt(G.o);
  G.madenIsle();   // oyun kapalıyken geçen kazı dakikaları
  G.gunlukKontrol();
  var r = G.hesapla(G.o);
  if (G.o.hp == null) { G.o.hp = r.hpMax; G.o.mp = r.mpMax; }
  G.alanDoldur();
  G.log('Hoş geldin, ' + G.kacis(G.o.ad) + '. Saldırmak için bir canavara dokun.', 'sistem');
  G.ekranOyun();
  setInterval(G.yenilenme, 2000);
  setInterval(function () { G.hareketTik(0.1); }, 100);
  setInterval(G.savasTik, G.TUR_MS);
  setInterval(G.madenSayac, 1000);
  setInterval(function () { G.bossKendiliginden(); G.bossSayac(); }, 1000);   // v0.30–31: boss doğması ve geri sayımlar
  setInterval(G.kaydet, 10000);
};

document.addEventListener('DOMContentLoaded', function () {
  G.olayBagla();
  G.eskiKayitTasi();
  G.secimSlot = G.aktifSlot;
  // Oyundan "karakter seçimine dön" ile gelindiyse doğrudan seçime git
  if (location.hash === '#secim') { history.replaceState(null, '', location.pathname); G.cizSecim(); }
  else G.cizBaslik();
});
