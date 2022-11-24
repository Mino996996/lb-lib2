import React, { useContext, useEffect, useState } from 'react';
import { EventLog } from '../../utilTypes';
import { ConfigContext } from '../../state/ConfigProvider';
import { isCategoryTag } from '../cardFunctions';
import { FormCard } from '../FormCard/FormCard';
import FileInfo from './FileInfo';
import { useEventContext } from '../../state/EventProvider';

interface Props {
  urlInfo: EventLog;
  index: number;
}

export const EventCard: React.FC<Props> = ({ urlInfo, index }) => {
  const { imageVisible, memoVisible, setSelectedCategory, setKeywords } = useContext(ConfigContext);
  const { allCategory } = useEventContext();
  const [visible, setVisible] = useState(imageVisible);
  const [allMemo, setAllMemo] = useState(memoVisible);
  const [isEdit, setIsEdit] = useState(false);
  const dateStr = new Date(urlInfo.addTime * 1000);

  useEffect(() => {
    setVisible(imageVisible);
  }, [imageVisible]);

  useEffect(() => {
    setAllMemo(memoVisible);
  }, [memoVisible]);

  return (
    <div className="mb-5 bg-gray-100 overflow-hidden shadow rounded-lg text-sm">
      {isEdit ? (
        <FormCard initUrlInfo={urlInfo} mode={'update'} setIsEdit={setIsEdit} />
      ) : (
        <div className={'border-l-8 ' + (index % 2 === 0 ? 'border-red-500' : 'border-green-500')}>
          {/* タイトル */}
          <div className="flex justify-between px-4 font-bold py-1 text-base sm:text-lg border-b border-gray-300 overflow-hidden whitespace-nowrap sm:h-9">
            <span className="w-5/6 overflow-hidden">{urlInfo.title}</span>
            <button
              className="ml-2 px-1 text-sm cursor-pointer"
              onClick={() => {
                setIsEdit(true);
              }}
            >
              [編集]
            </button>
          </div>

          {/* 日付 */}
          <div className="px-4 pt-1 border-b border-gray-300">
            <p className="inline-block w-full text-gray-700">{dateStr.toLocaleDateString()} 発表</p>
          </div>

          {/* File */}
          {urlInfo.fileUrl !== '' && (
            <div className="px-4 pt-1 border-b border-gray-300">
              <a
                href={urlInfo.fileUrl}
                target="_blank"
                className="inline-block w-full text-blue-600 overflow-hidden"
                rel="noreferrer"
              >
                {urlInfo.fileName}
              </a>
            </div>
          )}

          {/* URL */}
          <div className="px-4 pt-1 border-b border-gray-300">
            <a
              href={urlInfo.url}
              target="_blank"
              className="inline-block w-full text-blue-600 overflow-hidden"
              rel="noreferrer"
            >
              {urlInfo.url}
            </a>
          </div>

          {/* ファイルとURLのイメージデータ */}
          {(urlInfo.pageTitle !== '' || urlInfo.fileImageUrl !== '') && (
            <div className="py-1 border-b border-gray-300">
              {visible ? (
                <FileInfo urlInfo={urlInfo} setVisible={setVisible} />
              ) : (
                <button
                  className="px-2 mr-8 ml-auto text-sm font-bold cursor-pointer bg-gray-200 border border-gray-400 rounded shadow"
                  onClick={() => setVisible(true)}
                >
                  イメージ表示
                </button>
              )}
            </div>
          )}

          {/* 備考欄 */}
          <div className="px-4 py-1 border-b border-gray-300">
            <div className="flex w-full">
              <p
                className={
                  'inline-block w-10/12 mr-2 sm:mr-0 sm:w-11/12 whitespace-pre-wrap truncate overflow-hidden ' +
                  (allMemo ? '' : 'h-5')
                }
              >
                {urlInfo.memo}
              </p>
              <span className="cursor-pointer text-xs font-bold" onClick={() => setAllMemo(!allMemo)}>
                {allMemo ? '[省略]' : '[全文]'}
              </span>
            </div>
          </div>

          {/* タグ */}
          <div className="px-4 pb-1 ">
            {urlInfo.tagList.map((tag, index) => (
              <span
                key={index}
                className={
                  'inline-block px-2 py-0.5 border border-gray-500 rounded-2xl bg-blue-100 font-bold mr-1 mt-1 shadow-md cursor-pointer ' +
                  (isCategoryTag(allCategory, tag) ? 'bg-orange-100' : '')
                }
                onClick={() => {
                  setKeywords([]);
                  setSelectedCategory(tag);
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};