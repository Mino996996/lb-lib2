import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import CategoryArea from '../CategoryComponents/CategoryArea';
import ConfigArea from '../ConfigComponents/ConfigArea';

interface Props {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const MobileSideBarCF: React.FC<Props> = ({ sidebarOpen, setSidebarOpen }) => {
  const [categoryTab, setCategoryTab] = useState(true);
  return (
    <Transition.Root show={sidebarOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 flex z-40 lg:hidden" onClose={setSidebarOpen}>
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="transition ease-in-out duration-300 transform"
          enterFrom="-translate-x-full"
          enterTo="translate-x-0"
          leave="transition ease-in-out duration-300 transform"
          leaveFrom="translate-x-0"
          leaveTo="-translate-x-full"
        >
          <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-gray-800">
            <Transition.Child
              as={Fragment}
              enter="ease-in-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in-out duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  type="button"
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none text-white"
                  onClick={() => setSidebarOpen(false)}
                >
                  [X]
                </button>
              </div>
            </Transition.Child>
            <div className="md:hidden ml-4 border-b-2 border-gray-400 pb-1 box-content">
              <span
                onClick={() => setCategoryTab(true)}
                className={
                  'ml-1 border-2 border-b-0 border-gray-400 rounded-t-lg p-2 cursor-pointer font-bold box-content ' +
                  (categoryTab ? 'bg-indigo-200' : 'bg-gray-300 text-gray-600')
                }
              >
                カテゴリ選択
              </span>
              <span
                onClick={() => setCategoryTab(false)}
                className={
                  'ml-0.5 border-2 border-b-0 border-gray-400 rounded-t-lg p-2 cursor-pointer font-bold box-content ' +
                  (categoryTab ? 'bg-gray-300 text-gray-600' : 'bg-indigo-200')
                }
              >
                表示/タグ選択
              </span>
            </div>
            <div className="items-center px-4">{categoryTab ? <CategoryArea /> : <ConfigArea />}</div>
          </div>
        </Transition.Child>
        <div className="flex-shrink-0 w-14" aria-hidden="true">
          {/* Dummy element to force sidebar to shrink to fit close icon */}
        </div>
      </Dialog>
    </Transition.Root>
  );
};

const MobileSideBar = React.memo(MobileSideBarCF);

export default MobileSideBar;
