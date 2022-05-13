import React, {useContext} from 'react';
import {AppContext} from "../state/ContextProvider";
import CategoryForm from "./Parts/CategoryForm";
import logo from "../../images/ROBOSHIN_icon_1.svg";
import {firebaseSignOut} from "../../firebase/firebase";
import {logoutType} from "../state/authReducer";
import {Theme, themeOptions} from "./themeList";
import {CategoryTheme} from "./Parts/CategoryTheme";

type Props = {}

const CategoryArea: React.VFC<Props> = () => {

  const {dispatch} = useContext(AppContext);

  return (
    <div className="relative w-full text-gray-400 focus-within:text-gray-600 pr-2 pt-4 min-h-screen">
      <div className="pt-2 pb-4 text-center">
        {/*<div className="py-1 bg-gray-100 rounded-md">*/}
        {/*  <img src={logo} className="h-8 inline-block" alt=""/>*/}
        {/*</div>*/}
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
      </div>

      <h2 className="text-center text-xl text-red-300 font-bold ">= メインカテゴリ =</h2>
      <div className="overflow-y-scroll edit-scrollbar " style={{height: '62vh'}} >
        {themeOptions.map(themeOption => (
          themeOption.value === Theme.unselected ? (
            ''
          ):(
            <CategoryTheme key={themeOption.value} themeOption={themeOption} />
          )
        ))}
      </div>

      <div className="absolute bottom-0 w-full">
        <CategoryForm />
      </div>
    </div>
  );
};

export default CategoryArea;
