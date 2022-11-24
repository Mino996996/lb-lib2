# URL共有ページ

業務やライブラリ、言語、セットアップなどで参考にしたURLと備考を記録・共有するサイト

## バージョン情報

node: 15.13.1  
npm: 8.1.2  
React: 18.0.0  
Tailwind: 3.0.24  
Firebase: 10.2.0  

## 基本構成

- src: reactのコンポーネント
  - components: メインと認証ページのコンポーネント
    - CategoryComponents: 左側/カテゴリ一覧表示
      - Parts
      - CategoryArea.tsx
    - ConfigComponents: 右側/表示設定と関連タグを表示
      - Parts
      - ConfigArea.tsx
    - MobileSidebar: スマホ時のサイドバー/CategoryComponentの役目
      - MobileSidebar.tsx
    - state: 認証系のreducerとuseProviderファイル
      - authReducer.ts
      - ConfigProvider.tsx
    - UrlComponents: 中央/メインのURL情報
      - FormCard: 入力フォームコンポーネント置き場
      - URLCard: 登録データの表示コンポーネント置き場
      - cardFunction.spec.ts: ファンクション用の単体テスト
      - cardFunction.ts: ファンクション用TSファイル
      - EventArea.tsx
- .env: Firebaseのkeyと簡易なログインパスワード
