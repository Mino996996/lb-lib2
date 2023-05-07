import React, { useState } from 'react';
import { categoryDb, checkCategoryName } from '../../firebase/firebase';
import { useEventContext } from '../state/EventProvider';
import { createCategory, validateOnRegisterCategory } from './categoryUtils';
import { createId } from '../../utils/utilFinctions';
import { CategoryType } from '../../utils/utilTypes';
import CategorySelectInput from './CategorySelectInput';
const ID_LENGTH = 12;

const CategoryForm: React.FC = () => {
  const { allCategory, setAllCategory } = useEventContext();
  const [categoryName, setCategoryName] = useState<string>('');
  const [categoryType, setCategoryType] = useState<CategoryType>(CategoryType.unselected);

  const addCategory = async (categoryName: string): Promise<void> => {
    try {
      // 事前に登録済みか確認して値チェック
      const isUniqueName = await checkCategoryName(categoryName);
      validateOnRegisterCategory(isUniqueName, categoryName, categoryType);
      // 以下登録処理
      const uid = createId(ID_LENGTH);
      const categoryData = createCategory(uid, categoryName, categoryType);
      await categoryDb.add(categoryData);
      const newCategories = [...allCategory, categoryData].sort((a, b) => a.category.localeCompare(b.category));
      setAllCategory([...newCategories]);
      setCategoryName('');
      setCategoryType(CategoryType.unselected);
    } catch (error) {
      // チャッチするエラー：各登録値チェック、登録済、DB接続エラー
      throw new Error(String(error));
    }
  };

  return (
    <div className="mb-4">
      <CategorySelectInput className={'w-full mb-2 text-gray-700'} value={categoryType} setThemeType={setCategoryType} />
      <input
        id="search-field"
        className="w-3/4 pl-4 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-transparent sm:text-sm rounded-full"
        placeholder="カテゴリ名を記入"
        value={categoryName}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setCategoryName(e.target.value);
        }}
      />
      <button
        className="ml-2 p-1 bg-green-200 rounded-lg border border-indigo-400 cursor-pointer text-lg text-gray-700 font-bold"
        disabled={categoryName === ''}
        onClick={() => {
          addCategory(categoryName)
            .then(() => alert(`${categoryName}を登録しました`))
            .catch((error) => alert(error));
        }}
      >
        登録
      </button>
    </div>
  );
};

export default CategoryForm;
