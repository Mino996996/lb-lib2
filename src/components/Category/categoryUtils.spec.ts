import { createCategory, validateCategoryForm } from './categoryUtils';
import { CategoryInfo, CategoryType } from '../../utils/utilTypes';

describe('categoryUtils', () => {
  describe('validateCategoryForm', () => {
    it('themeの選択がジャンル、年、メンバー以外のときにエラーを投げる', () => {
      const id = 'testId';
      const categoryName = '2000年';
      const theme = CategoryType.unselected;

      expect(() => validateCategoryForm(id, categoryName, theme)).toThrow('登録する項目を選択してください');
    });

    it('themeの選択が年のとき、半角数字+年以外の入力にはエラーを投げる', () => {
      const id = 'testId';
      const errorInput1 = '2000';
      const errorInput2 = '２０００年';
      const errorInput3 = '200年';
      const theme = CategoryType.year;

      expect(() => validateCategoryForm(id, errorInput1, theme)).toThrow('発表年登録は 2000年 の形で 4桁の半角数字+年 で記入ください');
      expect(() => validateCategoryForm(id, errorInput2, theme)).toThrow('発表年登録は 2000年 の形で 4桁の半角数字+年 で記入ください');
      expect(() => validateCategoryForm(id, errorInput3, theme)).toThrow('発表年登録は 2000年 の形で 4桁の半角数字+年 で記入ください');
    });

    it('themeの選択がメンバーのとき、名前+さん以外の入力にはエラーを投げる', () => {
      const id = 'testId';
      const errorInput1 = '萩原';
      const errorInput2 = '萩原様';
      const theme = CategoryType.member;

      expect(() => validateCategoryForm(id, errorInput1, theme)).toThrow('発表者登録は ○○さん の形で 名前+さん で記入ください');
      expect(() => validateCategoryForm(id, errorInput2, theme)).toThrow('発表者登録は ○○さん の形で 名前+さん で記入ください');
    });
  });

  describe('createCategory', () => {
    it('テーマがジャンル、メンバー、年、以外を選択していたらエラーを投げる', () => {
      const expectedResult: CategoryInfo = { id: 'testId', category: '2000年', theme: CategoryType.year };
      const id = 'testId';
      const categoryName = '2000年';
      const theme: CategoryType = CategoryType.year;
      expect(createCategory(id, categoryName, theme)).toEqual(expectedResult);
    });
  });
});
