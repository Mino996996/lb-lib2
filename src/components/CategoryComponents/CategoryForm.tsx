import React, { useState } from 'react';
import { categoryDb, checkCategoryName } from '../../firebase/firebase';
import { Theme, themeOptions } from './themeList';
import { createCategory } from '../../utils/utilFinctions';
import { alerts } from '../../utils/alerts';
import { useEventContext } from '../state/EventProvider';
const ID_LENGTH = 12;

const CategoryForm: React.FC = () => {
  const { allCategory, setAllCategory } = useEventContext();
  const [categoryName, setCategoryName] = useState<string>('');
  const [theme, setTheme] = useState<Theme>(Theme.unselected);

  const addCategory = async (categoryName: string): Promise<string> => {
    const isUniqueName = await checkCategoryName(categoryName);
    if (categoryName !== '' && isUniqueName && !(theme === 0)) {
      const categoryData = createCategory(ID_LENGTH, categoryName, theme);
      await categoryDb.add(categoryData);
      allCategory.push(categoryData);
      setAllCategory([...allCategory.sort((a, b) => a.category.localeCompare(b.category))]);
      setCategoryName('');
      setTheme(Theme.unselected);
      return 'Done';
    } else {
      return alerts(isUniqueName, categoryName);
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
        onClick={() => {
          addCategory(categoryName)
            .then((result) => {
              if (result !== 'Done') alert(result);
            })
            .catch((error) => alert(error));
        }}
      >
        登録
      </button>
    </div>
  );
};

export default CategoryForm;
