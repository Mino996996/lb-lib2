import React, { useState } from 'react';
import { CategoryInfo } from '../utilTypes';
import CategoryList from './CategoryList';
import CategoryListEdit from './CategoryListEdit';

interface Props {
  categoryInfo: CategoryInfo;
}

const CategoryItem: React.FC<Props> = ({ categoryInfo }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  return (
    <>{isEditMode ? <CategoryListEdit categoryInfo={categoryInfo} setIsEditMode={setIsEditMode} /> : <CategoryList categoryInfo={categoryInfo} setIsEditMode={setIsEditMode} />}</>
  );
};

export default CategoryItem;
