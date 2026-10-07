// ============================================================
// ses.js — v0.24: Ses efektleri (dosya yok, tarayıcıda Web Audio ile üretilir)
// Kapatmak: Ayarlar → Ses  (kayıtta o.ayar.ses)
// Tarayıcılar sesi ilk dokunuştan sonra açar: ana.js'teki tıklama dinleyicisi G.sesAc'ı çağırır.
// ============================================================

G.SES = {
  ses: 0.55,   // ana ses seviyesi (0-1)
  // Aynı sesin en sık çalınabileceği aralık (sn) — alan becerisinde 6 vuruş üst üste binmesin
  aralik: { vurus: 0.06, beceri: 0.08, krit: 0.08, olum: 0.1, darbe: 0.1, iksir: 0.15, seviye: 0.5, boss: 1,
           cekic: 0.1, basari: 0.3, bos: 0.3, kirilma: 0.3 }
};

G.ses = { ctx: null, ana: null, gurultu: null, son: {} };

// İlk dokunuşta ses motorunu açar (her tıklamada çağrılır, ikinci seferden sonra bir şey yapmaz)
G.sesAc = function () {
  try {
    if (!G.ses.ctx) {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      var x = new AC();
      var sik = x.createDynamicsCompressor();   // üst üste binen sesler patlamasın
      G.ses.ana = x.createGain();
      G.ses.ana.gain.value = G.SES.ses;
      G.ses.ana.connect(sik); sik.connect(x.destination);
      // 1 saniyelik beyaz gürültü (darbe ve hışırtılar için)
      var b = x.createBuffer(1, x.sampleRate, x.sampleRate), d = b.getChannelData(0);
      for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      G.ses.gurultu = b;
      G.ses.ctx = x;
    }
    if (G.ses.ctx.state === 'suspended') G.ses.ctx.resume();
  } catch (e) { /* ses yoksa oyun sessiz devam eder */ }
};

// Kullanım: G.sesCal('krit')  ·  G.sesCal('darbe', 0.2)  (ikinci değer sesin şiddeti)
G.sesCal = function (ad, guc) {
  var x = G.ses.ctx, f = G.SESLER[ad];
  if (!f || !x || x.state !== 'running' || !G.o || !G.o.ayar || G.o.ayar.ses === false) return;
  var t = x.currentTime;
  if (G.ses.son[ad] != null && t - G.ses.son[ad] < (G.SES.aralik[ad] || 0.05)) return;
  G.ses.son[ad] = t;
  try { f(x, t, guc == null ? 1 : guc); } catch (e) { }
};

// ---- Yapı taşları ----
// Ton: dalga, frekans f1 → f2 kayar, ses zarfı hızlı yükselip söner. filtre: alçak geçiren (Hz)
G.sesTon = function (x, t, a) {
  var o = x.createOscillator(), g = x.createGain(), son = g;
  o.type = a.tip || 'sine';
  o.frequency.setValueAtTime(a.f1, t);
  if (a.f2) o.frequency.exponentialRampToValueAtTime(a.f2, t + a.sure);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(a.ses, t + (a.atak || 0.005));
  g.gain.exponentialRampToValueAtTime(0.0001, t + a.sure);
  o.connect(g);
  if (a.filtre) { var fl = x.createBiquadFilter(); fl.type = 'lowpass'; fl.frequency.value = a.filtre; g.connect(fl); son = fl; }
  son.connect(G.ses.ana);
  o.start(t); o.stop(t + a.sure + 0.02);
};
// Hışırtı: filtrelenmiş gürültü; filtre frekansı f1 → f2 kayar (vuruş, rüzgar, çatırtı)
G.sesHisir = function (x, t, a) {
  var s = x.createBufferSource(), fl = x.createBiquadFilter(), g = x.createGain();
  s.buffer = G.ses.gurultu;
  fl.type = a.filtreTip || 'lowpass'; fl.Q.value = a.q || 0.7;
  fl.frequency.setValueAtTime(a.f1, t);
  if (a.f2) fl.frequency.exponentialRampToValueAtTime(a.f2, t + a.sure);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(a.ses, t + (a.atak || 0.004));
  g.gain.exponentialRampToValueAtTime(0.0001, t + a.sure);
  s.connect(fl); fl.connect(g); g.connect(G.ses.ana);
  s.start(t, Math.random() * 0.5); s.stop(t + a.sure + 0.02);
};

// ---- Sesler ----
G.SESLER = {
  // Normal vuruş: boğuk darbe + kısa çatırtı
  vurus: function (x, t) {
    G.sesHisir(x, t, { f1: 1800, f2: 500, sure: 0.07, ses: 0.32 });
    G.sesTon(x, t, { f1: 150, f2: 55, sure: 0.1, ses: 0.5 });
  },
  // Beceri: rüzgar savuruşu, ardından ağır darbe
  beceri: function (x, t) {
    G.sesHisir(x, t, { filtreTip: 'bandpass', q: 1.4, f1: 400, f2: 2600, sure: 0.16, ses: 0.3, atak: 0.05 });
    G.sesTon(x, t + 0.06, { tip: 'triangle', f1: 130, f2: 45, sure: 0.18, ses: 0.6 });
    G.sesHisir(x, t + 0.06, { f1: 1400, f2: 300, sure: 0.12, ses: 0.3 });
  },
  // Kritik: metal çınlaması + sert darbe
  krit: function (x, t) {
    G.sesTon(x, t, { tip: 'square', f1: 880, f2: 840, sure: 0.32, ses: 0.07, filtre: 2600 });
    G.sesTon(x, t, { tip: 'square', f1: 1318, f2: 1290, sure: 0.24, ses: 0.05, filtre: 3200 });
    G.sesHisir(x, t, { filtreTip: 'highpass', f1: 2500, sure: 0.05, ses: 0.25 });
    G.sesTon(x, t, { f1: 180, f2: 48, sure: 0.15, ses: 0.65 });
  },
  // Ölüm: alçalan hırıltı
  olum: function (x, t) {
    G.sesTon(x, t, { tip: 'sawtooth', f1: 170, f2: 38, sure: 0.5, ses: 0.38, filtre: 800, atak: 0.02 });
    G.sesHisir(x, t, { f1: 900, f2: 150, sure: 0.4, ses: 0.3, atak: 0.02 });
  },
  // Sana vurulunca: donuk darbe; şiddet = canından götürdüğü oran
  darbe: function (x, t, oran) {
    var s = Math.min(0.75, 0.1 + oran * 3);   // küçük darbeler kısık, büyükler belirgin
    G.sesTon(x, t, { f1: 110, f2: 38, sure: 0.16, ses: s });
    G.sesHisir(x, t, { f1: 900, f2: 250, sure: 0.09, ses: s * 0.4 });
  },
  // İksir: iki yudum
  iksir: function (x, t) {
    G.sesTon(x, t, { f1: 360, f2: 720, sure: 0.08, ses: 0.38 });
    G.sesTon(x, t + 0.1, { f1: 400, f2: 820, sure: 0.08, ses: 0.34 });
  },
  // Seviye atlama: yükselen çan sesi
  seviye: function (x, t) {
    [392, 523.3, 659.3, 784].forEach(function (f, i) {
      G.sesTon(x, t + i * 0.09, { tip: 'triangle', f1: f, sure: 0.6, ses: 0.28, atak: 0.01 });
    });
  },
  // v0.28 — güçlendirme ritüeli
  // Çekiç örse iner: metal çınlaması + darbe
  cekic: function (x, t) {
    G.sesTon(x, t, { tip: 'square', f1: 1480, f2: 1400, sure: 0.22, ses: 0.06, filtre: 4200 });
    G.sesTon(x, t, { tip: 'square', f1: 2220, f2: 2150, sure: 0.16, ses: 0.04, filtre: 5000 });
    G.sesHisir(x, t, { filtreTip: 'highpass', f1: 3000, sure: 0.04, ses: 0.3 });
    G.sesTon(x, t, { f1: 140, f2: 60, sure: 0.09, ses: 0.45 });
  },
  // Başarı: parlak, yükselen çınlama
  basari: function (x, t) {
    [523.3, 784, 1046.5, 1568].forEach(function (f, i) {
      G.sesTon(x, t + i * 0.07, { tip: 'triangle', f1: f, sure: 0.7, ses: 0.4, atak: 0.008 });
    });
    G.sesHisir(x, t, { filtreTip: 'highpass', f1: 5000, sure: 0.5, ses: 0.08, atak: 0.05 });
  },
  // Boşa giden deneme: donuk, alçalan darbe
  bos: function (x, t) {
    G.sesTon(x, t, { tip: 'triangle', f1: 220, f2: 110, sure: 0.35, ses: 0.5 });
    G.sesHisir(x, t, { f1: 600, f2: 200, sure: 0.2, ses: 0.15 });
  },
  // Seviye düştü: çatırdayan kırılma
  kirilma: function (x, t) {
    G.sesHisir(x, t, { filtreTip: 'highpass', f1: 1800, sure: 0.09, ses: 0.5 });
    G.sesHisir(x, t + 0.07, { filtreTip: 'bandpass', q: 2, f1: 2400, f2: 500, sure: 0.3, ses: 0.35 });
    G.sesTon(x, t, { tip: 'sawtooth', f1: 300, f2: 70, sure: 0.5, ses: 0.18, filtre: 1500 });
  },
  // Boss ortaya çıktı: derin boru sesi
  boss: function (x, t) {
    G.sesTon(x, t, { tip: 'sawtooth', f1: 73, f2: 58, sure: 1.1, ses: 0.45, filtre: 480, atak: 0.12 });
    G.sesTon(x, t, { tip: 'sawtooth', f1: 110, f2: 87, sure: 1.1, ses: 0.24, filtre: 520, atak: 0.12 });
    G.sesHisir(x, t, { f1: 300, f2: 120, sure: 1, ses: 0.08, atak: 0.2 });
  }
};
