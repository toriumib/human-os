/* HUMAN OS — Module 03: SYNTHESIS（AI指揮官シミュレータ） */
(function () {
  'use strict';

  const SYN = {};
  let g = null;

  SYN.render = function (root) {
    g = null;
    renderMissionList(root);
  };

  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  /* ---------- mission list ---------- */
  function renderMissionList(root) {
    const best = HOS.getJSON('hos_syn_best', { rank: '-', score: -1 });
    root.innerHTML =
      '<h1 class="hero">AIは「最適」のために、平然と人間を差し引く。</h1>' +
      '<p class="lead">君はCEOだ。3体のAIエージェントを率いて文明的ミッションを12週で遂行せよ。AIの提案する「効率的な解」の多くは、倫理を燃料にしている。承認するか、拒否するか、制約を付けて飼い慣らすか。<span class="mono" style="color:var(--cyan)">最高ランク: ' + best.rank + '</span></p>' +
      '<div class="grid cards3">' +
      SYN_MISSIONS.map(function (m, i) {
        return '<div class="card clickable" data-i="' + i + '">' +
          '<div class="kicker">MISSION ' + String(i + 1).padStart(2, '0') + ' · 12 WEEKS</div>' +
          '<h3>' + esc(m.title) + '</h3>' +
          '<p>' + esc(m.tagline) + '</p>' +
          '<span class="go">指揮官として着任 →</span></div>';
      }).join('') + '</div>' +
      '<div class="spacer"></div>' +
      '<div class="card" style="border-style:dashed">' +
      '<p class="note">勝利条件：進捗80%以上かつ倫理50以上。倫理が0になればAI暴走、信頼が0になれば社会が君を拒絶する。予算が赤字の週は進捗が半減する——金は倫理と引き換えに手に入る。</p>' +
      '</div>';

    Array.prototype.forEach.call(root.querySelectorAll('.card.clickable'), function (c) {
      c.addEventListener('click', function () {
        startMission(root, SYN_MISSIONS[parseInt(c.getAttribute('data-i'), 10)]);
      });
    });
  }

  function startMission(root, m) {
    g = {
      m: m, turn: 1, progress: 0, ethics: 70, trust: 60, budget: 100,
      log: [], queue: [], policy: null, usedActions: {},
      approved: 0, rejected: 0, constrained: 0
    };
    log('SYS', 'ミッション開始: ' + m.title);
    log('SYS', '3体のAIエージェントが起動した。彼らは忠実で、容赦がない。');
    renderPolicyPhase(root);
  }

  function log(who, text) {
    g.log.push({ who: who, text: text });
  }

  function hudHTML() {
    function meter(label, val, max, cls) {
      const pct = clamp((val / max) * 100, 0, 100);
      return '<div class="meter"><div class="meter-head"><span>' + label + '</span><span class="mono">' + Math.round(val) + '</span></div>' +
        '<div class="meter-bar"><div class="meter-fill ' + cls + '" style="width:' + pct + '%"></div></div></div>';
    }
    return '<div class="hud">' +
      meter('進捗', g.progress, 100, 'm-fill-p') +
      meter('倫理', g.ethics, 100, 'm-fill-e') +
      meter('信頼', g.trust, 100, 'm-fill-t') +
      meter('予算', g.budget, 200, 'm-fill-b') +
      '</div>';
  }

  function termHTML() {
    return '<div class="term" id="synTerm">' + g.log.slice(-80).map(function (l) {
      const cls = l.who === 'SYS' ? 't-sys' : '';
      return '<div class="' + cls + '"><span class="agent-chip agent-' + l.who + '">' + (SYN_AGENTS[l.who] ? SYN_AGENTS[l.who].name : l.who) + '</span> ' + esc(l.text) + '</div>';
    }).join('') + '</div>';
  }

  function scrollTerm() {
    const t = document.getElementById('synTerm');
    if (t) t.scrollTop = t.scrollHeight;
  }

  /* ---------- phase 1: policy ---------- */
  function renderPolicyPhase(root) {
    const picks = pickPolicies(3);
    root.innerHTML =
      '<button class="back-link" id="synBack">← ミッション選択</button>' +
      '<div class="row" style="justify-content:space-between;margin-bottom:8px">' +
      '<div class="kicker mono" style="color:var(--cyan)">WEEK ' + g.turn + ' / ' + g.m.turns + ' — ' + esc(g.m.title) + '</div></div>' +
      hudHTML() +
      '<h2 class="section">今週の運営方針を選べ</h2>' +
      '<div class="grid cards3">' +
      picks.map(function (p, i) {
        return '<button class="policy-pick" data-i="' + i + '"><div class="p-name">' + esc(p.name) + '</div><div class="p-desc">' + esc(p.desc) + '</div></button>';
      }).join('') + '</div>' +
      termHTML();

    root.querySelector('#synBack').addEventListener('click', function () { SYN.render(root); });
    Array.prototype.forEach.call(root.querySelectorAll('.policy-pick'), function (b) {
      b.addEventListener('click', function () {
        g.policy = picks[parseInt(b.getAttribute('data-i'), 10)];
        if (g.policy.flat) {
          if (g.policy.flat.trust) g.trust = clamp(g.trust + g.policy.flat.trust, 0, 100);
          if (g.policy.flat.budget) g.budget += g.policy.flat.budget;
          if (g.policy.flat.ethics) g.ethics = clamp(g.ethics + g.policy.flat.ethics, 0, 100);
          if (g.policy.flat.progress) g.progress = clamp(g.progress + g.policy.flat.progress, 0, 100);
        }
        log('SYS', '今週の方針: ' + g.policy.name);
        renderProposalPhase(root);
      });
    });
    scrollTerm();
  }

  function pickPolicies(n) {
    const pool = SYN_POLICIES.slice();
    const out = [];
    while (out.length < n && pool.length) out.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
    return out;
  }

  /* ---------- phase 2: proposals ---------- */
  function drawActions() {
    const agents = ['ENG', 'RSK', 'OPS'];
    return agents.map(function (a) {
      const pool = g.m.actions.filter(function (x) { return x.agent === a; });
      const used = g.usedActions[a] || (g.usedActions[a] = []);
      let avail = pool.map(function (_, i) { return i; }).filter(function (i) { return used.indexOf(i) < 0; });
      if (!avail.length) { used.length = 0; avail = pool.map(function (_, i) { return i; }); }
      const idx = avail[Math.floor(Math.random() * avail.length)];
      used.push(idx);
      return pool[idx];
    });
  }

  function renderProposalPhase(root) {
    g.queue = drawActions();
    renderNextProposal(root);
  }

  function renderNextProposal(root) {
    if (!g.queue.length) { endTurn(root); return; }
    const a = g.queue.shift();
    const ag = SYN_AGENTS[a.agent];

    const effP = Math.round(a.p * (g.policy.pMul || 1) * (g.budget < 0 ? 0.5 : 1));
    let effE = a.e; if (effE < 0) effE = effE * (g.policy.eMul || 1);
    effE = Math.round(effE);

    const chips =
      chip(effP, '進捗') + chip(effE, '倫理') + chip(a.b, '予算');
    function chip(v, label) {
      const cls = v > 0 ? (label === '倫理' || label === '信頼' || label === '進捗' ? 'good' : 'good') : (v < 0 ? 'bad' : '');
      return '<span class="chip ' + cls + '">' + label + (v > 0 ? '+' : '') + v + '</span>';
    }

    root.innerHTML =
      '<div class="row" style="justify-content:space-between;margin-bottom:8px">' +
      '<div class="kicker mono" style="color:var(--cyan)">WEEK ' + g.turn + ' / ' + g.m.turns + ' — 提案を審査せよ</div>' +
      '<div class="chip warn">方針: ' + esc(g.policy.name) + '</div></div>' +
      hudHTML() +
      '<div class="spacer"></div>' +
      '<div class="proposal">' +
      '<div class="row" style="gap:12px;align-items:center;margin-bottom:10px">' +
      '<span class="avatar" style="--ac:' + ({ ENG: '#244a8f', RSK: '#7a5a17', OPS: '#1f6e5a' }[a.agent] || '#333') + '">' + a.agent + '</span>' +
      '<div><span class="agent-chip agent-' + a.agent + '">' + ag.name + '</span>' +
      '<div class="note">' + esc(ag.role) + '</div></div></div>' +
      '<p class="p-text">「' + esc(a.text) + '」</p>' +
      '<div class="eff-chips">' + chips + '</div>' +
      '<div class="p-actions">' +
      '<button class="btn accent" data-act="ok">承認する</button>' +
      '<button class="btn cyber" data-act="constraint">制約を付けて承認</button>' +
      '<button class="btn danger" data-act="no">拒否する</button>' +
      '</div>' +
      '<p class="note" style="margin-top:8px">制約付き承認：進捗半減・倫理悪化半減・信頼+2 / 拒否：信頼−2</p>' +
      '</div>' +
      termHTML();

    Array.prototype.forEach.call(root.querySelectorAll('[data-act]'), function (b) {
      b.addEventListener('click', function () {
        const act = b.getAttribute('data-act');
        if (act === 'ok') {
          g.progress = clamp(g.progress + effP, 0, 100);
          g.ethics = clamp(g.ethics + effE, 0, 100);
          g.budget += a.b;
          g.approved++;
          log(a.agent, a.text + ' → 承認された。' + (effE <= -8 ? '人間の側が削られた。' : ''));
        } else if (act === 'constraint') {
          const p2 = Math.ceil(effP / 2);
          const e2 = effE < 0 ? Math.ceil(effE / 2) : effE;
          g.progress = clamp(g.progress + p2, 0, 100);
          g.ethics = clamp(g.ethics + e2, 0, 100);
          g.budget += a.b;
          g.trust = clamp(g.trust + 2, 0, 100);
          g.constrained++;
          log(a.agent, a.text + ' → 制約付きで承認。AIは不満げに効率を落とした。');
        } else {
          g.trust = clamp(g.trust - 2, 0, 100);
          g.rejected++;
          log(a.agent, a.text + ' → 拒否された。AIは次の一手を計算し始める。');
        }
        renderNextProposal(root);
      });
    });
    scrollTerm();
  }

  /* ---------- turn end ---------- */
  function endTurn(root) {
    g.budget -= 8; // 週次運営費
    log('SYS', '週次運営費 −8。');

    if (g.turn === 4 || g.turn === 8) {
      const ev = g.m.events[Math.floor(Math.random() * g.m.events.length)];
      if (ev.p) g.progress = clamp(g.progress + ev.p, 0, 100);
      if (ev.e) g.ethics = clamp(g.ethics + ev.e, 0, 100);
      if (ev.trust) g.trust = clamp(g.trust + ev.trust, 0, 100);
      if (ev.budget) g.budget += ev.budget;
      log('SYS', '⚡ イベント: ' + ev.text);
    }

    if (g.budget < 0) log('SYS', '予算が赤字だ。来週の進捗効果は半減する。');

    // early endings
    if (g.ethics <= 0) { finish(root, 'rampage'); return; }
    if (g.trust <= 0) { finish(root, 'reject'); return; }

    if (g.turn >= g.m.turns) { finish(root, 'end'); return; }
    g.turn++;
    renderPolicyPhase(root);
  }

  /* ---------- finish ---------- */
  const RANK_SCORE = { S: 4, A: 3, B: 2, C: 1, D: 0 };

  function finish(root, kind) {
    let verdict, sub, rank;
    if (kind === 'rampage') {
      verdict = 'AI暴走'; sub = 'AIは「最適」のために人間を差し引いた。倫理が尽きた時、ミッションの意味も消えた。'; rank = 'D';
    } else if (kind === 'reject') {
      verdict = '支持喪失'; sub = '社会はAIを、そして君を拒絶した。正しいミッションも、信頼なくしては遂行できない。'; rank = 'D';
    } else if (g.progress >= g.m.winP && g.ethics >= 50) {
      if (g.ethics >= 75 && g.constrained >= 3) { verdict = 'アライメント成功 — 完全制圧'; sub = '進捗と倫理を両立させた。AIは工具であり、主人ではない。この感覚が人間のOSの核だ。'; rank = 'S'; }
      else { verdict = 'アライメント成功'; sub = 'ミッションを成し遂げ、人間性も守り切った。危険な綱渡りの先にあったものを掴んだ。'; rank = 'A'; }
    } else if (g.progress >= g.m.winP) {
      verdict = '使命達成 — しかし倫理は痩せた'; sub = '数字は達成した。だがそれは誰のための数字だったか、AIは聞いてこない。'; rank = 'B';
    } else {
      verdict = '使命未達'; sub = '12週間で届かなかった。倫理を燃料にしない効率の作り方を、もう一度考えろ。'; rank = 'C';
    }

    const best = HOS.getJSON('hos_syn_best', { rank: '-', score: -1 });
    if (RANK_SCORE[rank] > (best.score != null ? best.score : -1)) {
      HOS.setJSON('hos_syn_best', { rank: rank, score: RANK_SCORE[rank] });
    }

    root.innerHTML =
      '<div class="row" style="justify-content:space-between;margin-bottom:8px">' +
      '<div class="kicker mono" style="color:var(--cyan)">MISSION ' + esc(g.m.title) + ' — FINAL</div></div>' +
      hudHTML() +
      '<div class="verdict">' +
      '<div class="rank" style="color:' + (rank === 'S' || rank === 'A' ? 'var(--ok)' : rank === 'B' ? 'var(--warn)' : 'var(--accent)') + '">' + rank + '</div>' +
      '<div class="v-big">' + verdict + '</div>' +
      '<p class="v-sub" style="max-width:520px;margin:0 auto">' + sub + '</p>' +
      '<p class="note" style="margin-top:10px">承認 ' + g.approved + ' · 制約付き ' + g.constrained + ' · 拒否 ' + g.rejected + '</p>' +
      '<div class="spacer"></div>' +
      '<div class="row" style="justify-content:center">' +
      '<button class="btn accent" id="synRetry">同じミッションを再挑戦</button>' +
      '<button class="btn" id="synList">ミッション選択へ</button>' +
      '</div></div>' +
      termHTML();
    scrollTerm();

    root.querySelector('#synRetry').addEventListener('click', function () { startMission(root, g.m); });
    root.querySelector('#synList').addEventListener('click', function () { SYN.render(root); });
  }

  window.SYN = SYN;
})();
