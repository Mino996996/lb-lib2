import React, {useContext} from 'react';
import {AppContext} from "../state/ContextProvider";
import CategoryForm from "./Parts/CategoryForm";
import {firebaseSignOut} from "../../firebase/firebase";
import {logoutType} from "../state/authReducer";
import {Theme, themeOptions} from "./themeList";
import {CategoryTheme} from "./Parts/CategoryTheme";

type Props = {
}

const CategoryArea: React.FC<Props> = () => {

  const {dispatch, isAnalysisMode, setIsAnalysisMode} = useContext(AppContext);

  return (
    <div className="relative w-full text-gray-400 focus-within:text-gray-600 pr-2 sm:pt-4 min-h-screen">
      <div className="pt-2 pb-4 text-center hidden lg:block">
        <h2 className="m-1 pt-2 text-3xl font-bold text-green-400">LBの図書館</h2>
        <button
          className="px-2 bg-green-50 rounded border border-gray-400 text-sm text-gray-700"
          onClick={async ()=>{
            await firebaseSignOut();
            localStorage.setItem('loginState', '');
            dispatch({type: logoutType})}}
        >
          ログアウト
        </button>
        <button
          className="px-2 bg-green-50 rounded border border-gray-400 text-sm text-gray-700"
          onClick={()=> setIsAnalysisMode(!isAnalysisMode)}
        >
          {isAnalysisMode ? '蔵書室へ':'分析室へ'}
        </button>
      </div>

      <h2 className="text-center text-xl text-red-300 font-bold hidden sm:block">= メインカテゴリ =</h2>
      <div className="overflow-y-scroll edit-scrollbar category-height">
        {themeOptions.map(themeOption => (
          themeOption.value === Theme.unselected ? (
            ''
          ):(
            <CategoryTheme key={themeOption.value} themeOption={themeOption} />
          )
        ))}
      </div>

      <div className="absolute bottom-12 lg:bottom-0 w-full">
        <CategoryForm />
      </div>
    </div>
  );
};

export default CategoryArea;
