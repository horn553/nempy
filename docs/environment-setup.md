# 環境変数設定ガイド

## 概要

このプロジェクトでは、Google OAuth 2.0認証のため以下の環境変数が必要です。

## 必須環境変数

| 変数名                 | 説明                                     | 例                                           |
| ---------------------- | ---------------------------------------- | -------------------------------------------- |
| `GOOGLE_CLIENT_ID`     | Google OAuth 2.0クライアントID           | `123456789-abc.apps.googleusercontent.com`   |
| `GOOGLE_CLIENT_SECRET` | Google OAuth 2.0クライアントシークレット | `GOCSPX-xxxxxxxxxxxxxxxxxxxxxxxx`            |
| `GOOGLE_REDIRECT_URI`  | OAuth認証後のリダイレクトURI             | `http://localhost:5173/auth/google/callback` |

## 開発環境での設定

### 1. Google Cloud Consoleでの設定

1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. 新しいプロジェクトを作成または既存プロジェクトを選択
3. 「APIとサービス」→「認証情報」に移動
4. 「認証情報を作成」→「OAuth 2.0 クライアント ID」を選択
5. アプリケーションの種類：「ウェブアプリケーション」
6. 承認済みのリダイレクトURIに以下を追加：
   - `http://localhost:5173/auth/google/callback`
   - `http://localhost:4173/auth/google/callback` (preview用)

### 2. 環境変数ファイルの作成

プロジェクトルートに `.env` ファイルを作成：

```bash
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:5173/auth/google/callback
```

⚠️ **重要**: `.env` ファイルは `.gitignore` に含まれているため、Gitにコミットされません。

### 3. 環境変数の確認

環境変数が正しく設定されているか確認：

```bash
npm run check
npm run test
npm run dev
```

## 本番環境での設定

### Cloudflareでの設定

1. Cloudflare Workers & Pagesダッシュボードにアクセス
2. プロジェクトの「設定」→「環境変数」に移動
3. 本番用の環境変数を追加：
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `GOOGLE_REDIRECT_URI` (本番ドメインのURI)

## CI/CD環境での設定

### GitHub Actions

1. GitHubリポジトリの「Settings」→「Secrets and variables」→「Actions」
2. Repository secretsに追加：
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `GOOGLE_REDIRECT_URI`

⚠️ **注意**: CI環境では実際のGoogle認証は行われませんが、型チェックとビルドのために環境変数が必要です。

## トラブルシューティング

### 環境変数が見つからないエラー

```
Missing required Google OAuth environment variables
```

**解決方法：**

1. `.env` ファイルが存在し、正しい変数名で設定されているか確認
2. SvelteKitを再起動（`npm run dev` を停止して再実行）

### OAuth認証エラー

**考えられる原因：**

- `GOOGLE_REDIRECT_URI` がGoogle Cloud Consoleの設定と一致していない
- クライアントIDまたはシークレットが間違っている
- ドメインが未承認

**解決方法：**

1. Google Cloud Consoleで設定を再確認
2. リダイレクトURIが正確に設定されているか確認
3. ブラウザのキャッシュをクリア

## セキュリティ考慮事項

- 環境変数ファイル（`.env`）は絶対にGitにコミットしない
- 本番環境では最小権限の原則を適用
- 定期的にシークレットをローテーション
- 開発環境と本番環境で異なる認証情報を使用
