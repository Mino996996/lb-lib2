import React, {useContext} from 'react';
import {AppContext} from "../../state/ContextProvider";

type Props = {}

const UrlKeyword: React.VFC<Props> = () => {
  
  const {selectedCategory, setSelectedCategory, keywords, setKeywords} = useContext(AppContext);
  
  const deleteKeyword = (word: string) => {
    const newKeywords = keywords.filter(value => value !== word);
    setKeywords([...newKeywords]);
    newKeywords.length
      ? localStorage.setItem('keyword', JSON.stringify(newKeywords))
      : localStorage.setItem('keyword', '');
  }
  
  return (
    <div className='py-4 text-white font-bold text-lg'>
      <p>
        <span>カテゴリ：</span>
        {selectedCategory ? (
          <span>{selectedCategory}
            <span
              className="mr-2 text-xs cursor-pointer"
              onClick={() => {
                setSelectedCategory('');
                localStorage.setItem('category', '');
              }}
            >[x]</span>
          </span>
        ):(
          <span>なし</span>
        )}
      </p>
      <p>
        <span>選択タグ：</span>
        {keywords.length ? (
          keywords.map((value, index) => (
            <span key={index}>{value}<span className="mr-2 text-xs cursor-pointer" onClick={() => deleteKeyword(value)}>[x]</span>,</span>
          ))
        ):(
          <span>なし</span>
        )}
      </p>
    </div>
  );
};

export default UrlKeyword;
