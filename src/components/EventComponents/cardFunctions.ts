import { CategoryInfo, EventLog } from '../../utils/utilTypes';
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import PDFJSWorker from 'pdfjs-dist/legacy/build/pdf.worker.entry';
import { PDFDocumentProxy } from 'pdfjs-dist';

pdfjs.GlobalWorkerOptions.workerSrc = PDFJSWorker;

export interface Obj {
  pageTitle: string;
  pageImage: string;
  pageDescription: string;
}

export const testABC = (): number => {
  return 123;
};

export const urlPattern = /(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})[/\w .-]*\/?/;

// カテゴリタグと一緒に含まれているタグリストを作成
export const pickRelationalTabs = (ulrInfos: EventLog[], selectedCategory: string): string[] => {
  const hitUrls = selectedCategory !== '' ? ulrInfos.filter((value) => value.tagList.includes(selectedCategory)) : ulrInfos;

  const pickedTags: string[] = [];
  for (const urlInfo of hitUrls) {
    for (const tag of urlInfo.tagList) {
      if (!pickedTags.includes(tag)) {
        pickedTags.push(tag);
      }
    }
  }
  return pickedTags.sort((a, b) => a.localeCompare(b));
};

// カテゴリタグの有無をチェックして利用先で該当タグの背景色を変えるために使用
export const isCategoryTag = (categoryInfoList: CategoryInfo[], tag: string): boolean => {
  return !(categoryInfoList.filter((value) => value.category === tag).length === 0);
};

// タグ一覧リストを作成する ※Set()を使う方がスマートでは？
export const createInitTagList = (tagList: string[], selectedTag: string): string[] => {
  if (!(tagList.length === 0) && !(selectedTag === '')) {
    if (tagList.includes(selectedTag)) {
      return tagList;
    } else {
      return [...tagList, selectedTag];
    }
  } else if (!(tagList.length === 0) && selectedTag === '') {
    return tagList;
  } else if (tagList.length === 0 && !(selectedTag === '')) {
    return [selectedTag];
  }
  return [];
};

// inputフォームから選択されたファイルのArrayBufferを読み込んで返却
const readFileData = async (file: File): Promise<ArrayBuffer> => {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    // 先に読み込み結果ごとの動作を設定すること
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = (err) => reject(err);
    // Blobデータを読み込む
    reader.readAsArrayBuffer(file);
  });
};

// PDFファイルのパース
export const parsePdfData = async (data: Uint8Array): Promise<PDFDocumentProxy> => {
  return await pdfjs.getDocument({
    data,
    cMapUrl: '/cmaps/',
    cMapPacked: true,
  }).promise;
  // 補足コメント
  // getDocument()はPDFDocumentLoadingTaskクラスを返す。このメンバのpromiseプロパティを呼び出している
  // class PDFDocumentProxy{
  //   promise: PdfDocumentProxy
  //   constructor(){}
  // }
};

const pdfCanvasData = async (pdfData: PDFDocumentProxy, scale: number, pageNum: number): Promise<HTMLCanvasElement> => {
  const canvas = document.createElement('canvas');
  const page = await pdfData.getPage(pageNum);
  const viewport = page.getViewport({ scale });
  const context = canvas.getContext('2d');

  // contextがnullの時は例外を出して以降の処理を止める
  if (context == null) {
    throw new Error('Failed to get canvas 2D context');
  }

  canvas.height = viewport.height;
  canvas.width = viewport.width;
  const imageRef = { canvasContext: context, viewport };
  await page.render(imageRef).promise;
  return canvas;
};

// pdfファイルの1ページ目をBase64データで取得
export const convertPdfToImages = async (file: File): Promise<string> => {
  const arrayBuffData = await readFileData(file); // ファイルのバイナリデータ取得
  const pdf = await parsePdfData(new Uint8Array(arrayBuffData)); // Uint8Arrayに変換
  const canvas = await pdfCanvasData(pdf, 0.5, 1); // 1ページ目をcanvasにレンダリング
  // canvasにレンダリングされた画像をファイル化
  const pngImage = canvas.toDataURL(); // 指定がなければPNGのBase64データ
  canvas.remove();
  return pngImage;
};

// pdfファイルの指定ページ画像をフェッチしたデータから生成して返却
export const pdfPageImage = async (pdfData: PDFDocumentProxy, scale: number, pageNum: number): Promise<string> => {
  const canvas = await pdfCanvasData(pdfData, scale, pageNum);
  // canvasにレンダリングされた画像をファイル化
  const pngImage = canvas.toDataURL(); // 指定がなければPNGのBase64データ
  canvas.remove();
  return pngImage;
};

// イベントを条件でフィルタリング
export const filterEvent = (allEventLogs: EventLog[], keywords: string[], selectedCategory: string, asc: boolean): EventLog[] => {
  let filteredList: EventLog[] = allEventLogs;
  if (!(keywords.length === 0) && !(selectedCategory === '')) {
    // 両方データあり
    const keywordList = keywords.concat(selectedCategory);
    for (const keyword of keywordList) {
      filteredList = filteredList.filter((value) => value.tagList.includes(keyword));
    }
  } else if (!(keywords.length === 0) && selectedCategory === '') {
    // keywordsのみ
    for (const keyword of keywords) {
      filteredList = filteredList.filter((value) => value.tagList.includes(keyword));
    }
  } else if (keywords.length === 0 && !(selectedCategory === '')) {
    // selectedCategoryのみ
    filteredList = filteredList.filter((value) => value.tagList.includes(selectedCategory));
  }
  // ソート
  asc ? (filteredList = filteredList.sort((a, b) => b.addTime - a.addTime)) : (filteredList = filteredList.sort((a, b) => a.addTime - b.addTime));
  return filteredList;
};
