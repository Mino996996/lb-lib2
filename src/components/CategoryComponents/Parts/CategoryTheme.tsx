import React, { useContext, useState } from 'react';
import CategoryItem from './CategoryItem';
import { Theme, ThemeOption } from '../themeList';
import { AppContext } from '../../state/ContextProvider';

interface Props {
  themeOption: ThemeOption;
}

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

const initSetting = (theme: Theme): boolean => {
  switch (theme) {
    case Theme.genre:
      return localStorage.getItem('genre') != null
        ? !(localStorage.getItem('genre') == null)
        : localStorage.getItem('genre') === null;
    case Theme.member:
      return localStorage.getItem('member') != null
        ? !(localStorage.getItem('member') == null)
        : localStorage.getItem('member') === null;
    default:
      return true;
  }
};

export const CategoryTheme: React.FC<Props> = ({ themeOption }) => {
  const { allCategory } = useContext(AppContext);
  const [isOpen, setIsOpen] = useState<boolean>(initSetting(themeOption.value));

  return (
    <ul className="py-2 mr-2 border-b border-gray-600 border-dashed">
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
      {isOpen
        ? allCategory
            .filter((value) => value.theme === themeOption.value)
            .map((categoryInfo) => <CategoryItem key={categoryInfo.id} categoryInfo={categoryInfo} />)
        : ''}
    </ul>
  );
};
