/* HUMAN OS — Module 04: ASTRA NOVA 流の学び方（日本語ガイド） */
(function () {
  'use strict';

  const AN = {};

  const ORIGIN = 'https://www.astranova.org/';

  AN.render = function (root) {
    root.innerHTML =
      /* ---------- 本家への導線 ---------- */
      '<a class="honke" href="' + ORIGIN + '" target="_blank" rel="noopener">' +
      '<div class="honke-k">本家 ORIGIN SCHOOL</div>' +
      '<div class="honke-t">Astra Nova School — SpaceXのロケット工場で生まれた学校</div>' +
      '<div class="honke-d">この道場の思想の源流。2014年にイーロン・マスクがわが子のためにSpaceX構内に作った「Ad Astra」が、世界中の11〜18歳が学ぶオンライン学校になった。出願は年間受付中（サイト右上の Apply Now から）→</div>' +
      '</a>' +

      '<h1 class="hero">マスクがわが子のために作った学校の、<br>学び方を日本語で。</h1>' +
      '<p class="lead">2014年、イーロン・マスクは5人のわが子を学校から引き抜き、カリフォルニア州ハワソーンのSpaceX本社——「世界一クールな場所」であるロケット工場——の中に小さな学校を作った。Ad Astra（ラテン語で「星々へ」）。それが今日、同じ教師と思想を受け継ぐオンライン学校 <b>Astra Nova School</b> になった。ここでは、その教育の核心を5つの原則として日本語で紹介する。</p>' +

      /* ---------- タイムライン ---------- */
      '<h2 class="section">Our Story — ロケット工場から始まった学校</h2>' +
      '<div class="timeline">' +
      tl('2014', 'Ad Astra 創設',
        'ジョシュ・ダーンらが、SpaceXハワソーン本社の敷地内に創設。当初はマスクの子どもたちと、同じ教育観を持つSpaceX社員やLA近郊の家族の子どもたちのための小さな学校だった。') +
      tl('2014–2020', '工場の中の6年間',
        'SpaceXの内部で運営された6年間で、好奇心・問題解決・知的勇気を軸にしたカリキュラムが育つ。のちに世界中の教育になる「Conundrums」と「Synthesis」は、ここで生まれた。') +
      tl('2020', 'Astra Nova School へ',
        '同じ教師、同じ思想のまま独立。非営利のオンライン学校として、世界中の子どもたちに開かれた学校になる。') +
      tl('2021', 'Conundrums を世界中へ',
        'ClassDojoと提携し、看板活動である「建設的な不同意」の訓練 Conundrums を、世界中の数百万の子どもたちに届けた。') +
      tl('2022–', '実際に会う経験',
        'カタリナ島、サンタバーバラ、ハンツビルの宇宙キャンプ、ジュネーブのCERNなど、年に数回の対面体験を開催。') +
      tl('2026', 'ハイスクール開校',
        '創設以来12年間、家族からの要望が最も多かったハイスクール（14〜18歳・3〜4年の卒業プログラム）が2026年8月に開校。バイオ・物理・工学・AIと、文学・哲学・歴史を組み合わせ、企業との共同プログラムも伴う。') +
      '</div>' +

      /* ---------- 5つの原則 ---------- */
      '<h2 class="section">5つの教育原則</h2>' +
      principle('1', '問題から教える。道具から教えない。',
        'マスクはこう説明する——「エンジンをばら取りして、それから工具を探すんだ。工具は問題に奉仕するものだ」。教科書の章の順番に従うのではなく、本物の問題に取り組む中で、必要な知識（工具）を後から引き出す。例えば「AIが悪になったらどうする？」という問いから、倫理学も、プログラミングも、確率も、一緒に始まる。<br><br>既存の教育が「工具の使い方を先に覚えさせる」のに対し、Ad Astraでは「まず問題を解きにかかる」。この道場の<a href="#" data-go="fp" class="inline-link">第一原理道場</a>は、まさにこの訓練のソロ版だ。') +
      principle('2', '成績も学年も捨てる。',
        '「人にはそれぞれ、能力が花開く時期がある。英語が好きな子もいれば、数学が好きな子もいる」（マスク、2015年の北京テレビ取材）。Ad Astraに成績（グレード）はなかった。工場の流れ作業のように全員を同じ速度で同じ型にはめ、同時に同じ場所から出荷する——産業革命時代の学校の設計を、逆さから疑った。教育を、各自の適性と時期に合わせる。子どもたちが「休暇が長すぎる」と文句を言って学校に戻りたがる状態が、正常だと考える。') +
      principle('3', 'Conundrums — 正解のない問いで「建設的な不同意」を学ぶ。',
        'Astra Novaの看板活動。NASA、ドラゴン、フェリー、鳥、写真、ムーンショット……といった短い思考実験（Conundrum）について、立ち位置を決め、根拠を話し、意見の違う友だちと議論する。ゴールは合意ではなく、「よく考えた上での不同意（constructive disagreement）」。答えを覚える教育がAIの時代に自動化されるいま、問いに耐える力は人間の側に残る。<br><br>実際の本家への出願でも、Conundrumを1つ選んで30秒〜2分の動画回答を提出する——テストの点数ではなく「その子がどう考えるか」を見るためだ。') +
      principle('4', 'Synthesis — チームで考える格闘技。',
        'Ad Astra発祥の授業で、目指すのは「どのチームに加わっても不釣り合いな価値を出せる人間」になること。深い推論と協力と実行を要求されるチーム思考ゲームで、毎回まったく新しいゲームが設計される。勝つことより、チーム思考そのものを鍛える。<br><br>この道場の<a href="#" data-go="synthesis" class="inline-link">Synthesisモジュール</a>は、その思想を「AIエージェントの指揮官」に移植した日本語版だ。') +
      principle('5', '学校を毎年、第一原理から作り直す。',
        'Astra Novaは毎年新しい学校になる。去年やったことを慣性で繰り返さず、子どもたちが何を学ぶべきかを毎年ゼロから設計し直す。学期は年3回作り替えられ、学生は週4〜16時間、自由に科目を組み合わせる（化学、魚類学、時間哲学、C言語、合成、戦略ゲーム……本気の内容を）。学校そのものが、第一原理思考の実験場なのだ。') +

      /* ---------- マスクの言葉 ---------- */
      '<h2 class="section">マスクの言葉</h2>' +
      quote('「問題解決を教えることが大事だ」', '"It\'s important to teach problem solving." — Elon Musk') +
      quote('「子どもたちは本当に学校が好きなんだ。いい印だろ。俺は子どもの頃、学校が大嫌いだった。拷問だったよ。子どもたちは休暇が長すぎると文句を言って、学校に戻りたがる」', '"The kids really love going to school. That\'s a good sign. I hated going to school... They think that vacations are too long and they want to go back to school." — Elon Musk') +
      quote('「人には、違う時に違う能力がある。教育を各自の適性と能力に合わせる方が、理にかなっている」', '"People have different abilities at different times. It makes more sense to cater the education to match their aptitudes and abilities." — Elon Musk, 2015') +

      /* ---------- 本家で学ぶには ---------- */
      '<h2 class="section">本家 Astra Nova School で学ぶには</h2>' +
      '<div class="grid cards3">' +
      '<div class="card"><div class="kicker">WHO — 誰でも</div><h3>世界中の11〜18歳</h3><p>ミドルスクール（11〜14歳）は世界45か国から。ハイスクール（14〜18歳）は卒業トラック制。100%オンラインのライブ授業（英語・Zoom）、1クラス6〜16人。</p></div>' +
      '<div class="card"><div class="kicker">HOW — 出願3ステップ</div><h3>動画1本で挑める</h3><p>① Conundrumを1つ選び、30秒〜2分の動画か音声で回答（「どう考えるか」を見たい）② 保護者レター1枚（家族のこと、学校に求めること）③ オンラインでアップロード。約半数が次のラウンドへ進む。</p></div>' +
      '<div class="card"><div class="kicker">WHEN — 年2回審査</div><h3>年間出願受付</h3><p>「出願シーズン」という概念を捨て、年間を通して受付・年2回審査。例: 10月15日締切 → 11月1日グループ面接 → 12月15日最終決定 → 1月4日開講。経済的な必要には100%応じる。</p></div>' +
      '</div>' +
      '<div class="spacer"></div>' +
      '<div class="card" style="border-color:#1a5f5a">' +
      '<div class="kicker">LINKS</div>' +
      '<p style="margin-top:6px"><a class="inline-link" href="' + ORIGIN + '" target="_blank" rel="noopener">本家サイト Astra Nova School（astranova.org）</a> — 英語・世界中から出願可能。<br>' +
      '<a class="inline-link" href="https://www.youtube.com/results?search_query=Astra+Nova+Conundrums" target="_blank" rel="noopener">Conundrums の動画をYouTubeで見る</a> — 実際のお題の雰囲気を掴むのに最適。<br>' +
      '<a class="inline-link" href="https://musk.toriumis.com/" target="_blank" rel="noopener">MUSK RADAR</a> — マスクの発言・YouTube出演・SpaceX/Tesla/xAIの動向を日本語でリアルタイム追跡（姉妹サイト）。<br>' +
      '問い合わせ: <span class="mono">josh@astranova.org</span>（共同創設者 ジョシュ・ダーン）</p>' +
      '</div>' +

      /* ---------- 教育ニュース（自動更新） ---------- */
      '<h2 class="section">マスク教育の最新ニュース（自動更新）</h2>' +
      '<div class="card" id="eduNews"><p class="note">最新の教育ニュースを取得中… （配信元: <a class="inline-link" href="https://musk.toriumis.com/" target="_blank" rel="noopener">MUSK RADAR</a>）</p></div>' +

      /* ---------- この道場での実践 ---------- */
      '<h2 class="section">日本語で、今日から始める</h2>' +
      '<p class="lead">本家の思想を、この道場の3つの訓練で体感できる。</p>' +
      '<div class="grid cards3">' +
      '<div class="card clickable" data-go="fp"><div class="kicker">訓練 01</div><h3>第一原理道場</h3><p>Conundrumsのソロ版。お題に「なぜ？」を5回突き刺し、物理法則とコストの最小単位まで降りる。</p><span class="go">始める →</span></div>' +
      '<div class="card clickable" data-go="sensorium"><div class="kicker">訓練 02</div><h3>Sensorium</h3><p>AIが持たない物理世界との摩擦。センサーの生データの「粗さ」を体感し、生成データの嘘を見抜く。</p><span class="go">始める →</span></div>' +
      '<div class="card clickable" data-go="synthesis"><div class="kicker">訓練 03</div><h3>Synthesis</h3><p>本家SynthesisのAI指揮官版。3体のAIの提案を裁き、倫理と進捗の綱渡りを指揮する。</p><span class="go">始める →</span></div>' +
      '</div>' +
      '<div class="spacer"></div>' +
      '<div class="card" style="border-style:dashed"><p class="note">家族でやるなら: 夕食のお題にConundrumを1個。例——「もし家のAIアシスタントが嘘をついたら、どう罰する？」「動物園の動物は全部逃がすべきか？」。正解を教えない。理由を聞く。意見が割れたら勝ち。</p></div>';

    // module navigation
    Array.prototype.forEach.call(root.querySelectorAll('[data-go]'), function (el) {
      el.addEventListener('click', function (e) {
        if (el.tagName === 'A' && el.getAttribute('href') === '#') e.preventDefault();
        HOS.nav(el.getAttribute('data-go'));
      });
    });

    // 教育ニュースをMUSK RADAR APIから自動取得（失敗時は静かに表示を縮退）
    (function loadEduNews() {
      const box = root.querySelector('#eduNews');
      if (!box) return;
      const esc2 = function (s) {
        return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
      };
      const ctrl = new AbortController();
      const to = setTimeout(function () { ctrl.abort(); }, 12000);
      fetch('https://musk.toriumis.com/api/news?cat=edu&limit=8', { signal: ctrl.signal })
        .then(function (r) { return r.ok ? r.json() : Promise.reject(new Error('HTTP ' + r.status)); })
        .then(function (d) {
          clearTimeout(to);
          if (!d.items || !d.items.length) throw new Error('empty');
          box.innerHTML =
            '<p class="note" style="margin-bottom:8px">' + esc2(d.updatedJST || '') + ' 更新 · マスクの動向全般は姉妹サイト <a class="inline-link" href="https://musk.toriumis.com/" target="_blank" rel="noopener">MUSK RADAR</a> がリアルタイム追跡中</p>' +
            d.items.map(function (it) {
              return '<p style="margin:7px 0;font-size:13.5px"><span class="mono" style="font-size:10.5px;color:var(--sub)">' + esc2(it.dateJST || '') + '</span> <a class="inline-link" href="' + esc2(it.link) + '" target="_blank" rel="noopener">' + esc2(it.title) + '</a> <span class="chip">' + esc2(it.source) + '</span></p>';
            }).join('');
        })
        .catch(function () {
          clearTimeout(to);
          box.innerHTML = '<p class="note">現在ニュースを取得できません（オフラインの可能性）。マスクの動向は <a class="inline-link" href="https://musk.toriumis.com/" target="_blank" rel="noopener">MUSK RADAR（musk.toriumis.com）</a> でリアルタイム追跡しています。</p>';
        });
    })();
  };

  function tl(year, title, desc) {
    return '<div class="tl-item"><div class="tl-year">' + year + '</div><div class="tl-title">' + title + '</div><p>' + desc + '</p></div>';
  }

  function principle(num, title, body) {
    return '<details class="principle" open><summary><span class="num">' + num + '</span>' + title + '</summary><div class="body">' + body + '</div></details>';
  }

  function quote(ja, en) {
    return '<div class="quote">' + ja + '<span class="en">' + en + '</span></div>';
  }

  window.AN = AN;
})();
