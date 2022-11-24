import React, { useContext, useState } from 'react';
import TitleForm from './Parts/TitleForm';
import UrlForm from './Parts/UrlForm';
import TagForm from './Parts/TagForm';
import MemoForm from './Parts/MemoForm';
import { EventLog } from '../../utilTypes';
import { addUrl, fbPdfImageUpload, fbStorageDelete, fbStorageUpload, updateUrl } from '../../../firebase/firebase';
import { ClosedFormCard } from './ClosedFormCard';
import { AppContext } from '../../state/ConfigProvider';
import FormButtonArea from './Parts/FormButtonArea';
import FileForm from './Parts/FileForm';
import DateForm from './Parts/DateForm';
import { createId } from '../../../utils/utilFinctions';

interface Props {
  initUrlInfo: EventLog;
  mode: 'update' | 'create';
  setIsEdit?: React.Dispatch<React.SetStateAction<boolean>>;
}

// createとupdateを兼ねるコンポーネント。編集時は両立性に注意
export const FormCard: React.FC<Props> = ({ initUrlInfo, mode, setIsEdit }) => {
  const { asc, allEventLogs, setAllEventLogs } = useContext(AppContext);
  const [inputTitle, setInputTitle] = useState(initUrlInfo.title);
  const [inputUrl, setInputUrl] = useState(initUrlInfo.url);
  const [inputMemo, setInputMemo] = useState(initUrlInfo.memo);
  const [inputTagStr, setInputTagStr] = useState('');
  const [inputTagList, setInputTagList] = useState<string[]>(initUrlInfo.tagList);
  const [inputPageTitle, setInputPageTitle] = useState(initUrlInfo.pageTitle);
  const [inputPageImage, setInputPageImage] = useState(initUrlInfo.pageImage);
  const [inputPageDescription, setInputPageDescription] = useState(initUrlInfo.pageDescription);
  const [inputAddTime, setInputAddTime] = useState(initUrlInfo.addTime);
  const [isInputFieldOpen, setIsInputFieldOpen] = useState(false);
  const [inputFile, setInputFile] = useState<File | null>(null);
  const [inputFileId, setInputFileId] = useState(initUrlInfo.fileId);
  const [inputFileUrl, setInputFileUrl] = useState(initUrlInfo.fileUrl);
  const [inputFileName, setInputFileName] = useState(initUrlInfo.fileName);
  const [base64Image, setBase64Image] = useState('');
  const [fileImageId, setFileImageId] = useState(initUrlInfo.fileImageId);
  const [fileImageUrl, setFileImageUrl] = useState(initUrlInfo.fileImageUrl);
  const [status, setStatus] = useState(false);

  const clearInputData = (): void => {
    const nowDate = new Date();
    setInputPageTitle('');
    setInputPageImage('');
    setInputPageDescription('');
    setInputTitle('');
    setInputUrl('');
    setInputMemo('');
    setInputTagStr('');
    setInputTagList([]);
    setInputFile(null);
    setInputAddTime(Math.floor(nowDate.getTime() / 1000));
    setInputFileId('');
    setInputFileUrl('');
    setInputFileName('');
    setBase64Image('');
    setFileImageId('');
    setFileImageUrl('');
  };

  const post = async (): Promise<void> => {
    const id = initUrlInfo.id !== '' ? initUrlInfo.id : createId(12);
    const date = new Date();
    const urlInfo: EventLog = {
      id,
      title: inputTitle,
      url: inputUrl,
      memo: inputMemo,
      tagList: inputTagList,
      pageTitle: inputPageTitle,
      pageImage: inputPageImage,
      pageDescription: inputPageDescription,
      addTime: inputAddTime !== 0 ? inputAddTime : Math.floor(date.getTime() / 1000),
      fileUrl: inputFileUrl,
      fileName: inputFileName,
      fileId: inputFileId,
      fileImageId,
      fileImageUrl,
    };
    try {
      setStatus(true);
      if (mode === 'update') {
        // 更新時の処理
        if (inputFileId !== '' && inputFile != null && inputFile.name.includes('.pdf')) {
          await fbStorageDelete(inputFileId);
          const result = await Promise.all([
            fbStorageUpload(inputFile),
            fbPdfImageUpload(base64Image),
            fbStorageDelete(inputFileId),
            fbStorageDelete(fileImageId),
          ]);
          urlInfo.fileId = result[0].id;
          urlInfo.fileName = result[0].name;
          urlInfo.fileUrl = result[0].url;
          urlInfo.fileImageId = result[1].id;
          urlInfo.fileImageUrl = result[1].url;
        } else if (inputFileId !== '' && inputFile != null) {
          const result = await Promise.all([fbStorageUpload(inputFile), fbStorageDelete(inputFileId)]);
          urlInfo.fileId = result[0].id;
          urlInfo.fileName = result[0].name;
          urlInfo.fileUrl = result[0].url;
          urlInfo.fileImageId = '';
          urlInfo.fileImageUrl = '';
        } else if (inputFile?.name.includes('.pdf') === true) {
          const result = await Promise.all([fbStorageUpload(inputFile), fbPdfImageUpload(base64Image)]);
          urlInfo.fileId = result[0].id;
          urlInfo.fileName = result[0].name;
          urlInfo.fileUrl = result[0].url;
          urlInfo.fileImageId = result[1].id;
          urlInfo.fileImageUrl = result[1].url;
        } else if (inputFile != null) {
          const result = await fbStorageUpload(inputFile);
          urlInfo.fileId = result.id;
          urlInfo.fileName = result.name;
          urlInfo.fileUrl = result.url;
        }
        await updateUrl(urlInfo);
        const indexNum = allEventLogs.findIndex((urlInfo) => urlInfo.id === id);
        allEventLogs[indexNum] = urlInfo;
        setAllEventLogs([...allEventLogs]);
        setIsEdit?.(false);
        setIsInputFieldOpen(false);
      } else {
        // 新規投稿時の処理
        if (inputFile?.name.includes('.pdf') === true) {
          const result = await Promise.all([fbStorageUpload(inputFile), fbPdfImageUpload(base64Image)]);
          urlInfo.fileId = result[0].id;
          urlInfo.fileName = result[0].name;
          urlInfo.fileUrl = result[0].url;
          urlInfo.fileImageId = result[1].id;
          urlInfo.fileImageUrl = result[1].url;
        } else if (inputFile != null) {
          const result = await fbStorageUpload(inputFile);
          urlInfo.fileId = result.id;
          urlInfo.fileName = result.name;
          urlInfo.fileUrl = result.url;
        }
        await addUrl(urlInfo);
        allEventLogs.push(urlInfo);
        const newList = asc
          ? allEventLogs.sort((a, b) => b.addTime - a.addTime)
          : allEventLogs.sort((a, b) => a.addTime - b.addTime);
        setAllEventLogs([...newList]);
        clearInputData();
        setIsInputFieldOpen(false);
      }
      setStatus(false);
    } catch (e) {
      alert(e);
      setStatus(false);
    }
  };

  return (
    <>
      {isInputFieldOpen || !(setIsEdit == null) ? (
        <div className="pt-4 pb-2 px-1.5 bg-white overflow-hidden shadow rounded-lg">
          {status && <h2 className="text-green-500 text-sm p-2">Now Uploading...</h2>}
          <TitleForm inputTitle={inputTitle} setInputTitle={setInputTitle} />
          <DateForm publicationTime={inputAddTime} setPublicationTime={setInputAddTime} />
          <FileForm
            inputFile={inputFile}
            setInputFile={setInputFile}
            inputFileName={inputFileName}
            base64Image={base64Image}
            setBase64Image={setBase64Image}
          />
          <UrlForm
            inputUrl={inputUrl}
            setInputUrl={setInputUrl}
            setInputPageImage={setInputPageImage}
            setInputPageTitle={setInputPageTitle}
            setInputPageDescription={setInputPageDescription}
            inputPageTitle={inputPageTitle}
          />
          <TagForm
            inputTagStr={inputTagStr}
            setInputTagStr={setInputTagStr}
            inputTagList={inputTagList}
            setInputTagList={setInputTagList}
          />
          <MemoForm inputMemo={inputMemo} setInputMemo={setInputMemo} />
          <FormButtonArea
            mode={mode}
            initUrlInfo={initUrlInfo}
            post={post}
            inputTitle={inputTitle}
            isInputFieldOpen={isInputFieldOpen}
            setIsInputFieldOpen={setIsInputFieldOpen}
            setIsEdit={setIsEdit!}
          />
        </div>
      ) : (
        <ClosedFormCard isInputFieldOpen={isInputFieldOpen} setIsInputFieldOpen={setIsInputFieldOpen} />
      )}
    </>
  );
};
