# 📊 投資スコアリングダッシュボード

CAN-SLIM準拠の投資スコアリングシステム。
4テーマ（AI・半導体、宇宙、防衛、エネルギー）の銘柄を自動スコアリング。

## 🎯 機能

- **自動スコアリング**: CAN-SLIM基準（100点満点）
- **4テーマ対応**: AI・半導体、宇宙、防衛、エネルギー
- **日米両市場**: 米国株・日本株対応
- **リアルタイム更新**: ボタン1つでデータ更新

## 📊 スコアリング基準

| カテゴリ | 配点 | 基準 |
|----------|------|------|
| 成長性 | 40点 | EPS成長率25%↑、売上成長率25%↑ |
| 収益性 | 20点 | ROE17%↑、営業利益率 |
| タイミング | 25点 | 52週高値から25%以内 |
| 安全性 | 15点 | 負債比率、時価総額 |

| グレード | スコア | アクション |
|----------|--------|------------|
| A | 80〜100 | 即検討 |
| B | 60〜79 | 監視リスト |
| C | 40〜59 | 様子見 |
| D | 0〜39 | 見送り |

---

## 🚀 セットアップ手順

### Step 1: GASバックエンド設定

1. **Googleスプレッドシート作成**
   - 新規スプレッドシートを作成
   - 名前: 「投資スコアリング」

2. **Apps Script設定**
   - 拡張機能 > Apps Script を開く
   - `gas_backend.js` の内容を貼り付け

3. **API Key取得**
   - [Financial Modeling Prep](https://financialmodelingprep.com/) でアカウント作成（無料）
   - API Keyを取得
   - GASコード内の `FMP_API_KEY` を設定

4. **初期化実行**
   - Apps Scriptで `initializeSheet` 関数を実行
   - 銘柄リストシートが作成される

5. **Webアプリとしてデプロイ**
   - デプロイ > 新しいデプロイ
   - 種類: ウェブアプリ
   - アクセス: 全員
   - デプロイしてURLをコピー

### Step 2: Reactフロントエンド設定

1. **依存関係インストール**
   ```bash
   cd stock-dashboard
   npm install
   ```

2. **GAS URLを設定**
   - `src/App.jsx` を開く
   - `GAS_API_URL` にStep 1でコピーしたURLを設定

3. **ローカル確認**
   ```bash
   npm run dev
   ```
   - http://localhost:5173 で確認

### Step 3: Vercelデプロイ

1. **GitHubリポジトリ作成**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/stock-dashboard.git
   git push -u origin main
   ```

2. **Vercel連携**
   - [Vercel](https://vercel.com/) にログイン
   - New Project > Import Git Repository
   - stock-dashboardを選択
   - Framework: Vite を選択
   - Deploy

3. **完了！**
   - `https://your-app.vercel.app` でアクセス可能

---

## 📁 ファイル構成

```
stock-dashboard/
├── index.html          # HTMLエントリーポイント
├── package.json        # 依存関係
├── vite.config.js      # Vite設定
└── src/
    ├── main.jsx        # Reactエントリーポイント
    └── App.jsx         # メインコンポーネント

gas_backend.js          # GASバックエンド（別途設定）
stock_list.csv          # 銘柄リスト（参考用）
```

---

## ⚠️ 注意事項

- **API制限**: Financial Modeling Prep無料枠は250回/日
- **日本株**: 現時点では米国株のみ自動スコアリング対応
- **投資判断**: このツールは参考情報であり、投資助言ではありません

---

## 🔧 カスタマイズ

### 銘柄追加
スプレッドシートの「銘柄リスト」シートに行を追加

### スコア基準変更
`gas_backend.js` の `calculateScore` 関数を編集

### テーマ追加
1. スプシの銘柄リストに新テーマを追加
2. `App.jsx` の `themes` 配列と `themeColors` に追加

---

## 📞 トラブルシューティング

| 問題 | 解決策 |
|------|--------|
| データが表示されない | GAS_API_URLが正しいか確認 |
| スコアが-になる | API制限に達している可能性。翌日再試行 |
| 日本株のスコアがない | 現時点では米国株のみ対応 |

---

## 📜 ライセンス

MIT License
