import {
  createCategory,
  initSetting,
  registeredNumber,
  setIsOpenListOfLocalStorage,
  validateCategoryForm,
  validateOnRegisterCategory,
  validateOnUpdateCategory,
} from './categoryUtils';
import { CategoryInfo, CategoryType } from '../../utils/utilTypes';
import { CATEGORY_SAMPLES, EVENT_SAMPLES } from '../../fixtures/samples/samples';

describe('categoryUtils', () => {
  describe('createCategory', () => {
    it('テーマがジャンル、メンバー、年、以外を選択していたらエラーを投げる', () => {
      const expectedResult: CategoryInfo = { id: 'testId', category: '2000年', theme: CategoryType.year };
      const id = 'testId';
      const categoryName = '2000年';
      const theme: CategoryType = CategoryType.year;
      expect(createCategory(id, categoryName, theme)).toEqual(expectedResult);
    });
  });

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

  describe('registeredNumber', () => {
    it('該当するカテゴリの登録数を返す', () => {
      const expectResult = 1;
      const category: CategoryInfo = CATEGORY_SAMPLES[4];

      expect(registeredNumber(EVENT_SAMPLES, category)).toEqual(expectResult);
    });
  });

  describe('setIsOpenListOfLocalStorage', () => {
    beforeEach(() => {
      localStorage.clear();
    });
    it('isOpenがfalseのとき、該当するキーのlocalStorageの値が"closeになる"', () => {
      const isOpen = false;
      setIsOpenListOfLocalStorage(CategoryType.genre, isOpen);
      setIsOpenListOfLocalStorage(CategoryType.member, isOpen);
      setIsOpenListOfLocalStorage(CategoryType.year, isOpen);

      expect(localStorage.getItem('isGenreListOpen')).toEqual('close');
      expect(localStorage.getItem('isMemberListOpen')).toEqual('close');
      expect(localStorage.getItem('isYearListOpen')).toEqual('close');
    });

    it('isOpenがtrueのとき、該当するキーのlocalStorageの値が"closeになる"', () => {
      const isOpen = true;
      setIsOpenListOfLocalStorage(CategoryType.genre, isOpen);
      setIsOpenListOfLocalStorage(CategoryType.member, isOpen);
      setIsOpenListOfLocalStorage(CategoryType.year, isOpen);

      expect(localStorage.getItem('isGenreListOpen')).toEqual('open');
      expect(localStorage.getItem('isMemberListOpen')).toEqual('open');
      expect(localStorage.getItem('isYearListOpen')).toEqual('open');
    });
  });

  describe('initSetting', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it('各キーの値が"open"のときtrueを返す', () => {
      localStorage.setItem('isGenreListOpen', 'open');
      localStorage.setItem('isMemberListOpen', 'open');
      localStorage.setItem('isYearListOpen', 'open');

      expect(initSetting(CategoryType.genre)).toBeTruthy();
      expect(initSetting(CategoryType.member)).toBeTruthy();
      expect(initSetting(CategoryType.year)).toBeTruthy();
    });

    it('各キーの値がNullならtrueを返す', () => {
      expect(initSetting(CategoryType.genre)).toBeTruthy();
      expect(initSetting(CategoryType.member)).toBeTruthy();
      expect(initSetting(CategoryType.year)).toBeTruthy();
    });

    it('各キーの値が"open"以外ならfalseを返す', () => {
      localStorage.setItem('isGenreListOpen', 'close');
      localStorage.setItem('isMemberListOpen', '');
      localStorage.setItem('isYearListOpen', 'true');

      expect(initSetting(CategoryType.genre)).toBeFalsy();
      expect(initSetting(CategoryType.member)).toBeFalsy();
      expect(initSetting(CategoryType.year)).toBeFalsy();
    });
  });

  describe('validationOnRegisterCategory', () => {
    it('isUniqueNameがfalseのときエラーを投げる', () => {
      const isUnique = false;
      const categoryName = 'dummy Name';
      const categoryType = CategoryType.year;

      expect(() => validateOnRegisterCategory(isUnique, categoryName, categoryType)).toThrow('すでにデータベースに登録されています');
    });

    it('名前が空欄または空白文字のみのときにエラーを投げる', () => {
      const isUnique = true;
      const categoryName1 = '';
      const categoryName2 = ' ';
      const categoryName3 = '　';
      const categoryType = CategoryType.genre;

      expect(() => validateOnRegisterCategory(isUnique, categoryName1, categoryType)).toThrow('空白では登録できません');
      expect(() => validateOnRegisterCategory(isUnique, categoryName2, categoryType)).toThrow('空白では登録できません');
      expect(() => validateOnRegisterCategory(isUnique, categoryName3, categoryType)).toThrow('空白では登録できません');
    });

    it('登録カテゴリが未選択のときにエラーを投げる', () => {
      const isUnique = true;
      const categoryName = 'dummyName';
      const categoryType = CategoryType.unselected;

      expect(() => validateOnRegisterCategory(isUnique, categoryName, categoryType)).toThrow('分類先を選択してください');
    });
  });

  describe('validateOnUpdateCategory', () => {
    it('変更する登録名が旧登録名以外と重複していたらエラーを投げる', () => {
      const category = CATEGORY_SAMPLES[0];
      const isUnique = false;
      const categoryName = 'dummy Name';
      const categoryType = CATEGORY_SAMPLES[0].theme;
      const point = String(CATEGORY_SAMPLES[0].point);

      expect(() => validateOnUpdateCategory(category, isUnique, categoryName, categoryType, point)).toThrow('他の登録名と重複しています');
    });

    it('旧登録名と異なり、ユニークならエラーを投げるない', () => {
      const category = CATEGORY_SAMPLES[0];
      const isUnique = true;
      const categoryName = 'dummy Name';
      const categoryType = CATEGORY_SAMPLES[0].theme;
      const point = String(CATEGORY_SAMPLES[0].point);

      expect(() => validateOnUpdateCategory(category, isUnique, categoryName, categoryType, point)).not.toThrow();
    });

    it('変更する登録名が空白入力のときエラーを投げる', () => {
      const category = CATEGORY_SAMPLES[0];
      const isUnique = true;
      const categoryName1 = '';
      const categoryName2 = ' ';
      const categoryName3 = '　';
      const categoryType = CATEGORY_SAMPLES[0].theme;
      const point = String(CATEGORY_SAMPLES[0].point);

      expect(() => validateOnUpdateCategory(category, isUnique, categoryName1, categoryType, point)).toThrow('空白では登録できません');
      expect(() => validateOnUpdateCategory(category, isUnique, categoryName2, categoryType, point)).toThrow('空白では登録できません');
      expect(() => validateOnUpdateCategory(category, isUnique, categoryName3, categoryType, point)).toThrow('空白では登録できません');
    });

    it('登録カテゴリが未選択のときエラーを投げる', () => {
      const category = CATEGORY_SAMPLES[0];
      const isUnique = false;
      const categoryName1 = CATEGORY_SAMPLES[0].category;
      const categoryType = CategoryType.unselected;
      const point = String(CATEGORY_SAMPLES[0].point);

      expect(() => validateOnUpdateCategory(category, isUnique, categoryName1, categoryType, point)).toThrow('分類先を選択してください');
    });

    it('変更箇所がない場合にエラーを投げる', () => {
      const category = CATEGORY_SAMPLES[0];
      const isUnique = false;
      const categoryName1 = CATEGORY_SAMPLES[0].category;
      const categoryType = CATEGORY_SAMPLES[0].theme;
      const point = String(CATEGORY_SAMPLES[0].point);

      expect(() => validateOnUpdateCategory(category, isUnique, categoryName1, categoryType, point)).toThrow('すでにデータベースに登録されています');
    });
  });
});
