# 🚗 nempy

燃費管理を中心とした車の維持管理アプリケーション

[![CI Status](https://github.com/horn553/nempy/workflows/CI/badge.svg)](https://github.com/horn553/nempy/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

## ✨ 主な機能

- 🔐 **Googleアカウント認証** - 安全でシンプルなログイン
- 🚙 **複数車両管理** - 家族の車を一元管理
- ⛽ **給油記録管理** - 詳細な給油履歴の記録・編集
- 📊 **燃費分析** - リアルタイムでの燃費計算・可視化
- 🤝 **車両共有** - 家族やパートナーとのデータ共有
- 📤 **データエクスポート** - CSV形式でのデータ出力

## 🛠 技術スタック

### フロントエンド

- **SvelteKit** - モダンなWebアプリケーションフレームワーク
- **TypeScript** - 型安全な開発環境
- **Skeleton UI** - 美しいUIコンポーネント

### バックエンド・インフラ

- **Cloudflare Workers** - エッジコンピューティング
- **Cloudflare D1** - SQLiteベースのデータベース
- **Drizzle ORM** - 型安全なORM
- **Lucia** - OAuth 2.0認証

### 開発・CI/CD

- **Vitest** - 高速な単体テスト
- **ESLint + Prettier** - コード品質管理
- **Husky** - Git hooks
- **GitHub Actions** - 自動化されたCI/CD

## 🏗 アーキテクチャ

- **DDD（ドメイン駆動設計）** - ビジネスロジック中心の設計
- **クリーンアーキテクチャ** - 保守性の高い構造
- **関数型プログラミング** - イミュータブルな設計
- **Result型** - 安全なエラーハンドリング

## 🚀 開発環境のセットアップ

### 前提条件

- Node.js 18.0.0 以上
- npm または pnpm

### インストール

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# ブラウザで自動的に開く場合
npm run dev -- --open
```

### 利用可能なコマンド

```bash
# 開発サーバー
npm run dev

# プロダクションビルド
npm run build

# プロダクション確認
npm run preview

# 型チェック
npm run check

# 型チェック（監視モード）
npm run check:watch

# リント
npm run lint

# フォーマット
npm run format

# テスト実行
npm run test

# テスト（監視モード）
npm run test:unit
```

## 📋 開発ガイドライン

### コード品質

- **必須**: 全てのPRでlintとtypecheckが通ること
- **必須**: 新機能には対応するテストを含めること
- **推奨**: コミット前に `npm run format` を実行すること

### Git ワークフロー

- **main**: 本番環境用ブランチ
- **feature/\***: 新機能開発用ブランチ
- **fix/\***: バグ修正用ブランチ

### 設計原則

- オブジェクト指向よりも関数型プログラミングを優先
- 例外を投げず、Result型でエラーハンドリング
- イミュータブルなデータ構造を心がける
- ビジネスロジックはドメイン層に集約

## 📖 ドキュメント

- [要件定義書](./docs/requirements.md) - プロジェクトの詳細な要件
- [開発TODO](./docs/development-todo.md) - 開発計画・進捗管理

## 🎯 パフォーマンス目標

- **初回ロード**: 3秒以内（モバイル4G）
- **ページ遷移**: 1秒以内
- **API応答**: 200ms以内
- **Core Web Vitals**: Google推奨値準拠

## 🔐 セキュリティ

- HTTPS通信の強制
- OAuth 2.0による安全な認証
- SQLインジェクション対策（Drizzle ORM）
- 適切なアクセス制御・権限管理

## 📝 ライセンス

このプロジェクトは [MIT License](./LICENSE) の下で公開されています。

## 🤝 コントリビューション

プロジェクトへの貢献を歓迎します！issueやpull requestをお気軽に作成してください。

---

**nempy** で、あなたの愛車をもっと身近に、もっとスマートに管理しましょう 🚗✨
