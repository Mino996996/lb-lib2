import React, {useState} from 'react';

type Props = {
  inputTagStr: string;
  setInputTagStr: React.Dispatch<React.SetStateAction<string>>;
  inputTagList: string[];
  setInputTagList: React.Dispatch<React.SetStateAction<string[]>>;
}

const TagForm: React.VFC<Props> = ({inputTagStr, setInputTagStr, inputTagList, setInputTagList}) => {

  const [isJapaneseTagInput, setIsJapaneseTagInput] = useState(false);

  return (
    <div
      className='px-2 pb-1 text-sm'
      onCompositionStart={(e)=> setIsJapaneseTagInput(true)}
      onCompositionEnd={(e)=> setIsJapaneseTagInput(false)}
      onKeyDown={(e:React.KeyboardEvent<HTMLInputElement>)=>{
        if(!isJapaneseTagInput && e.key === 'Enter'){
          if(inputTagStr && !inputTagList.includes(inputTagStr)) {
            setInputTagList([...inputTagList, inputTagStr]);
            setInputTagStr('');
          } else {
            alert('同じタグが登録済です');
            setInputTagStr('');
          }
        }
      }}
    >
      <div className='mb-1'>
        {inputTagList.map((value, index) => (
          <span key={index} className='inline-block pl-2 py-0.5 border border-gray-400 rounded-2xl bg-blue-100 font-bold mr-1 mt-1 shadow-md'>
            {value}
            <span className='bg-white m-1 px-1 bg-gray-400 rounded-full font-bold text-white'
              onClick={() => {
                const newTagList = inputTagList.filter((tag) => tag !== inputTagList[index]);
                setInputTagList([...newTagList]);
              }}
            >
              Ｘ
            </span>
          </span>
        ))}
      </div>
      <label className='inline-block w-12' htmlFor="inputTag">タグ：</label>
      <input
        className='w-10/12 border border-gray-300 pl-2'
        id='inputTag'
        placeholder='単語入力後→[Enter]で追加されます'
        value={inputTagStr}
        onChange={(e:React.ChangeEvent<HTMLInputElement>)=>{
          setInputTagStr(e.target.value);
        }}
        type="text"
      />
    </div>
  );
};

export default TagForm;
