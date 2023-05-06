import { createInitTagList, isCategoryTag, pickRelationalTabs, testABC } from './cardFunctions';
import { urlInfoList } from '../../fixtures/stab/urlStab';
import { CategoryInfo } from '../../utils/utilTypes';

describe('cardFunctions.ts', () => {
  it('testABC', () => {
    expect(testABC()).toBe(123);
  });

  it('選択されたカテゴリに含まれるタグを取り出す', () => {
    const result1 = ['AWS', 'test', 'test2', '寿司安価スレ'];
    const result2 = ['test', 'test2', '寿司安価スレ'];
    expect(pickRelationalTabs(urlInfoList, 'test')).toEqual(result1);
    expect(pickRelationalTabs(urlInfoList, '寿司安価スレ')).toEqual(result2);
  });

  it('カードのタグ名からカテゴリタグに一致するものの有無を返す', () => {
    const categories: CategoryInfo[] = [
      { id: '123456', category: 'test', theme: 1 },
      { id: '456789', category: 'test2', theme: 1 },
      { id: '789123', category: '寿司安価スレ', theme: 6 },
      { id: '147258', category: 'AWS', theme: 1 },
    ];
    expect(isCategoryTag(categories, 'AWS')).toBeTruthy();
    expect(isCategoryTag(categories, 'test3')).toBeFalsy();
  });

  it('登録済みタグと選択カテゴリの状態に合わせた初期のタグリストを返す', () => {
    const tagList = ['AWS', 'EC2', '設定方法'];
    const result1 = ['AWS', 'EC2', '設定方法', 'データベース'];
    expect(createInitTagList(tagList, 'データベース')).toEqual(result1);
    expect(createInitTagList(tagList, 'AWS')).toEqual(tagList);
    expect(createInitTagList([], 'AWS')).toEqual(['AWS']);
    expect(createInitTagList([], '')).toEqual([]);
  });
});
