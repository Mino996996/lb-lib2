import React, { useContext, useEffect, useState } from 'react';
import { pickRelationalTabs } from '../EventComponents/cardFunctions';
// import { urlInfoList } from '../../fixtures/stab/urlStab'
import { ToggleButton } from './Parts/ToggleButton';
import { AppContext } from '../state/ConfigProvider';
import { ToggleSortButton } from './Parts/ToggleSortButton';
import { getAllCategories, getAllUrls } from '../../firebase/firebase';

const ConfigArea: React.FC = () => {
  const { keywords, setKeywords, selectedCategory, allEventLogs, setAllEventLogs, setAllCategory } =
    useContext(AppContext);
  const [itemList, setItemList] = useState<string[]>([]);

  const reload = (): void => {
    Promise.all([getAllUrls(), getAllCategories()])
      .then((value) => {
        setAllEventLogs(value[0]);
        setAllCategory(value[1].sort((a, b) => a.category.localeCompare(b.category)));
      })
      .catch((e) => alert(e));
  };

  useEffect(() => {
    const items = pickRelationalTabs(allEventLogs, selectedCategory);
    setItemList([...items]);
  }, [selectedCategory, allEventLogs]);

  return (
    <>
      <div className="pt-2 sm:pt-6 text-gray-200 text-lg font-bold text-center">
        <h2 className="text-center mb-2 text-red-300">= 表示設定 =</h2>
        <p>
          イメージ画像：OFF
          <ToggleButton kind={'image'} />
          ON
        </p>
        <p>
          コメント：省略
          <ToggleButton kind={'memo'} />
          全文
        </p>
        <p>
          表示順：OLD
          <ToggleSortButton />
          NEW
        </p>
      </div>
      <div className="pt-2 sm:pt-6 text-lg font-bold text-center">
        <h2 className="mb-2 text-red-300">= データ再読み込み =</h2>
        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <button
          className="w-10/12 py-1 bg-green-200 border-2 border-gray-600 rounded-lg cursor-pointer text-gray-800 font-bold"
          onClick={reload}
        >
          Reload
        </button>
      </div>
      <div className="pt-2 sm:pt-6 text-lg">
        <h2 className="text-center mb-2 font-bold text-red-300">
          = {selectedCategory !== '' && selectedCategory + ' 関連'}タグ一覧 =
        </h2>
        <div className="overflow-y-scroll edit-scrollbar" style={{ height: '52vh' }}>
          {itemList
            .filter((value) => value !== selectedCategory)
            .map((item) => (
              <div className="inline-block" key={item}>
                <input
                  type="checkbox"
                  id={item}
                  className="cursor-pointer"
                  checked={keywords.includes(item)}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (e.target.checked) {
                      setKeywords([...keywords, item]);
                      localStorage.setItem('keyword', JSON.stringify([...keywords, item]));
                    } else {
                      const newList = keywords.filter((value) => value !== item);
                      setKeywords([...newList]);
                      localStorage.setItem('keyword', JSON.stringify([...newList]));
                    }
                  }}
                />
                <label htmlFor={item} className="pl-2 mr-6 text-base cursor-pointer text-gray-200">
                  {item}
                </label>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default ConfigArea;
