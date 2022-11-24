import React, { useContext } from 'react';
import { Switch } from '@headlessui/react';
import { ConfigContext } from '../../state/ConfigProvider';

const classNames = (...classes: string[]): string => classes.filter(Boolean).join(' ');

interface Props {
  kind: 'image' | 'memo';
}

export const ToggleButton: React.FC<Props> = ({ kind }) => {
  const { imageVisible, setImageVisible, memoVisible, setMemoVisible } = useContext(ConfigContext);
  const visible = kind === 'image' ? imageVisible : memoVisible;
  const setVisible = kind === 'image' ? setImageVisible : setMemoVisible;

  return (
    <Switch
      checked={visible}
      className={classNames(
        visible ? 'bg-green-600' : 'bg-gray-200',
        'mx-2 relative inline-flex flex-shrink-0 h-4 w-9 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-700'
      )}
      onChange={() => {
        if (kind === 'image') {
          visible ? localStorage.setItem('image', '') : localStorage.setItem('image', 'true');
        } else {
          visible ? localStorage.setItem('memo', '') : localStorage.setItem('memo', 'true');
        }
        setVisible(!visible);
      }}
    >
      <span
        aria-hidden="true"
        className={classNames(
          visible ? 'translate-x-5' : 'translate-x-0',
          'pointer-events-none inline-block h-3 w-3 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
        )}
      />
    </Switch>
  );
};
