import React, {useContext, useState} from 'react';
import {AppContext} from "../../state/ContextProvider";
import {CategoryInfo, UrlInfo} from "../../utilTypes";
import {categoryDb, checkCategoryName, getAllCategories, getAllUrls} from "../../../firebase/firebase";
import {themeOptions} from "../themeList";

type Props = {
  categoryInfo: CategoryInfo;
  isEditMode: boolean;
  setIsEditMode : React.Dispatch<React.SetStateAction<boolean>>
}

const CategoryListEdit: React.VFC<Props> = ({categoryInfo, isEditMode, setIsEditMode}) => {
  
  const {allCategory, setAllCategory, setAllUrl} = useContext(AppContext);
  const [categoryName, setCategoryName] = useState(categoryInfo.category);
  const [theme, setTheme] = useState(categoryInfo.theme);
  
  const updateCategory = async () => {
    if (categoryInfo.category !== categoryName) {
      const isUniqueName = await checkCategoryName(categoryName);
      if(categoryName && isUniqueName && !!theme) {
        const categoryData: CategoryInfo = {
          id: categoryInfo.id,
          category: categoryName,
          theme
        }
        await categoryDb.update(categoryData);
        const newCategories = allCategory.filter(value => value.category !== categoryInfo.category)
        newCategories.push(categoryData);
        setAllCategory([...newCategories.sort((a, b)=>a.category.localeCompare(b.category))]);
        setIsEditMode(false);
      } else {
        if(!isUniqueName) {
          window.alert('すでにデータベースに登録されています');
          const newCateData = await getAllCategories() as CategoryInfo[];
          const newUrlData = await getAllUrls() as UrlInfo[];
          setAllCategory(newCateData);
          setAllUrl([...newUrlData]);
        } else if(!categoryName) {
          window.alert('未記入のため登録できません');
        } else {
          window.alert('分類先を選択してください');
        }
      }
    } else {
      setIsEditMode(false);
    }
  }
  
  return (
    <div className="my-2 ml-2">
      <input
        className="bg-green-50 w-11/12 pl-2 mb-1 border border-gray-500 rounded text-gray-700"
        type="text"
        value={categoryName}
        onChange={(e:React.ChangeEvent<HTMLInputElement>)=>{
          setCategoryName(e.target.value);
        }}
      />
      <select
        className="w-6/12 bg-green-50 mt-1 mb-2 text-gray-700"
        onChange={(e:React.ChangeEvent<HTMLSelectElement>)=>{setTheme(Number(e.target.value))}}
        value={theme}
      >
        {themeOptions.map(themeOption=>(
          <option key={themeOption.value} value={themeOption.value}>{themeOption.text}</option>
        ))}
      </select>
      <button className="ml-4 p-0.5 bg-green-100 rounded border border-gray-600 cursor-pointer text-sm text-gray-700" onClick={async() => updateCategory()}>
        更新
      </button>
      <button className="ml-4 p-0.5 bg-gray-200 rounded border border-gray-600 cursor-pointer text-sm text-gray-700" onClick={() => setIsEditMode(false)}>
        閉じる
      </button>
    </div>
  );
};

export default CategoryListEdit;
