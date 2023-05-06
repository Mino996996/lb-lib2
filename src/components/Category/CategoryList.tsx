import React, { useState } from 'react';
import CategoryItemAndEdit from './CategoryItemAndEdit';
import { ThemeOption } from './themeList';
import { useEventContext } from '../state/EventProvider';
import CategoryListToggle from './CategoryListToggle';
import { CategoryType } from '../../utils/utilTypes';

interface Props {
  themeOption: ThemeOption;
}

// todo:move
const initSetting = (theme: CategoryType): boolean => {
  switch (theme) {
    case CategoryType.genre:
      return localStorage.getItem('genre') != null ? !(localStorage.getItem('genre') == null) : localStorage.getItem('genre') === null;
    case CategoryType.member:
      return localStorage.getItem('member') != null ? !(localStorage.getItem('member') == null) : localStorage.getItem('member') === null;
    default:
      return true;
  }
};

export const CategoryList: React.FC<Props> = ({ themeOption }) => {
  const { allCategory } = useEventContext();
  const [isOpen, setIsOpen] = useState<boolean>(initSetting(themeOption.value));

  return (
    <ul className="py-2 mr-2 border-b border-gray-600 border-dashed">
      <CategoryListToggle isOpen={isOpen} setIsOpen={setIsOpen} themeOption={themeOption} />
      {/* 該当カテゴリのリスト一覧 */}
      {isOpen && allCategory.filter((value) => value.theme === themeOption.value).map((categoryInfo) => <CategoryItemAndEdit key={categoryInfo.id} categoryInfo={categoryInfo} />)}
    </ul>
  );
};
