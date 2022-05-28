import React, {useState} from 'react';
import {UrlInfo} from "../../utilTypes";
import { Document, Page } from 'react-pdf';
import {readFile} from "fs";

type Props = {
  urlInfo: UrlInfo;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const InputPageInfo: React.VFC<Props> = ({urlInfo, setVisible}) => {

  const [pdf, setPdf] = useState<any>('');
  const [numPages, setNumPages] = useState<null|number>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [preview, setPreview] = useState(false);

  // @ts-ignore
  const onDocumentLoadSuccess = ({numPages}) => {
    console.log(numPages);
    setNumPages(numPages);
    setPageNumber(1);
  }

  const readPdfData = async (): Promise<void> => {
    // const response = await fetch(urlInfo.fileUrl);
    // console.log(response.url);
    // console.log(response.url === urlInfo.fileUrl);
    // const fileData = {
    //   data: await response.body,
    //   httpHeaders: response.headers,
    //   withCredentials: true
    // }
    // await setPdf(response.blob);
    // console.log(await response.blob())
    // const url = URL.createObjectURL(await response.blob());
    // console.log(url);
    // setPdf(url);
    window.open(urlInfo.fileUrl);
    await setPreview(true);
    console.log('done');
  }


  // 添付ファイルがあれば資料表示を優先。
  // 無ければURLイメージ。
  // URLイメージが無ければ何も表示しない
  return (
    <>
      {urlInfo.fileImageUrl ? (
        <>
          {preview ? ( //pdfプレビューモード
            <div className="flex">
              <div>
                <Document file={pdf} onLoadSuccess={onDocumentLoadSuccess}>
                  <Page pageNumber={pageNumber}/>
                </Document>
                <p>
                  Page {pageNumber} of {numPages}
                </p>
                <p>
                  {
                    pageNumber >=1 ?(<span onClick={() => setPageNumber(pageNumber-1)}>戻る</span>):(<span>'---'</span>)
                  } / {
                    pageNumber !== numPages ? (<span onClick={() => setPageNumber(pageNumber+1)}>進む</span>):(<span>'---'</span>)
                  }
                </p>
              </div>
              <span className="text-lg font-bold cursor-pointer" onClick={() => {
                setVisible(false)
              }}>[x]</span>
            </div>
          ):(　//サムネイルモード
            <div className="flex">
              <div
                className='w-11/12 sm:w-80 mx-auto sm:mx-4 my-1 border border-gray-500 rounded-lg text-sm shadow-md bg-white'>
                <div className='p-2 w-full h-36 sm:h-auto overflow-hidden'>
                  <img className="w-full sm:h-full" src={urlInfo.fileImageUrl} alt=""/>
                </div>
              </div>
              <span className="text-lg font-bold cursor-pointer" onClick={() => {
                setVisible(false)
              }}>[x]</span>
            </div>
          )}
          <div className="py-2 px-4 block">
            {preview ? (
              <button
                className="rounded-md bg-gray-200 border border-gray-600 px-2 cursor-pointer mr-4"
                onClick={()=> {setPreview(false)}}
              >
                閲覧解除
              </button>
            ):(
              urlInfo.fileName.includes('.pdf') && (
                <button
                  className="rounded-md bg-gray-200 border border-gray-600 px-2 cursor-pointer mr-4"
                  onClick={readPdfData}
                >
                  資料閲覧
                </button>
              )
            )}
            <a href={urlInfo.fileUrl} target="_blank" rel="noreferrer">
              <button
                className="rounded-md bg-gray-200 border border-gray-600 px-2 cursor-pointer"
              >
                資料DL
              </button>
            </a>
          </div>
        </>
      ):(
        urlInfo.url && (
          <>
            <div className='w-11/12 sm:w-80 mx-auto sm:mx-4 my-1 border border-gray-500 rounded-lg text-sm shadow-md bg-white'>
              <a href={urlInfo.url} target="_blank" rel="noreferrer">
                <p className='font-bold border-b border-gray-600 overflow-hidden pl-2'>{urlInfo.pageTitle}</p>
                <div className='p-2 w-full h-36 sm:h-auto overflow-hidden border-b border-gray-600 '>
                  <img className="w-full sm:h-full" src={urlInfo.pageImage} alt=""/>
                </div>
                <p className='p-1 h-16 overflow-hidden'>{urlInfo.pageDescription}</p>
              </a>
            </div>
            <span className="text-lg font-bold cursor-pointer" onClick={()=>{setVisible(false)}}>[x]</span>
          </>
        )
      )}
    </>
  );
};

export default InputPageInfo;
