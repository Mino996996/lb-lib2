import React, { useContext } from 'react';
import { ConfigContext } from '../state/ConfigProvider';
import CategoryForm from './CategoryForm';
import { firebaseSignOut } from '../../firebase/firebase';
import { logoutType } from '../state/authReducer';
import { Theme, themeOptions } from './themeList';
import { CategoryTheme } from './CategoryTheme';
import BaseButton from '../UtilComponents/BaseButton';

const CategoryAreaFC: React.FC = () => {
  const { dispatch, isAnalysisMode, setIsAnalysisMode } = useContext(ConfigContext);
  const logoutOnClick = async (): Promise<void> => {
    await firebaseSignOut();
    localStorage.setItem('loginState', '');
    dispatch({ type: logoutType });
  };

  return (
    <div className="relative w-full text-gray-400 focus-within:text-gray-600 pr-2 sm:pt-4 min-h-screen">
      {/* 左サイドバー用のヘッド部分 */}
      <div className="pt-2 pb-4 text-center hidden lg:block">
        <h2 className="m-1 pt-2 text-3xl font-bold text-green-400">LBの図書館</h2>
        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <BaseButton onClickCallback={logoutOnClick} name={'ログアウト'} />
        <BaseButton onClickCallback={() => setIsAnalysisMode(!isAnalysisMode)} name={isAnalysisMode ? '蔵書室へ' : '分析室へ'} />
      </div>
      {/* カテゴリのテーマ別リスト表示 */}
      <h2 className="text-center text-xl text-red-300 font-bold hidden sm:block">= メインカテゴリ =</h2>
      <div className="overflow-y-scroll edit-scrollbar category-height">
        {themeOptions.map((themeOption) => (themeOption.value === Theme.unselected ? '' : <CategoryTheme key={themeOption.value} themeOption={themeOption} />))}
      </div>
      {/* カテゴリ追加フォーム */}
      <div className="absolute bottom-12 lg:bottom-0 w-full">
        <CategoryForm />
      </div>
    </div>
  );
};

const CategoryArea = React.memo(CategoryAreaFC);
export default CategoryArea;
