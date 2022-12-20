import React, { useEffect, useState } from 'react';
import { useConfigContext } from '../state/ConfigProvider';
import BaseButton from '../UtilComponents/BaseButton';
import { useEventContext } from '../state/EventProvider';
import { Theme } from '../CategoryComponents/themeList';
import { EventLog } from '../utilTypes';

const dateStyle = (ms: number): string => {
  const date = new Date(ms * 1000);
  const dateYMD = date.toLocaleDateString().split('/');
  return `${dateYMD[1]}月 ${dateYMD[2]}日`;
};

const getYear = (ms: number): string => {
  const date = new Date(ms * 1000);
  const dateYMD = date.toLocaleDateString().split('/');
  return `${dateYMD[0]}年`;
};

const tagFilter = (tags: string[]): string[] => {
  return tags.filter((tag) => tag.slice(-1) !== '年' && !tag.includes('さん'));
};

const AnalysisRoom: React.FC = (props) => {
  const { setIsAnalysisMode } = useConfigContext();
  const { allEventLogs, allCategory } = useEventContext();
  const [year, setYear] = useState('all');
  const [person, setPerson] = useState('all');
  const [selectTag, setSelectTag] = useState('なし');
  const [presentations, setPresentations] = useState<EventLog[]>([]);

  useEffect(() => {
    let eventLogs = allEventLogs;
    if (year !== 'all') {
      eventLogs = eventLogs.filter((eventLog) => eventLog.tagList.includes(year));
    }
    if (person !== 'all') {
      eventLogs = eventLogs.filter((eventLog) => eventLog.tagList.includes(person));
    }
    if (selectTag !== 'なし') {
      eventLogs = eventLogs.filter((eventLogs) => eventLogs.tagList.includes(selectTag));
    }
    setPresentations(eventLogs.sort((a, b) => b.addTime - a.addTime));
  }, [year, person, selectTag]);

  return (
    <>
      <header className="p-4" style={{ height: '5vh' }}>
        <BaseButton onClickCallback={() => setIsAnalysisMode(false)} name={'蔵書室へ'} />
        <label className="text-white" htmlFor="">
          発表年：
        </label>
        <select onChange={(e) => setYear(e.target.value)}>
          <option value="all">すべて</option>
          {allCategory
            .filter((value) => value.theme === Theme.year)
            .reverse()
            .map((v, index) => (
              <option key={index} value={v.category}>
                {v.category}
              </option>
            ))}
        </select>
        <label className="text-white" htmlFor="">
          発表者：
        </label>
        <select onChange={(e) => setPerson(e.target.value)}>
          <option value="all">すべて</option>
          {allCategory
            .filter((value) => value.theme === Theme.member)
            .map((v, index) => (
              <option key={index} value={v.category}>
                {v.category}
              </option>
            ))}
        </select>
        <label className="text-white" htmlFor="">
          メインタグ：
        </label>
        <select onChange={(e) => setSelectTag(e.target.value)}>
          <option value="なし">すべて</option>
          {allCategory
            .filter((value) => value.theme === Theme.genre)
            .map((year, index) => (
              <option key={index} value={year.category}>
                {year.category}
              </option>
            ))}
        </select>
      </header>
      <div className="bg-white p-4 flex" style={{ height: '55vh' }}>
        <div className="w-2/6">graphArea</div>
        <div className="w-2/6">てｓｔ</div>
        <div className="w-2/6">該当情報リストエリア</div>
      </div>
      <div className="p-4 bg-gray-200 w-full border-t border-gray-500 box-border flex justify-center" style={{ height: '40vh' }}>
        <div className="overflow-y-scroll">
          <table className="text-sm bg-white">
            <tr>
              <th>№</th>
              <th>タイトル</th>
              <th>発表者</th>
              <th>年</th>
              <th>月</th>
              <th>日</th>
              <th>タグ</th>
              <th>発表傾向</th>
              <th>リンク</th>
            </tr>
            {presentations.map((event, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
                <td className="px-1.5 py-1">{presentations.length - index}</td>
                <td className="px-1.5">
                  <p className="w-72 truncate">{event.title}</p>
                </td>
                <td className="px-1.5 text-center">{event.tagList.filter((tag) => tag.includes('さん'))}</td>
                <td className="px-1.5 text-right">{getYear(event.addTime)}</td>
                <td className="px-1.5 text-right">{dateStyle(event.addTime)}</td>
                <td className="px-1.5">
                  <p className="">
                    {tagFilter(event.tagList).map((tag, index) => (
                      <span key={index}>{tag}, </span>
                    ))}
                  </p>
                </td>
                <td className="px-1.5"></td>
                <td className="px-1.5 text-center">
                  {event.fileUrl !== '' ? (
                    <a className="cursor-pointer text-blue-600" href={event.fileUrl} rel="noreferrer" target="_blank">
                      資料
                    </a>
                  ) : (
                    ''
                  )}
                </td>
              </tr>
            ))}
          </table>
        </div>
        <div className="ml-4 w-4/12">
          <div className="bg-white w-full h-full">test</div>
        </div>
      </div>
    </>
  );
};

export default AnalysisRoom;
