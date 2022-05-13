import React, {useContext, useEffect, useState} from 'react';
import MobileSideBar from "./MobileSidebar/MobileSidebar";
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
      <div className="p-2 sm:py-0 flex justify-center">
        <div className="hidden sm:block w-72 mr-3 ">
          <CategoryArea />
        </div>
        <div className="w-full sm:py-1 sm:w-2/5 pl-6 mr-6 border-l border-gray-500 " >
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
