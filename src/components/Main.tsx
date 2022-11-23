import React, { useEffect, useState } from 'react';
import MobileSideBar from './Mobile/MobileSidebar';
import CategoryArea from './CategoryComponents/CategoryArea';
import UrlArea from './UrlComponents/UrlArea';
import ConfigArea from './ConfigComponents/ConfigArea';
import { useConfigContext } from './state/ConfigProvider';
import { getAllCategories, getAllUrls } from '../firebase/firebase';
// import Graph3D from './AnalisysComponents/Graph3D'
// import GraphTest from './AnalisysComponents/GraphTest'
import GraphViolin from './AnalisysComponents/GraphViolin';
import MobileHeader from './Mobile/MobileHeader';

// const saveAsJson = (data: any, fileName: string) => {
//   const name = `${fileName}.json`;
//   const blobData = new Blob([JSON.stringify(data)], { type: 'text/json' });
//   const jsonURL = window.URL.createObjectURL(blobData);
//   const link = document.createElement('a');
//   document.body.appendChild(link);
//   link.href = jsonURL;
//   link.setAttribute('download', name);
//   link.click();
//   document.body.removeChild(link);
// }

const Articles: React.FC = () => {
  return (
    <>
      <div className="w-full py-2 sm:w-3/5 lg:w-2/5 sm:py-1 sm:pl-6 sm:mr-6 lg:border-l border-gray-500 ">
        <UrlArea />
      </div>
      <div className="hidden sm:block w-80 pl-4 border-l border-gray-500 ">
        <ConfigArea />
      </div>
    </>
  );
};

const Main: React.FC = () => {
  const { login, setAllCategory, setAllUrl, isAnalysisMode } = useConfigContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 各データの取得/消去管理
  useEffect(() => {
    const getAllData = (): void => {
      Promise.all([getAllUrls(), getAllCategories()])
        .then((value) => {
          setAllUrl(value[0]);
          setAllCategory(value[1].sort((a, b) => a.category.localeCompare(b.category)));
        })
        .catch((e) => alert(e));
    };
    login && getAllData(); // ログインしているならデータを取得しにいく

    return () => {
      // ログアウト時に画面が消えるのでその際にデータを消去
      setAllUrl([]);
      setAllCategory([]);
    };
  }, []);

  return (
    <>
      <MobileSideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <MobileHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="p-2 sm:py-0 flex justify-center">
        <div className="hidden lg:block w-72 mr-3 ">
          <CategoryArea />
        </div>
        {isAnalysisMode ? <GraphViolin /> : <Articles />}
      </div>
    </>
  );
};

export default Main;
