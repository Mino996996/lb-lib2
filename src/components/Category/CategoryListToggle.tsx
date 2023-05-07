import React from 'react';
import { ThemeOption } from './themeList';
import { setIsOpenListOfLocalStorage } from './categoryUtils';

interface props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  themeOption: ThemeOption;
}

export const CategoryListToggle: React.FC<props> = ({ isOpen, setIsOpen, themeOption }) => {
  return (
    <p
      className={isOpen ? 'mb-2 text-red-200 font-bold' : 'text-gray-200'}
      onClick={() => {
        setIsOpenListOfLocalStorage(themeOption.value, !isOpen);
        setIsOpen(!isOpen);
      }}
    >
      {themeOption.text}
      <span className="ml-4">{isOpen ? '-' : '+'}</span>
    </p>
  );
};

export default CategoryListToggle;
