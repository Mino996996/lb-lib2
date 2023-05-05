import { Theme } from './themeList';
import { CategoryInfo } from '../utilTypes';

// 登録するカテゴリオブジェクトを作る
export const createCategory = (id: string, category: string, theme: Theme): CategoryInfo => {
  return {
    id,
    category,
    theme,
  };
};

// 登録情報のバリデーション
export const validateCategoryForm = (id: string, category: string, theme: Theme): void => {
  // 登録ジャンルの選択チェック
  if (theme !== Theme.member && theme !== Theme.genre && theme !== Theme.year) {
    throw new Error('登録する項目を選択してください');
  }

  // 発表年カテゴリの値チェック
  const yearRegex = /^[0-9]{4}年$/; // 4桁の半角数字+"年"の正規表現
  if (theme === Theme.year && !yearRegex.test(category)) {
    throw new Error('発表年登録は 2000年 の形で 4桁の半角数字+年 で記入ください');
  }

  // 発表者の値チェック
  const memberRegex = /^[.+]さん$/; // 1文字以上の文字+"さん"
  if (theme === Theme.member && !memberRegex.test(category)) {
    throw new Error('発表者登録は ○○さん の形で 名前+さん で記入ください');
  }
};
