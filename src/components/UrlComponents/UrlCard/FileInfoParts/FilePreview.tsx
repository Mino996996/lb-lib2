import React, {useEffect, useState} from 'react';
import {UrlInfo} from "../../../utilTypes";
import {pdfPageImage} from "../../cardFunctions";

type Props = {
  urlInfo: UrlInfo;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const FilePreview: React.FC<Props> = ({urlInfo, setVisible}) => {

  const [pdf, setPdf] = useState<any>('');
  const [numPages, setNumPages] = useState<null|number>(null);
  const [pageNumber, setPageNumber] = useState(4);
  const [imageUrl, setImageUrl] = useState('');

  const test = async () => {
    setImageUrl(await pdfPageImage(urlInfo, 0.7, pageNumber))
  }

  return (
    <div className="flex">
      <div>
        {/*<Document file={pdf} onLoadSuccess={onDocumentLoadSuccess}>*/}
        {/*  <Page pageNumber={pageNumber}/>*/}
        {/*</Document>*/}
        {/*{async () => pdfImagePage(urlInfo.fileUrl,1)}*/}
        <div>
          <img src={imageUrl} alt=""/>
        </div>
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
        <p onClick={test}>test</p>
      </div>
      <span className="text-lg font-bold cursor-pointer" onClick={() => {
        setVisible(false)
      }}>[x]</span>
    </div>
  );
};
