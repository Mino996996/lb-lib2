import React, { useEffect, useState } from 'react';
import MobileSideBar from './Mobile/MobileSidebar';
import Category from './Category/Category';
import EventArea from './EventComponents/EventArea';
import Config from './Config/Config';
import { useConfigContext } from './state/ConfigProvider';
import MobileHeader from './Mobile/MobileHeader';
import { useEventContext } from './state/EventProvider';
import AnalysisRoom from './AnalisysRoom/AnalysisRoom';

const Articles: React.FC = () => {
  return (
    <>
      <div className="w-full py-2 sm:w-3/5 lg:w-2/5 sm:py-1 sm:pl-6 sm:mr-6 lg:border-l border-gray-500 ">
        <EventArea />
      </div>
      <div className="hidden sm:block w-80 pl-4 border-l border-gray-500 ">
        <Config />
      </div>
    </>
  );
};

const Main: React.FC = () => {
  const { login, isAnalysisMode } = useConfigContext();
  const { setAllCategory, setAllEventLogs, fetchEventsAndCategories } = useEventContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 各データの取得/消去管理
  useEffect(() => {
    const getAllData = (): void => {
      fetchEventsAndCategories()
        .then()
        .catch((e) => alert(e));
    };
    // ログインしているならデータを取得しにいく
    login && getAllData();

    return () => {
      // ログアウト時に画面が消えるのでその際にデータを消去
      setAllEventLogs([]);
      setAllCategory([]);
    };
  }, []);

  return (
    <>
      {isAnalysisMode ? (
        <AnalysisRoom />
      ) : (
        <>
          <MobileSideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <MobileHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <div className="p-2 sm:py-0 flex justify-center">
            <div className="hidden lg:block w-72 mr-3 ">
              <Category />
            </div>
            <Articles />
          </div>
        </>
      )}
    </>
  );
};

export default Main;
