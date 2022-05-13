import React from 'react';
import {UrlInfo} from "../../utilTypes";

type Props = {
  urlInfo: UrlInfo;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const InputPageInfo: React.VFC<Props> = ({urlInfo, setVisible}) => {
  return (
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
  );
};

export default InputPageInfo;
