import React, { createContext, ReactNode, useContext, useState } from 'react';
import { CategoryInfo, EventLog } from '../../utils/utilTypes';
import { getAllCategories, getAllUrls } from '../../firebase/firebase';

interface EventContextType {
  allCategory: CategoryInfo[];
  setAllCategory: React.Dispatch<React.SetStateAction<CategoryInfo[]>>;
  allEventLogs: EventLog[];
  setAllEventLogs: React.Dispatch<React.SetStateAction<EventLog[]>>;
  fetchEventsAndCategories: () => Promise<void>;
}

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
export const EventContext = createContext({} as EventContextType);

interface Props {
  children: ReactNode;
}

const EventProvider: React.FC<Props> = ({ children }) => {
  const [allCategory, setAllCategory] = useState<CategoryInfo[]>([]);
  const [allEventLogs, setAllEventLogs] = useState<EventLog[]>([]);

  const fetchEventsAndCategories = async (): Promise<void> => {
    const [allUrls, allCategories] = await Promise.all([getAllUrls(), getAllCategories()]);
    setAllEventLogs(allUrls);
    setAllCategory(allCategories.sort((a, b) => a.category.localeCompare(b.category)));
  };

  const value: EventContextType = {
    allCategory,
    setAllCategory,
    allEventLogs,
    setAllEventLogs,
    fetchEventsAndCategories,
  };

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
};

export default EventProvider;

export const useEventContext = (): EventContextType => useContext(EventContext);
