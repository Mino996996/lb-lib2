import React, { useEffect, useState } from 'react';
import { FormCard } from './FormCard/FormCard';
import { EventCard } from './EventCard/EventCard';
import { EventLog } from '../utilTypes';
import { useConfigContext } from '../state/ConfigProvider';
import EventKeyword from './EventCard/EventKeyword';
import { useEventContext } from '../state/EventProvider';

const nowTime = new Date();
const blankUrlInfo: EventLog = {
  id: '',
  title: '',
  url: '',
  pageTitle: '',
  pageImage: '',
  pageDescription: '',
  tagList: [],
  memo: '',
  addTime: Math.floor(nowTime.getTime() / 1000),
  fileUrl: '',
  fileName: '',
  fileId: '',
  fileImageUrl: '',
  fileImageId: '',
};

const UrlArea: React.FC = () => {
  const { keywords, selectedCategory, asc } = useConfigContext();
  const { allEventLogs } = useEventContext();
  const [urlInfos, setUrlInfos] = useState<EventLog[]>([]);

  // カテゴリまたは選択タグ変更時の表示URLデータをフィルタリング
  useEffect(() => {
    /* 表示をDBとテストスタブで切り替え */
    let filteredList: EventLog[] = [...allEventLogs]; // データ複製 FromDB
    // let filteredList: UrlInfo[] = [...urlInfoList]; // データ複製 FromStub

    if (!(keywords.length === 0) && !(selectedCategory === '')) {
      // 両方データあり
      const keywordList = keywords.concat(selectedCategory);
      for (const keyword of keywordList) {
        filteredList = filteredList.filter((value) => value.tagList.includes(keyword));
      }
    } else if (!(keywords.length === 0) && selectedCategory === '') {
      // keywordsのみ
      for (const keyword of keywords) {
        filteredList = filteredList.filter((value) => value.tagList.includes(keyword));
      }
    } else if (keywords.length === 0 && !(selectedCategory === '')) {
      // selectedCategoryのみ
      filteredList = filteredList.filter((value) => value.tagList.includes(selectedCategory));
    }
    asc
      ? (filteredList = filteredList.sort((a, b) => b.addTime - a.addTime))
      : (filteredList = filteredList.sort((a, b) => a.addTime - b.addTime));
    setUrlInfos([...filteredList]);
  }, [keywords, selectedCategory, allEventLogs, asc]);

  return (
    <div className="relative" style={{ height: '96vh' }}>
      {/* URLデータのOutput */}
      <div className="pr-2 lg:pr-6 w-full absolute top-0 left-0 overflow-y-scroll edit-scrollbar url-height">
        {/* 選択中のカテゴリとタグ */}
        <EventKeyword />
        {/* URL情報一覧 */}
        {urlInfos.map((urlInfo, index) => (
          <EventCard key={urlInfo.id} urlInfo={urlInfo} index={index} />
        ))}
      </div>
      {/* URLデータのInput */}
      <div className="w-full absolute bottom-14 lg:bottom-0 left-0 pt-4 bg-gray-800">
        <FormCard initUrlInfo={blankUrlInfo} mode={'create'} />
      </div>
    </div>
  );
};

export default UrlArea;
