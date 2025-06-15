# データベースセットアップガイド

このドキュメントでは、nempyプロジェクトのデータベースセットアップ方法について説明します。

## 概要

nempyはCloudflare D1をデータベースとして使用し、Drizzle ORMでスキーマ管理を行います。

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

## セットアップ手順

### 1. 環境変数の設定

`.env.example`をコピーして`.env`ファイルを作成し、Cloudflare D1の認証情報を設定します：

```bash
cp .env.example .env
```

以下の環境変数を設定してください：

- `CLOUDFLARE_ACCOUNT_ID`: CloudflareアカウントID
- `CLOUDFLARE_DATABASE_ID`: D1データベースID
- `CLOUDFLARE_D1_TOKEN`: D1 APIトークン

### 2. 依存関係のインストール

```bash
npm install
```

### 3. マイグレーションの実行

#### ローカル開発環境

ローカル開発では、SQLiteを使用します：

```bash
# マイグレーションファイルの生成
npm run db:generate:local

# マイグレーションの適用（手動で実行が必要）
```

#### 本番環境（Cloudflare D1）

本番環境へのデプロイ時は、以下のコマンドを使用します：

```bash
# マイグレーションファイルの生成
npm run db:generate

# D1データベースへのマイグレーション適用
npm run db:push
```

### 4. シードデータの投入（開発環境のみ）

開発環境では、`src/lib/db/seed.ts`に定義されたサンプルデータを投入できます。

## データベース管理

### Drizzle Studio

データベースの内容を視覚的に確認・編集するには、Drizzle Studioを使用します：

```bash
npm run db:studio
```

ブラウザで`http://localhost:4983`にアクセスしてください。

## スキーマの変更

### 1. スキーマファイルの編集

`src/lib/db/schema/`ディレクトリ内の該当ファイルを編集します。

### 2. マイグレーションの生成

```bash
npm run db:generate:local  # ローカル開発用
# または
npm run db:generate       # 本番環境用
```

### 3. マイグレーションの適用

生成されたマイグレーションファイルを確認後、データベースに適用します。

## トラブルシューティング

### マイグレーションエラー

- 環境変数が正しく設定されているか確認してください
- Cloudflare D1の認証情報が有効か確認してください

### 型エラー

- `npm run check`でTypeScriptの型チェックを実行してください
- スキーマ変更後は必ず`npm run db:generate`を実行してください

## 参考リンク

- [Drizzle ORM ドキュメント](https://orm.drizzle.team/)
- [Cloudflare D1 ドキュメント](https://developers.cloudflare.com/d1/)
