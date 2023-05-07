import React, { useState } from 'react';
import { CategoryInfo, CategoryType } from '../../utils/utilTypes';
import { categoryDb, checkCategoryName } from '../../firebase/firebase';
import { useEventContext } from '../state/EventProvider';
import CategoryTextInput from './CategoryTextInput';
import CategorySelectInput from './CategorySelectInput';
import { validateOnUpdateCategory } from './categoryUtils';

interface Props {
  categoryInfo: CategoryInfo;
  setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const CategoryItemEdit: React.FC<Props> = ({ categoryInfo, setIsEditMode }) => {
  const { allCategory, setAllCategory } = useEventContext();
  const [categoryName, setCategoryName] = useState(categoryInfo.category);
  const [categoryType, setCategoryType] = useState(categoryInfo.theme);
  const [points, setPoints] = useState(categoryInfo.point?.length != null ? String(categoryInfo.point) : String([0, 0, 0]));

  const updateCategory = async (): Promise<void> => {
    try {
      const isUniqueName = await checkCategoryName(categoryName);
      validateOnUpdateCategory(categoryInfo, isUniqueName, categoryName, categoryType, points);
      const categoryData: CategoryInfo = {
        id: categoryInfo.id,
        category: categoryName,
        theme: categoryType,
        point: points.split(',').map((v) => Number(v)),
      };
      await categoryDb.update(categoryData);
      const newCategories = allCategory.filter((value) => value.category !== categoryInfo.category);
      newCategories.push(categoryData);
      setAllCategory([...newCategories.sort((a, b) => a.category.localeCompare(b.category))]);
    } catch (error) {
      throw new Error(String(error));
    }
  };

  return (
    <div className="my-2 ml-2">
      <CategoryTextInput value={categoryName} setValue={setCategoryName} />
      {categoryInfo.theme === CategoryType.genre && <CategoryTextInput value={String(points)} setValue={setPoints} />}
      <CategorySelectInput value={categoryType} setThemeType={setCategoryType} className={'w-6/12 bg-green-50 mt-1 mb-2 text-gray-700'} />
      <button
        className="ml-4 p-0.5 bg-green-100 rounded border border-gray-600 cursor-pointer text-sm text-gray-700"
        onClick={() => {
          updateCategory()
            .then(() => alert('更新完了しました'))
            .catch((e) => alert(e));
          setIsEditMode(false);
        }}
      >
        更新
      </button>
      <button className="ml-4 p-0.5 bg-gray-200 rounded border border-gray-600 cursor-pointer text-sm text-gray-700" onClick={() => setIsEditMode(false)}>
        閉じる
      </button>
    </div>
  );
};

export default CategoryItemEdit;
