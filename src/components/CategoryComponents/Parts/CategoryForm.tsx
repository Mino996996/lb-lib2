import React, { useContext, useState } from 'react';
import { CategoryInfo } from '../../utilTypes';
import { createId } from '../../UrlComponents/cardFunctions';
import { categoryDb, checkCategoryName, getAllCategories, getAllUrls } from '../../../firebase/firebase';
import { AppContext } from '../../state/ConfigProvider';
import { Theme, themeOptions } from '../themeList';

const CategoryForm: React.FC = () => {
  const { allCategory, setAllCategory, setAllUrl } = useContext(AppContext);
  const [categoryName, setCategoryName] = useState<string>('');
  const [theme, setTheme] = useState<Theme>(Theme.unselected);

  const addCategory = async (categoryName: string): Promise<void> => {
    const isUniqueName = await checkCategoryName(categoryName);
    if (categoryName !== '' && isUniqueName && !(theme === 0)) {
      const categoryData: CategoryInfo = {
        id: createId(12),
        category: categoryName,
        theme,
      };
      await categoryDb.add(categoryData);
      allCategory.push(categoryData);
      setAllCategory([...allCategory.sort((a, b) => a.category.localeCompare(b.category))]);
      setCategoryName('');
      setTheme(Theme.unselected);
    } else {
      if (!isUniqueName) {
        window.alert('すでにデータベースに登録されています');
        const newCateData = await getAllCategories();
        const newUrlData = await getAllUrls();
        setAllCategory(newCateData);
        setAllUrl([...newUrlData]);
      } else if (categoryName === '') {
        window.alert('未記入のため登録できません');
      } else {
        window.alert('分類先を選択してください');
      }
    }
  };

  return (
    <div className="mb-4">
      <select
        className="w-full mb-2 text-gray-700"
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
          setTheme(Number(e.target.value));
        }}
        value={theme}
      >
        {themeOptions.map((themeOption) => (
          <option key={themeOption.value} value={themeOption.value}>
            {themeOption.text}
          </option>
        ))}
      </select>
      <input
        id="search-field"
        className="w-3/4 pl-4 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-transparent sm:text-sm rounded-full"
        placeholder="カテゴリ名を記入"
        value={categoryName}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setCategoryName(e.target.value);
        }}
      />
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <button
        className="ml-2 p-1 bg-green-200 rounded-lg border border-indigo-400 cursor-pointer text-lg text-gray-700 font-bold"
        onClick={async () => await addCategory(categoryName)}
      >
        登録
      </button>
    </div>
  );
};

export default CategoryForm;
