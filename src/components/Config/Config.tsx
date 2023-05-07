import React from 'react';
import { ConfigToggleButton } from './ConfigToggleButton';
import { useEventContext } from '../state/EventProvider';
import ConfigTags from './ConfigTags';

const Config: React.FC = () => {
  const { allEventLogs, fetchEventsAndCategories } = useEventContext();
  return (
    <>
      <div className="pt-2 sm:pt-6 text-gray-200 text-lg font-bold text-center">
        <h2 className="text-center mb-2 text-red-300">= 表示設定 =</h2>
        <p>
          イメージ画像：OFF <ConfigToggleButton kind={'image'} /> ON{' '}
        </p>
        <p>
          コメント：省略 <ConfigToggleButton kind={'memo'} /> 全文
        </p>
        <p>
          表示順：OLD <ConfigToggleButton kind={'asc'} /> NEW
        </p>
      </div>
      <div className="pt-2 sm:pt-6 text-lg font-bold text-center">
        <h2 className="mb-2 text-red-300">= データ再読み込み =</h2>
        <button
          className="w-10/12 py-1 bg-green-200 border-2 border-gray-600 rounded-lg cursor-pointer text-gray-800 font-bold"
          onClick={() => {
            fetchEventsAndCategories()
              .then(() => alert('再読み込みを実行しました'))
              .catch((error) => alert(String(error)));
          }}
        >
          Reload
        </button>
      </div>
      <ConfigTags allEventLogs={allEventLogs} />
    </>
  );
};

export default Config;
