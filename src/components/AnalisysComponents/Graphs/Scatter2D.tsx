import React from 'react';
import Plot from 'react-plotly.js';
import { CategoryInfo, EventLog } from '../../utilTypes';
import * as Plotly from 'plotly.js';
import { Score } from './Score';
import { totalScores } from './graphFunctions';

const scatterScores = (eventLogs: EventLog[], allCategories: CategoryInfo[], type: 1 | 2 | 3): Plotly.Data[] => {
  // X軸は社会的/教養的の2種類。Y軸は教養的/講義型の2種で組み合わせているのでこの書き方でOK
  const xScores =
    type === 2 ? totalScores(eventLogs, allCategories, Score.Educated) : totalScores(eventLogs, allCategories, Score.Socially);
  const yScores = type === 1 ? totalScores(eventLogs, allCategories, Score.Educated) : totalScores(eventLogs, allCategories, Score.Lecture);
  const xAxis = type === 2 ? '実用性-教養性' : '個性的-社会的';
  const yAxis = type === 1 ? '教養性-実用性' : '参加型-講義型';
  return [
    {
      x: xScores,
      y: yScores,
      mode: 'markers',
      text: eventLogs.map((v) => v.title),
      xaxis: xAxis,
      yaxis: yAxis,
      marker: { color: 'blue' },
    },
  ];
};

const titleLabel = (type: 1 | 2 | 3): string => {
  if (type === 1) return '←個性的-社会的→  ↑教養性-実用性↓';
  if (type === 2) return '←実用性-教養性→  ↑参加型-講義型↓';
  return '←個性的-社会的→  ↑参加型-講義型↓';
};

interface props {
  type: 1 | 2 | 3;
  eventLogs: EventLog[];
  categories: CategoryInfo[];
}
const Scatter2D: React.FC<props> = ({ type, eventLogs, categories }) => {
  return (
    <Plot
      data={scatterScores(eventLogs, categories, type)}
      layout={{
        title: titleLabel(type),
        autosize: true,
        xaxis: { range: [-10, 10] },
        yaxis: { range: [-10, 10] },
        margin: { t: 50, b: 40, l: 40, r: 40 },
      }}
      useResizeHandler={true}
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default Scatter2D;
