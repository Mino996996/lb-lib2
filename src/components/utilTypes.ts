import {Theme} from "./CategoryComponents/themeList";

export type UrlInfo = {
  id: string;
  title: string
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
}

export type CategoryInfo = {
  id: string;
  category: string;
  theme: Theme;
}

export type UploadFileData = {
  id: string;
  name: string;
  url: string;
}
