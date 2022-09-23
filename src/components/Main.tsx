import React, {useContext, useEffect, useState} from 'react';
import MobileSideBar from "./MobileSidebar/MobileSidebar";
import bars from "../images/bars_24.svg";
import {logoutType} from "./state/authReducer";
import CategoryArea from "./CategoryComponents/CategoryArea";
import UrlArea from "./UrlComponents/UrlArea";
import ConfigArea from "./ConfigComponents/ConfigArea";
import {AppContext} from "./state/ContextProvider";
import {firebaseSignOut, getAllCategories, getAllUrls} from "../firebase/firebase";
import {CategoryInfo, UrlInfo} from "./utilTypes";
import BaseButton from "./UrlComponents/Buttons/BaseButton";

type Props = {}

const Main: React.FC<Props> = () => {
  
  const {login, dispatch, setAllCategory, setAllUrl, isAnalysisMode, setIsAnalysisMode} = useContext(AppContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const logoutOnclick = async () => {
    await firebaseSignOut();
    localStorage.setItem('loginState', '');
    dispatch({type: logoutType})
  }

  // ログイン状態の変更でカテゴリとURLの各データを取得/消去する
  useEffect(() => {
    // useEffect内の非同期処理用関数/全データ取得してuseContextで管理
    const getAllData = async () => {
      try {
        const urls = await getAllUrls() as UrlInfo[];
        const categories = await getAllCategories() as CategoryInfo[];
        setAllUrl(urls);
        setAllCategory(categories.sort((a,b)=> a.category.localeCompare(b.category)));
      } catch (e) {
        alert(e)
      }
    };
    const cleanData2 = () => {
      setAllUrl([]);
      setAllCategory([]);
    }
    
    // ログインしているならデータを取得しにいく
    login && getAllData();
    
    return cleanData2; // クリーンアップ関数でページを閉じる際にデータを消去
  },[]);
  
  return (
    <>
      <MobileSideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      {/*スマホ用の固定ヘッダー*/}
      <div className="sticky top-0 z-10 py-2 bg-gray-50 lg:hidden shadow display-none">
        <img
          src={bars}
          className="h-8 inline-block ml-4 mr-4"
          alt=''
          onClick={() => setSidebarOpen(!sidebarOpen)}
        />
        <h2 className="inline-block w-5/12 m-1 text-3xl font-bold text-green-700 text-center">LBの図書館</h2>
        <BaseButton onClickCallback={logoutOnclick} name={'ログアウト'} />
        <BaseButton onClickCallback={()=> setIsAnalysisMode(!isAnalysisMode)} name={isAnalysisMode ? '蔵書室へ':'分析室へ'}  />
      </div>
      <div className="p-2 sm:py-0 flex justify-center">
        {/*表示左サイドバー：カテゴリリスト*/}
        <div className="hidden lg:block w-72 mr-3 ">
          <CategoryArea />
        </div>
        {/*表示メイン部分*/}
        { isAnalysisMode ? (
          '分析室'
        ):(
          <>
            <div className="w-full py-2 sm:w-3/5 lg:w-2/5 sm:py-1 sm:pl-6 sm:mr-6 lg:border-l border-gray-500 " >
              <UrlArea />
            </div>
            <div className="hidden sm:block w-80 pl-4 border-l border-gray-500 ">
              <ConfigArea />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Main;
