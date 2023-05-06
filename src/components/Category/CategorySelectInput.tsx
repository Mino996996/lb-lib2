import React from 'react';
import { themeOptions } from './themeList';
import { CategoryType } from '../../utils/utilTypes';

interface props {
  className: string;
  value: CategoryType;
  setThemeType: React.Dispatch<React.SetStateAction<CategoryType>>;
}

const CategorySelectInput: React.FC<props> = ({ value, setThemeType, className }) => {
  return (
    <select
      className={className}
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
