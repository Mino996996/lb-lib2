import React from 'react';

interface Props {
  isInputFieldOpen: boolean;
  setIsInputFieldOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ClosedFormCard: React.VFC<Props> = ({ isInputFieldOpen, setIsInputFieldOpen }) => {
  return (
    <div className="p-1.5 bg-gray-50 overflow-hidden shadow rounded-lg">
      <div className="px-2 py-1 text-sm">
        <span className="mr-4">投稿フォーム</span>
        <button
          className="px-1 bg-gray-50 rounded-sm border border-gray-500"
          onClick={() => {
            setIsInputFieldOpen(!isInputFieldOpen);
          }}
        >
          開く
        </button>
      </div>
    </div>
  );
};
