import React from 'react';

interface Props {
  title: string;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
}

const EventTitle: React.FC<Props> = ({ title, setIsEdit }) => {
  return (
    <div className="flex justify-between px-4 font-bold py-1 text-base sm:text-lg border-b border-gray-300 overflow-hidden whitespace-nowrap sm:h-9">
      <span className="w-5/6 overflow-hidden">{title}</span>
      <button
        className="ml-2 px-1 text-sm cursor-pointer"
        onClick={() => {
          setIsEdit(true);
        }}
      >
        [編集]
      </button>
    </div>
  );
};

export default EventTitle;
