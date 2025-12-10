import { Alert, StyleSheet, ToastAndroid, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { MoveLeftIcon } from 'lucide-react-native'
import { useRouter } from 'expo-router'
import color from '@/shared/color'
import EmojiPicker from 'rn-emoji-keyboard'
import { LinearGradient } from 'expo-linear-gradient'
import { doc, setDoc } from 'firebase/firestore'
import { useUser } from '@clerk/clerk-expo'
import { firestoreDb } from '@/config/firbaseconfig'
import { on } from 'events'

const UseCreateAgent = ({ onClose }: { onClose: () => void }) => {
    const [showPicker, setShowPicker] = useState(false);
    const [selectemoji, setEmoji] = useState('🤖');
    const [agentName, setAgentName] = useState<string>('');
    const [agentInstruction, setAgentInstruction] = useState<string>('');
    const [loading, setloading] = useState(false);
    const { user } = useUser();
    const router = useRouter();

    const CreateNewAgent = async () => {
        if (!agentName || !agentInstruction || !selectemoji) {
            Alert.alert("Please Enter all fields Correctly ",
                "All are the Required Field");
            return;
        }

        setloading(true)
        let agentId = Date.now().toString();
        await setDoc(doc(firestoreDb!, 'agents', agentId), {
            emoji: selectemoji,
            agentName: agentName,
            agentId: agentId,
            prompt: agentInstruction,
            userEmail: user?.primaryEmailAddress?.emailAddress
        });
        setloading(false)

        Alert.alert("🪄 Congratulation 🪄",
            "Agent Created Sucessfully!",
            [
                {
                    text: 'Ok',
                    onPress: () => onClose(),
                    style: 'cancel'
                },
                {
                    text: 'Try Now',
                    onPress: () => router.push({
                        pathname: '/chat',
                        params: {
                            agentName: agentName,
                            initialText: "How can I Help You Today",
                            agentPrompt: agentInstruction,
                            agentId: agentId
                        }
                    })
                }
            ])

    }

    return (
        <View>
            {/* header */}
            <View style={styles.header}>
                <TouchableOpacity style={{ marginRight: 20 }} onPress={onClose}>
                    <MoveLeftIcon size={24} color="#3692ff" />
                </TouchableOpacity>

                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Create Agent</Text>
                <View style={{ flex: 1, alignItems: 'flex-end', flexDirection: 'row', justifyContent: 'flex-end' }}>
                </View>
            </View>

            {loading === true ? (
                <View style={{alignItems:'center',justifyContent:'center'}}>
                    <ActivityIndicator size='large' color='#0000FF' />
                </View>
            ) : (
                <View>
                    {/**Emoji Picker */}
                    <View style={{ padding: 10, alignItems: 'center', justifyContent: 'center' }}>
                        <TouchableOpacity style={{ padding: 20, borderWidth: 2, borderRadius: 20, borderColor: '#ccc' }}
                            onPress={() => setShowPicker(true)}>
                            <Text
                                style={{ fontSize: 50 }}
                            >{selectemoji}</Text>
                        </TouchableOpacity>

                        <EmojiPicker onEmojiSelected={(event) => setEmoji(event.emoji)} open={showPicker} onClose={() => setShowPicker(false)} />
                    </View>

                    {/**Name Input */}
                    <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
                        <Text style={{ padding: 5, fontSize: 18 }}>
                            Agent/Assistant Name
                        </Text>
                        <TextInput
                            placeholder='Agent Name'
                            style={[styles.input]}
                            onChangeText={(v) => setAgentName(v)} />
                    </View>

                    {/**Name Input */}
                    <View style={{ paddingHorizontal: 20, paddingTop: 15 }}>
                        <Text style={{ padding: 5, fontSize: 18 }}>
                            Instructions
                        </Text>
                        <TextInput
                            placeholder='Agent Instruction (Mandatory)'
                            style={[styles.input, { height: 150, textAlignVertical: 'top', maxHeight: 200 }]}
                            onChangeText={(v) => setAgentInstruction(v)}
                            multiline={true} />
                    </View>


                    <TouchableOpacity
                        style={styles.submitbtn}
                        onPress={CreateNewAgent}
                    >
                        <Text style={{ fontSize: 20, color: color.WHITE }} >
                            Create Agent
                        </Text>
                    </TouchableOpacity>

                </View>

            )
            }

        </View>
        )
    
    }
    
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#a29f9fff',
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'flex-start', // space out items
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingVertical: 16,
            backgroundColor: '#fff',
            borderBottomColor: '#ccc',
            borderBottomWidth: 2,
            shadowOpacity: 0.1,
            shadowOffset: { width: 0, height: 0 },
            shadowRadius: 4,
        },
        input: {
            borderRadius: 10,
            padding: 8,
            fontSize: 18,
            borderWidth: 1,
    
        },
        submitbtn: {
            backgroundColor: color.PRIMARY,
            margin: 20,
            padding: 15,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10
        }
    });
    
    export default UseCreateAgent;