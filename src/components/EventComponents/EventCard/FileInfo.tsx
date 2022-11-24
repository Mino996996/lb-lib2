import React, { useState } from 'react';
import { EventLog } from '../../utilTypes';
import { FilePreview } from './FileInfoParts/FilePreview';
import { FileThumbnail } from './FileInfoParts/FileThumbnail';
import { PDFDocumentProxy } from 'pdfjs-dist';
import { createPdfPars } from '../cardFunctions';
import { alerts } from '../../../utils/alerts';

interface Props {
  urlInfo: EventLog;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const FileInfo: React.FC<Props> = ({ urlInfo, setVisible }) => {
  const [preview, setPreview] = useState(false);
  const [pdfData, setPdfData] = useState<PDFDocumentProxy | undefined>();
  const [pdfPageNumber, setPdfPageNumber] = useState<number | null>(null);

  // pdfファイルのurlからデータを取得してメモリに保存
  const readPdfData = async (): Promise<void> => {
    if (pdfData == null) {
      const response = await fetch(urlInfo.fileUrl);
      const pdf = await createPdfPars(await response.arrayBuffer());
      setPdfData(pdf);
      setPdfPageNumber(pdf.numPages);
    }
    await setPreview(true);
  };

  // 添付ファイルがあれば資料表示を優先。
  // 無ければURLイメージ。
  // URLイメージが無ければ何も表示しない
  return (
    <>
      {urlInfo.fileImageUrl !== '' ? (
        <>
          {preview ? ( // pdfプレビューモード
            <FilePreview urlInfo={urlInfo} pdfData={pdfData} pdfPageNumber={pdfPageNumber} setVisible={setVisible} />
          ) : (
            // サムネイルモード
            <FileThumbnail urlInfo={urlInfo} setVisible={setVisible} />
          )}
          <div className="py-2 px-4 block">
            {preview ? (
              <button
                className="rounded-md bg-gray-200 border border-gray-600 px-2 cursor-pointer mr-4"
                onClick={() => {
                  setPreview(false);
                }}
              >
                閲覧解除
              </button>
            ) : (
              urlInfo.fileName.includes('.pdf') && (
                <button
                  className="rounded-md bg-gray-200 border border-gray-600 px-2 cursor-pointer mr-4"
                  onClick={() => {
                    readPdfData()
                      .then()
                      .catch((error) => alert(error));
                  }}
                >
                  資料閲覧
                </button>
              )
            )}
            <a href={urlInfo.fileUrl} target="_blank" rel="noreferrer">
              <button className="rounded-md bg-gray-200 border border-gray-600 px-2 cursor-pointer">資料DL</button>
            </a>
          </div>
        </>
      ) : (
        urlInfo.url !== '' && (
          <>
            <div className="w-10/12 sm:w-80 mx-auto sm:mx-4 my-1 border border-gray-500 rounded-lg text-sm shadow-md bg-white">
              <a href={urlInfo.url} target="_blank" rel="noreferrer">
                <p className="font-bold border-b border-gray-600 overflow-hidden pl-2">{urlInfo.pageTitle}</p>
                <div className="p-2 w-full h-40 sm:h-auto overflow-hidden border-b border-gray-600 ">
                  <img className="h-full" src={urlInfo.pageImage} alt="" />
                </div>
                <p className="p-1.5 sm:p-1 h-14 sm:h-16 overflow-hidden text-xs sm:text-sm">
                  {urlInfo.pageDescription}
                </p>
              </a>
            </div>
            <span
              className="text-lg font-bold cursor-pointer"
              onClick={() => {
                setVisible(false);
              }}
            >
              [x]
            </span>
          </>
        )
      )}
    </>
  );
};

export default FileInfo;
