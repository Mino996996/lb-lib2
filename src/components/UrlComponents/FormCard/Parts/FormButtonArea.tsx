import React, { useContext } from 'react';
import { fbStorageDelete, urlDb } from '../../../../firebase/firebase';
import { AppContext } from '../../../state/ContextProvider';
import { UrlInfo } from '../../../utilTypes';

interface Props {
  mode: string;
  initUrlInfo: UrlInfo;
  post: () => Promise<void>;
  inputTitle: string;
  isInputFieldOpen: boolean;
  setIsInputFieldOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
}

const FormButtonArea: React.FC<Props> = (prop) => {
  const { allUrl, setAllUrl } = useContext(AppContext);

  const deleteUrlInfo = async () => {
    if (window.confirm('この情報を削除しますか？')) {
      try {
        if (prop.initUrlInfo.fileId !== '') {
          await fbStorageDelete(prop.initUrlInfo.fileId);
        }
        await urlDb.delete(prop.initUrlInfo);
        const newList = allUrl.filter((urlInfo) => urlInfo.id !== prop.initUrlInfo.id);
        setAllUrl([...newList]);
      } catch (e) {
        alert(e);
      }
    }
  };

  return (
    <div className="ml-2 text-center">
      {prop.mode === 'update' && (
        <button className={'px-4 py-1 mr-16 bg-black font-bold text-white rounded '} onClick={deleteUrlInfo}>
          削除
        </button>
      )}
      <button
        className={
          'px-4 py-1 bg-purple-600 font-bold text-white rounded ' +
          (prop.inputTitle !== '' ? '' : 'bg-gray-300 text-gray-600')
        }
        onClick={prop.post}
        disabled={prop.inputTitle === ''}
      >
        {prop.mode === 'create' ? '送信' : '更新'}
      </button>
      <button
        className="ml-16 px-2 py-1 bg-gray-600 font-bold text-white rounded "
        onClick={() => {
          if (!prop.setIsEdit) {
            prop.setIsInputFieldOpen(!prop.isInputFieldOpen);
          } else {
            prop.setIsEdit(false);
          }
        }}
      >
        閉じる
      </button>
    </div>
  );
};

export default FormButtonArea;
