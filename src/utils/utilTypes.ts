export interface EventLog {
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

export enum CategoryType {
  unselected,
  genre,
  member,
  year,
}

export interface CategoryInfo {
  id: string;
  category: string;
  theme: CategoryType;
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
