import React, { createContext, Dispatch, ReactNode, useReducer, useState } from 'react'
import authReducer, { AuthAction } from './authReducer'
import { CategoryInfo, UrlInfo } from '../utilTypes'

interface AppContextType {
  login: boolean
  dispatch: Dispatch<AuthAction>
  imageVisible: boolean
  setImageVisible: React.Dispatch<React.SetStateAction<boolean>>
  memoVisible: boolean
  setMemoVisible: React.Dispatch<React.SetStateAction<boolean>>
  keywords: string[]
  setKeywords: React.Dispatch<React.SetStateAction<string[]>>
  selectedCategory: string
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>
  allCategory: CategoryInfo[]
  setAllCategory: React.Dispatch<React.SetStateAction<CategoryInfo[]>>
  allUrl: UrlInfo[]
  setAllUrl: React.Dispatch<React.SetStateAction<UrlInfo[]>>
  asc: boolean
  setAsc: React.Dispatch<React.SetStateAction<boolean>>
  isAnalysisMode: boolean
  setIsAnalysisMode: React.Dispatch<React.SetStateAction<boolean>>
}

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
export const AppContext = createContext({} as AppContextType)

interface Props {
  children: ReactNode
}

export const ContextProvider: React.VFC<Props> = (props) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const savedKeywords = (localStorage.getItem('keyword') != null) ? JSON.parse(localStorage.getItem('keyword')!) as string[] : []
  const [authState, dispatch] = useReducer(authReducer.reducer, authReducer.initialState)
  const [imageVisible, setImageVisible] = useState(localStorage.getItem('image') === null ? true : !(localStorage.getItem('image') == null))
  const [memoVisible, setMemoVisible] = useState(localStorage.getItem('memo') === null ? true : !(localStorage.getItem('memo') == null))
  const [asc, setAsc] = useState(!(localStorage.getItem('asc') == null))
  const [keywords, setKeywords] = useState<string[]>(savedKeywords)
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const [selectedCategory, setSelectedCategory] = useState((localStorage.getItem('category') != null) ? localStorage.getItem('category')! : '')
  const [allCategory, setAllCategory] = useState<CategoryInfo[]>([])
  const [allUrl, setAllUrl] = useState<UrlInfo[]>([])
  const [isAnalysisMode, setIsAnalysisMode] = useState(false)

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
    setIsAnalysisMode
  }

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  )
}
