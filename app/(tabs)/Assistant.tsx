import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Mic } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';



const Assistant = () => {
    const router = useRouter();
    const [isListening, setIsListening] = useState(false);
    const [recognizedText, setRecognizedText] = useState('');

    useEffect(()=>{
    
    },[])

    const handleVoiceChat = async () => {

    }

    const stopListening = async () => {

    }

    const startListening = async () => {
        try {
            setRecognizedText('');
            setIsListening(true);
            // await Voice.start('en-US')
        } catch (error) {
            console.error('Start Listening Error:', error);
            setIsListening(false);
        }
    }

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#c3a2e1ff', "#74bbbbff"]} // light to dark blue tone
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.gradientContainer}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Ai Assistance</Text>
                </View>

                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

                    {/* Center Gradient Circle */}
                    <View style={styles.circleContainer}>
                        <TouchableOpacity onPress={isListening ? stopListening : startListening}
                            activeOpacity={0.7} >
                            <LinearGradient
                                colors={isListening ? ['#ff4ecd', '#4e8cff'] : ['#4e8cff', '#ff4ecd']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.gradientCircle}
                            >
                                <Mic size={50} color={'#fff'} />
                            </LinearGradient>
                        </TouchableOpacity>

                        <Text style={styles.statusText}>
                            {isListening ? 'Listening...' : 'Tap to Talk'}
                        </Text>
                    </View>

                </View>

            </LinearGradient>
        </View>
    );
};

export default Assistant;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradientContainer: {
        flex: 1,
    },
    header: {
        marginTop:30,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: '#c3a2e1ff',
        borderBottomColor: '#ccc',
        borderBottomWidth: 2,
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 4,
    },
    backButton: {
        position: 'absolute',
        left: 10,
        padding: 6,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#fff',
    },
    circleContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    gradientCircle: {
        width: 160,
        height: 160,
        borderRadius: 80,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#4e8cff',
        shadowOpacity: 0.5,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 10 },
        elevation: 15,
    },
    circleText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: '600',
        letterSpacing: 1,
    },
    statusText: {
        color: '#fff',
        fontSize: 18,
        marginTop: 20,
        fontWeight: '500',
    },
});
