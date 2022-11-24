import React, { createContext, ReactNode, useContext, useState } from 'react';
import { CategoryInfo, EventLog } from '../utilTypes';

interface EventContextType {
  allCategory: CategoryInfo[];
  setAllCategory: React.Dispatch<React.SetStateAction<CategoryInfo[]>>;
  allEventLogs: EventLog[];
  setAllEventLogs: React.Dispatch<React.SetStateAction<EventLog[]>>;
}

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
export const EventContext = createContext({} as EventContextType);

interface Props {
  children: ReactNode;
}

const EventProvider: React.FC<Props> = ({ children }) => {
  const [allCategory, setAllCategory] = useState<CategoryInfo[]>([]);
  const [allEventLogs, setAllEventLogs] = useState<EventLog[]>([]);

  const value: EventContextType = {
    allCategory,
    setAllCategory,
    allEventLogs,
    setAllEventLogs,
  };

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
};

export default EventProvider;

export const useEventContext = (): EventContextType => useContext(EventContext);
