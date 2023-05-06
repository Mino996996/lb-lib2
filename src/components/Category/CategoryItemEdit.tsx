import React, { useState } from 'react';
import { CategoryInfo } from '../../utils/utilTypes';
import { categoryDb, checkCategoryName, getAllCategories, getAllUrls } from '../../firebase/firebase';
import { useEventContext } from '../state/EventProvider';
import CategoryTextInput from './CategoryTextInput';
import CategorySelectInput from './CategorySelectInput';

interface Props {
  categoryInfo: CategoryInfo;
  setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const CategoryItemEdit: React.FC<Props> = ({ categoryInfo, setIsEditMode }) => {
  const { allCategory, setAllCategory, setAllEventLogs } = useEventContext();
  const [categoryName, setCategoryName] = useState(categoryInfo.category);
  const [theme, setTheme] = useState(categoryInfo.theme);
  const [points, setPoints] = useState(categoryInfo.point?.length != null ? String(categoryInfo.point) : String([0, 0, 0]));

  const updateCategory = async (): Promise<void> => {
    // 変化点の有無をチェック
    if (categoryInfo.category !== categoryName || categoryInfo.theme !== theme || String(categoryInfo.point) !== points) {
      const isUniqueName = await checkCategoryName(categoryName);
      const isUnique = isUniqueName || categoryInfo.theme !== theme || String(categoryInfo.point) !== points;
      if (categoryName !== '' && isUnique) {
        const categoryData: CategoryInfo = {
          id: categoryInfo.id,
          category: categoryName,
          theme,
          point: points.split(',').map((v) => Number(v)),
        };
        await categoryDb.update(categoryData);
        const newCategories = allCategory.filter((value) => value.category !== categoryInfo.category);
        newCategories.push(categoryData);
        setAllCategory([...newCategories.sort((a, b) => a.category.localeCompare(b.category))]);
        setIsEditMode(false);
      } else {
        if (!isUniqueName) {
          window.alert('すでにデータベースに登録されています');
          const newCateData = await getAllCategories();
          const newUrlData = await getAllUrls();
          setAllCategory(newCateData);
          setAllEventLogs([...newUrlData]);
        } else if (categoryName === '') {
          window.alert('未記入のため登録できません');
        } else {
          window.alert('分類先を選択してください');
        }
      }
    } else {
      setIsEditMode(false);
    }
  };

  // todo:inputのコンポーネント分離
  return (
    <div className="my-2 ml-2">
      <CategoryTextInput value={categoryName} setValue={setCategoryName} />
      <CategoryTextInput value={String(points)} setValue={setPoints} />
      <CategorySelectInput value={theme} setThemeType={setTheme} className={'w-6/12 bg-green-50 mt-1 mb-2 text-gray-700'} />
      <button
        className="ml-4 p-0.5 bg-green-100 rounded border border-gray-600 cursor-pointer text-sm text-gray-700"
        onClick={() => {
          updateCategory()
            .then()
            .catch((e) => alert(e));
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
