import React from 'react';
import { fbStorageDelete, urlDb } from '../../../../firebase/firebase';
import { EventLog } from '../../../../utils/utilTypes';
import { useEventContext } from '../../../state/EventProvider';

interface Props {
  mode: string;
  initUrlInfo: EventLog;
  post: () => Promise<void>;
  inputTitle: string;
  isInputFieldOpen: boolean;
  setIsInputFieldOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>> | null;
}

const FormButtonArea: React.FC<Props> = ({ mode, initUrlInfo, inputTitle, post, isInputFieldOpen, setIsInputFieldOpen, setIsEdit = null }) => {
  const { allEventLogs, setAllEventLogs } = useEventContext();

  const deleteUrlInfo = (): void => {
    if (window.confirm('この情報を削除しますか？')) {
      try {
        if (initUrlInfo.fileId !== '') {
          fbStorageDelete(initUrlInfo.fileId)
            .then()
            .catch((e) => alert(e));
        }
        urlDb
          .delete(initUrlInfo)
          .then()
          .catch((e) => alert(e));
        const newList = allEventLogs.filter((urlInfo) => urlInfo.id !== initUrlInfo.id);
        setAllEventLogs([...newList]);
      } catch (e) {
        alert(e);
      }
    }
  };

  return (
    <div className="ml-2 text-center">
      {mode === 'update' && (
        <button className={'px-4 py-1 mr-16 bg-black font-bold text-white rounded '} onClick={deleteUrlInfo}>
          削除
        </button>
      )}
      <button
        className={'px-4 py-1 bg-purple-600 font-bold text-white rounded ' + (inputTitle !== '' ? '' : 'bg-gray-300 text-gray-600')}
        onClick={() => {
          post()
            .then()
            .catch((e) => alert(e));
        }}
        disabled={inputTitle === ''}
      >
        {mode === 'create' ? '送信' : '更新'}
      </button>
      <button
        className="ml-16 px-2 py-1 bg-gray-600 font-bold text-white rounded "
        onClick={() => {
          if (setIsEdit != null) {
            setIsEdit(false);
          } else {
            setIsInputFieldOpen(!isInputFieldOpen);
          }
        }}
      >
        閉じる
      </button>
    </div>
  );
};

export default FormButtonArea;
