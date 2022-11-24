import React, { useContext, useState } from 'react';
import Plot from 'react-plotly.js';
import { AppContext } from '../state/ConfigProvider';
import BaseButton from '../EventComponents/Buttons/BaseButton';

const Graph3D: React.FC = () => {
  const { allUrl, allCategory } = useContext(AppContext);
  const [count, setCount] = useState(0);
  const countChange = (): void => {
    setCount((count + 1) % 3);
  };

  const data1 = [
    {
      x: allUrl.map((v) => {
        let score = 0;
        for (const tag of v.tagList) {
          if (!tag.includes('さん') && !tag.includes('年')) {
            const mainTag = allCategory.find((value) => value.category === tag);
            if (mainTag?.point?.length != null) {
              score += mainTag.point[0];
            }
          }
        }
        return score;
      }),
      y: allUrl.map((v) => {
        let score = 0;
        for (const tag of v.tagList) {
          if (!tag.includes('さん') && !tag.includes('年')) {
            const mainTag = allCategory.find((value) => value.category === tag);
            if (mainTag?.point?.length != null) {
              score += mainTag.point[1];
            }
          }
        }
        return score;
      }),
      mode: 'markers',
      text: allUrl.map((v) => v.title),
      xaxis: '個性的-社会的',
      yaxis: '教養-実用',
    },
  ];
  const data2 = [
    {
      x: allUrl.map((v) => {
        let score = 0;
        for (const tag of v.tagList) {
          if (!tag.includes('さん') && !tag.includes('年')) {
            const mainTag = allCategory.find((value) => value.category === tag);
            if (mainTag?.point?.length != null) {
              score += mainTag.point[1];
            }
          }
        }
        return score;
      }),
      y: allUrl.map((v) => {
        let score = 0;
        for (const tag of v.tagList) {
          if (!tag.includes('さん') && !tag.includes('年')) {
            const mainTag = allCategory.find((value) => value.category === tag);
            if (mainTag?.point?.length != null) {
              score += mainTag.point[2];
            }
          }
        }
        return score;
      }),
      mode: 'markers',
      text: allUrl.map((v) => v.title),
      xaxis: '個性的-社会的',
      yaxis: '教養-実用',
    },
  ];
  const data3 = [
    {
      x: allUrl.map((v) => {
        let score = 0;
        for (const tag of v.tagList) {
          if (!tag.includes('さん') && !tag.includes('年')) {
            const mainTag = allCategory.find((value) => value.category === tag);
            if (mainTag?.point?.length != null) {
              score += mainTag.point[0];
            }
          }
        }
        return score;
      }),
      y: allUrl.map((v) => {
        let score = 0;
        for (const tag of v.tagList) {
          if (!tag.includes('さん') && !tag.includes('年')) {
            const mainTag = allCategory.find((value) => value.category === tag);
            if (mainTag?.point?.length != null) {
              score += mainTag.point[2];
            }
          }
        }
        return score;
      }),
      mode: 'markers',
      text: allUrl.map((v) => v.title),
      xaxis: '個性的-社会的',
      yaxis: '教養-実用',
    },
  ];

  const layout1 = { title: '横:個性的-社会的 縦:教養性-実用性' };
  const layout2 = { title: '横:実用性-教養性 縦:参加型-講義型' };
  const layout3 = { title: '横:個性的-社会的 縦:参加型-講義型' };

  return (
    <>
      <BaseButton onClickCallback={countChange} name={'次のグラフ'} />
      {count === 0 && <Plot data={data1} layout={layout1} />}
      {count === 1 && <Plot data={data2} layout={layout2} />}
      {count === 2 && <Plot data={data3} layout={layout3} />}
    </>
  );
};

export default Graph3D;
