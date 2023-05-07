import React, { useState } from 'react';
import { CategoryInfo } from '../../utils/utilTypes';
import CategoryItem from './CategoryItem';
import CategoryItemEdit from './CategoryItemEdit';

interface Props {
  categoryInfo: CategoryInfo;
}

// カテゴリ名表示と編集コンポーネントを切り替える
const CategoryItemAndEdit: React.FC<Props> = ({ categoryInfo }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  return (
    <>
      {
        // prettier-ignore
        isEditMode
        ? <CategoryItemEdit categoryInfo={categoryInfo} setIsEditMode={setIsEditMode} />
        : <CategoryItem categoryInfo={categoryInfo} setIsEditMode={setIsEditMode} />
      }
    </>
  );
};

export default CategoryItemAndEdit;
