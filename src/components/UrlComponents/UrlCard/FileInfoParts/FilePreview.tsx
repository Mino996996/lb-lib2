import React, {useState} from 'react';
import {Document, Page} from "react-pdf";
import {UrlInfo} from "../../../utilTypes";

type Props = {
  urlInfo: UrlInfo;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const FilePreview: React.FC<Props> = ({urlInfo, setVisible}) => {

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


  return (
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
  );
};
