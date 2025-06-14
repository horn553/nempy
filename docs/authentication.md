# nempy 認証システム ドキュメント

## 概要

nempy では、Google OAuth 2.0 を使用したシンプルで安全な認証システムを実装しています。セッション管理には暗号化されたトークンを使用し、OSLOライブラリによる現代的なセキュリティ手法を採用しています。

## 技術スタック

### 認証ライブラリ
- **Arctic**: OAuth 2.0 プロバイダー統合
- **@oslojs/crypto**: 暗号化機能
- **@oslojs/encoding**: エンコーディング機能

### データベース
- **開発環境**: SQLite (better-sqlite3)
- **本番環境**: Cloudflare D1 (予定)
- **ORM**: Drizzle ORM

## アーキテクチャ

### 1. データベーススキーマ

#### usersテーブル
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,           -- UUID
  google_id TEXT UNIQUE NOT NULL, -- Google OAuth ID
  email TEXT UNIQUE NOT NULL,    -- メールアドレス
  name TEXT NOT NULL,           -- 表示名
  picture TEXT,                 -- プロフィール画像URL
  created_at INTEGER NOT NULL,  -- 作成日時 (Unix timestamp)
  updated_at INTEGER NOT NULL   -- 更新日時 (Unix timestamp)
);
```

#### sessionsテーブル
```sql
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,           -- SHA-256ハッシュ化されたセッショントークン
  user_id TEXT NOT NULL,        -- ユーザーID (foreign key)
  expires_at INTEGER NOT NULL   -- 有効期限 (Unix timestamp)
);
```

### 2. セッション管理

#### セッショントークンの生成
```typescript
// 20バイトのランダムトークンを生成
const bytes = new Uint8Array(20);
crypto.getRandomValues(bytes);
const token = encodeBase32LowerCaseNoPadding(bytes);
```

#### セッション保存
```typescript
// トークンをSHA-256でハッシュ化してセッションIDとして使用
const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
```

#### セッションの有効期限
- **基本有効期限**: 30日間
- **自動延長**: 残り15日以下の場合、アクセス時に30日間延長
- **無効化**: ログアウト時に即座に削除

### 3. 認証フロー

#### 1. ログイン開始
```
GET /auth/google
→ Google OAuth認証URLにリダイレクト
```

#### 2. コールバック処理
```
GET /auth/google/callback?code=xxx&state=xxx
→ 認証コード検証
→ Googleユーザー情報取得
→ ユーザー作成/更新
→ セッション作成
→ ダッシュボードにリダイレクト
```

#### 3. ログアウト
```
POST /auth/logout
→ セッション無効化
→ Cookieクリア
→ トップページにリダイレクト
```

## セットアップ手順

### 1. 環境変数設定

`.env`ファイルを作成し、以下の環境変数を設定:

```bash
# Google OAuth設定
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:5173/auth/google/callback

# 本番環境では以下のようなURLになります
# GOOGLE_REDIRECT_URI=https://your-domain.com/auth/google/callback
```

### 2. Google OAuth設定

1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. 新しいプロジェクトを作成または既存プロジェクトを選択
3. 「APIs & Services」→「Credentials」に移動
4. 「+ CREATE CREDENTIALS」→「OAuth client ID」を選択
5. アプリケーションタイプとして「Web application」を選択
6. リダイレクトURIを設定:
   - 開発環境: `http://localhost:5173/auth/google/callback`
   - 本番環境: `https://your-domain.com/auth/google/callback`

### 3. 開発サーバー起動

```bash
npm install
npm run dev
```

## API エンドポイント

### 認証関連

| メソッド | エンドポイント | 説明 |
|---------|-------------|------|
| GET | `/auth/google` | Google OAuth認証開始 |
| GET | `/auth/google/callback` | OAuth コールバック処理 |
| POST | `/auth/logout` | ログアウト処理 |

### ページ

| パス | 説明 | 認証要否 |
|------|------|----------|
| `/` | トップページ/ダッシュボード | 任意 |
| `/login` | ログインページ | 不要 |

## セキュリティ考慮事項

### 1. セッション管理
- **トークンの暗号化**: セッショントークンはSHA-256でハッシュ化して保存
- **CSRF対策**: SameSite=Lax設定でCookieの送信を制限
- **XSS対策**: HttpOnly Cookieでクライアントサイドからのアクセスを防止

### 2. OAuth設定
- **State パラメータ**: CSRF攻撃を防ぐためのランダムな状態値
- **スコープ制限**: 必要最小限のスコープ（profile, email）のみ要求

### 3. 本番環境対応
- **HTTPS必須**: 本番環境ではSecure Cookieを使用
- **環境変数**: 機密情報は環境変数で管理
- **CORS設定**: 適切なOrigin制限

## トラブルシューティング

### よくある問題

1. **Google OAuth エラー**
   - リダイレクトURIの設定を確認
   - クライアントIDとシークレットが正しく設定されているか確認

2. **セッションが保持されない**
   - Cookie設定（Secure、SameSite）を確認
   - セッションの有効期限を確認

3. **データベース接続エラー**
   - SQLiteファイルの書き込み権限を確認
   - 開発環境でのデータベース初期化を確認

## 今後の拡張予定

- [ ] 複数のOAuthプロバイダー対応（GitHub、Twitter等）
- [ ] 管理者権限システム
- [ ] セッション管理画面（アクティブセッション一覧）
- [ ] 二要素認証（2FA）対応
- [ ] パスワードレス認証の検討

## 参考資料

- [Arctic Documentation](https://arctic.js.org/)
- [Oslo Security Libraries](https://oslojs.dev/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [SvelteKit Authentication Guide](https://kit.svelte.dev/docs/authentication)