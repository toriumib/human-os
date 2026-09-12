# HUMAN OS — AIに負けない訓練所

**「AIが『常識』を出す時代に、人間に残るのは前提を疑う力だ。」**

HUMAN OS は、イーロン・マスク的な思考特性（第一原理思考・物理世界との摩擦・AIへの警戒と活用）を鍛えるための3モジュール構成の訓練アプリです。Webアプリ（PWA）とAndroidアプリの両形態で提供されます。

- 🌐 **本番URL**: https://human-os.toriumis.com/ （Cloudflare Workers + カスタムドメイン）
- 🌐 **ミラー（GitHub Pages）**: https://toriumib.github.io/human-os/
- 📦 **Android APK**: [Releases](https://github.com/toriumib/human-os/releases) （CIが自動ビルド）
- 📱 **Androidソース**: [`android/`](android/)

## 3つの訓練

| モジュール | 鍛える能力 | 内容 |
|---|---|---|
| **01 FIRST PRINCIPLES** | 第一原理思考・課題の再定義 | AIが提示する「世間の常識」に対して「なぜ？」を5回突き刺し、物理法則とコストの最小単位まで降りる思考の格闘技。到達度をスコア化。 |
| **02 SENSORIUM** | 物理世界との摩擦・センサーリテラシー | スマホの全センサー（加速度・方位・GPS・照度・マイク・時計ジッタ等）を可視化。「AIが生成した美しすぎる嘘の波形」と「ノイズだらけの物理的真実」を見破るREAL or FAKE訓練。 |
| **03 SYNTHESIS** | AIアライメント・複雑系のディレクション | 君はCEO。エンジニアAI・リスクAI・運用AIの提案を「承認 / 拒否 / 制約付き承認」で裁き、12週で文明的ミッション（居眠り運転ゼロ社会・火星テラフォーミング・都市電力網最適化）を遂行。AIは平然と人間を犠牲にする「最適解」を提案してくる。 |
| **04 学び方 (ASTRA NOVA)** | 教育思想の理解 | 本家 Astra Nova School（SpaceXで生まったAd Astra後身）の教育——第一原理の授業・成縑なし・Conundrums・Synthesis・毎年の再設計——を日本語で学べるガイド。出願方法（年間受付・3ステップ）も紹介。 |

## 技術構成

依存ゼロのバニラHTML/CSS/JS。ビルド不要。すべてのデータは端末内（localStorage）に保存され、外部送信はない。

```
human-os/
├── web/                  # Webアプリ本体（PWA: manifest + Service Worker）
│   ├── index.html
│   ├── css/style.css
│   ├── js/
│   │   ├── data.js       # お題・ミッション・AI提案のデータ
│   │   ├── app.js        # シェル/ルーター
│   │   ├── fp.js         # 01 第一原理道場
│   │   ├── sensorium.js  # 02 センサーハック
│   │   └── synthesis.js  # 03 AI指揮官シミュレータ
│   ├── icons/            # SVGアイコン
│   ├── manifest.webmanifest
│   └── sw.js             # オフライン対応
├── android/              # Androidアプリ（WebViewシェル, Java, minSdk 26）
│   └── app/
│       └── src/main/     # MainActivity + アダプティブアイコン
├── cloudflare/           # 本番配信（Cloudflare Workers 静的アセット）
│   └── wrangler.jsonc    # カスタムドメイン: human-os.toriumis.com
└── .github/workflows/
    ├── deploy-web.yml    # web/ を GitHub Pages へ自動デプロイ
    └── android-build.yml # web/ をアセットに同梱し APK をビルド → Release
```

## 開発

```bash
# ローカルでWebアプリを起動（センサー系APIはHTTPSかlocalhostが必要）
cd web
python -m http.server 8080
# → http://localhost:8080
```

Androidをローカルビルドする場合（JDK 17 + Android SDK + Gradle 8.7+）:

```bash
mkdir -p android/app/src/main/assets
cp -r web android/app/src/main/assets/web
cd android && gradle assembleDebug
# → android/app/build/outputs/apk/debug/app-debug.apk
```

## センサー対応表

| センサー | PC | Android (WebView) | iOS (Safari) |
|---|---|---|---|
| 加速度 / 方位 | ✗ | ○ | ○（許可 required） |
| GPS | ✗ | △ 要実装 | ✗ |
| マイク | ○ | △ 要実装 | ○（許可 required） |
| 時計 / バッテリー / ネットワーク | ○ | ○ | 一部非対応 |

※ Android版はオフライン動作を優先し、WebView単体で動作しないセンサー（GPS・マイク）は機能を絞って同梱しています。フル機能はWeb版（HTTPS）でお試しください。

## 公開について

- **本番（toriumis.com）**: Cloudflare Workers が静的アセットを配信。カスタムドメイン `human-os.toriumis.com` はWorkers Custom Domainとして紐付け済みで、DNSレコードとSSL証明書はCloudflareが自動管理（apexのスタジオトリウミ本番サイトには影響なし）。更新コマンド:

  ```bash
  cd cloudflare && npx wrangler deploy   # web/ を再配信
  ```

- **ミラー**: GitHub Pages が main ブランチ push を検知して自動デプロイ
- **Android**: `v*` タグの push で GitHub Actions が APK をビルドし、GitHub Releases に公開。APKを端末で直接インストール（サイドロード）できます
- **Google Play ストアでの配布**を行う場合: [Google Play Console](https://play.google.com/console)（登録料 $25）でアプリを作成し、`android/` をリリースビルド（署名付きAAB）にしてアップロードしてください。必要な手順はPlay Consoleがガイドします

## ライセンス

MIT License — 詳細は [LICENSE](LICENSE)
