import React, { useState } from 'react';
import { PDFDocumentProxy } from 'pdfjs-dist';
import { pdfPageImage } from '../../cardFunctions';
import { EventLog } from '../../../../utils/utilTypes';

interface Props {
  urlInfo: EventLog;
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
            <PageButtonMemo changeImageUrl={changeImageUrl} page={page - 1} labelName={'戻る'} />
          ) : (
            <span className="py-0.5 px-4 mr-4 bg-gray-200 rounded border border-gray-500">---</span>
          )}
          <span> /</span>
          {page !== pdfPageNumber ? (
            <PageButtonMemo changeImageUrl={changeImageUrl} page={page + 1} labelName={'進む'} />
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

interface PageButtonPron {
  changeImageUrl: (num: number) => Promise<void>;
  page: number;
  labelName: string;
}
const PageButton: React.FC<PageButtonPron> = ({ changeImageUrl, page, labelName }) => {
  return (
    <span
      className="py-0.5 px-4 mr-4 bg-green-200 rounded border border-green-500 cursor-pointer"
      onClick={() => {
        changeImageUrl(page)
          .then()
          .catch((e) => alert(e));
      }}
    >
      {labelName}
    </span>
  );
};

const PageButtonMemo = React.memo(PageButton);
