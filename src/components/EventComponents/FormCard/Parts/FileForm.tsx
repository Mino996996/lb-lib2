import React from 'react';
import { convertPdfToImages } from '../../cardFunctions';

interface Props {
  inputFile: File | null;
  setInputFile: React.Dispatch<React.SetStateAction<File | null>>;
  inputFileName: string;
  base64Image: string;
  setBase64Image: React.Dispatch<React.SetStateAction<string>>;
}

const FileForm: React.FC<Props> = (props) => {
  return (
    <div className="px-2 pb-1 text-sm">
      {/* <label className='inline-block w-16' htmlFor="inputFile">ファイル:</label> */}
      {props.inputFileName !== '' && props.inputFile == null && <span className="mr-4">{props.inputFileName}</span>}
      <input
        className="w-8/12 whitespace-nowrap overflow-hidden text-xs sm:text-sm"
        id="inputFile"
        type="file"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          if (e.target.files?.length == null) return;
          if (e.target.files[0].size < 12_000_000) {
            props.setInputFile(e.target.files[0]);
            if (e.target.files[0].name.includes('.pdf')) {
              convertPdfToImages(e.target.files[0])
                .then((resultStr) => props.setBase64Image(resultStr))
                .catch((e) => alert(e));
            }
          }
          alert('ファイルサイズの上限は12MBです');
        }}
      />
      <img src={props.base64Image} alt="" />
    </div>
  );
};

export default FileForm;
