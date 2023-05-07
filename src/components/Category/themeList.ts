import { CategoryType } from '../../utils/utilTypes';

export interface ThemeOption {
  value: CategoryType;
  text: string;
}

export const themeOptions: ThemeOption[] = [
  { value: CategoryType.unselected, text: '=分類を選択してください=' },
  { value: CategoryType.genre, text: 'ジャンル' },
  { value: CategoryType.member, text: '発表者' },
  { value: CategoryType.year, text: '年' },
];
