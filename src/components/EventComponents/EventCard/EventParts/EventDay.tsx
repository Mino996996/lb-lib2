import React from 'react';

interface Props {
  addTime: number;
}

const EventDay: React.FC<Props> = ({ addTime }) => {
  const dateStr = new Date(addTime * 1000);
  return (
    <div className="px-4 pt-1 border-b border-gray-300">
      <p className="inline-block w-full text-gray-700">{dateStr.toLocaleDateString()} 発表</p>
    </div>
  );
};

export default EventDay;
