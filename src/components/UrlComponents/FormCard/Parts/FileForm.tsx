import React, {useEffect, useState} from 'react';
import {convertPdfToImages} from "../FormCard";

type Props = {
  inputFile: File|null;
  setInputFile: React.Dispatch<React.SetStateAction<File|null>>;
  inputFileName: string;
  base64Image: string;
  setBase64Image: React.Dispatch<React.SetStateAction<string>>;
}

const FileForm: React.FC<Props> = (props) => {
  
  return (
    <div className='px-2 pb-1 text-sm'>
      {/*<label className='inline-block w-16' htmlFor="inputFile">ファイル:</label>*/}
      {(props.inputFileName && !props.inputFile) && (
        <span className="mr-4">{props.inputFileName}</span>
      )}
      <input
        className='w-8/12 whitespace-nowrap overflow-hidden'
        id='inputFile'
        type="file"
        onChange={async (e: React.ChangeEvent<HTMLInputElement>)=>{
          if (!!e.target.files?.length) {
            if (e.target.files![0].size > 12_000_000) {
              alert('ファイルサイズの上限は12MBです');
            } else {
              props.setInputFile(e.target.files[0]);
              if(e.target.files[0].name.includes('.pdf')){
                try {
                  props.setBase64Image(await convertPdfToImages(e.target.files[0]));
                } catch (e) {
                  console.log(e)
                }
              }
            }
          }
        }}
      />
      <img src={props.base64Image} alt=""/>
    </div>
  );
};

export default FileForm;
