import React, { createContext, useContext, useState } from 'react';

type TabsContextType = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

const TabsContext = createContext<TabsContextType | undefined>(undefined);

export const Tabs: React.FC<{ defaultValue: string; children: React.ReactNode; className?: string }> = ({
  defaultValue,
  children,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={`tabs-container ${className}`}>{children}</div>
    </TabsContext.Provider>
  );
};

export const TabsList: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="flex border-b">{children}</div>;
};

export const TabsTrigger: React.FC<{ value: string; children: React.ReactNode }> = ({
  value,
  children
}) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsTrigger must be used within Tabs');

  const { activeTab, setActiveTab } = context;

  return (
    <button
      className={`px-4 py-2 ${activeTab === value ? 'border-b-2 border-blue-500 font-bold' : ''}`}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </button>
  );
};

export const TabsContent: React.FC<{ value: string; children: React.ReactNode }> = ({
  value,
  children
}) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsContent must be used within Tabs');

  const { activeTab } = context;

  if (activeTab !== value) return null;

  return <div className="tabs-content">{children}</div>;
};