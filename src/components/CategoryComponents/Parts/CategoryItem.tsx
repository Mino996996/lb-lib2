import React, {useState} from 'react';
import {CategoryInfo} from "../../utilTypes";
import CategoryList from "./CategoryList";
import CategoryListEdit from "./CategoryListEdit";

type Props = {
  categoryInfo: CategoryInfo;
}

const CategoryItem: React.VFC<Props> = ({categoryInfo}) => {
  
  const [isEditMode, setIsEditMode] = useState(false);
  
  return (
    <>
    {isEditMode ? (
      <CategoryListEdit categoryInfo={categoryInfo} isEditMode={isEditMode} setIsEditMode={setIsEditMode} />
    ):(
      <CategoryList categoryInfo={categoryInfo} isEditMode={isEditMode} setIsEditMode={setIsEditMode} />
    )}
    </>
  );
};

export default CategoryItem;
