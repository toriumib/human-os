/* HUMAN OS — Module 01: FIRST PRINCIPLES（常識破壊道場） */
(function () {
  'use strict';

  const FP = {};
  let st = null; // session state

  FP.render = function (root) {
    st = null;
    renderTopicList(root);
  };

  function esc(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /* ---------- topic list ---------- */
  function renderTopicList(root) {
    const hist = HOS.getJSON('hos_fp_history', []);
    const cards = FP_TOPICS.map(function (t, i) {
      const mine = hist.filter(function (h) { return h.id === t.id; });
      const done = mine.length;
      const best = mine.reduce(function (m, r) { return Math.max(m, r.score); }, 0);
      return '<div class="card clickable" data-i="' + i + '">' +
        '<div class="kicker">CONUNDRUM ' + String(i + 1).padStart(2, '0') +
        (done ? ' · <span style="color:var(--ok)">最高' + best + '点</span>' : '') + '</div>' +
        '<h3>' + esc(t.q) + '</h3>' +
        '<p>' + esc(t.common.slice(0, 42)) + '…</p>' +
        '<span class="go">' + (done ? '再訓練する →' : 'この常識を破壊する →') + '</span></div>';
    }).join('');

    root.innerHTML =
      '<h1 class="hero">なぜ？を5回、突き刺せ。</h1>' +
      '<p class="lead">AIは「世間の常識」＝過去データの平均値を提示する。それを鵜呑みにした瞬間、君の思考はAIに占拠される。お題を選び、5層の「なぜ」を降りて、物理法則とコストの最小単位（First Principles）まで到達せよ。</p>' +
      '<div class="grid cards3">' + cards + '</div>';

    Array.prototype.forEach.call(root.querySelectorAll('.card.clickable'), function (c) {
      c.addEventListener('click', function () {
        startSession(root, FP_TOPICS[parseInt(c.getAttribute('data-i'), 10)]);
      });
    });
  }

  /* ---------- session ---------- */
  function startSession(root, topic) {
    st = { topic: topic, step: 1, answers: [] };
    renderStep(root);
  }

  function dotsHTML(step) {
    // L0 常識 + L1..L5
    let html = '';
    for (let i = 0; i <= 5; i++) {
      const cls = i < step ? 'done' : (i === step ? 'lit' : '');
      const label = i === 0 ? 'L0' : 'L' + i;
      html += '<div class="dot ' + cls + '">' + label + '</div>';
      if (i < 5) html += '<div class="arrow">→</div>';
    }
    return '<div class="depth-dots">' + html + '<span style="font-size:11px;color:var(--sub);margin-left:8px">' +
      (step <= 5 ? FP_TOPICS && st.topic.layers[step - 1].name : '第一原理の言語化') + '</span></div>';
  }

  function renderStep(root) {
    const t = st.topic;
    if (st.step > 5) { renderFinal(root); return; }
    const layer = t.layers[st.step - 1];

    root.innerHTML =
      '<button class="back-link" id="fpBack">← お題一覧</button>' +
      '<h1 class="hero" style="font-size:20px;">' + esc(t.q) + '</h1>' +
      dotsHTML(st.step) +
      '<div class="ai-box"><div class="ai-name">AI（常識）</div>' + esc(t.common) + '</div>' +
      '<div class="spacer"></div>' +
      '<div class="card">' +
      '<div class="kicker">' + layer.name + ' — 君の「なぜ？」第' + st.step + '撃</div>' +
      '<p class="note" style="margin:8px 0">常識を1段掘れ。何が本当に起きている？</p>' +
      '<textarea class="ta" id="fpInput" placeholder="例：それは結局、〜だからだ。だから本当の問題は〜にある。"></textarea>' +
      '<div class="row" style="margin-top:10px">' +
      '<button class="btn small ghost" id="fpHint">💡 ヒントを見る</button>' +
      '<span class="note" id="fpHintText" style="flex:1;min-width:200px"></span>' +
      '</div>' +
      '<div class="spacer"></div>' +
      '<button class="btn accent" id="fpNext">次の「なぜ」へ ▸</button>' +
      '</div>';

    root.querySelector('#fpBack').addEventListener('click', function () { FP.render(root); });
    root.querySelector('#fpHint').addEventListener('click', function () {
      root.querySelector('#fpHintText').textContent = '💡 ' + layer.hint;
    });
    root.querySelector('#fpNext').addEventListener('click', function () {
      const v = root.querySelector('#fpInput').value.trim();
      if (v.length < 5) {
        root.querySelector('#fpInput').style.borderColor = 'var(--accent)';
        root.querySelector('#fpInput').placeholder = '文字数が少なすぎる。思考を言語化しろ。';
        return;
      }
      st.answers.push(v);
      st.step++;
      renderStep(root);
    });
  }

  function renderFinal(root) {
    const t = st.topic;
    const summary = st.answers.map(function (a, i) {
      return '<p style="font-size:12px;color:var(--sub);margin:4px 0"><span class="mono" style="color:var(--cyan)">L' + (i + 1) + '</span> ' + esc(a.slice(0, 60)) + (a.length > 60 ? '…' : '') + '</p>';
    }).join('');

    root.innerHTML =
      '<button class="back-link" id="fpBack2">← お題一覧</button>' +
      '<h1 class="hero" style="font-size:20px;">到達点を言語化しろ</h1>' +
      '<div class="depth-dots"><div class="dot done">L0</div><div class="arrow">→</div><div class="dot done">L1</div><div class="arrow">→</div><div class="dot done">L2</div><div class="arrow">→</div><div class="dot done">L3</div><div class="arrow">→</div><div class="dot done">L4</div><div class="arrow">→</div><div class="dot done">L5</div><div class="arrow">→</div><div class="dot lit">FP</div></div>' +
      '<div class="card">' + summary + '</div>' +
      '<div class="spacer"></div>' +
      '<div class="card">' +
      '<div class="kicker">FINAL — 第一原理を一言で</div>' +
      '<p class="note" style="margin:8px 0">ここまでの掘り下なが指し示す、変えようのない最小単位は何か？</p>' +
      '<textarea class="ta" id="fpFinal" placeholder="例：費用の本質は素材ではなく〇〇に由来する。だから△△が可能になるはずだ。"></textarea>' +
      '<div class="spacer"></div>' +
      '<button class="btn accent" id="fpScore">採点する</button>' +
      '</div>';

    root.querySelector('#fpBack2').addEventListener('click', function () { FP.render(root); });
    root.querySelector('#fpScore').addEventListener('click', function () {
      const v = root.querySelector('#fpFinal').value.trim();
      if (v.length < 10) { root.querySelector('#fpFinal').placeholder = 'もう少しだけ言語化しろ（10文字以上）。'; return; }
      renderResult(root, v);
    });
  }

  /* ---------- scoring ---------- */
  function scoreSession(finalText) {
    const t = st.topic;
    const all = finalText + ' ' + st.answers.join(' ');
    let layerReached = 0;
    const matched = [];
    t.layers.forEach(function (layer, i) {
      let hit = false;
      layer.keys.forEach(function (k) {
        if (all.indexOf(k) >= 0) { hit = true; if (matched.indexOf(k) < 0) matched.push(k); }
      });
      if (hit) layerReached = Math.max(layerReached, i + 1);
    });
    let score = 30 + layerReached * 8 + matched.length * 4;
    if (finalText.length >= 40) score += 6;
    const avgLen = st.answers.reduce(function (s, a) { return s + a.length; }, 0) / st.answers.length;
    if (avgLen >= 25) score += 6;
    score = Math.min(100, score);

    let badge = '常識人';
    for (let i = 0; i < FP_BADGES.length; i++) {
      if (score >= FP_BADGES[i].min) { badge = FP_BADGES[i].label; break; }
    }
    return { score: score, badge: badge, matched: matched, layerReached: layerReached };
  }

  function renderResult(root, finalText) {
    const t = st.topic;
    const r = scoreSession(finalText);

    const hist = HOS.getJSON('hos_fp_history', []);
    hist.push({ id: t.id, q: t.q, score: r.score, badge: r.badge, date: new Date().toISOString() });
    HOS.setJSON('hos_fp_history', hist);

    const keyChips = r.matched.length
      ? r.matched.map(function (k) { return '<span class="chip info">' + esc(k) + '</span>'; }).join('')
      : '<span class="note">キーワード未検出 — もっと具体的な物理・コストの言葉で掘れ。</span>';

    root.innerHTML =
      '<h1 class="hero" style="font-size:20px;">採点結果</h1>' +
      '<div class="card">' +
      '<div class="meter"><div class="meter-head"><span>第一原理到達度</span><span class="mono">' + r.score + ' / 100</span></div>' +
      '<div class="meter-bar"><div class="meter-fill m-fill-score" style="width:' + r.score + '%"></div></div></div>' +
      '<div style="margin:12px 0"><span class="badge">' + r.badge + '</span></div>' +
      '<p class="note">思考の最深層：' + (r.layerReached ? 'L' + r.layerReached + ' ' + t.layers[r.layerReached - 1].name : 'L0 常識のまま') + '</p>' +
      '<div class="result-keys"><p class="note" style="margin-bottom:4px">君の思考に現れた「物理レベルの言葉」：</p>' + keyChips + '</div>' +
      '</div>' +
      '<div class="spacer"></div>' +
      '<div class="ai-box"><div class="ai-name">参考解答（第一原理の一例）</div>' + esc(t.principle) + '</div>' +
      '<div class="spacer"></div>' +
      '<div class="row">' +
      '<button class="btn accent" id="fpRetry">同じお題で再訓練</button>' +
      '<button class="btn" id="fpList">別のお題へ</button>' +
      '</div>';

    root.querySelector('#fpRetry').addEventListener('click', function () { startSession(root, t); });
    root.querySelector('#fpList').addEventListener('click', function () { FP.render(root); });
  }

  window.FP = FP;
})();
