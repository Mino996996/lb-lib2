import React, { useEffect, useState } from 'react';
import { FormCard } from './FormCard/FormCard';
import EventCard from './EventCard/EventCard';
import { EventLog } from '../utilTypes';
import { useConfigContext } from '../state/ConfigProvider';
import EventKeyword from './EventCard/EventKeyword';
import { useEventContext } from '../state/EventProvider';
import PageMoveButtons from './PageMove/PageMoveButtons';
import { filterEvent } from './cardFunctions';

const PAGE_VOL = 5;
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

const EventArea: React.FC = () => {
  const { keywords, selectedCategory, asc } = useConfigContext();
  const { allEventLogs } = useEventContext();
  const [eventLogs, setEventLogs] = useState<EventLog[]>([]);
  const [pageNum, setPageNum] = useState<number>(0);
  const [pageEndNum, setPageEndNum] = useState<number>(0);

  // カテゴリまたは選択タグ変更時の表示URLデータをフィルタリング
  useEffect(() => {
    const filteredList = filterEvent(allEventLogs, keywords, selectedCategory, asc);
    // ページ数をセット
    if (Math.floor(filteredList.length % PAGE_VOL) === 0) {
      setPageEndNum(Math.floor(filteredList.length / PAGE_VOL) - 1);
    } else {
      setPageEndNum(Math.floor(filteredList.length / PAGE_VOL));
    }
    setEventLogs([...filteredList.slice(pageNum * PAGE_VOL, pageNum * PAGE_VOL + 5)]);
  }, [keywords, selectedCategory, allEventLogs, asc, pageNum]);

  return (
    <div className="relative" style={{ height: '96vh' }}>
      <div className="pr-2 lg:pr-6 w-full absolute top-0 left-0 overflow-y-scroll edit-scrollbar url-height">
        <EventKeyword />
        <PageMoveButtons pageNum={pageNum} setPageNum={setPageNum} pageEndNum={pageEndNum} setPageEndNum={setPageEndNum} />
        {eventLogs.map((urlInfo, index) => (
          <EventCard key={urlInfo.id} urlInfo={urlInfo} index={index} />
        ))}
        <PageMoveButtons pageNum={pageNum} setPageNum={setPageNum} pageEndNum={pageEndNum} setPageEndNum={setPageEndNum} />
      </div>
      <div className="w-full absolute bottom-14 lg:bottom-0 left-0 pt-4 bg-gray-800">
        <FormCard initUrlInfo={blankUrlInfo} mode={'create'} />
      </div>
    </div>
  );
};

export default EventArea;
