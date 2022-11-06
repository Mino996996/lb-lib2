import React, { useState } from 'react';
import { urlPattern } from '../../cardFunctions';
import { getOgpData } from '../../../../firebase/firebase';

interface Props {
  inputUrl: string;
  setInputUrl: React.Dispatch<React.SetStateAction<string>>;
  setInputPageImage: React.Dispatch<React.SetStateAction<string>>;
  inputPageTitle: string;
  setInputPageTitle: React.Dispatch<React.SetStateAction<string>>;
  setInputPageDescription: React.Dispatch<React.SetStateAction<string>>;
}

const UrlForm: React.FC<Props> = (props) => {
  const [isFetching, setIsFetching] = useState(false);

  return (
    <div className="px-2 pb-1 text-sm">
      <label className="inline-block w-12 text-xs sm:text-sm" htmlFor="inputUrl">
        URL:
      </label>
      <input
        className="pl-1 w-9/12 sm:w-7/12 border border-gray-300"
        id="inputUrl"
        type="url"
        placeholder="https://example.com"
        pattern="http(s)?://.*"
        value={props.inputUrl}
        onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
          if (e.target.value) {
            props.setInputUrl(e.target.value);
            if (urlPattern.test(e.target.value)) {
              setIsFetching(true);
              try {
                const result = await getOgpData(e.target.value);
                props.setInputPageImage(result.pageImage);
                props.setInputPageTitle(result.pageTitle);
                props.setInputPageDescription(result.pageDescription);
              } catch (e) {
                props.setInputUrl('');
                props.setInputPageImage('');
                props.setInputPageTitle('');
                props.setInputPageDescription('');
              }
              await setIsFetching(false);
            }
          } else {
            props.setInputUrl('');
            props.setInputPageImage('');
            props.setInputPageTitle('');
            props.setInputPageDescription('');
          }
        }}
      />
      {isFetching && <span className={'ml-3 text-orange-500'}>データ取得中</span>}
    </div>
  );
};

export default UrlForm;
