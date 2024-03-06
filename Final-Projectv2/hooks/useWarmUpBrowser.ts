import { useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';

//Improve the performance of the app when run on Android 
export const useWarmupBrowser = () => {
    useEffect(() => {
        void WebBrowser.warmUpAsync();
        return () => {
            void WebBrowser.coolDownAsync();
        };
    }, []);
};