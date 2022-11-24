import React, { useContext } from 'react';
import { fbStorageDelete, urlDb } from '../../../../firebase/firebase';
import { AppContext } from '../../../state/ConfigProvider';
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

const FormButtonArea: React.FC<Props> = ({
  mode,
  initUrlInfo,
  inputTitle,
  post,
  isInputFieldOpen,
  setIsInputFieldOpen,
  setIsEdit,
}) => {
  const { allUrl, setAllUrl } = useContext(AppContext);

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
        const newList = allUrl.filter((urlInfo) => urlInfo.id !== initUrlInfo.id);
        setAllUrl([...newList]);
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
        className={
          'px-4 py-1 bg-purple-600 font-bold text-white rounded ' +
          (inputTitle !== '' ? '' : 'bg-gray-300 text-gray-600')
        }
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
          // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
          if (setIsEdit) {
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
