import React, { useContext } from 'react';
import BaseButton from '../UtilComponents/BaseButton';
import { firebaseSignOut } from '../../firebase/firebase';
import { logoutType } from '../state/authReducer';
import { ConfigContext } from '../state/ConfigProvider';

const CategoryHeader: React.FC = () => {
  const { dispatch, isAnalysisMode, setIsAnalysisMode } = useContext(ConfigContext);

  const logoutOnClick = async (): Promise<void> => {
    await firebaseSignOut();
    localStorage.setItem('loginState', '');
    dispatch({ type: logoutType });
  };

  const logoutEvent = (): void => {
    logoutOnClick()
      .then()
      .catch((error) => alert(error));
  };

  return (
    <div className="pt-2 pb-4 text-center hidden lg:block">
      <h2 className="m-1 pt-2 text-3xl font-bold text-green-400">LBの図書館</h2>
      <BaseButton onClickCallback={logoutEvent} name={'ログアウト'} />
      <BaseButton onClickCallback={() => setIsAnalysisMode(!isAnalysisMode)} name={isAnalysisMode ? '蔵書室へ' : '分析室へ'} />
    </div>
  );
};

export default CategoryHeader;
