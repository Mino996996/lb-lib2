import React from 'react';

type Props = {
  inputTitle: string;
  setInputTitle: React.Dispatch<React.SetStateAction<string>>;
}

const TitleForm: React.VFC<Props> = ({inputTitle, setInputTitle}) => {
  return (
    <div className='px-2 pb-1 text-sm'>
      <label className='inline-block w-12 sm:w-20 text-xs sm:text-sm' htmlFor="inputTitle">タイトル:</label>
      <input
        required
        className='pl-1 w-9/12 sm:w-8/12 border border-gray-300'
        id='inputTitle'
        placeholder='〇〇についてメモ、〇〇エラーの解消方法など'
        type="text"
        value={inputTitle}
        onChange={(e:React.ChangeEvent<HTMLInputElement>)=>{
          setInputTitle(e.target.value);
        }}
      />
    </div>
  );
};

export default TitleForm;
