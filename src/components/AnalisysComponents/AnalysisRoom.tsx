import React, { useEffect, useState } from 'react';
import { useConfigContext } from '../state/ConfigProvider';
import BaseButton from '../UtilComponents/BaseButton';
import { useEventContext } from '../state/EventProvider';
import { Theme } from '../CategoryComponents/themeList';
import { EventLog } from '../utilTypes';
import Scatter2D from './Graphs/Scatter2D';
import { Score } from './Graphs/Score';
import { relations, totalScores } from './Graphs/graphFunctions';

const dateYMD = (ms: number): Date => {
  return new Date(ms * 1000);
};

const tagFilter = (tags: string[]): string[] => {
  return tags.filter((tag) => tag.slice(-1) !== '年' && !tag.includes('さん'));
};

const AnalysisRoom: React.FC = (props) => {
  const { setIsAnalysisMode } = useConfigContext();
  const { allEventLogs, allCategory } = useEventContext();
  const [year, setYear] = useState('すべて');
  const [person, setPerson] = useState('すべて');
  const [selectTag, setSelectTag] = useState('すべて');
  const [presentations, setPresentations] = useState<EventLog[]>([]);
  const [socialScore, setSocialScore] = useState(0);
  const [educateScore, setEducateScore] = useState(0);
  const [lectureScore, setLectureScore] = useState(0);
  const [yearConfig, setYearConfig] = useState('単年');
  const [startYear, setStartYear] = useState('2013年');
  const [lastYear, setLastYear] = useState('2022年');
  const fromYears = allCategory.filter(category => category.theme === Theme.year).map(value => value.category);
  const sinceYears = allCategory.filter(category => category.theme === Theme.year).map(value => value.category);
  const [yearRange, setYearRange] = useState(allCategory.filter(category => category.theme === Theme.year).map(value => value.category));

  useEffect(() => {
    const start = Number(startYear.replace('年',''));
    const last = Number(lastYear.replace('年',''));
    const range:string[] = []
    for (let year = start; year <= last; year++) {
      range.push(String(year) + '年');
    }
    setYearRange(range);
  }, [startYear, lastYear])
  
  useEffect(() => {
    let eventLogs = allEventLogs;
    if (yearConfig === "単年") {
      if (year !== 'すべて') {
        eventLogs = eventLogs.filter((eventLog) => eventLog.tagList.includes(year));
      }
    } else {
      const list:EventLog[] = []
      for (const targetYear of yearRange) {
        const categories = allEventLogs.filter(eventLog => eventLog.tagList.includes(targetYear))
        list.push(...categories)
      }
      eventLogs = list
    }
    if (person !== 'すべて') {
      eventLogs = eventLogs.filter((eventLog) => eventLog.tagList.includes(person));
    }
    if (selectTag !== 'すべて') {
      eventLogs = eventLogs.filter((eventLogs) => eventLogs.tagList.includes(selectTag));
    }
    if (eventLogs.length === 0) {
      alert('該当する発表がありません');
      setYear('すべて');
      setPerson('すべて');
      setSelectTag('すべて');
    } else {
      setPresentations(eventLogs.sort((a, b) => b.addTime - a.addTime));
      setSocialScore(
        totalScores(eventLogs, allCategory, Score.Socially).reduce((pre: number, cur: number) => pre + cur) / eventLogs.length
      );
      setEducateScore(
        totalScores(eventLogs, allCategory, Score.Educated).reduce((pre: number, cur: number) => pre + cur) / eventLogs.length
      );
      setLectureScore(
        totalScores(eventLogs, allCategory, Score.Lecture).reduce((pre: number, cur: number) => pre + cur) / eventLogs.length
      );
    }
  }, [year, person, selectTag, yearRange, yearConfig]);

  return (
    <>
      <header className="p-4" style={{ height: '7vh' }}>
        <BaseButton onClickCallback={() => setIsAnalysisMode(false)} name={'蔵書室へ'} />
        <input
          className="ml-6"
          type='radio'
          id="single"
          value={"単年"}
          onChange={(e)=>{
            setYearConfig(e.target.value);
            setYear("すべて");
          }}
          checked={yearConfig === "単年"}
        />
        <label htmlFor='single' className="text-white">単年</label>
        <input
          className="m-1.5"
          type='radio'
          id="multi"
          value={"期間指定"}
          onChange={(e)=>setYearConfig(e.target.value)}
          checked={yearConfig === "期間指定"}
        />
        <label htmlFor='multi' className="text-white">期間指定</label>
  
        {yearConfig === '単年' ? (
          <>
            <label className="text-white ml-3" htmlFor="">
              発表年：
            </label>
            <select onChange={(e) => setYear(e.target.value)} value={year}>
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
        ):(
          <>
            <select
              onChange={(e) => {
                if(Number(e.target.value.replace('年','')) >= Number(lastYear.replace('年',''))) {
                  alert('正しい範囲ではありません');
                } else {
                  setStartYear(e.target.value)}
                }
              }
              value={startYear}
            >
              {fromYears
                .map((v, index) => (
                  <option key={index} value={v}>
                    {v}
                  </option>
                ))
              }
            </select>
            <label className="text-white mx-2" htmlFor="">
              〜
            </label>
            <select
              onChange={(e) => {
                if (Number(e.target.value.replace('年', '')) <= Number(startYear.replace('年', ''))) {
                  alert('正しい範囲ではありません');
                } else {
                  setLastYear(e.target.value)
                }
              }}
              value={lastYear}
            >
              {sinceYears
                .map((v, index) => (
                  <option key={index} value={v}>
                    {v}
                  </option>
                ))
              }
            </select>
          </>
          )
        }
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
        <select onChange={(e) => setSelectTag(e.target.value)} value={selectTag}>
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
              {relations(presentations, allCategory, 'tag').map((relation) => (
                <li key={relation.name}>
                  <span>{relation.name}:</span>
                  <span>{relation.times}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white">
            <h2 className="bg-orange-200">発表回数</h2>
            <ul className="overflow-y-scroll edit-scrollbar" style={{ height: '21vh' }}>
              {relations(presentations, allCategory, 'person').map((relation) => (
                <li key={relation.name}>
                  <span>{relation.name}:</span>
                  <span>{relation.times}</span>
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
                <span className={'font-bold ' + (educateScore > 0 ? 'text-emerald-500' : 'text-orange-500')}>
                  {educateScore.toFixed(2)}
                </span>
              </p>
              <p className="pl-4 pr-4">
                参加型 - 講義型スコア平均：
                <span className={'font-bold ' + (lectureScore > 0 ? 'text-emerald-500' : 'text-orange-500')}>
                  {lectureScore.toFixed(2)}
                </span>
              </p>
            </div>
            <div className="p-1.5 text-xl">
              <p className="pl-4 pr-4">
                発表年:
                {yearConfig === "単年"
                  ? <span className="font-bold text-2xl">{year}</span>
                  : <span className="font-bold text-2xl">{startYear}〜{lastYear}</span>
                }
                , 発表者:<span className="font-bold text-2xl">{person}</span>,
              </p>
              <p className="pl-4 pr-4">
                指定タグ:<span className="font-bold text-2xl">{selectTag}</span> における傾向としては、
              </p>
              <p className="pl-4 pr-4 pt-2">
                <span className={'font-bold text-2xl ' + (socialScore > 0 ? 'text-emerald-500' : 'text-orange-500')}>
                  {socialScore > 0 ? '社会的視点' : '個性的視点'}
                </span>
                のテーマが多く
              </p>
              <p className="pl-4 pr-4">
                <span className={'font-bold text-2xl ' + (educateScore > 0 ? 'text-emerald-500' : 'text-orange-500')}>
                  {educateScore > 0 ? '教養に富んだ' : '実生活に活かしやすい'}
                </span>
              </p>
              <p className="pl-4 pr-4">
                <span className={'font-bold text-2xl ' + (lectureScore > 0 ? 'text-emerald-500' : 'text-orange-500')}>
                  {lectureScore > 0 ? '参加型' : '講義型'}
                </span>
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
