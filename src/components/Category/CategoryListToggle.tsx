import React from 'react';
import { Theme, ThemeOption } from './themeList';

// todo: move
const setLocalStorage = (theme: Theme, isOpen: boolean): void => {
  switch (theme) {
    case Theme.genre:
      isOpen ? localStorage.setItem('genre', 'true') : localStorage.setItem('genre', '');
      break;
    case Theme.member:
      isOpen ? localStorage.setItem('member', 'true') : localStorage.setItem('member', '');
      break;
  }
};

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
        setLocalStorage(themeOption.value, !isOpen);
        setIsOpen(!isOpen);
      }}
    >
      {themeOption.text}
      <span className="ml-4">{isOpen ? '-' : '+'}</span>
    </p>
  );
};

export default CategoryListToggle;