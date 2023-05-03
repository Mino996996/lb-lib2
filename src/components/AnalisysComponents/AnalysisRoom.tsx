import React, { useEffect, useState } from 'react';
import { useConfigContext } from '../state/ConfigProvider';
import BaseButton from '../UtilComponents/BaseButton';
import { useEventContext } from '../state/EventProvider';
import { Theme } from '../CategoryComponents/themeList';
import { EventLog } from '../utilTypes';
import Scatter2D from './Scatter2D';
import { TendScore } from './TendScore';
import {
  averageTendScores,
  createYearList,
  createYearRange,
  dateYMD,
  filterEventLogsByTags,
  filterEventLogsByYear,
  hitTimes,
  tagFilter,
  validateInputYears,
} from './analysisUtils';

const AnalysisRoom: React.FC = () => {
  const { setIsAnalysisMode } = useConfigContext();
  const { allEventLogs, allCategory } = useEventContext();
  const [selectedYear, setSelectedYear] = useState('すべて');
  const [person, setPerson] = useState('すべて');
  const [selectedTag, setSelectedTag] = useState('すべて');
  const [presentations, setPresentations] = useState<EventLog[]>([]);
  const [socialScore, setSocialScore] = useState(0);
  const [educateScore, setEducateScore] = useState(0);
  const [lectureScore, setLectureScore] = useState(0);
  const [isSingleYear, setIsSingleYear] = useState(true);
  const [startYear, setStartYear] = useState('2013年');
  const [endYear, setLastYear] = useState('2023年');
  const years = createYearList(allCategory);
  const [yearRange, setYearRange] = useState(years);

  // 発表年範囲リストを更新
  useEffect(() => {
    try {
      validateInputYears(startYear, endYear);
      const range = createYearRange(startYear, endYear);
      setYearRange(range);
    } catch (error) {
      alert(error);
    }
  }, [startYear, endYear]);

  // 該当した発表リストから表示する情報を更新
  useEffect(() => {
    const filteredEventsByYear = filterEventLogsByYear(allEventLogs, isSingleYear, selectedYear, yearRange);
    const filteredEvents = filterEventLogsByTags(filteredEventsByYear, person, selectedTag);

    if (filteredEvents.length === 0) {
      alert('該当する発表がありません');
      setSelectedYear('すべて');
      setPerson('すべて');
      setSelectedTag('すべて');
    } else {
      setPresentations(filteredEvents.sort((a, b) => b.addTime - a.addTime));
      setSocialScore(averageTendScores(filteredEvents, allCategory, TendScore.Socially));
      setEducateScore(averageTendScores(filteredEvents, allCategory, TendScore.Educated));
      setLectureScore(averageTendScores(filteredEvents, allCategory, TendScore.Lecture));
    }
  }, [selectedYear, person, selectedTag, yearRange, isSingleYear]);

  return (
    <>
      <header className="p-4" style={{ height: '7vh' }}>
        <BaseButton onClickCallback={() => setIsAnalysisMode(false)} name={'蔵書室へ'} />
        <input
          className="ml-6"
          type="radio"
          id="single"
          value={'単年'}
          onChange={() => {
            setIsSingleYear(true);
            setSelectedYear('すべて');
          }}
          checked={isSingleYear}
        />
        <label htmlFor="single" className="text-white">
          単年
        </label>
        <input className="m-1.5" type="radio" id="multi" value={'期間指定'} onChange={() => setIsSingleYear(false)} checked={!isSingleYear} />
        <label htmlFor="multi" className="text-white">
          期間指定
        </label>

        {isSingleYear ? (
          <>
            <label className="text-white ml-3" htmlFor="">
              発表年：
            </label>
            <select onChange={(e) => setSelectedYear(e.target.value)} value={selectedYear}>
              <option value="すべて">すべて</option>
              {allCategory
                .filter((value) => value.theme === Theme.year)
                .reverse()
                .map((v, index) => (
                  <option key={index} value={v.category}>
                    {v.category}
                  </option>
                ))}
            </select>
          </>
        ) : (
          <>
            <select
              onChange={(e) => {
                if (Number(e.target.value.replace('年', '')) >= Number(endYear.replace('年', ''))) {
                  alert('正しい範囲ではありません');
                } else {
                  setStartYear(e.target.value);
                }
              }}
              value={startYear}
            >
              {years.map((v, index) => (
                <option key={index} value={v}>
                  {v}
                </option>
              ))}
            </select>
            <label className="text-white mx-2" htmlFor="">
              〜
            </label>
            <select
              onChange={(e) => {
                if (Number(e.target.value.replace('年', '')) <= Number(startYear.replace('年', ''))) {
                  alert('正しい範囲ではありません');
                } else {
                  setLastYear(e.target.value);
                }
              }}
              value={endYear}
            >
              {years.map((v, index) => (
                <option key={index} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </>
        )}
        <label className="text-white ml-8" htmlFor="">
          発表者：
        </label>
        <select onChange={(e) => setPerson(e.target.value)} value={person}>
          <option value="すべて">すべて</option>
          {allCategory
            .filter((value) => value.theme === Theme.member)
            .map((v, index) => (
              <option key={index} value={v.category}>
                {v.category}
              </option>
            ))}
        </select>
        <label className="text-white ml-3" htmlFor="">
          メインタグ：
        </label>
        <select onChange={(e) => setSelectedTag(e.target.value)} value={selectedTag}>
          <option value="すべて">すべて</option>
          {allCategory
            .filter((value) => value.theme === Theme.genre)
            .map((v, index) => (
              <option key={index} value={v.category}>
                {v.category}
              </option>
            ))}
        </select>
      </header>
      <div className="bg-gray-200 p-4 flex justify-around" style={{ height: '53vh' }}>
        <div className="bg-white w-3/12">
          <Scatter2D eventLogs={presentations} categories={allCategory} type={1} />
        </div>
        <div className="bg-white w-3/12">
          <Scatter2D eventLogs={presentations} categories={allCategory} type={2} />
        </div>
        <div className="bg-white w-3/12">
          <Scatter2D eventLogs={presentations} categories={allCategory} type={3} />
        </div>
        <div className="w-2/12 flex flex-col">
          <div className="bg-white mb-auto">
            <h2 className="bg-orange-200">発表タグ数</h2>
            <ul className="overflow-y-scroll edit-scrollbar" style={{ height: '21vh' }}>
              {hitTimes(presentations, allCategory, 'tag').map((hitTime) => (
                <li key={hitTime.name}>
                  <span>{hitTime.name}:</span>
                  <span>{hitTime.times}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white">
            <h2 className="bg-orange-200">発表回数</h2>
            <ul className="overflow-y-scroll edit-scrollbar" style={{ height: '21vh' }}>
              {hitTimes(presentations, allCategory, 'person').map((hitTime) => (
                <li key={hitTime.name}>
                  <span>{hitTime.name}:</span>
                  <span>{hitTime.times}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="p-4 bg-gray-200 w-full border-t border-gray-500 box-border flex justify-center" style={{ height: '40vh' }}>
        <div className="bg-white">
          <h2 className="bg-blue-200 pl-4 pr-4">該当した発表リスト</h2>
          <div className="overflow-y-scroll edit-scrollbar" style={{ height: '34vh' }}>
            <table className="text-sm bg-white">
              <tbody>
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
              </tbody>
              <tbody>
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
              </tbody>
            </table>
          </div>
        </div>
        <div className="ml-4 w-4/12">
          <div className="bg-white w-full h-full">
            <h2 className="bg-blue-200 pl-4 pr-4">発表傾向</h2>
            <div className="p-1.5">
              <p className="pl-4 pr-4">
                個性的 - 社会的スコア平均：
                <span className={'font-bold ' + (socialScore > 0 ? 'text-emerald-500' : 'text-orange-500')}>{socialScore.toFixed(2)}</span>
              </p>
              <p className="pl-4 pr-4">
                実用型 - 教養型スコア平均：
                <span className={'font-bold ' + (educateScore > 0 ? 'text-emerald-500' : 'text-orange-500')}>{educateScore.toFixed(2)}</span>
              </p>
              <p className="pl-4 pr-4">
                参加型 - 講義型スコア平均：
                <span className={'font-bold ' + (lectureScore > 0 ? 'text-emerald-500' : 'text-orange-500')}>{lectureScore.toFixed(2)}</span>
              </p>
            </div>
            <div className="p-1.5 text-xl">
              <p className="pl-4 pr-4">
                発表年:
                {isSingleYear ? (
                  <span className="font-bold text-2xl">{selectedYear}</span>
                ) : (
                  <span className="font-bold text-2xl">
                    {startYear}〜{endYear}
                  </span>
                )}
                , 発表者:<span className="font-bold text-2xl">{person}</span>,
              </p>
              <p className="pl-4 pr-4">
                指定タグ:<span className="font-bold text-2xl">{selectedTag}</span> における傾向としては、
              </p>
              <p className="pl-4 pr-4 pt-2">
                <span className={'font-bold text-2xl ' + (socialScore > 0 ? 'text-emerald-500' : 'text-orange-500')}>{socialScore > 0 ? '社会的視点' : '個性的視点'}</span>
                のテーマが多く
              </p>
              <p className="pl-4 pr-4">
                <span className={'font-bold text-2xl ' + (educateScore > 0 ? 'text-emerald-500' : 'text-orange-500')}>
                  {educateScore > 0 ? '教養に富んだ' : '実生活に活かしやすい'}
                </span>
              </p>
              <p className="pl-4 pr-4">
                <span className={'font-bold text-2xl ' + (lectureScore > 0 ? 'text-emerald-500' : 'text-orange-500')}>{lectureScore > 0 ? '参加型' : '講義型'}</span>
                の発表が多いです。
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AnalysisRoom;
