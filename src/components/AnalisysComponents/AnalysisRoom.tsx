import React, { useEffect, useState } from 'react';
import { useConfigContext } from '../state/ConfigProvider';
import BaseButton from '../UtilComponents/BaseButton';
import { useEventContext } from '../state/EventProvider';
import { Theme } from '../CategoryComponents/themeList';
import { CategoryInfo, EventLog } from '../utilTypes';

interface relation {
  name: string;
  times: number;
}

const dateYMD = (ms: number): Date => {
  return new Date(ms * 1000);
};

const tagFilter = (tags: string[]): string[] => {
  return tags.filter((tag) => tag.slice(-1) !== '年' && !tag.includes('さん'));
};

const relations = (presentations: EventLog[], allCategory: CategoryInfo[], filter: 'person' | 'tag'): relation[] => {
  const theme = filter === 'person' ? Theme.member : Theme.genre;
  return allCategory
    .filter((category) => category.theme === theme)
    .map((relation) => {
      return {
        name: relation.category,
        times: presentations.filter((eventLog) => eventLog.tagList.includes(relation.category)).length,
      };
    })
    .filter((presenter) => presenter.times !== 0)
    .sort((a, b) => b.times - a.times);
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
      <header className="p-4" style={{ height: '7vh' }}>
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
      <div className="bg-gray-200 p-4 flex" style={{ height: '53vh' }}>
        <div className="bg-white w-4/12">graphArea</div>
        <div className="bg-white w-4/12 mx-1.5">てｓｔ</div>
        <div className="bg-white w-1/12 mx-1.5">
          <h2 className="bg-orange-100">発表回数</h2>
          <ul className="overflow-y-scroll" style={{ height: '46vh' }}>
            {relations(presentations, allCategory, 'person').map((relation) => (
              <li key={relation.name}>
                <span>{relation.name}:</span>
                <span>{relation.times}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white mx-1.5" style={{ minWidth: 200 }}>
          <h2 className="bg-orange-100">発表タグ数</h2>
          <ul className="overflow-y-scroll" style={{ height: '46vh' }}>
            {relations(presentations, allCategory, 'tag').map((relation) => (
              <li key={relation.name}>
                <span>{relation.name}:</span>
                <span>{relation.times}</span>
              </li>
            ))}
          </ul>
        </div>
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
              <th>資料</th>
            </tr>
            {presentations.map((event, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
                <td className="px-1.5 py-1">{presentations.length - index}</td>
                <td className="px-1.5">
                  <p className="w-60 truncate">{event.title}</p>
                </td>
                <td className="px-1.5 text-center">{event.tagList.filter((tag) => tag.includes('さん'))}</td>
                <td className="px-1.5 text-right">{dateYMD(event.addTime).getFullYear()}</td>
                <td className="px-1.5 text-right">{dateYMD(event.addTime).getMonth() + 1}</td>
                <td className="px-1.5 text-right">{dateYMD(event.addTime).getDate()}</td>
                <td className="px-1.5">
                  <p className="">
                    {tagFilter(event.tagList).map((tag, index) => (
                      <span key={index}>{tag}, </span>
                    ))}
                  </p>
                </td>
                <td className="px-1.5 text-center">
                  {event.fileUrl !== '' ? (
                    <a className="cursor-pointer text-blue-600" href={event.fileUrl} rel="noreferrer" target="_blank">
                      DL
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
