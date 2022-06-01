import React from 'react';
import {UrlInfo} from "../../../utilTypes";

type Props = {
  urlInfo: UrlInfo;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const FileThumbnail: React.FC<Props> = ({urlInfo, setVisible}) => {
  return (
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
  );
};
