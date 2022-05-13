import React, {useContext, useState} from 'react';
import TitleForm from "./Parts/TitleForm";
import UrlForm from "./Parts/UrlForm";
import TagForm from "./Parts/TagForm";
import MemoForm from "./Parts/MemoForm";
import {createId, readFileData} from "../cardFunctions";
import {UrlInfo} from "../../utilTypes";
import {addUrl, fbPdfImageUpload, fbStorageDelete, fbStorageUpload, updateUrl} from "../../../firebase/firebase";
import {ClosedFormCard} from "./ClosedFormCard";
import {AppContext} from "../../state/ContextProvider";
import FormButtonArea from "./Parts/FormButtonArea";
import FileForm from "./Parts/FileForm";
import DateForm from "./Parts/DateForm";
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf'
// @ts-ignore
import PDFJSWorker from 'pdfjs-dist/legacy/build/pdf.worker.entry'
pdfjs.GlobalWorkerOptions.workerSrc = PDFJSWorker;

//
export const convertPdfToImages = async (file:File) => {
  const data = await readFileData(file);
  // PDFファイルのパース
  const pdf = await pdfjs.getDocument({
    // @ts-ignore
    data: data as string,
    cMapUrl: '/cmaps/',
    cMapPacked: true,
  }).promise
  
  // 1ページ目をcanvasにレンダリング
  const canvas = document.createElement("canvas");
  const page = await pdf.getPage(1);
  const viewport = page.getViewport({ scale: 0.5 });
  const context = canvas.getContext("2d");
  canvas.height = viewport.height;
  canvas.width = viewport.width;
  const imageRef = { canvasContext: context!, viewport: viewport };
  await page.render(imageRef).promise;
  
  // canvasにレンダリングされた画像をファイル化
  const pngImage = canvas.toDataURL(); //指定がなければPNGのBase64データ
  canvas.remove();
  return pngImage;
}

type Props = {
  initUrlInfo: UrlInfo;
  mode: 'update'|'create';
  setIsEdit?: React.Dispatch<React.SetStateAction<boolean>>;
}


// createとupdateを兼ねるコンポーネント。編集時は両立性に注意
export const FormCard: React.VFC<Props> = (prop) => {
  
  const {asc, allUrl, setAllUrl} = useContext(AppContext);
  const [inputTitle, setInputTitle] = useState(prop.initUrlInfo.title);
  const [inputUrl, setInputUrl] = useState(prop.initUrlInfo.url);
  const [inputMemo, setInputMemo] = useState(prop.initUrlInfo.memo);
  const [inputTagStr, setInputTagStr] = useState('');
  const [inputTagList, setInputTagList] = useState<string[]>(prop.initUrlInfo.tagList);
  const [inputPageTitle, setInputPageTitle] = useState(prop.initUrlInfo.pageTitle);
  const [inputPageImage, setInputPageImage] = useState(prop.initUrlInfo.pageImage);
  const [inputPageDescription, setInputPageDescription] = useState(prop.initUrlInfo.pageDescription);
  const [inputAddTime, setInputAddTime] = useState(prop.initUrlInfo.addTime);
  const [isInputFieldOpen, setIsInputFieldOpen] = useState(false);
  const [inputFile, setInputFile] = useState<File|null>(null);
  const [inputFileId, setInputFileId] = useState(prop.initUrlInfo.fileId);
  const [inputFileUrl, setInputFileUrl] = useState(prop.initUrlInfo.fileUrl);
  const [inputFileName, setInputFileName] = useState(prop.initUrlInfo.fileName);
  const [base64Image, setBase64Image] = useState('');
  const [fileImageId, setFileImageId] = useState(prop.initUrlInfo.fileImageId);
  const [fileImageUrl, setFileImageUrl] = useState(prop.initUrlInfo.fileImageUrl);
  const [status, setStatus] = useState(false);
  
  const clearInputData = () => {
    const nowDate = new Date();
    setInputPageTitle('');
    setInputPageImage('');
    setInputPageDescription('');
    setInputTitle('');
    setInputUrl('');
    setInputMemo('');
    setInputTagStr('');
    setInputTagList([]);
    setInputFile(null);
    setInputAddTime(Math.floor(nowDate.getTime()/1000));
    setInputFileId('');
    setInputFileUrl('');
    setInputFileName('');
    setBase64Image('');
    setFileImageId('');
    setFileImageUrl('')
  }

  const post = async () => {
    const id = prop.initUrlInfo.id ? prop.initUrlInfo.id : createId(12);
    const date = new Date();
    const urlInfo: UrlInfo = {
      id : id,
      title: inputTitle,
      url: inputUrl ? inputUrl : '',
      memo: inputMemo ? inputMemo : '',
      tagList: inputTagList ? inputTagList : [],
      pageTitle: inputPageTitle ? inputPageTitle : '',
      pageImage: inputPageImage ? inputPageImage : '',
      pageDescription: inputPageDescription ? inputPageDescription : '',
      addTime: inputAddTime? inputAddTime : Math.floor(date.getTime()/1000),
      fileUrl: inputFileUrl ? inputFileUrl: '',
      fileName: inputFileName ? inputFileName: '',
      fileId: inputFileId ? inputFileName: '',
      fileImageId: fileImageId ? fileImageId: '',
      fileImageUrl: fileImageUrl ? fileImageUrl : '',
    }
    try {
      setStatus(true);
      if(prop.mode === 'update') { // 更新時の処理
        if (inputFileId && inputFile && inputFile.name.includes('.pdf')) {
          await fbStorageDelete(inputFileId);
          const result = await Promise.all([
            fbStorageUpload(inputFile),
            fbPdfImageUpload(base64Image),
            fbStorageDelete(inputFileId),
            fbStorageDelete(fileImageId)
          ]);
          urlInfo.fileId = result[0].id;
          urlInfo.fileName = result[0].name;
          urlInfo.fileUrl = result[0].url;
          urlInfo.fileImageId = result[1].id;
          urlInfo.fileImageUrl = result[1].url;
        } else if (inputFileId && inputFile) {
          const result = await Promise.all([
            fbStorageUpload(inputFile),
            fbStorageDelete(inputFileId),
          ]);
          urlInfo.fileId = result[0].id;
          urlInfo.fileName = result[0].name;
          urlInfo.fileUrl = result[0].url;
          urlInfo.fileImageId = '';
          urlInfo.fileImageUrl = '';
        } else if (inputFile && inputFile.name.includes('.pdf')) {
          const result = await Promise.all([
            fbStorageUpload(inputFile),
            fbPdfImageUpload(base64Image)
          ]);
          urlInfo.fileId = result[0].id;
          urlInfo.fileName = result[0].name;
          urlInfo.fileUrl = result[0].url;
          urlInfo.fileImageId = result[1].id;
          urlInfo.fileImageUrl = result[1].url;
        } else if (inputFile) {
          const result = await fbStorageUpload(inputFile);
          urlInfo.fileId = result.id;
          urlInfo.fileName = result.name;
          urlInfo.fileUrl = result.url;
        }
        await updateUrl(urlInfo);
        const indexNum = allUrl.findIndex(urlInfo => urlInfo.id === id);
        allUrl[indexNum] = urlInfo;
        setAllUrl([...allUrl]);
        prop.setIsEdit!(false);
        setIsInputFieldOpen(false);
      } else { // 新規投稿時の処理
        if (inputFile && inputFile.name.includes('.pdf')) {
          const result = await Promise.all([
            fbStorageUpload(inputFile),
            fbPdfImageUpload(base64Image)
          ]);
          urlInfo.fileId = result[0].id;
          urlInfo.fileName = result[0].name;
          urlInfo.fileUrl = result[0].url;
          urlInfo.fileImageId = result[1].id;
          urlInfo.fileImageUrl = result[1].url;
        } else if (inputFile) {
          const result = await fbStorageUpload(inputFile);
          urlInfo.fileId = result.id;
          urlInfo.fileName = result.name;
          urlInfo.fileUrl = result.url;
        }
        await addUrl(urlInfo);
        allUrl.push(urlInfo);
        const newList = asc
          ? allUrl.sort((a, b)=> b.addTime - a.addTime)
          : allUrl.sort((a, b)=> a.addTime - b.addTime)
        setAllUrl([...newList]);
        clearInputData();
        setIsInputFieldOpen(false);
      }
      setStatus(false);
    } catch (e) {
      alert(e);
      setStatus(false);
    }
  }

  return (
    <>
      {(isInputFieldOpen || !!prop.setIsEdit) ? (
        <div className='pt-4 pb-2 px-1.5 bg-white overflow-hidden shadow rounded-lg'>
          {status && <h2 className="text-green-500 text-sm p-2">Now Uploading...</h2>}
          <TitleForm inputTitle={inputTitle} setInputTitle={setInputTitle} />
          <DateForm publicationTime={inputAddTime} setPublicationTime={setInputAddTime} />
          <FileForm inputFile={inputFile} setInputFile={setInputFile} inputFileName={inputFileName}
                    base64Image={base64Image} setBase64Image={setBase64Image}
          />
          <UrlForm inputUrl={inputUrl} setInputUrl={setInputUrl} setInputPageImage={setInputPageImage}
                   setInputPageTitle={setInputPageTitle} setInputPageDescription={setInputPageDescription}
                   inputPageTitle={inputPageTitle}
          /><TagForm inputTagStr={inputTagStr} setInputTagStr={setInputTagStr} inputTagList={inputTagList} setInputTagList={setInputTagList} />
          <MemoForm inputMemo={inputMemo} setInputMemo={setInputMemo} />
          <FormButtonArea mode={prop.mode} initUrlInfo={prop.initUrlInfo} post={post} inputTitle={inputTitle}
                          isInputFieldOpen={isInputFieldOpen} setIsInputFieldOpen={setIsInputFieldOpen} setIsEdit={prop.setIsEdit!}
          />
        </div>
      ):(
        <ClosedFormCard isInputFieldOpen={isInputFieldOpen} setIsInputFieldOpen={setIsInputFieldOpen} />
      )}
    </>
  );
};
