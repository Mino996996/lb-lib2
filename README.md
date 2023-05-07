[![Test and build on merge](https://github.com/Mino996996/lb-lib2/actions/workflows/test-build-merge.yml/badge.svg)](https://github.com/Mino996996/lb-lib2/actions/workflows/test-build-merge.yml)
# LBの図書館

朝活発表資料の管理、閲覧、DL、及び傾向分析アプリ

## バージョン情報

node: 19.13.1  
npm: 9.1.1  
React: 18.0.0  
Tailwind: 3.0.24  
Firebase: 10.2.0  

## 基本構成

- src: reactのコンポーネント
  - components: メインと認証ページのコンポーネント
    - Category: 左側/カテゴリ一覧表示
      - Category.tsx
    - Config: 右側/表示設定と関連タグを表示
      - Config.tsx
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

