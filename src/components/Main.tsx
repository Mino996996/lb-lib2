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

type Props = {}

const Main: React.VFC<Props> = (props) => {
  
  const {login, dispatch, setAllCategory, setAllUrl} = useContext(AppContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // ログイン状態の変更でカテゴリとURLの各データを取得/消去する
  useEffect(() => {
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
    login && getAllData(); // ログインしているならデータを取得しにいく
    
    return cleanData2; // クリーンアップ関数でページを閉じる際にデータを消去
  },[]);
  
  return (
    <>
      <MobileSideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="sticky top-0 z-10 py-2 bg-gray-50 lg:hidden shadow display-none">
        <img
          src={bars}
          className="h-8 inline-block ml-4 mr-4"
          alt=''
          onClick={() => setSidebarOpen(!sidebarOpen)}
        />
        <h2 className="m-1 pt-2 text-3xl font-bold text-green-400">LBの図書館</h2>
        <button
          className="ml-6 px-2 bg-gray-200 rounded border border-gray-400 text-sm"
          onClick={async ()=>{
            await firebaseSignOut();
            localStorage.setItem('loginState', '');
            dispatch({type: logoutType})}}
        >
          ログアウト
        </button>
      </div>
      <div className="p-2 sm:py-0 flex justify-center">
        <div className="hidden lg:block w-72 mr-3 ">
          <CategoryArea />
        </div>
        <div className="w-full py-2 sm:w-3/5 lg:w-2/5 sm:py-1 sm:pl-6 sm:mr-6 lg:border-l border-gray-500 " >
          <UrlArea />
        </div>
        <div className="hidden sm:block w-80 pl-4 border-l border-gray-500 ">
          <ConfigArea />
        </div>
      </div>
    </>
  );
};

export default Main;
