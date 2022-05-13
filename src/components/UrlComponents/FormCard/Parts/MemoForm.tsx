import React from 'react';

type Props = {
  inputMemo: string;
  setInputMemo: React.Dispatch<React.SetStateAction<string>>;
}

const MemoForm: React.VFC<Props> = ({inputMemo, setInputMemo}) => {
  return (
    <div className='px-2 pb-1 text-sm'>
      <label className='inline-block' htmlFor="inputDescribe">まとめ：</label>
      <textarea
        className='w-full p-2 border border-gray-300 focus:text-gray-700'
        rows={3}
        id='inputDescribe'
        placeholder='～～の箇所参照、△△の記事と組み合わせて解決、バージョン＊＊＊用、起動コード ctrl+c で止める、など'
        value={inputMemo}
        onChange={(e:React.ChangeEvent<HTMLTextAreaElement>) => {
          setInputMemo(e.target.value);
        }}
      />
    </div>
  );
};

export default MemoForm;
