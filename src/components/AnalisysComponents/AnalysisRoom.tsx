import React, { useEffect, useState } from 'react';
import { useConfigContext } from '../state/ConfigProvider';
import BaseButton from '../UtilComponents/BaseButton';
import { useEventContext } from '../state/EventProvider';
import { Theme } from '../CategoryComponents/themeList';
import { CategoryInfo, EventLog } from '../utilTypes';
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
  const [selectTag, setSelectTag] = useState('なし');
  const [presentations, setPresentations] = useState<EventLog[]>([]);
  const [socialScore, setSocialScore] = useState(0);
  const [educateScore, setEducateScore] = useState(0);
  const [lectureScore, setLectureScore] = useState(0);

  useEffect(() => {
    let eventLogs = allEventLogs;
    if (year !== 'すべて') {
      eventLogs = eventLogs.filter((eventLog) => eventLog.tagList.includes(year));
    }
    if (person !== 'すべて') {
      eventLogs = eventLogs.filter((eventLog) => eventLog.tagList.includes(person));
    }
    if (selectTag !== 'なし') {
      eventLogs = eventLogs.filter((eventLogs) => eventLogs.tagList.includes(selectTag));
    }
    setPresentations(eventLogs.sort((a, b) => b.addTime - a.addTime));
    setSocialScore(totalScores(eventLogs, allCategory, Score.Socially).reduce((pre, cur) => pre + cur) / eventLogs.length);
    setEducateScore(totalScores(eventLogs, allCategory, Score.Educated).reduce((pre, cur) => pre + cur) / eventLogs.length);
    setLectureScore(totalScores(eventLogs, allCategory, Score.Lecture).reduce((pre, cur) => pre + cur) / eventLogs.length);
  }, [year, person, selectTag]);

  return (
    <>
      <header className="p-4" style={{ height: '7vh' }}>
        <BaseButton onClickCallback={() => setIsAnalysisMode(false)} name={'蔵書室へ'} />
        <label className="text-white ml-3" htmlFor="">
          発表年：
        </label>
        <select onChange={(e) => setYear(e.target.value)}>
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
        <label className="text-white ml-3" htmlFor="">
          発表者：
        </label>
        <select onChange={(e) => setPerson(e.target.value)}>
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
        <div className="bg-white w-3/12 mx-1.5">
          <Scatter2D eventLogs={presentations} categories={allCategory} type={1} />
        </div>
        <div className="bg-white w-3/12 mx-1.5">
          <Scatter2D eventLogs={presentations} categories={allCategory} type={2} />
        </div>
        <div className="bg-white w-3/12 mx-1.5">
          <Scatter2D eventLogs={presentations} categories={allCategory} type={3} />
        </div>
        <div className="bg-white w-1/12 mx-1.5">
          <h2 className="bg-blue-200">発表回数</h2>
          <ul className="overflow-y-scroll" style={{ height: '46vh' }}>
            {relations(presentations, allCategory, 'person').map((relation) => (
              <li key={relation.name}>
                <span>{relation.name}:</span>
                <span>{relation.times}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white mx-1.5" style={{ minWidth: 180 }}>
          <h2 className="bg-blue-200">発表タグ数</h2>
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
                発表年:<span className="font-bold text-2xl">{year}</span>, 発表者:<span className="font-bold text-2xl">{person}</span>,
              </p>
              <p className="pl-4 pr-4">
                指定タグ:<span className="font-bold text-2xl">{selectTag}</span> の傾向として、
              </p>
              <p className="pl-4 pr-4 pt-2">
                <span className={'font-bold text-2xl ' + (socialScore > 0 ? 'text-emerald-500' : 'text-orange-500')}>
                  {socialScore > 0 ? '社会的視点' : '個性的視点'}
                </span>
                のテーマが多く
              </p>
              <p className="pl-4 pr-4">
                <span className={'font-bold text-2xl ' + (educateScore > 0 ? 'text-emerald-500' : 'text-orange-500')}>
                  {educateScore > 0 ? '教養に富んだ ' : '実生活に活かしやすい '}
                </span>
              </p>
              <p className="pl-4 pr-4">
                <span className={'font-bold text-2xl ' + (lectureScore > 0 ? 'text-emerald-500' : 'text-orange-500')}>
                  {lectureScore > 0 ? ' 参加型' : ' 講義型'}
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
