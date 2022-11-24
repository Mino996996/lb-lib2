import React, { useContext } from 'react';
import { Switch } from '@headlessui/react';
import { ConfigContext } from '../../state/ConfigProvider';

const classNames = (...classes: string[]): string => classes.filter(Boolean).join(' ');

export const ToggleSortButton: React.VFC = () => {
  const { asc, setAsc } = useContext(ConfigContext);

  return (
    <Switch
      checked={asc}
      className={classNames(
        asc ? 'bg-green-600' : 'bg-gray-200',
        'mx-2 relative inline-flex flex-shrink-0 h-4 w-9 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-700'
      )}
      onChange={() => {
        asc ? localStorage.setItem('asc', '') : localStorage.setItem('asc', 'true');
        setAsc(!asc);
      }}
    >
      <span
        aria-hidden="true"
        className={classNames(
          asc ? 'translate-x-5' : 'translate-x-0',
          'pointer-events-none inline-block h-3 w-3 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
        )}
      />
    </Switch>
  );
};
