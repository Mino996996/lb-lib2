import React from 'react';
import bars from '../../images/bars_24.svg';
import BaseButton from '../EventComponents/Buttons/BaseButton';
import { firebaseSignOut } from '../../firebase/firebase';
import { logoutType } from '../state/authReducer';
import { useConfigContext } from '../state/ConfigProvider';

interface Props {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const MobileHeader: React.FC<Props> = ({ sidebarOpen, setSidebarOpen }) => {
  const { dispatch, isAnalysisMode, setIsAnalysisMode } = useConfigContext();
  const logoutOnClick = (): void => {
    firebaseSignOut()
      .then(() => {
        localStorage.setItem('loginState', '');
        dispatch({ type: logoutType });
      })
      .catch((error) => alert(error));
  };

  return (
    <div className="sticky top-0 z-10 py-2 bg-gray-50 lg:hidden shadow display-none">
      <img src={bars} className="h-8 inline-block ml-4 mr-4" alt="" onClick={() => setSidebarOpen(!sidebarOpen)} />
      <h2 className="inline-block w-5/12 m-1 text-3xl font-bold text-green-700 text-center">LBの図書館</h2>
      <BaseButton onClickCallback={logoutOnClick} name={'ログアウト'} />
      <BaseButton
        onClickCallback={() => setIsAnalysisMode(!isAnalysisMode)}
        name={isAnalysisMode ? '蔵書室へ' : '分析室へ'}
      />
      {/* <BaseButton onClickCallback={()=> saveAsJson(allUrl, 'urls')} name={'発表データ出力'}  /> */}
      {/* <BaseButton onClickCallback={()=> saveAsJson(allCategory, 'categories')} name={'カテゴリデータ出力'}  /> */}
    </div>
  );
};

export default MobileHeader;
