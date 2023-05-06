import React from 'react';
import { themeOptions } from './themeList';
import { CategoryType } from '../../utils/utilTypes';

interface props {
  value: CategoryType;
  setThemeType: React.Dispatch<React.SetStateAction<CategoryType>>;
}

const CategorySelectInput: React.FC<props> = ({ value, setThemeType }) => {
  return (
    <select
      className="w-6/12 bg-green-50 mt-1 mb-2 text-gray-700"
      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
        setThemeType(Number(e.target.value));
      }}
      value={value}
    >
      {themeOptions.map((themeOption) => (
        <option key={themeOption.value} value={themeOption.value}>
          {themeOption.text}
        </option>
      ))}
    </select>
  );
};

export default CategorySelectInput;
