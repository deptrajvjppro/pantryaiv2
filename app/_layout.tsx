import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';

//                 {/*INITIAL_LAYOUT */}                  //

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

const tokenCache = {
  async getToken (key: string){
    try {
      return SecureStore.getItemAsync(key);
    }
      catch (err){
        return null;
      }
    },
    async saveToken(key: string,value: string){
      try {
        return SecureStore.setItemAsync(key, value);
      } catch (err){
        return;
      }
    }
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// FONTS
export default function RootLayout() {
  const [loaded, error] = useFonts({
    'mon': require('../assets/fonts/Regular.ttf'),
    'mon-sb': require('../assets/fonts/SemiBold.ttf'),
    'mon-b': require('../assets/fonts/Bold.ttf'),
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ClerkProvider publishableKey = {CLERK_PUBLISHABLE_KEY!} tokenCache={tokenCache}> 
      <RootLayoutNav />
      </ClerkProvider>
 
  );
}


function RootLayoutNav() {

//  Evoke the router
  const router = useRouter();

//Check authentication of users 
  const {isLoaded, isSignedIn} = useAuth();
  useEffect (() => {
    //Clerk is ready but the user is not yet authenticated
    if (isLoaded && !isSignedIn) {
      //push the login page
      router.push('/(modals)/Login');
    }
  }, [isLoaded])

  return (
      <Stack>
    
        <Stack.Screen name="(tabs)" options={{ 
          headerShown: false ,
          }} />
        <Stack.Screen 
        name="(modals)/Login" 
        options={{ 
          title: 'Log in or Sign up',
          presentation: 'modal',
          //Header left of the modal window has
          headerLeft: () =>(
            //a back icon button.
            <TouchableOpacity onPress = {() => router.back()}>
              <Ionicons name = "close-outline" size ={30} color = {Colors.dark}/>
            </TouchableOpacity>
          ),
         
        }} 
        />
        <Stack.Screen
          name = "listing/[id]"
          options={{
            headerTitle: ''
        }}
        />
      </Stack>
    
  );
}
