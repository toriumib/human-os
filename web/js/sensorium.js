/* HUMAN OS — Module 02: SENSORIUM（物理世界ハック） */
(function () {
  'use strict';

  const SENS = {};
  let sensors = [];
  let rafId = null;
  let attached = false;

  /* ---------- canvas helper ---------- */
  function fitCanvas(cv) {
    const dpr = window.devicePixelRatio || 1;
    const w = cv.clientWidth, h = cv.clientHeight;
    if (cv.width !== Math.round(w * dpr) || cv.height !== Math.round(h * dpr)) {
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
    }
    const ctx = cv.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return ctx;
  }

  function drawSeries(cv, data, color) {
    const ctx = fitCanvas(cv);
    const w = cv.clientWidth, h = cv.clientHeight;
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(139,149,167,.25)';
    ctx.beginPath(); ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2); ctx.stroke();
    if (!data || data.length < 2) return;
    let min = Math.min.apply(null, data), max = Math.max.apply(null, data);
    if (max - min < 1e-9) { max += 1; min -= 1; }
    ctx.strokeStyle = color || '#37f2e6';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    for (let i = 0; i < data.length; i++) {
      const x = (i / (data.length - 1)) * w;
      const y = h - 6 - ((data[i] - min) / (max - min)) * (h - 12);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  function std(arr) {
    if (!arr.length) return 0;
    const m = arr.reduce(function (s, v) { return s + v; }, 0) / arr.length;
    return Math.sqrt(arr.reduce(function (s, v) { return s + (v - m) * (v - m); }, 0) / arr.length);
  }

  /* ---------- sensor definitions ---------- */
  function makeSensors() {
    return [
      {
        id: 'accel', name: '加速度 / 振動', desc: 'デバイスモーション — 机の微振動、歩行、心拍級の揺れまで',
        status: 'idle', buf: [], handle: null,
        start: async function () {
          if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
            try { await DeviceMotionEvent.requestPermission(); } catch (e) { this.status = 'no'; return; }
          }
          if (!('DeviceMotionEvent' in window)) { this.status = 'no'; return; }
          const self = this;
          this.handle = function (e) {
            const a = e.accelerationIncludingGravity;
            if (!a || a.x == null) return;
            const mag = Math.sqrt((a.x || 0) * (a.x || 0) + (a.y || 0) * (a.y || 0) + (a.z || 0) * (a.z || 0));
            self.buf.push(mag);
            if (self.buf.length > 240) self.buf.shift();
          };
          window.addEventListener('devicemotion', this.handle);
          this.status = 'on';
        },
        stop: function () {
          if (this.handle) window.removeEventListener('devicemotion', this.handle);
          this.handle = null; this.status = 'idle';
        },
        value: function () {
          if (!this.buf.length) return '';
          const last = this.buf[this.buf.length - 1].toFixed(2) + ' m/s²';
          const s = std(this.buf.slice(-60));
          const state = s < 0.02 ? '静止（それでも微振動はある）' : s < 0.3 ? '微振動を検知' : '動いている';
          return last + ' · σ=' + s.toFixed(3) + ' · ' + state;
        },
        plot: function (cv) { drawSeries(cv, this.buf.slice(-160), '#37f2e6'); }
      },
      {
        id: 'orient', name: '方位 / 磁気コンパス', desc: '地磁気の向き — スマホは常に地球の磁場の中にいる',
        status: 'idle', alpha: null, handle: null,
        start: async function () {
          if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
            try { const r = await DeviceOrientationEvent.requestPermission(); if (r !== 'granted') { this.status = 'no'; return; } } catch (e) { this.status = 'no'; return; }
          }
          if (!('DeviceOrientationEvent' in window)) { this.status = 'no'; return; }
          const self = this;
          this.handle = function (e) { if (e.alpha != null) self.alpha = e.alpha; };
          window.addEventListener('deviceorientation', this.handle, true);
          this.status = 'on';
        },
        stop: function () {
          if (this.handle) window.removeEventListener('deviceorientation', this.handle, true);
          this.handle = null; this.status = 'idle';
        },
        value: function () {
          if (this.alpha == null) return '';
          const dirs = ['北', '北北東', '北東', '東北東', '東', '東南東', '南東', '南南東', '南', '南南西', '南西', '西南西', '西', '西北西', '北西', '北北西'];
          const d = (360 - this.alpha + 22.5) % 360;
          return this.alpha.toFixed(1) + '° · 方位: ' + dirs[Math.floor(d / 22.5) % 16];
        },
        plot: function (cv) {
          const ctx = fitCanvas(cv);
          const w = cv.clientWidth, h = cv.clientHeight, cx = w / 2, cy = h / 2, r = Math.min(w, h) / 2 - 8;
          ctx.clearRect(0, 0, w, h);
          ctx.strokeStyle = 'rgba(139,149,167,.4)';
          ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
          ctx.fillStyle = '#8b95a7'; ctx.font = '10px monospace';
          ctx.fillText('N', cx - 3, cy - r + 12); ctx.fillText('S', cx - 3, cy + r - 5);
          ctx.fillText('E', cx + r - 10, cy + 3); ctx.fillText('W', cx - r + 4, cy + 3);
          if (this.alpha != null) {
            const rad = ((360 - this.alpha) - 90) * Math.PI / 180;
            ctx.strokeStyle = '#ff3b30'; ctx.lineWidth = 2.5;
            ctx.beginPath(); ctx.moveTo(cx, cy);
            ctx.lineTo(cx + Math.cos(rad) * (r - 6), cy + Math.sin(rad) * (r - 6)); ctx.stroke();
            ctx.fillStyle = '#ff3b30';
            ctx.beginPath(); ctx.arc(cx, cy, 3, 0, Math.PI * 2); ctx.fill();
          }
        }
      },
      {
        id: 'geo', name: '位置（GPS）', desc: '緯度経度と誤差半径 — 誤差こそ物理世界のしるし',
        status: 'idle', watch: null, last: null,
        start: async function () {
          if (!navigator.geolocation) { this.status = 'no'; return; }
          const self = this;
          this.watch = navigator.geolocation.watchPosition(function (pos) {
            self.last = pos.coords; self.status = 'on';
            const el = document.getElementById('sv-geo');
            if (el) el.textContent = self.value();
          }, function () { self.status = 'no'; }, { enableHighAccuracy: true });
          this.status = 'wait';
        },
        stop: function () {
          if (this.watch != null) navigator.geolocation.clearWatch(this.watch);
          this.watch = null; this.status = 'idle'; this.last = null;
        },
        value: function () {
          if (!this.last) return '計測中…（HTTPS + 許可が必要）';
          return this.last.latitude.toFixed(5) + ', ' + this.last.longitude.toFixed(5) + ' ±' + Math.round(this.last.accuracy) + 'm' +
            (this.last.altitude != null ? ' · 高度' + Math.round(this.last.altitude) + 'm' : '');
        },
        plot: null
      },
      {
        id: 'mic', name: 'マイク音圧', desc: '空気の圧力波 — 部屋の環境音と君の呼吸の物理',
        status: 'idle', stream: null, ctxA: null, analyser: null, data: null, buf: [],
        start: async function () {
          const self = this;
          try {
            this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.ctxA = new (window.AudioContext || window.webkitAudioContext)();
            const src = this.ctxA.createMediaStreamSource(this.stream);
            this.analyser = this.ctxA.createAnalyser();
            this.analyser.fftSize = 2048;
            src.connect(this.analyser);
            this.data = new Uint8Array(this.analyser.fftSize);
            this.status = 'on';
          } catch (e) { this.status = 'no'; }
        },
        stop: function () {
          if (this.stream) this.stream.getTracks().forEach(function (t) { t.stop(); });
          if (this.ctxA) this.ctxA.close();
          this.stream = null; this.ctxA = null; this.analyser = null; this.buf = []; this.status = 'idle';
        },
        tick: function () {
          if (!this.analyser) return;
          this.analyser.getByteTimeDomainData(this.data);
          let sum = 0;
          for (let i = 0; i < this.data.length; i++) { const v = (this.data[i] - 128) / 128; sum += v * v; this.buf.push(v); }
          const rms = Math.sqrt(sum / this.data.length);
          this.level = 20 * Math.log10(rms || 1e-6);
          if (this.buf.length > 480) this.buf.splice(0, this.buf.length - 480);
        },
        value: function () {
          return this.analyser ? ('音圧 ' + (this.level || -100).toFixed(1) + ' dBFS · σ=' + std(this.buf.slice(-120)).toFixed(3)) : '';
        },
        plot: function (cv) { drawSeries(cv, this.buf.slice(-240), '#ff3b30'); }
      },
      {
        id: 'light', name: '環境光', desc: '照度センサー — 目に見える「明るさ」の定量',
        status: 'idle', sensor: null, lux: null,
        start: async function () {
          try {
            this.sensor = new AmbientLightSensor();
            const self = this;
            this.sensor.addEventListener('reading', function () { self.lux = self.sensor.illuminance; });
            this.sensor.start();
            this.status = 'on';
          } catch (e) { this.status = 'no'; }
        },
        stop: function () { if (this.sensor) { try { this.sensor.stop(); } catch (e) {} } this.sensor = null; this.lux = null; this.status = 'idle'; },
        value: function () { return this.lux != null ? this.lux.toFixed(0) + ' lux' : (this.status === 'no' ? 'この端末/ブラウザは非対応' : '読み取り待ち…'); },
        plot: null
      },
      {
        id: 'clock', name: '時計のジッタ', desc: '完璧な時計など存在しない — タイマーの揺らぎを観測',
        status: 'idle', buf: [], lastT: null, expected: null, handle: null,
        start: async function () {
          const self = this;
          this.expected = performance.now() + 200;
          this.handle = setInterval(function () {
            const now = performance.now();
            if (self.lastT != null) {
              const interval = now - self.lastT;
              self.buf.push(interval - 200);
              if (self.buf.length > 240) self.buf.shift();
            }
            self.lastT = now;
          }, 200);
          this.status = 'on';
        },
        stop: function () { if (this.handle) clearInterval(this.handle); this.handle = null; this.buf = []; this.lastT = null; this.status = 'idle'; },
        value: function () { return this.buf.length ? ('ずれ σ=' + std(this.buf.slice(-40)).toFixed(2) + ' ms — 理想は0ms、現実は0ではない') : ''; },
        plot: function (cv) { drawSeries(cv, this.buf.slice(-160), '#ffb020'); }
      },
      {
        id: 'battery', name: 'バッテリー', desc: '化学反応の残量 — エントロピーの可視化',
        status: 'idle', batt: null,
        start: async function () {
          if (!navigator.getBattery) { this.status = 'no'; return; }
          this.batt = await navigator.getBattery();
          this.status = 'on';
        },
        stop: function () { this.batt = null; this.status = 'idle'; },
        value: function () {
          if (!this.batt) return this.status === 'no' ? 'このブラウザは非対応' : '';
          return Math.round(this.batt.level * 100) + '% ' + (this.batt.charging ? '（充電中）' : '（放電中）');
        },
        plot: null
      },
      {
        id: 'net', name: 'ネットワーク', desc: '電波の状態 — 空間を飛ぶ電磁波の粗密',
        status: 'idle',
        start: async function () {
          if (!navigator.connection) { this.status = 'no'; return; }
          this.status = 'on';
        },
        stop: function () { this.status = 'idle'; },
        value: function () {
          const c = navigator.connection;
          if (!c) return 'このブラウザは非対応';
          return (c.effectiveType || '?') + ' · 下り' + (c.downlink != null ? c.downlink + 'Mbps' : '?') + ' · RTT' + (c.rtt != null ? c.rtt + 'ms' : '?');
        },
        plot: null
      }
    ];
  }

  /* ---------- render ---------- */
  let mode = 'live';
  let pollTimer = null;

  SENS.render = function (root) {
    sensors = makeSensors();
    mode = 'live';
    renderShell(root);
  };

  function renderShell(root) {
    root.innerHTML =
      '<h1 class="hero">物理世界を、直接ハックしろ。</h1>' +
      '<p class="lead">AIはサーバーの中に閉じこもっている。物理世界の生データに触れられるのは、デバイスを手にした君だけだ。センサーを起動し、見えない層を可視化せよ。</p>' +
      '<div class="subtabs">' +
      '<button data-m="live" class="' + (mode === 'live' ? 'active' : '') + '">ライブ計測</button>' +
      '<button data-m="game" class="' + (mode === 'game' ? 'active' : '') + '">REAL or FAKE — AIの嘘を見破れ</button>' +
      '</div><div id="sensBody"></div>';
    Array.prototype.forEach.call(root.querySelectorAll('.subtabs button'), function (b) {
      b.addEventListener('click', function () { mode = b.getAttribute('data-m'); renderShell(root); });
    });
    if (mode === 'live') renderLive(root.querySelector('#sensBody'));
    else renderGame(root.querySelector('#sensBody'));
  }

  function statusChip(s) {
    const map = { idle: ['idle', '待機'], wait: ['off', '許可待ち'], on: ['on', '計測中'], no: ['no', '非対応'] };
    const m = map[s] || map.idle;
    return '<span class="status ' + m[0] + '">' + m[1] + '</span>';
  }

  function renderLive(body) {
    body.innerHTML =
      '<div class="sensor-grid">' +
      sensors.map(function (s, i) {
        return '<div class="sensor-card">' +
          '<div class="s-head"><div><div class="s-name">' + s.name + '</div><div class="s-desc">' + s.desc + '</div></div>' +
          '<span id="sst-' + s.id + '">' + statusChip(s.status) + '</span></div>' +
          (s.plot ? '<canvas id="scv-' + s.id + '"></canvas>' : '') +
          '<div class="s-val" id="sv-' + s.id + '"></div>' +
          '<button class="btn small cyber" data-sens="' + s.id + '" style="margin-top:8px">' + (s.status === 'on' ? '停止' : '計測開始') + '</button>' +
          '</div>';
      }).join('') + '</div>' +
      '<div class="spacer"></div>' +
      '<div class="card" style="border-style:dashed"><p class="note">PCの場合：マイク・時計・バッテリー・ネットワークが動作する。加速度・方位・GPS・照度はスマートフォン（HTTPS）で開け。iOSは計測開始ボタンで許可を求める。</p></div>';

    Array.prototype.forEach.call(body.querySelectorAll('[data-sens]'), function (btn) {
      btn.addEventListener('click', async function () {
        const s = sensors.find(function (x) { return x.id === btn.getAttribute('data-sens'); });
        if (s.status === 'on') { s.stop(); } else { await s.start(); }
        const chipEl = body.querySelector('#sst-' + s.id);
        if (chipEl) chipEl.innerHTML = statusChip(s.status);
        btn.textContent = s.status === 'on' ? '停止' : '計測開始';
      });
    });

    startPolling(body);
  }

  function startPolling(body) {
    stopPolling();
    pollTimer = setInterval(function () {
      if (!document.body.contains(body)) { stopPolling(); return; }
      sensors.forEach(function (s) {
        if (s.status !== 'on') return;
        if (s.tick) s.tick();
        const el = body.querySelector('#sv-' + s.id);
        if (el && s.value) el.textContent = s.value();
        const cv = body.querySelector('#scv-' + s.id);
        if (cv && s.plot) s.plot(cv);
      });
    }, 200);
  }

  function stopPolling() { if (pollTimer) { clearInterval(pollTimer); pollTimer = null; } }

  SENS.destroy = function () {
    stopPolling();
    if (sensors) sensors.forEach(function (s) { if (s.stop) s.stop(); });
    sensors = [];
  };

  /* ---------- REAL or FAKE game ---------- */
  let rf = null;

  function renderGame(body) {
    rf = { phase: 'intro', round: 0, streak: 0, score: 0, taps: [], realSeries: null, src: null };
    body.innerHTML =
      '<div class="card">' +
      '<div class="kicker">TRAINING — 生成データ vs 物理データ</div>' +
      '<h3>AIの「美しすぎる嘘」を見破れるか？</h3>' +
      '<p>2つの波形のうち、1つは<b>本物の物理データ</b>、もう1つは<b>AIが生成した合成データ</b>。本物にはノイズ・量子化・ドリフトが宿る。まず、君自身の生データを採取しろ。</p>' +
      '<div class="spacer"></div>' +
      '<button class="btn accent" id="rfStart">本物のデータを採取する</button>' +
      '</div>' +
      '<div class="spacer"></div>' +
      '<div class="card" style="border-style:dashed"><p class="note">推奨：スマホなら「ライブ計測」で加速度を起動してから挑むと採取が一瞬で終わる。PCでも挑戦できる（タップリズムを採取する）。</p></div>';

    body.querySelector('#rfStart').addEventListener('click', function () { startCapture(body); });
  }

  async function startCapture(body) {
    const accel = sensors.find(function (s) { return s.id === 'accel' && s.status === 'on'; });
    const mic = sensors.find(function (s) { return s.id === 'mic' && s.status === 'on'; });
    if (accel && accel.buf.length > 60) {
      rf.src = 'accel';
      rf.realSeries = normalize(accel.buf.slice(-140));
      nextRound(body);
      return;
    }
    if (mic && mic.analyser) {
      mic.tick();
      rf.src = 'mic';
      rf.realSeries = normalize(mic.buf.slice(-140));
      nextRound(body);
      return;
    }
    // fallback: human tap rhythm
    rf.src = 'tap';
    rf.taps = [];
    body.innerHTML =
      '<div class="card">' +
      '<div class="kicker">物理データ採取 — 人間のリズム</div>' +
      '<h3>パッドを<span style="color:var(--cyan)">15回</span>タップして、リズムを刻め</h3>' +
      '<p class="note">機械のような正確さではなく、君のままのリズムでいい。それが「本物」だ。</p>' +
      '<div class="spacer"></div>' +
      '<div class="tap-pad" id="tapPad">ここをタップ（残り 15）</div>' +
      '<div class="spacer"></div>' +
      '<button class="btn ghost" id="rfReset">やり直す</button>' +
      '</div>';
    const pad = body.querySelector('#tapPad');
    pad.addEventListener('pointerdown', function () {
      rf.taps.push(performance.now());
      const left = 15 - rf.taps.length;
      pad.textContent = left > 0 ? 'ここをタップ（残り ' + left + '）' : '採取完了 — 解析中…';
      pad.classList.add('active');
      if (rf.taps.length >= 15) {
        const iv = [];
        for (let i = 1; i < rf.taps.length; i++) iv.push(rf.taps[i] - rf.taps[i - 1]);
        rf.realSeries = iv;
        setTimeout(function () { nextRound(body); }, 500);
      }
    });
    body.querySelector('#rfReset').addEventListener('click', function () { renderGame(body); });
  }

  function normalize(arr) {
    if (!arr.length) return [0, 0];
    const min = Math.min.apply(null, arr), max = Math.max.apply(null, arr);
    const span = (max - min) || 1;
    return arr.map(function (v) { return (v - min) / span; });
  }

  function makeFake(series, round) {
    const n = series.length;
    const out = [];
    const ph = round * 1.7;
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1);
      let v = 0.5 + 0.28 * Math.sin(t * Math.PI * 2 + ph) + 0.12 * Math.sin(t * Math.PI * 6 + ph * 2);
      v += (Math.random() - 0.5) * 0.015; // 微細な均一ノイズ = 不自然
      out.push(Math.max(0, Math.min(1, v)));
    }
    return out;
  }

  function makeFakeFromIntervals(series, round) {
    // タップ間隔用：ほぼ完全な等間隔（機械的リズム）
    const m = series.reduce(function (s, v) { return s + v; }, 0) / series.length;
    return series.map(function (_, i) {
      return m * (1 + (i % 2 === 0 ? 1 : -1) * 0.004) + (Math.random() - 0.5) * m * 0.01;
    });
  }

  function nextRound(body) {
    rf.round++;
    if (rf.round > 5) { endGame(body); return; }
    rf.phase = 'quiz';
    const real = rf.src === 'tap' ? rf.realSeries : rf.realSeries;
    // refresh accel/mic data each round
    const accel = sensors.find(function (s) { return s.id === 'accel' && s.status === 'on'; });
    const mic = sensors.find(function (s) { return s.id === 'mic' && s.status === 'on'; });
    if (rf.src === 'accel' && accel && accel.buf.length > 60) rf.realSeries = normalize(accel.buf.slice(-140));
    if (rf.src === 'mic' && mic) { mic.tick(); if (mic.buf.length > 60) rf.realSeries = normalize(mic.buf.slice(-140)); }
    const fake = rf.src === 'tap' ? makeFakeFromIntervals(rf.realSeries, rf.round) : makeFake(rf.realSeries, rf.round);

    const realFirst = Math.random() < 0.5;
    const pair = realFirst ? [real, fake] : [fake, real];

    body.innerHTML =
      '<div class="row" style="justify-content:space-between">' +
      '<div class="kicker mono" style="color:var(--cyan)">ROUND ' + rf.round + ' / 5</div>' +
      '<div class="mono" style="font-size:12px;color:var(--sub)">SCORE ' + rf.score + ' · STREAK ' + rf.streak + '</div></div>' +
      '<p class="lead" style="margin:8px 0 12px">どちらが<b style="color:var(--ok)">本物の物理データ</b>か？（ソース: ' + (rf.src === 'tap' ? '君のタップ間隔' : rf.src === 'accel' ? '加速度センサー' : 'マイク音圧') + '）</p>' +
      '<div class="rf-pair">' +
      rfPairHtml('A', pair[0]) + rfPairHtml('B', pair[1]) +
      '</div><div class="spacer"></div>' +
      '<div class="row">' +
      '<button class="btn accent" data-pick="A">Aが本物</button>' +
      '<button class="btn accent" data-pick="B">Bが本物</button>' +
      '</div><div id="rfFeedback"></div>';

    drawSeries(body.querySelector('#rfcv-A'), pair[0], '#e8ecf4');
    drawSeries(body.querySelector('#rfcv-B'), pair[1], '#e8ecf4');

    Array.prototype.forEach.call(body.querySelectorAll('[data-pick]'), function (b) {
      b.addEventListener('click', function () {
        if (rf.phase !== 'quiz') return;
        rf.phase = 'reveal';
        const pick = b.getAttribute('data-pick');
        const correct = (pick === 'A') === realFirst;
        const wrapA = body.querySelector('#rfw-A'), wrapB = body.querySelector('#rfw-B');
        (realFirst ? wrapA : wrapB).classList.add('real');
        (realFirst ? wrapB : wrapA).classList.add('fake');
        if (correct) { rf.streak++; rf.score += 10 + rf.streak * 2; }
        else { rf.streak = 0; }
        const sReal = std(real).toFixed(3), sFake = std(fake).toFixed(3);
        body.querySelector('#rfFeedback').innerHTML =
          '<div class="card" style="margin-top:12px;' + (correct ? 'border-color:#1d5c38' : 'border-color:#6a2020') + '">' +
          '<h3>' + (correct ? '◯ 正解 — 本物のノイズを見抜いた' : '× 不正解 — 嘘に騙された') + '</h3>' +
          '<p class="note">本物のσ（バラつき）= ' + sReal + ' / 合成のσ = ' + sFake + '</p>' +
          '<p class="note" style="margin-top:6px">' + RF_EXPL[Math.floor(Math.random() * RF_EXPL.length)] + '</p>' +
          '<div class="spacer"></div><button class="btn accent" id="rfNext">次のラウンド ▸</button></div>';
        body.querySelector('#rfNext').addEventListener('click', function () { nextRound(body); });
      });
    });
  }

  function rfPairHtml(label, series) {
    return '<div class="rf-canvas-wrap" id="rfw-' + label + '"><div class="rf-label">波形 ' + label + '</div><canvas id="rfcv-' + label + '"></canvas></div>';
  }

  function endGame(body) {
    const best = HOS.getJSON('hos_rf_best', { score: 0, streak: 0 });
    if (rf.score > best.score) { best.score = rf.score; }
    if (rf.streak > best.streak) { best.streak = rf.streak; }
    HOS.setJSON('hos_rf_best', best);

    body.innerHTML =
      '<div class="verdict">' +
      '<div class="kicker mono" style="color:var(--cyan)">RESULT</div>' +
      '<div class="rank" style="color:' + (rf.score >= 60 ? 'var(--ok)' : rf.score >= 30 ? 'var(--warn)' : 'var(--accent)') + '">' + rf.score + '</div>' +
      '<p class="v-sub">5ラウンドのスコア · 最長STREAK ' + rf.streak + '</p>' +
      '<div class="spacer"></div>' +
      '<div class="ai-box" style="text-align:left"><div class="ai-name">教官より</div>生成モデルは毎回、きれいな波形を作る。だが物理世界は量子化誤差・熱ノイズ・ドリフトにまみれている。君が「リアルの粗さ」を体感で掴んだ今、AIの生成物は少し疑わしく見えるはずだ。それがセンサーリテラシーだ。</div>' +
      '<div class="spacer"></div>' +
      '<div class="row" style="justify-content:center">' +
      '<button class="btn accent" id="rfAgain">もう一度</button>' +
      '</div></div>';
    body.querySelector('#rfAgain').addEventListener('click', function () { renderGame(body); });
  }

  window.SENS = SENS;
})();
