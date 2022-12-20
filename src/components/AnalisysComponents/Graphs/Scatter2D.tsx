import React from 'react';
import Plot from 'react-plotly.js';
import { useEventContext } from '../../state/EventProvider';
import { CategoryInfo, EventLog } from '../../utilTypes';

enum Score {
  Socially,
  Educated,
  Lecture,
}

interface ScatterGraphParams {
  x: number[];
  y: number[];
  mode: string;
  text: string[];
  xaxis: '個性的-社会的' | '実用性-教養性';
  yaxis: '教養性-実用性' | '参加型-講義型';
}
const scatterScores = (eventLogs: EventLog[], allCategories: CategoryInfo[], type: 1 | 2 | 3): ScatterGraphParams => {
  // X軸は社会的/教養的の2種類。Y軸は教養的/講義型の2種で組み合わせているのでこの書き方でOK
  const xScores = type === 2 ? calcScore(eventLogs, allCategories, Score.Educated) : calcScore(eventLogs, allCategories, Score.Socially);
  const yScores = type === 1 ? calcScore(eventLogs, allCategories, Score.Educated) : calcScore(eventLogs, allCategories, Score.Lecture);
  const xAxis = type === 2 ? '実用性-教養性' : '個性的-社会的';
  const yAxis = type === 1 ? '教養性-実用性' : '参加型-講義型';
  return {
    x: xScores,
    y: yScores,
    mode: 'markers',
    text: eventLogs.map((v) => v.title),
    xaxis: xAxis,
    yaxis: yAxis,
  };
};

const calcScore = (eventLogs: EventLog[], allCategories: CategoryInfo[], scoreKind: Score): number[] => {
  return eventLogs.map((v) => {
    let score = 0;
    for (const tag of v.tagList) {
      if (!tag.includes('さん') && tag.slice(-1) !== '年') {
        const mainTag = allCategories.find((value) => value.category === tag);
        if (mainTag?.point?.length != null) {
          score += mainTag.point[scoreKind];
        }
      }
    }
    return score;
  });
};

const titleLabel = (type: 1 | 2 | 3): string => {
  if (type === 1) return '横:個性的-社会的 縦:教養性-実用性';
  if (type === 2) return '横:実用性-教養性 縦:参加型-講義型';
  return '横:個性的-社会的 縦:参加型-講義型';
};

interface props {
  type: 1 | 2 | 3;
}
const Scatter2D: React.FC<props> = ({ type }) => {
  const { allEventLogs, allCategory } = useEventContext();
  return <Plot data={[scatterScores(allEventLogs, allCategory, type)]} layout={{ title: titleLabel(type) }} />;
};

export default Scatter2D;
