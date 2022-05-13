import React, {useContext, useState} from 'react';
import { Switch } from '@headlessui/react'
import {AppContext} from "../../state/ContextProvider";

function classNames(...classes:string[]) {
  return classes.filter(Boolean).join(' ')
}

export const ToggleSortButton: React.VFC = () => {
  const {asc, setAsc} = useContext(AppContext);

  return (
    <Switch
      checked={asc}
      className={classNames(
        asc ? 'bg-green-600' : 'bg-gray-200',
        'mx-2 relative inline-flex flex-shrink-0 h-4 w-9 border-2 border-transparent border-gray-400 rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
      )}
      onChange={() => {
        asc ? localStorage.setItem('asc', ''): localStorage.setItem('asc', 'true');
        setAsc(!asc);
      }}
    >
      <span className="sr-only">Use setting</span>
      <span
        aria-hidden="true"
        className={classNames(
          asc ? 'translate-x-5' : 'translate-x-0',
          'pointer-events-none inline-block h-3 w-3 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
        )}
      />
    </Switch>
  )
}
