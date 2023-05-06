import React from 'react';
import { CategoryInfo, EventLog } from '../../utils/utilTypes';
import { categoryDb } from '../../firebase/firebase';
import { useConfigContext } from '../state/ConfigProvider';
import { useEventContext } from '../state/EventProvider';

interface Props {
  categoryInfo: CategoryInfo;
  setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>;
}

// todo: ロジックファイルに移動する
const hitCounts = (urlInfos: EventLog[], categoryInfo: CategoryInfo): number => {
  return urlInfos.filter((value) => value.tagList.includes(categoryInfo.category)).length;
};

// カテゴリ名と編集ボタン込みのコンポーネント
const CategoryItem: React.FC<Props> = ({ categoryInfo, setIsEditMode }) => {
  const { selectedCategory, setSelectedCategory, setKeywords } = useConfigContext();
  const { allCategory, setAllCategory, allEventLogs } = useEventContext();

  const selectCategory = (category: string): void => {
    if (selectedCategory !== category) {
      setSelectedCategory(category);
      setKeywords([]);
      localStorage.setItem('category', category);
      localStorage.setItem('keyword', '');
    }
  };

  const deleteCategory = (categoryInfo: CategoryInfo): void => {
    if (window.confirm(`カテゴリから "${categoryInfo.category}" を削除しますか？`)) {
      categoryDb
        .delete(categoryInfo)
        .then(() => {
          setAllCategory([...allCategory.filter((value) => value.id !== categoryInfo.id)]);
        })
        .catch((e) => alert(e));
    }
  };

  return (
    <li className={'text-white mr-2 flex justify-between ' + (categoryInfo.category === selectedCategory ? 'bg-gray-600 rounded' : '')}>
      <span className="ml-2 font-bold text-sm cursor-pointer w-40 overflow-hidden" onClick={() => selectCategory(categoryInfo.category)}>
        # {categoryInfo.category} ({hitCounts(allEventLogs, categoryInfo)})
      </span>
      <span className="ml-auto pt-0.5 mr-2.5 text-sm text-gray-400 cursor-pointer" onClick={() => setIsEditMode(true)}>
        [編集]
      </span>
      <span className="pt-0.5 mr-2 text-sm text-gray-400 cursor-pointer" onClick={() => deleteCategory(categoryInfo)}>
        [x]
      </span>
    </li>
  );
};

export default CategoryItem;
