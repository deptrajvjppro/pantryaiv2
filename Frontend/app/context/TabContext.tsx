import React, { createContext, useContext, useState } from 'react';

const TabContext = createContext({
    activeTab: 'index', // Default active tab.
    setActiveTab: (tabName: string) => {}
});

export const useTab = () => useContext(TabContext);

export const TabProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [activeTab, setActiveTab] = useState('index'); // Initial active tab.

    return (
        <TabContext.Provider value={{ activeTab, setActiveTab }}>
            {children}
        </TabContext.Provider>
    );
};
