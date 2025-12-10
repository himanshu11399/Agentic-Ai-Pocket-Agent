import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore'
import { firestoreDb } from '@/config/firbaseconfig'
import { useUser } from '@clerk/clerk-expo'

import color from '@/shared/color'
import { ArrowRightIcon } from 'lucide-react-native'
import { useRouter } from 'expo-router'


type Agent = {
    agentName: string,
    agentId: string,
    prompt: string,
    emoji: string,
}

const UserCreatedAgentList = () => {
    const { user } = useUser();
    const [agentList, setAgentList] = useState<Agent[]>([]);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    

    useEffect(() => {
        user && GetUserAgents();
    }, [user])
    const GetUserAgents = async () => {
        const q = query(collection(firestoreDb!, 'agents'),
            where('userEmail', '==', user?.primaryEmailAddress?.emailAddress));
        setAgentList([]);
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            //@ts-ignore
            setAgentList((prev) => [...prev, {
                ...doc.data(),
                agentId: doc.id
            }])
        })

    }

    const handleDelete = (agentId: string) => {

        Alert.alert('Delete', "Are You Sure You want to Delete This One",
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Delete Now',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setLoading(true)
                            await deleteDoc(doc(firestoreDb!, 'agents', agentId));
                            setLoading(false);
                            GetUserAgents();
                            console.log("Agent Deltred:-", agentId);
                        } catch (error) {
                            console.error("Error while deleteing agent:", error)
                        }
                    }
                }
            ]
        )
    }


    return (
        <View style={{ marginVertical: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>My Agents:-</Text>

            {loading === true ? (
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size='large' />
                </View>
            ) : (
                <FlatList
                    data={agentList}
                    renderItem={({ item, index }) => (


                        <View style={styles.agentList}>

                            <Text style={{ fontSize: 20 }}>{item.emoji}</Text>
                            <TouchableOpacity onLongPress={() => handleDelete(item.agentId)}>
                                <Text>{item.agentName}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => router.push({
                                    pathname: '/chat',
                                    params: {
                                        agentName: item.agentName,
                                        initialText: 'How can I help You ',
                                        agentPrompt: item.prompt,
                                        agentId: item.agentId
                                    }
                                })}

                            >
                                <ArrowRightIcon size={24} color={color.PRIMARY} />
                            </TouchableOpacity>

                        </View>

                    )}
                />
            )
            }


        </View>
    )
}

export default UserCreatedAgentList

const styles = StyleSheet.create({
    agentList: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        borderColor: '#0d6e7dff',
        borderWidth: 1,
        marginVertical: 5,
        borderRadius: 10,

    }
})