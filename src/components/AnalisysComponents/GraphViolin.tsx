import React, { useContext } from 'react';
import { AppContext } from '../state/ConfigProvider';
import { Layout, ViolinData } from 'plotly.js';
import Plot from 'react-plotly.js';
import { scores, Tend } from './graphFunctions';
import { CategoryInfo, UrlInfo } from '../utilTypes';
import { Theme } from '../CategoryComponents/themeList';

const violinData = (urls: UrlInfo[], categories: CategoryInfo[], tend: Tend): Array<Partial<ViolinData>> => {
  const persons = categories.filter((value) => value.theme === Theme.member);
  return persons.map((value) => {
    return {
      type: 'violin',
      points: 'all',
      name: value.category,
      x: scores(urls, categories, value.category, 'all', tend),
      orientation: 'h',
      // text: urls.map(value => value.title)
    };
  });
};

const GraphViolin: React.FC = () => {
  const { allUrl, allCategory } = useContext(AppContext);

  const layout1: Partial<Layout> = {
    title: '発表傾向：個人-社会的',
    xaxis: { zeroline: true },
    autosize: true,
    width: 1200,
  };
  const allData = violinData(allUrl, allCategory, Tend.social);
  return <Plot data={allData} layout={layout1} />;
};

export default GraphViolin;
