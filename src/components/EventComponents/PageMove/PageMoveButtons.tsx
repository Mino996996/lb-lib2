import React from 'react';
import BaseButton from '../../UtilComponents/BaseButton';

interface Props {
  pageNum: number;
  setPageNum: React.Dispatch<React.SetStateAction<number>>;
  pageEndNum: number;
  setPageEndNum: React.Dispatch<React.SetStateAction<number>>;
}

const PageMoveButtons: React.FC<Props> = ({ pageNum, pageEndNum, setPageNum }) => {
  return (
    <div className="w-full mb-2">
      <p className="text-center">
        <BaseButton onClickCallback={() => setPageNum(0)} name={'|<<'} />
        {pageNum === 0 ? (
          <BaseButton onClickCallback={() => setPageNum(pageNum)} name={'---'} />
        ) : (
          <BaseButton onClickCallback={() => setPageNum(pageNum - 1)} name={'Back'} />
        )}
        <span className="text-gray-200 px-3">List: {pageNum + 1}</span>
        {pageNum === pageEndNum ? (
          <BaseButton onClickCallback={() => setPageNum(pageNum)} name={'---'} />
        ) : (
          <BaseButton onClickCallback={() => setPageNum(pageNum + 1)} name={'Next'} />
        )}
        <BaseButton onClickCallback={() => setPageNum(pageEndNum)} name={'>>|'} />
      </p>
    </div>
  );
};

export default PageMoveButtons;
