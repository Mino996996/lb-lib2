import { CategoryInfo, CategoryType, EventLog } from '../../utils/utilTypes';

// 登録するカテゴリオブジェクトを作る
export const createCategory = (id: string, category: string, theme: CategoryType): CategoryInfo => {
  return {
    id,
    category,
    theme,
  };
};

// 登録情報のバリデーション
export const validateCategoryForm = (id: string, category: string, theme: CategoryType): void => {
  // 登録ジャンルの選択チェック
  if (theme !== CategoryType.member && theme !== CategoryType.genre && theme !== CategoryType.year) {
    throw new Error('登録する項目を選択してください');
  }

  // 発表年カテゴリの値チェック
  const yearRegex = /^[0-9]{4}年$/; // 4桁の半角数字+"年"の正規表現
  if (theme === CategoryType.year && !yearRegex.test(category)) {
    throw new Error('発表年登録は 2000年 の形で 4桁の半角数字+年 で記入ください');
  }

  // 発表者の値チェック
  const memberRegex = /^[.+]さん$/; // 1文字以上の文字+"さん"
  if (theme === CategoryType.member && !memberRegex.test(category)) {
    throw new Error('発表者登録は ○○さん の形で 名前+さん で記入ください');
  }
};

export const registeredNumber = (urlInfos: EventLog[], categoryInfo: CategoryInfo): number => {
  return urlInfos.filter((value) => value.tagList.includes(categoryInfo.category)).length;
};

export const initSetting = (theme: CategoryType): boolean => {
  switch (theme) {
    case CategoryType.genre:
      return localStorage.getItem('genre') != null ? !(localStorage.getItem('genre') == null) : localStorage.getItem('genre') === null;
    case CategoryType.member:
      return localStorage.getItem('member') != null ? !(localStorage.getItem('member') == null) : localStorage.getItem('member') === null;
    default:
      return true;
  }
};

export const validateOnRegisterCategory = (isUniqueName: boolean, categoryName: string, categoryType: CategoryType): void => {
  // 他の登録名との重複チェック
  if (!isUniqueName) throw new Error('すでにデータベースに登録されています');
  // 空白入力のチェック
  if (categoryName === '' || categoryName.startsWith(' ') || categoryName.startsWith('　')) throw new Error('空白では登録できません');
  // 登録先の未選択チェック
  if (categoryType === CategoryType.unselected) throw new Error('分類先を選択してください');
};

export const validateOnUpdateCategory = (categoryInfo: CategoryInfo, isUniqueName: boolean, categoryName: string, categoryType: CategoryType, points: string): void => {
  // 変更しており、かつ他の登録名との重複チェック
  if (categoryInfo.category !== categoryName && isUniqueName) throw new Error('他の登録名と重複しています');
  // 空白入力のチェック
  if (categoryName === '' || categoryName.startsWith(' ') || categoryName.startsWith('　')) throw new Error('空白では登録できません');
  // 登録先の未選択チェック
  if (categoryType === CategoryType.unselected) throw new Error('分類先を選択してください');
  // 未変更のチェック
  if (categoryInfo.category === categoryName && categoryInfo.theme === categoryType && String(categoryInfo.point) === points)
    throw new Error('すでにデータベースに登録されています');
};
