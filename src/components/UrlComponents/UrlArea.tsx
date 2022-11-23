import React, { useContext, useEffect, useState } from 'react';
import { FormCard } from './FormCard/FormCard';
import { UrlCard } from './UrlCard/UrlCard';
import { UrlInfo } from '../utilTypes';
import { urlInfoList } from '../../fixtures/stab/urlStab'; // 表示テスト用デモデータ
import { AppContext } from '../state/ConfigProvider';
import UrlKeyword from './UrlCard/UrlKeyword';

const nowTime = new Date();
const blankUrlInfo: UrlInfo = {
  id: '',
  title: '',
  url: '',
  pageTitle: '',
  pageImage: '',
  pageDescription: '',
  tagList: [],
  memo: '',
  addTime: Math.floor(nowTime.getTime() / 1000),
  fileUrl: '',
  fileName: '',
  fileId: '',
  fileImageUrl: '',
  fileImageId: '',
};

const UrlArea: React.FC = () => {
  const { keywords, selectedCategory, allUrl, asc } = useContext(AppContext);
  const [urlInfos, setUrlInfos] = useState<UrlInfo[]>([]);

  // カテゴリまたは選択タグ変更時の表示URLデータをフィルタリング
  useEffect(() => {
    /* 表示をDBとテストスタブで切り替え */
    let filteredList: UrlInfo[] = [...allUrl]; // データ複製 FromDB
    // let filteredList: UrlInfo[] = [...urlInfoList]; // データ複製 FromStub

    if (!(keywords.length === 0) && !(selectedCategory === '')) {
      // 両方データあり
      const keywordList = keywords.concat(selectedCategory);
      for (const keyword of keywordList) {
        filteredList = filteredList.filter((value) => value.tagList.includes(keyword));
      }
    } else if (!(keywords.length === 0) && selectedCategory === '') {
      // keywordsのみ
      for (const keyword of keywords) {
        filteredList = filteredList.filter((value) => value.tagList.includes(keyword));
      }
    } else if (keywords.length === 0 && !(selectedCategory === '')) {
      // selectedCategoryのみ
      filteredList = filteredList.filter((value) => value.tagList.includes(selectedCategory));
    }
    asc
      ? (filteredList = filteredList.sort((a, b) => b.addTime - a.addTime))
      : (filteredList = filteredList.sort((a, b) => a.addTime - b.addTime));
    setUrlInfos([...filteredList]);
  }, [keywords, selectedCategory, allUrl, asc]);

  return (
    <div className="relative" style={{ height: '96vh' }}>
      {/* URLデータのOutput */}
      <div className="pr-2 lg:pr-6 w-full absolute top-0 left-0 overflow-y-scroll edit-scrollbar url-height">
        {/* 選択中のカテゴリとタグ */}
        <UrlKeyword />
        {/* URL情報一覧 */}
        {urlInfos.map((urlInfo, index) => (
          <UrlCard key={urlInfo.id} urlInfo={urlInfo} index={index} />
        ))}
      </div>
      {/* URLデータのInput */}
      <div className="w-full absolute bottom-14 lg:bottom-0 left-0 pt-4 bg-gray-800">
        <FormCard initUrlInfo={blankUrlInfo} mode={'create'} />
      </div>
    </div>
  );
};

export default UrlArea;
