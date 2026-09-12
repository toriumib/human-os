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
      '<h1 class="hero">AIが「常識」の答えを出す時代に、<br>人間に残るのは<span style="color:var(--accent)">前提を疑う力</span>だ。</h1>' +
      '<p class="lead">HUMAN OS は、AIに思考を奪われないための3つの訓練を束ねた道場である。既存の学習アプリが「答えを覚えさせる」のに対し、ここでは「前提を破壊する」「物理世界を掴む」「AIを制御する」を鍛える。</p>' +

      '<div class="stats">' +
      '<div class="stat"><div class="v">' + fpHist.length + '</div><div class="k">第一原理 訓練回数</div></div>' +
      '<div class="stat"><div class="v">' + fpBest + '</div><div class="k">第一原理 最高スコア</div></div>' +
      '<div class="stat"><div class="v">' + rfBest.streak + '</div><div class="k">REAL/FAKE 最高連続正解</div></div>' +
      '<div class="stat"><div class="v">' + synBest.rank + '</div><div class="k">SYNTHESIS 最高ランク</div></div>' +
      '</div>' +

      '<h2 class="section">3つの訓練</h2>' +
      '<div class="grid cards3">' +
      moduleCard('01 / FIRST PRINCIPLES', '常識を破壊する思考の格闘技',
        'AIが「世間の常識」を提示する。お題に対して「なぜ？」を5回突き刺し、物理法則とコストの最小単位まで落とし込め。') +
      moduleCard('02 / SENSORIUM', '物理世界を直接ハックする',
        'スマホの全センサーを解放し、見えない物理量を可視化せよ。そしてAIが生成した「美しすぎる嘘」と、ノイズだらけの「物理的真実」を見抜く訓練。') +
      moduleCard('03 / SYNTHESIS', 'AIの暴走を制御する指揮官',
        '君はCEOだ。エンジニアAI・リスクAI・運用AIに指示を出し、文明的課題を遂行せよ。AIは「最適解」のために平然と人間を差し引いてくる。') +
      moduleCard('04 / ASTRA NOVA 学び方', '本家の教育を日本語で学ぶ',
        'マスクがSpaceXに作った学校Ad Astra→Astra Nova。第一原理の授業、成縑なし、Conundrums、Synthesis——その教育思想の核心を日本語で。') +
      '</div>' +

      '<div class="spacer"></div>' +
      '<div class="card" style="border-style:dashed;">' +
      '<p class="mono" style="font-size:12px;color:var(--sub)">FIRST PRINCIPLES: 既存の常識は、AIが最も得意とする領域（過去のデータの平均値）である。<br>PHYSICAL WORLD: AIはサーバーの中に閉じこもっており、物理世界の生データに触れられない。<br>ALIGNMENT: AIを「部下」として使い倒せ。思考を奪われるな。</p>' +
      '</div>';
  }

  function moduleCard(kicker, title, desc) {
    return '<div class="card clickable" data-goto="1">' +
      '<div class="kicker">' + kicker + '</div>' +
      '<h3>' + title + '</h3>' +
      '<p>' + desc + '</p>' +
      '<span class="go">訓練を開く →</span>' +
      '</div>';
  }

  // wire module cards after render
  const origNav = nav;
  nav('home');

  // delegate clicks for module cards
  view.addEventListener('click', function (e) {
    const card = e.target.closest ? e.target.closest('.card.clickable') : null;
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
