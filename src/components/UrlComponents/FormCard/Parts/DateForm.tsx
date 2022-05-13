import React from 'react';

type Props = {
  publicationTime: number;
  setPublicationTime: React.Dispatch<React.SetStateAction<number>>;
}

const changeToDateStr = (unix:number) => {
  const date = new Date(unix*1000);
  return date.toLocaleDateString();
}

export const changeDateStyle = (dateStr:string) => {
  const dateList = dateStr.split('/');
  return `${dateList[0]}-${('00'+dateList[1]).slice(-2)}-${('00'+dateList[2]).slice(-2)}`
}

const DateForm: React.VFC<Props> = (props) => {
  return (
    <div className='px-2 pb-1 text-sm'>
      <label className='inline-block w-12' htmlFor="inputDate">発表日:</label>
      <input
        className='w-7/12 border border-gray-300'
        id='inputDate'
        type="date"
        value={changeToDateStr(props.publicationTime)}
        onChange={ (e: React.ChangeEvent<HTMLInputElement>)=>{
          const selectedTime = new Date(e.target.value);
          props.setPublicationTime(Math.floor(selectedTime.getTime() / 1000));
        }}
      />
    </div>
  );
};

export default DateForm;
