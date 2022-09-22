import React, {createContext, Dispatch, ReactNode, useReducer, useState} from 'react';
import authReducer, {AuthAction} from './authReducer';
import {CategoryInfo, UrlInfo} from "../utilTypes";

interface AppContextType {
  login: boolean;
  dispatch: Dispatch<AuthAction>;
  imageVisible: boolean;
  setImageVisible: React.Dispatch<React.SetStateAction<boolean>>;
  memoVisible: boolean;
  setMemoVisible: React.Dispatch<React.SetStateAction<boolean>>;
  keywords: string[];
  setKeywords: React.Dispatch<React.SetStateAction<string[]>>;
  selectedCategory: string;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
  allCategory: CategoryInfo[];
  setAllCategory: React.Dispatch<React.SetStateAction<CategoryInfo[]>>;
  allUrl: UrlInfo[];
  setAllUrl: React.Dispatch<React.SetStateAction<UrlInfo[]>>;
  asc: boolean;
  setAsc: React.Dispatch<React.SetStateAction<boolean>>;
  isAnalysisMode: boolean,
  setIsAnalysisMode: React.Dispatch<React.SetStateAction<boolean>>
}

export const AppContext = createContext({} as AppContextType);

type Props = {
  children: ReactNode
}

export const ContextProvider: React.VFC<Props> = (props) => {

  const savedKeywords = localStorage.getItem('keyword') ? JSON.parse(localStorage.getItem('keyword')!) as string[] : [];
  const [authState, dispatch] = useReducer(authReducer.reducer, authReducer.initialState);
  const [imageVisible, setImageVisible] = useState(localStorage.getItem('image') === null ? true : !!localStorage.getItem('image'));
  const [memoVisible, setMemoVisible] = useState(localStorage.getItem('memo') === null ? true : !!localStorage.getItem('memo'));
  const [asc, setAsc] = useState(!!localStorage.getItem('asc'));
  const [keywords, setKeywords] = useState<string[]>(savedKeywords);
  const [selectedCategory, setSelectedCategory] = useState(localStorage.getItem('category')? localStorage.getItem('category')! : '');
  const [allCategory, setAllCategory] = useState<CategoryInfo[]>([]);
  const [allUrl, setAllUrl] = useState<UrlInfo[]>([]);
  const [isAnalysisMode, setIsAnalysisMode] = useState(false);

  const value: AppContextType = {
    login: authState.isLogin,
    dispatch: dispatch,
    imageVisible: imageVisible,
    setImageVisible: setImageVisible,
    memoVisible: memoVisible,
    setMemoVisible: setMemoVisible,
    keywords: keywords,
    setKeywords: setKeywords,
    selectedCategory: selectedCategory,
    setSelectedCategory: setSelectedCategory,
    allCategory: allCategory,
    setAllCategory: setAllCategory,
    allUrl: allUrl,
    setAllUrl: setAllUrl,
    asc: asc,
    setAsc: setAsc,
    isAnalysisMode: isAnalysisMode,
    setIsAnalysisMode: setIsAnalysisMode
  }

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

