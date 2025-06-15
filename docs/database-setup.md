# データベースセットアップガイド

このドキュメントでは、nempyプロジェクトのデータベースセットアップ方法について説明します。

## 概要

nempyはCloudflare D1をデータベースとして使用し、Drizzle ORMでスキーマ管理、Wranglerでマイグレーション管理を行います。
環境別（ローカル、プレビュー、本番）に異なるデータベースを使い分けることができます。

## データベーススキーマ

### テーブル構成

1. **users** - ユーザー情報

   - Google OAuth認証によるユーザー管理
   - プロフィール情報の保存

2. **vehicles** - 車両情報

   - ユーザーが所有する車両の管理
   - 車両の基本情報（メーカー、モデル、年式など）

3. **fuel_records** - 給油記録

   - 給油履歴の記録
   - 走行距離、給油量、価格などの詳細情報

4. **vehicle_permissions** - 車両共有権限
   - 車両の共有設定
   - 権限レベル（閲覧、記録追加、編集、管理者）

## 環境構成

### 環境別データベース

- **ローカル環境**: `nempy-local` (SQLite)
- **プレビュー環境**: `nempy-preview` (Cloudflare D1)
- **本番環境**: `nempy-production` (Cloudflare D1)

## セットアップ手順

### 1. 依存関係のインストール

```bash
npm install
```

### 2. Cloudflare認証設定

Wranglerを使用するために、Cloudflareにログインします：

```bash
npx wrangler login
```

### 3. データベースの作成

各環境用のD1データベースを作成します：

```bash
# ローカル開発用（自動作成されるためオプション）
npm run db:create:local

# プレビュー環境用
npm run db:create:preview

# 本番環境用
npm run db:create:production
```

### 4. wrangler.toml の更新

データベース作成後、`wrangler.toml`内の`database_id`を実際のIDに更新してください：

```toml
[env.preview]
[[env.preview.d1_databases]]
binding = "DB"
database_name = "nempy-preview"
database_id = "実際のプレビューデータベースID"  # 更新が必要
migrations_dir = "./drizzle"

[env.production]
[[env.production.d1_databases]]
binding = "DB"
database_name = "nempy-production"
database_id = "実際の本番データベースID"      # 更新が必要
migrations_dir = "./drizzle"
```

### 5. マイグレーションの実行

#### マイグレーションファイルの生成

スキーマからSQLマイグレーションファイルを生成：

```bash
npm run db:generate
```

#### マイグレーションの適用

各環境にマイグレーションを適用：

```bash
# ローカル環境
npm run db:migrate:local

# プレビュー環境
npm run db:migrate:preview

# 本番環境
npm run db:migrate:production
```

## 開発ワークフロー

### 日常的な開発

1. **ローカルでの開発**

   ```bash
   # ローカルでマイグレーション適用
   npm run db:migrate:local

   # 開発サーバー起動
   npm run dev
   ```

2. **プレビュー環境での確認**

   ```bash
   # プレビュー環境にマイグレーション適用
   npm run db:migrate:preview

   # プレビューデプロイ
   npx wrangler deploy --env preview
   ```

3. **本番リリース**

   ```bash
   # 本番環境にマイグレーション適用
   npm run db:migrate:production

   # 本番デプロイ
   npx wrangler deploy --env production
   ```

### スキーマの変更

1. **スキーマファイルの編集**
   `src/lib/db/schema/`ディレクトリ内の該当ファイルを編集

2. **マイグレーションの生成**

   ```bash
   npm run db:generate
   ```

3. **マイグレーションの適用**

   ```bash
   # ローカルで確認
   npm run db:migrate:local

   # 問題なければプレビュー環境に適用
   npm run db:migrate:preview

   # 最終確認後、本番環境に適用
   npm run db:migrate:production
   ```

## データベース管理

### Drizzle Studio

データベースの内容を視覚的に確認・編集：

```bash
npm run db:studio
```

ブラウザで`http://localhost:4983`にアクセス

### Wranglerコマンド

```bash
# データベース一覧表示
npx wrangler d1 list

# データベース情報表示
npx wrangler d1 info nempy-local

# ローカルデータベースでSQL実行
npx wrangler d1 execute nempy-local --local --command "SELECT * FROM users;"

# 本番データベースでSQL実行
npx wrangler d1 execute nempy-production --env production --command "SELECT COUNT(*) FROM users;"
```

## トラブルシューティング

### データベース接続エラー

- Cloudflareにログインしているか確認：`npx wrangler whoami`
- `wrangler.toml`のdatabase_idが正しいか確認

### マイグレーションエラー

- マイグレーションファイルの内容を確認
- ローカル環境で先にテストしてからプレビュー・本番に適用

### 環境変数エラー

- 必要に応じて`.env`ファイルでWranglerの設定を追加
- `CLOUDFLARE_ACCOUNT_ID`などの環境変数が設定されているか確認

## 参考リンク

- [Wrangler ドキュメント](https://developers.cloudflare.com/workers/wrangler/)
- [Cloudflare D1 ドキュメント](https://developers.cloudflare.com/d1/)
- [Drizzle ORM ドキュメント](https://orm.drizzle.team/)
- [Drizzle + D1 統合ガイド](https://orm.drizzle.team/docs/get-started-sqlite#cloudflare-d1)
