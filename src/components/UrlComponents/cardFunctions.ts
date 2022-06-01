import {CategoryInfo, UrlInfo} from "../utilTypes";
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf'
// @ts-ignore
import PDFJSWorker from 'pdfjs-dist/legacy/build/pdf.worker.entry'
import {PDFDocumentProxy} from "pdfjs-dist/types/web/base_viewer";
pdfjs.GlobalWorkerOptions.workerSrc = PDFJSWorker;

export type Obj = {
  pageTitle: string;
  pageImage: string;
  pageDescription: string;
}

export const testABC = (): number => {
  return 123
}

export const urlPattern = new RegExp('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?');

export const createOgpData = async (urlStr:string): Promise<Obj> => {
  const obj: Obj = {
    pageTitle: '',
    pageImage: '',
    pageDescription: '',
  }
  try{
    const res = await fetch(urlStr,{mode:"cors"});
    const data = await res.text();
    const el = new DOMParser().parseFromString(data, "text/html");
    const headEls = (el.head.children);
    const list = Array.from(headEls);
    for (const v of list) {
      if(v.getAttribute('property') === 'og:title'){
        obj.pageTitle = v.getAttribute('content') ? v.getAttribute('content')! :'';
      } else if (v.getAttribute('property') === 'og:image') {
        obj.pageImage = v.getAttribute('content') ? v.getAttribute('content')! :'';
      } else if (v.getAttribute('property') === 'og:description') {
        obj.pageDescription = v.getAttribute('content') ? v.getAttribute('content')! :'';
      }
    }
    return obj;
  } catch (e) {
    // データが取れなかったパターン。ブランクデータを返す
    return obj;
  }
}

// オリジナルIDを作成
export const createId = (digit: number): string => {
  const S = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return  Array.from(crypto.getRandomValues(new Uint32Array(digit)))
    .map((n) => S[n % S.length])
    .join("");
}

// カテゴリタグと一緒に含まれているタグリストを作成
export const pickRelationalTabs = (ulrInfos: UrlInfo[], selectedCategory: string): string[] => {
  const hitUrls = selectedCategory ? ulrInfos.filter(value => value.tagList.includes(selectedCategory)) : ulrInfos;
  const pickedTags: string[] =[];
  for (const urlInfo of hitUrls) {
    for (const tag of urlInfo.tagList) {
      if(!pickedTags.includes(tag)) {
        pickedTags.push(tag);
      }
    }
  }
  return pickedTags.sort((a,b)=>a.localeCompare(b));
}

// カテゴリタグの有無をチェックして利用先で該当タグの背景色を変えるために使用
export const isCategoryTag = (categoryInfoList: CategoryInfo[], tag:string): boolean => {
  return !!categoryInfoList.filter(value => value.category === tag).length;
}

// タグ一覧リストを作成する ※Set()を使う方がスマートでは？
export const createInitTagList = (tagList:string[], selectedTag:string): string[] => {
  if(!!tagList.length && !!selectedTag) {
    if(tagList.includes(selectedTag)) {
      return tagList
    } else {
      return [...tagList, selectedTag]
    }
  } else if (!!tagList.length && !selectedTag) {
    return tagList
  } else if (!tagList.length && !!selectedTag) {
    return [selectedTag];
  }
  return [];
}

// inputフォームから選択されたファイルのArrayBufferを読み込んで返却
const readFileData = (file:File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = (err) => {
      reject(err);
    };
    // Blobデータを読み込む
    reader.readAsArrayBuffer(file);
  });
};

// PDFファイルのパース
const createPdfPars = async (data:any) => {
  return pdfjs.getDocument({
    // @ts-ignore
    data: data as string,
    cMapUrl: '/cmaps/',
    cMapPacked: true,
  }).promise
}

const pdfCanvasData = async (pdfData: any, scale: number, pageNum: number) => {
  const canvas = document.createElement("canvas");
  const page = await pdfData.getPage(pageNum);
  const viewport = page.getViewport({ scale: scale });
  const context = canvas.getContext("2d");
  canvas.height = viewport.height;
  canvas.width = viewport.width;
  const imageRef = { canvasContext: context!, viewport: viewport };
  await page.render(imageRef).promise;
  return canvas;
}

// pdfファイルの1ページ目をBase64データで取得
export const convertPdfToImages = async (file:File) => {
  const data = await readFileData(file); // ファイルのArrayBufferデータ取得
  const pdf = await createPdfPars(data); // PDFファイルのパース
  // 1ページ目をcanvasにレンダリング
  const canvas = await pdfCanvasData(pdf, 0.5, 1);
  // canvasにレンダリングされた画像をファイル化
  const pngImage = canvas.toDataURL(); //指定がなければPNGのBase64データ
  canvas.remove();
  return pngImage;
}

// pdfファイルの画像データをリンクUrlから取得
export const pdfPageImage = async (urlInfo:UrlInfo, scale:number, pageNum:number) => {
  const response = await fetch(urlInfo.fileUrl);
  const data = await response.arrayBuffer();
  const pdf = await createPdfPars(data); // PDFファイルのパース
  // 1ページ目をcanvasにレンダリング
  const canvas = await pdfCanvasData(pdf, scale, pageNum);
  // canvasにレンダリングされた画像をファイル化
  const pngImage = canvas.toDataURL(); //指定がなければPNGのBase64データ
  canvas.remove();
  return pngImage;
}
