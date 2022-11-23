import React, { createContext, Dispatch, ReactNode, useContext, useReducer, useState } from 'react';
import authReducer, { AuthAction } from './authReducer';
import { CategoryInfo, UrlInfo } from '../utilTypes';
import { checkHasBoolean, checkSelectedCategory, checkSelectedKeywords } from '../../utils/utilFinctions';

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
  isAnalysisMode: boolean;
  setIsAnalysisMode: React.Dispatch<React.SetStateAction<boolean>>;
}

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
export const AppContext = createContext({} as AppContextType);

interface Props {
  children: ReactNode;
}

export const ConfigProvider: React.FC<Props> = ({ children }) => {
  const _keywords = localStorage.getItem('keyword');
  const _imageVisible = localStorage.getItem('image');
  const _memoVisible = localStorage.getItem('memo');
  const _selectedCategory = localStorage.getItem('category');
  const _asc = localStorage.getItem('asc');

  const savedKeywords = checkSelectedKeywords(_keywords);
  const [authState, dispatch] = useReducer(authReducer.reducer, authReducer.initialState);
  const [imageVisible, setImageVisible] = useState(checkHasBoolean(_imageVisible));
  const [memoVisible, setMemoVisible] = useState(checkHasBoolean(_memoVisible));
  const [asc, setAsc] = useState(checkHasBoolean(_asc));
  const [keywords, setKeywords] = useState<string[]>(savedKeywords);
  const [selectedCategory, setSelectedCategory] = useState(checkSelectedCategory(_selectedCategory));
  const [allCategory, setAllCategory] = useState<CategoryInfo[]>([]);
  const [allUrl, setAllUrl] = useState<UrlInfo[]>([]);
  const [isAnalysisMode, setIsAnalysisMode] = useState(false);

  const value: AppContextType = {
    login: authState.isLogin,
    dispatch,
    imageVisible,
    setImageVisible,
    memoVisible,
    setMemoVisible,
    keywords,
    setKeywords,
    selectedCategory,
    setSelectedCategory,
    allCategory,
    setAllCategory,
    allUrl,
    setAllUrl,
    asc,
    setAsc,
    isAnalysisMode,
    setIsAnalysisMode,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useConfigContext = (): AppContextType => useContext(AppContext);
