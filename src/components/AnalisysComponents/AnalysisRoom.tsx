import React from 'react';
import { useConfigContext } from '../state/ConfigProvider';
import BaseButton from '../UtilComponents/BaseButton';
import { useEventContext } from '../state/EventProvider';

const dateStyle = (ms: number): string => {
  const date = new Date(ms * 1000);
  return date.toLocaleDateString();
};

const AnalysisRoom: React.FC = (props) => {
  const { setIsAnalysisMode } = useConfigContext();
  const { allEventLogs } = useEventContext();
  return (
    <>
      <header className="p-4" style={{ height: '8vh' }}>
        <BaseButton onClickCallback={() => setIsAnalysisMode(false)} name={'蔵書室へ'} />
      </header>
      <div className="p-4 bg-white w-full overflow-y-scroll" style={{ height: '92vh' }}>
        <table className="text-sm">
          <tr>
            <th>№</th>
            <th>タイトル</th>
            <th>発表者</th>
            <th>発表日</th>
            <th>タグ</th>
            <th>発表傾向</th>
            <th>リンク</th>
          </tr>
          {allEventLogs.map((event, index) => (
            <tr key={index}>
              <td>{allEventLogs.length - index}</td>
              <td>{event.title}</td>
              <td>{event.tagList.filter((tag) => tag.includes('さん'))}</td>
              <td>{dateStyle(event.addTime)}</td>
              <td>
                {event.tagList.map((tag, index) => (
                  <span key={index}>tag</span>
                ))}
              </td>
              <td>{event.fileUrl !== '' ? <a href={event.fileUrl}>資料</a> : <p>資料無し</p>}</td>
            </tr>
          ))}
        </table>
      </div>
    </>
  );
};

export default AnalysisRoom;
