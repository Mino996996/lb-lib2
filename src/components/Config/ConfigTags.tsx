import React, { useEffect, useState } from 'react';
import { pickRelationalTabs } from '../EventComponents/cardFunctions';
import { useConfigContext } from '../state/ConfigProvider';
import { EventLog } from '../../utils/utilTypes';

interface props {
  allEventLogs: EventLog[];
}

const ConfigTags: React.FC<props> = ({ allEventLogs }) => {
  console.log('ConfigTags');
  const { keywords, setKeywords, selectedCategory } = useConfigContext();
  const [itemList, setItemList] = useState<string[]>([]);

  useEffect(() => {
    const items = pickRelationalTabs(allEventLogs, selectedCategory);
    setItemList([...items]);
  }, [selectedCategory, allEventLogs]);

  return (
    <div className="pt-2 sm:pt-6 text-lg">
      <h2 className="text-center mb-2 font-bold text-red-300">= {selectedCategory !== '' && selectedCategory + ' 関連'}タグ一覧 =</h2>
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
  );
};

export default ConfigTags;
