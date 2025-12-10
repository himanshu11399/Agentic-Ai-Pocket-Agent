import {Stack } from "expo-router";
import { ClerkProvider } from '@clerk/clerk-expo'
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import React from "react";
import * as WebBrowser from "expo-web-browser";
WebBrowser.maybeCompleteAuthSession();

// Read the publishable key from runtime env (fallback to empty string)
const EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY = 'pk_test_cmVsYXRpdmUtYm94ZXItNDkuY2xlcmsuYWNjb3VudHMuZGV2JA';


export default function RootLayout() {


  return (

    <ClerkProvider
     publishableKey={EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}>
        
      
      <Stack screenOptions={{headerShown:false, statusBarStyle:'dark',statusBarAnimation:'none'}} />
      {/* <slot /> */}
    </ClerkProvider>

  )
}

