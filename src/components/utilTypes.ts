import { Theme } from './CategoryComponents/themeList';

export interface UrlInfo {
  id: string;
  title: string;
  url: string;
  memo: string;
  tagList: string[];
  pageTitle: string;
  pageImage: string;
  pageDescription: string;
  addTime: number;
  fileId: string;
  fileUrl: string;
  fileName: string;
  fileImageId: string;
  fileImageUrl: string;
}

export interface CategoryInfo {
  id: string;
  category: string;
  theme: Theme;
  point?: number[];
}

export interface UploadFileData {
  id: string;
  name: string;
  url: string;
}

export interface UploadFileImageData {
  id: string;
  url: string;
}
