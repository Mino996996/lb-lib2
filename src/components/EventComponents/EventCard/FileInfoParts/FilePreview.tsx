import React, { useState } from 'react';
import { PDFDocumentProxy } from 'pdfjs-dist';
import { pdfPageImage } from '../../cardFunctions';
import { UrlInfo } from '../../../utilTypes';

interface Props {
  urlInfo: UrlInfo;
  pdfData: PDFDocumentProxy | undefined;
  pdfPageNumber: number | null;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const FilePreview: React.FC<Props> = ({ urlInfo, pdfData, pdfPageNumber, setVisible }) => {
  const [page, setPage] = useState(1);
  const [imageUrl, setImageUrl] = useState(urlInfo.fileImageUrl);

  const changeImageUrl = async (page: number): Promise<void> => {
    pdfData != null && setImageUrl(await pdfPageImage(pdfData, 0.7, page));
    setPage(page);
  };

  return (
    <div className="flex">
      <div>
        <div>
          <img src={imageUrl} alt="" />
        </div>
        <p className="text-center font-bold">
          Page {page} of {pdfPageNumber}
        </p>
        <p className="mt-2 text-center font-bold">
          {page - 1 !== 0 ? (
            <span
              className="py-0.5 px-4 mr-4 bg-green-200 rounded border border-green-500 cursor-pointer"
              onClick={() => {
                changeImageUrl(page - 1)
                  .then()
                  .catch((e) => alert(e));
              }}
            >
              戻る
            </span>
          ) : (
            <span className="py-0.5 px-4 mr-4 bg-gray-200 rounded border border-gray-500">---</span>
          )}{' '}
          /
          {page !== pdfPageNumber ? (
            <span
              className="py-0.5 px-4 ml-4 bg-green-200 rounded border border-green-500 cursor-pointer"
              onClick={() => {
                changeImageUrl(page + 1)
                  .then()
                  .catch((e) => alert(e));
              }}
            >
              進む
            </span>
          ) : (
            <span className="py-0.5 px-4 ml-4 bg-gray-200 rounded border border-gray-500">---</span>
          )}
        </p>
      </div>
      <span
        className="text-lg font-bold cursor-pointer"
        onClick={() => {
          setVisible(false);
        }}
      >
        [x]
      </span>
    </div>
  );
};
