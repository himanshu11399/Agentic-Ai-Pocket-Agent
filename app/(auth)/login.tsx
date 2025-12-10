import { View, Text, TouchableOpacity, Image, StyleSheet, Platform, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useCallback, useEffect } from 'react'
import * as WebBrowser from 'expo-web-browser'
import * as AuthSession from 'expo-auth-session'
import { useSSO } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router';
import { firestoreDb } from '@/config/firbaseconfig';
import { setDoc, doc } from 'firebase/firestore';
import { useAuth } from '@clerk/clerk-expo';

// Preloads the browser for Android devices to reduce authentication load time
// See: https://docs.expo.dev/guides/authentication/#improving-user-experience
export const useWarmUpBrowser = () => {
    useEffect(() => {
        if (Platform.OS !== 'android') return
        void WebBrowser.warmUpAsync()
        return () => {
            // Cleanup: closes browser when component unmounts
            void WebBrowser.coolDownAsync()
        }
    }, [])
};

// Handle any pending authentication sessions
WebBrowser.maybeCompleteAuthSession();

const Login = () => {
    useWarmUpBrowser();



    // Use the `useSSO()` hook to access the `startSSOFlow()` method
    const { startSSOFlow } = useSSO()
    const router = useRouter();
    const { isSignedIn } = useAuth();

    useEffect(() => {
        if (isSignedIn) {
            router.replace('/(tabs)/Home');
        }
        }, [isSignedIn]);

    const onLogin = useCallback(async () => {
        try {
            if(isSignedIn){
                router.replace('/(tabs)/Home');
                return;
            }

            // Start the authentication process by calling `startSSOFlow()`
            const { createdSessionId, setActive, signIn, signUp } = await startSSOFlow({
                strategy: 'oauth_google',
                // For web, defaults to current path
                // For native, you must pass a scheme, like AuthSession.makeRedirectUri({ scheme, path })
                // For more info, see https://docs.expo.dev/versions/latest/sdk/auth-session/#authsessionmakeredirecturioptions
                redirectUrl: AuthSession.makeRedirectUri(),
            })

            // If sign up was successful, create user document in Firestore
            if (signUp && firestoreDb && signUp?.emailAddress) {
                const userEmail = signUp.emailAddress.trim().toLowerCase();
                await setDoc(doc(firestoreDb, 'users', userEmail), {
                    email: userEmail,
                    name: `${signUp?.firstName ?? ''} ${signUp?.lastName ?? ''}`.trim(),
                    createdAt: Date.now(),
                    credits: 20
                },{ merge: true });
            }



            // If sign in was successful, set the active session
            if (createdSessionId) {
                setActive!({
                    session: createdSessionId,
                    // Check for session tasks and navigate to custom UI to help users resolve them
                    // See https://clerk.com/docs/guides/development/custom-flows/overview#session-tasks
                    navigate: async ({ session }) => {
                        if (session?.currentTask) {
                            console.log(session?.currentTask)
                            router.replace('/(tabs)/Home') // Replace with custom session task handling UI
                            return
                        }

                        router.replace('/(tabs)/Home') // Navigate to the main app after successful sign in
                    },
                })
            } else {
                // If there is no `createdSessionId`,
                // there are missing requirements, such as MFA
                // See https://clerk.com/docs/guides/development/custom-flows/authentication/oauth-connections#handle-missing-requirements
            }
        } catch (err) {
            // See https://clerk.com/docs/guides/development/custom-flows/error-handling
            // for more info on error handling
            console.error(JSON.stringify(err, null, 2));
            Alert.alert('Login Failed', 'An error occurred during login. Please try again.');
        }

    }, [isSignedIn]);

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={['#0F172A', '#1E293B', '#334155']}
                style={styles.gradient}
            >
                {/* Logo and Title */}
                <View style={styles.topContainer}>
                    <Image
                        source={require("../../assets/images/agent_1.png")}
                        style={styles.logo}
                    />
                    <Text style={styles.title}>AI Agent</Text>
                    <Text style={styles.subtitle}>Your Personal Smart Assistant</Text>
                </View>

                {/* Google Button */}
                <View style={styles.bottomContainer}>
                    <TouchableOpacity style={styles.googleButton} activeOpacity={0.8} onPress={onLogin} disabled={isSignedIn}>

                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {/* <Image style={{ width: 24, height: 24, marginRight: 10 }} source={require('../../assets/images/agent_1.png')} /> */}
                            <Text style={styles.googleButtonText}>Sign in with Google</Text>
                        </View>

                    </TouchableOpacity>

                    <Text style={styles.footerText}>
                        By continuing, you agree to our Terms & Privacy Policy
                    </Text>
                </View>
            </LinearGradient>
        </SafeAreaView>
    );
};

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 60,
        paddingHorizontal: 25,
    },
    topContainer: {
        alignItems: 'center',
        marginTop: 60,
    },
    logo: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 25,
    },
    title: {
        fontSize: 36,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: 1,
    },
    subtitle: {
        fontSize: 16,
        color: '#CBD5E1',
        marginTop: 8,
    },
    bottomContainer: {
        alignItems: 'center',
        width: '100%',
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        paddingVertical: 14,
        paddingHorizontal: 20,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 6,
        elevation: 5,
        width: '85%',
        justifyContent: 'center',
    },
    googleIcon: {
        width: 24,
        height: 24,
        marginRight: 10,
    },
    googleButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
    footerText: {
        color: '#94A3B8',
        fontSize: 12,
        marginTop: 15,
        textAlign: 'center',
    },
});
