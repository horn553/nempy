# nempy 開発TODOリスト

## フェーズ1: 基盤構築（並行開発可能）

### 1-A: プロジェクト初期設定

- [x] SvelteKitプロジェクトの作成
- [x] TypeScript設定
- [x] ESLint, Prettier設定
- [x] Git pre-commit hook設定
- [x] Vitest設定
- [x] GitHub Actions CI/CD設定

### 1-B: インフラ設定

- [ ] Cloudflare Workers設定
- [ ] Cloudflare D1データベース作成
- [ ] Drizzle ORM設定
- [ ] 環境変数設定（開発/本番）

### 1-C: UIフレームワーク設定

- [x] Skeleton UIインストール・設定
- [x] 基本レイアウトコンポーネント作成
- [x] テーマ設定（カラー、フォント）
- [x] レスポンシブデザインの基本設定

### 1-D: Storybook設定

- [ ] 新しいブランチを作成 (storybook-setup)
- [ ] Storybook for Svelteをインストール
- [ ] Storybookの設定ファイルを構成
- [ ] Tailwind CSSをStorybookに統合
- [ ] Headerコンポーネントのストーリー作成
- [ ] Sidebarコンポーネントのストーリー作成
- [ ] Footerコンポーネントのストーリー作成
- [ ] カードコンポーネントのストーリー作成
- [ ] Storybookビルドの確認

## フェーズ2: コアドメイン実装（並行開発可能）

### 2-A: ドメインモデル実装

- [x] Userエンティティ
- [x] Vehicleエンティティ
- [x] FuelRecordエンティティ
- [x] 権限（Permission）値オブジェクト
- [x] Result型の実装
- [x] 共通バリデーションルール

### 2-B: データベーススキーマ

- [x] usersテーブル
- [x] vehiclesテーブル
- [x] fuel_recordsテーブル
- [x] vehicle_permissionsテーブル
- [x] マイグレーションスクリプト
- [x] シードデータ

### 2-C: 認証基盤

- [ ] Lucia設定
- [ ] Google OAuth 2.0設定
- [ ] 認証ミドルウェア
- [ ] セッション管理
- [ ] 認証画面UI

## フェーズ3: リポジトリ・ユースケース層（2完了後、並行開発可能）

### 3-A: リポジトリ実装

- [ ] UserRepository
- [ ] VehicleRepository
- [ ] FuelRecordRepository
- [ ] PermissionRepository
- [ ] トランザクション管理

### 3-B: ユースケース実装

- [ ] ユーザー登録・ログイン
- [ ] 車両登録・編集・削除
- [ ] 給油記録登録・編集・削除
- [ ] 燃費計算ロジック
- [ ] 車両共有・権限管理
- [ ] データエクスポート

## フェーズ4: API実装（3完了後、並行開発可能）

### 4-A: 認証・ユーザーAPI

- [ ] POST /api/auth/google
- [ ] POST /api/auth/logout
- [ ] GET /api/auth/session

### 4-B: 車両管理API

- [ ] GET /api/vehicles
- [ ] POST /api/vehicles
- [ ] PUT /api/vehicles/:id
- [ ] DELETE /api/vehicles/:id
- [ ] POST /api/vehicles/:id/share
- [ ] PUT /api/vehicles/:id/permissions

### 4-C: 給油記録API

- [ ] GET /api/vehicles/:id/fuel-records
- [ ] POST /api/vehicles/:id/fuel-records
- [ ] PUT /api/fuel-records/:id
- [ ] DELETE /api/fuel-records/:id
- [ ] GET /api/vehicles/:id/fuel-economy
- [ ] GET /api/vehicles/:id/export

## フェーズ5: UI実装（4と並行開発可能）

### 5-A: 共通コンポーネント

- [ ] ヘッダー/ナビゲーション
- [ ] ローディング表示
- [ ] エラー表示
- [ ] 確認ダイアログ
- [ ] フォーム入力コンポーネント

### 5-B: 認証関連画面

- [ ] ログイン画面
- [ ] ログアウト処理
- [ ] 認証エラー画面

### 5-C: 車両管理画面

- [ ] 車両一覧画面
- [ ] 車両登録・編集フォーム
- [ ] 車両詳細画面
- [ ] 共有設定画面

### 5-D: 給油記録画面

- [ ] 給油記録一覧
- [ ] 給油記録追加フォーム（位置情報サジェスト含む）
- [ ] 給油記録編集フォーム
- [ ] 削除確認

### 5-E: ダッシュボード

- [ ] メインダッシュボード
- [ ] 燃費グラフコンポーネント
- [ ] 走行距離グラフコンポーネント
- [ ] 統計情報表示
- [ ] 期間フィルター

## フェーズ6: 統合・最適化

### 6-A: 機能統合テスト

- [ ] E2Eテストシナリオ作成
- [ ] 認証フロー統合テスト
- [ ] 車両管理フロー統合テスト
- [ ] 給油記録フロー統合テスト

### 6-B: パフォーマンス最適化

- [ ] バンドルサイズ最適化
- [ ] 画像最適化
- [ ] キャッシュ戦略実装
- [ ] Core Web Vitals測定・改善

### 6-C: 本番環境準備

- [ ] 本番環境デプロイ設定
- [ ] ドメイン設定
- [ ] HTTPS設定
- [ ] バックアップ設定確認
- [ ] モニタリング設定

## 並行開発の推奨分担

### 開発者A（バックエンド中心）

- フェーズ1-B（インフラ設定）
- フェーズ2-A（ドメインモデル）
- フェーズ3-A（リポジトリ）
- フェーズ4-A,B,C（API実装）

### 開発者B（フロントエンド中心）

- フェーズ1-C（UIフレームワーク）
- フェーズ2-C（認証基盤UI部分）
- フェーズ5-A,B,C,D,E（UI実装）

### 開発者C（フルスタック）

- フェーズ1-A（プロジェクト設定）
- フェーズ2-B（データベース）
- フェーズ3-B（ユースケース）
- フェーズ6（統合・最適化）

## 注意事項

- 各フェーズ内のタスクは並行開発可能
- フェーズ間には依存関係があるため、前フェーズの完了を待つ必要がある
- APIとUIは並行開発可能だが、モックデータでの開発が必要
- 定期的なコードレビューと統合を行い、競合を防ぐ
