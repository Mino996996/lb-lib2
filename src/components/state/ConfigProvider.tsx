import React, { createContext, Dispatch, ReactNode, useContext, useReducer, useState } from 'react';
import authReducer, { AuthAction } from './authReducer';
import { CategoryInfo, EventLog } from '../utilTypes';
import { checkHasBoolean, checkSelectedCategory, checkSelectedKeywords } from '../../utils/utilFinctions';

interface ConfigContextType {
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
  asc: boolean;
  setAsc: React.Dispatch<React.SetStateAction<boolean>>;
  isAnalysisMode: boolean;
  setIsAnalysisMode: React.Dispatch<React.SetStateAction<boolean>>;
}

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
export const ConfigContext = createContext({} as ConfigContextType);

interface Props {
  children: ReactNode;
}

export const ConfigProvider: React.FC<Props> = ({ children }) => {
  const _keywords = localStorage.getItem('keyword');
  const _imageVisible = localStorage.getItem('image');
  const _memoVisible = localStorage.getItem('memo');
  const _selectedCategory = localStorage.getItem('category');
  const _asc = localStorage.getItem('asc');

  const [authState, dispatch] = useReducer(authReducer.reducer, authReducer.initialState);
  const [imageVisible, setImageVisible] = useState(checkHasBoolean(_imageVisible));
  const [memoVisible, setMemoVisible] = useState(checkHasBoolean(_memoVisible));
  const [asc, setAsc] = useState(checkHasBoolean(_asc));
  const [keywords, setKeywords] = useState<string[]>(checkSelectedKeywords(_keywords));
  const [selectedCategory, setSelectedCategory] = useState(checkSelectedCategory(_selectedCategory));
  const [isAnalysisMode, setIsAnalysisMode] = useState(false);

  const value: ConfigContextType = {
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
    asc,
    setAsc,
    isAnalysisMode,
    setIsAnalysisMode,
  };

  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>;
};

export const useConfigContext = (): ConfigContextType => useContext(ConfigContext);
