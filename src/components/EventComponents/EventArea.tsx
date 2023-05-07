import React, { useEffect, useState } from 'react';
import { FormCard } from './FormCard/FormCard';
import EventCard from './EventCard/EventCard';
import { EventLog } from '../../utils/utilTypes';
import { useConfigContext } from '../state/ConfigProvider';
import EventKeyword from './EventCard/EventKeyword';
import { useEventContext } from '../state/EventProvider';
import { filterEvent } from './cardFunctions';

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

  // カテゴリまたは選択タグ変更時の表示URLデータをフィルタリング
  useEffect(() => {
    const filteredList = filterEvent(allEventLogs, keywords, selectedCategory, asc);
    setEventLogs(filteredList);
  }, [keywords, selectedCategory, allEventLogs, asc]);

  return (
    <div className="relative" style={{ height: '96vh' }}>
      <div className="pr-2 lg:pr-6 w-full absolute top-0 left-0 overflow-y-scroll edit-scrollbar url-height">
        <EventKeyword />
        {eventLogs.map((urlInfo, index) => (
          <EventCard key={urlInfo.id} urlInfo={urlInfo} index={index} />
        ))}
      </div>
      <div className="w-full absolute bottom-14 lg:bottom-0 left-0 pt-4 bg-gray-800">
        <FormCard initUrlInfo={blankUrlInfo} mode={'create'} />
      </div>
    </div>
  );
};

export default EventArea;
