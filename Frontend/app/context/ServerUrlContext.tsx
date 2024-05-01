// context/ServerUrlContext.js
import React, { createContext, useContext } from 'react';

const ServerUrlContext = createContext('http://127.0.0.1:5000');

export const useServerUrl = () => useContext(ServerUrlContext);

export const ServerUrlProvider = ({ children }) => {
    return (
        <ServerUrlContext.Provider value='http://127.0.0.1:5000'>
            {children}
        </ServerUrlContext.Provider>
    );
};
