import React from 'react';

type Props = {
  inputFile: File|null;
  setInputFile: React.Dispatch<React.SetStateAction<File|null>>;
  inputFileName: string;
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
            }
          }
        }}
      />
    </div>
  );
};

export default FileForm;
