/* HUMAN OS — app shell / router */
(function () {
  'use strict';

  const view = document.getElementById('view');
  const tabbar = document.getElementById('tabbar');
  const btnHome = document.getElementById('btnHome');

  const views = {
    home: renderHome,
    astranova: function (root) { window.AN.render(root); },
    fp: function (root) { window.FP.render(root); },
    sensorium: function (root) { window.SENS.render(root); },
    synthesis: function (root) { window.SYN.render(root); }
  };

  function nav(name) {
    if (!views[name]) name = 'home';
    // teardown previous module (stop sensors etc.)
    if (window.SENS && window.SENS.destroy) window.SENS.destroy();
    view.innerHTML = '';
    window.scrollTo(0, 0);
    views[name](view);
    Array.prototype.forEach.call(tabbar.querySelectorAll('button'), function (b) {
      b.classList.toggle('active', b.getAttribute('data-nav') === name);
    });
    try { localStorage.setItem('hos_last_view', name); } catch (e) {}
  }

  Array.prototype.forEach.call(tabbar.querySelectorAll('button'), function (b) {
    b.addEventListener('click', function () { nav(b.getAttribute('data-nav')); });
  });
  btnHome.addEventListener('click', function () { nav('home'); });

  /* ---------- storage helpers ---------- */
  window.HOS = {
    getJSON: function (key, fallback) {
      try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch (e) { return fallback; }
    },
    setJSON: function (key, val) {
      try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
    },
    nav: nav
  };

  /* ---------- home ---------- */
  const HERO_SVG = '<svg viewBox="0 0 260 224" fill="none" aria-hidden="true">' +
    '<circle cx="130" cy="112" r="92" stroke="#1c2331" stroke-dasharray="3 7"/>' +
    '<ellipse cx="130" cy="112" rx="58" ry="22" stroke="#1a5f5a" opacity=".45"/>' +
    '<g class="orbit-spin"><circle cx="130" cy="20" r="5" fill="#37f2e6"/><circle cx="222" cy="112" r="3.5" fill="#ff3b30"/></g>' +
    '<circle cx="130" cy="112" r="36" fill="#12161f" stroke="#232a38"/>' +
    '<path d="M136 90 L112 122h15l-6 22 27-37h-14l8-17Z" fill="#ff3b30"/>' +
    '<text x="130" y="176" text-anchor="middle" fill="#8b95a7" font-family="monospace" font-size="9" letter-spacing="3">AD ASTRA</text>' +
    '</svg>';

  const ICONS = {
    bolt: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 2 5 13h5l-1.5 9L19 10h-6l.5-8Z" fill="currentColor"/></svg>',
    radar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4.5"/><path d="M12 12 18 6"/></svg>',
    net: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><path d="M12 7 6.2 17.2M12 7l5.8 10.2M7 19h10"/></svg>',
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 5c-2-1.6-4.6-2-8-2v15c3.4 0 6 .4 8 2 2-1.6 4.6-2 8-2V3c-3.4 0-6 .4-8 2Zm0 0v15"/></svg>'
  };

  function renderHome(root) {
    const fpHist = HOS.getJSON('hos_fp_history', []);
    const fpBest = fpHist.reduce(function (m, r) { return Math.max(m, r.score); }, 0);
    const rfBest = HOS.getJSON('hos_rf_best', { score: 0, streak: 0 });
    const synBest = HOS.getJSON('hos_syn_best', { rank: '-', score: 0 });

    root.innerHTML =
      '<a class="honke" href="https://www.astranova.org/" target="_blank" rel="noopener">' +
      '<div class="honke-k">本家 ORIGIN SCHOOL</div>' +
      '<div class="honke-t">Astra Nova School — SpaceXのロケット工場で生まれた学校</div>' +
      '<div class="honke-d">この道場の思想の源流。2014年にイーロン・マスクがわが子のためにSpaceX構内に作った学校「Ad Astra」が、世界中の11〜18歳が学ぶオンライン学校になった。出願は年間受付中（サイト右上 Apply Now から）→</div>' +
      '</a>' +

      '<div class="hero-wrap">' +
      '<div>' +
      '<div class="hero-kicker">BORN FROM A THOUGHT EXPERIMENT — SCHOOL AT A ROCKET FACTORY</div>' +
      '<h1 class="hero">AIが「常識」の答えを出す時代に、<br>人間に残るのは<span style="color:var(--accent)">前提を疑う力</span>だ。</h1>' +
      '<p class="lead">HUMAN OS は、マスクがSpaceXに作った学校（Ad Astra → Astra Nova）の思想を日本語で学び、体感する訓練所。答えを覚える学習アプリの対極として、「前提を破壊する」「物理世界を掴む」「AIを制御する」を鍛える。</p>' +
      '<div class="hero-actions">' +
      '<button class="btn accent" data-navbtn="fp">訓練を始める ▸</button>' +
      '<button class="btn cyber" data-navbtn="astranova">本家の学び方を読む</button>' +
      '</div>' +
      '</div>' +
      '<div class="hero-art">' + HERO_SVG + '</div>' +
      '</div>' +

      '<div class="stats">' +
      '<div class="stat"><div class="v">' + fpHist.length + '</div><div class="k">第一原理 訓練回数</div></div>' +
      '<div class="stat"><div class="v">' + fpBest + '</div><div class="k">第一原理 最高スコア</div></div>' +
      '<div class="stat"><div class="v">' + rfBest.streak + '</div><div class="k">REAL/FAKE 最高連続正解</div></div>' +
      '<div class="stat"><div class="v">' + synBest.rank + '</div><div class="k">SYNTHESIS 最高ランク</div></div>' +
      '</div>' +

      '<h2 class="section">3つの訓練</h2>' +
      '<div class="grid cards3">' +
      moduleCard('01 / FIRST PRINCIPLES', '常識を破壊する思考の格闘技',
        'AIが「世間の常識」を提示する。お題に対して「なぜ？」を5回突き刺し、物理法則とコストの最小単位まで落とし込め。',
        ICONS.bolt, '#ff3b30', 'rgba(255,59,48,.1)') +
      moduleCard('02 / SENSORIUM', '物理世界を直接ハックする',
        'スマホの全センサーを解放し、見えない物理量を可視化せよ。そしてAIが生成した「美しすぎる嘘」と、ノイズだらけの「物理的真実」を見抜く訓練。',
        ICONS.radar, '#37f2e6', 'rgba(55,242,230,.09)') +
      moduleCard('03 / SYNTHESIS', 'AIの暴走を制御する指揮官',
        '君はCEOだ。エンジニアAI・リスクAI・運用AIに指示を出し、文明的課題を遂行せよ。AIは「最適解」のために平然と人間を差し引いてくる。',
        ICONS.net, '#6f8cff', 'rgba(111,140,255,.1)') +
      '</div>' +

      '<h2 class="section">本家ガイド</h2>' +
      '<div class="card clickable" style="border-style:dashed;display:flex;gap:16px;align-items:flex-start">' +
      '<div class="mc-icon" style="background:rgba(47,208,106,.09);color:#2fd06a;flex:none">' + ICONS.book + '</div>' +
      '<div><div class="kicker">04 / ASTRA NOVA 学び方</div>' +
      '<h3>マスクがわが子のために作った学校の、教育を日本語で</h3>' +
      '<p>第一原理の授業、成縑なし、Conundrums、Synthesis、毎年の再設計——本家Astra Novaの教育思想の核心と、出願方法（年間受付・3ステップ）を紹介。教育の最新ニュースも自動配信。</p>' +
      '<span class="go">読む →</span></div></div>' +

      '<div class="spacer"></div>' +
      '<div class="card" style="border-style:dashed">' +
      '<p class="mono" style="font-size:12px;color:var(--sub)">FIRST PRINCIPLES: 既存の常識は、AIが最も得意とする領域（過去のデータの平均値）である。<br>PHYSICAL WORLD: AIはサーバーの中に閉じこもっており、物理世界の生データに触れられない。<br>ALIGNMENT: AIを「部下」として使い倒せ。思考を奪われるな。</p>' +
      '</div>';
  }

  function moduleCard(kicker, title, desc, icon, ac, bg) {
    return '<div class="card clickable module-card">' +
      '<div class="mc-icon" style="background:' + bg + ';color:' + ac + '">' + icon + '</div>' +
      '<div class="kicker">' + kicker + '</div>' +
      '<h3>' + title + '</h3>' +
      '<p>' + desc + '</p>' +
      '<span class="go" style="color:' + ac + '">訓練を開く →</span>' +
      '</div>';
  }

  nav('home');

  // delegate clicks for module cards + hero action buttons
  view.addEventListener('click', function (e) {
    if (!e.target.closest) return;
    const nb = e.target.closest('[data-navbtn]');
    if (nb) { nav(nb.getAttribute('data-navbtn')); return; }
    const card = e.target.closest('.card.clickable');
    if (!card) return;
    const kick = card.querySelector('.kicker') ? card.querySelector('.kicker').textContent : '';
    if (kick.indexOf('FIRST PRINCIPLES') >= 0) nav('fp');
    else if (kick.indexOf('SENSORIUM') >= 0) nav('sensorium');
    else if (kick.indexOf('SYNTHESIS') >= 0) nav('synthesis');
    else if (kick.indexOf('ASTRA NOVA') >= 0) nav('astranova');
  });

  /* ---------- PWA: service worker (https only) ---------- */
  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    navigator.serviceWorker.register('sw.js').catch(function () {});
  }
})();
