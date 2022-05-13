import {CategoryInfo, UrlInfo} from "../utilTypes";

export type Obj = {
  pageTitle: string;
  pageImage: string;
  pageDescription: string;
}

export const testABC = (): number => {
  return 123
}

export const urlPattern = new RegExp('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?');

export const createOgpData = async (urlStr:string): Promise<Obj> => {
  const obj: Obj = {
    pageTitle: '',
    pageImage: '',
    pageDescription: '',
  }
  try{
    const res = await fetch(urlStr,{mode:"cors"});
    const data = await res.text();
    const el = new DOMParser().parseFromString(data, "text/html");
    const headEls = (el.head.children);
    const list = Array.from(headEls);
    for (const v of list) {
      if(v.getAttribute('property') === 'og:title'){
        obj.pageTitle = v.getAttribute('content') ? v.getAttribute('content')! :'';
      } else if (v.getAttribute('property') === 'og:image') {
        obj.pageImage = v.getAttribute('content') ? v.getAttribute('content')! :'';
      } else if (v.getAttribute('property') === 'og:description') {
        obj.pageDescription = v.getAttribute('content') ? v.getAttribute('content')! :'';
      }
    }
    return obj;
  } catch (e) {
    // データが取れなかったパターン。ブランクデータを返す
    return obj;
  }
}

export const createId = (num: number): string => {
  const S = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return  Array.from(crypto.getRandomValues(new Uint32Array(num)))
    .map((n) => S[n % S.length])
    .join("");
}

export const pickRelationalTabs = (ulrInfos: UrlInfo[], selectedCategory: string): string[] => {
  const hitUrls = selectedCategory ? ulrInfos.filter(value => value.tagList.includes(selectedCategory)) : ulrInfos;
  const pickedTags: string[] =[];
  for (const urlInfo of hitUrls) {
    for (const tag of urlInfo.tagList) {
      if(!pickedTags.includes(tag)) {
        pickedTags.push(tag);
      }
    }
  }
  return pickedTags.sort((a,b)=>a.localeCompare(b));
}

export const isCategoryTag = (categoryInfoList: CategoryInfo[], tag:string): boolean => {
  return !!categoryInfoList.filter(value => value.category === tag).length;
}

export const createInitTagList = (tagList:string[], selectedTag:string): string[] => {
  if(!!tagList.length && !!selectedTag) {
    if(tagList.includes(selectedTag)) {
      return tagList
    } else {
      return [...tagList, selectedTag]
    }
  } else if (!!tagList.length && !selectedTag) {
    return tagList
  } else if (!tagList.length && !!selectedTag) {
    return [selectedTag];
  }
  return [];
}


