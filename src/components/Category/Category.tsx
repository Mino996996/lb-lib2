import React from 'react';
import CategoryForm from './CategoryForm';
import { themeOptions } from './themeList';
import CategoryList from './CategoryList';
import CategoryHeader from './CategoryHeader';

const Category: React.FC = () => {
  return (
    <div className="relative w-full text-gray-400 focus-within:text-gray-600 pr-2 sm:pt-4 min-h-screen">
      <CategoryHeader />

      <h2 className="text-center text-xl text-red-300 font-bold hidden sm:block">= メインカテゴリ =</h2>

      <div className="overflow-y-scroll edit-scrollbar category-height">
        <CategoryList themeOption={themeOptions[1]} />
        <CategoryList themeOption={themeOptions[2]} />
        <CategoryList themeOption={themeOptions[3]} />
      </div>

      <div className="absolute bottom-12 lg:bottom-0 w-full">
        <CategoryForm />
      </div>
    </div>
  );
};

export default Category;
