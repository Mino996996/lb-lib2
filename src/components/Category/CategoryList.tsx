import React, { memo, useState } from 'react';
import CategoryItemAndEdit from './CategoryItemAndEdit';
import { ThemeOption } from './themeList';
import { useEventContext } from '../state/EventProvider';
import CategoryListToggle from './CategoryListToggle';
import { initSetting } from './categoryUtils';

interface Props {
  themeOption: ThemeOption;
}

// 該当カテゴリ一覧の表示
const CategoryList: React.FC<Props> = ({ themeOption }) => {
  const { allCategory } = useEventContext();
  const [isOpen, setIsOpen] = useState<boolean>(initSetting(themeOption.value));

  return (
    <ul className="py-2 mr-2 border-b border-gray-600 border-dashed">
      <CategoryListToggle isOpen={isOpen} setIsOpen={setIsOpen} themeOption={themeOption} />
      {isOpen && allCategory.filter((value) => value.theme === themeOption.value).map((categoryInfo) => <CategoryItemAndEdit key={categoryInfo.id} categoryInfo={categoryInfo} />)}
    </ul>
  );
};

export default memo(CategoryList);
