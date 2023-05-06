import React from 'react';

interface props {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}

const CategoryTextInput: React.FC<props> = ({ value, setValue }) => {
  return (
    <input
      className="bg-green-50 w-11/12 pl-2 mb-1 border border-gray-500 rounded text-gray-700"
      type="text"
      value={value}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
      }}
    />
  );
};

export default CategoryTextInput;
