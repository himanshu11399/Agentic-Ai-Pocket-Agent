import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import color from '@/shared/color'
import { useRouter } from 'expo-router'

type Props = {
    agent: Agent
}

type Agent = {
    id: number,
    name: string,
    desc: string,
    image: string,
    initialText: string,
    prompt: string,
    type: string,
    featured?: boolean
}

const NonFeaturedAgentCart = ({ agent }: Props) => {
    const [isFocused, setIsFocused] = useState(false);
    const router=useRouter();

    return (
        <TouchableOpacity style={{
            backgroundColor: isFocused ? '#0fb0ebff' : '#fff',
            borderRadius: 15,
            borderColor: color.GREY,
            borderWidth: 0.1,
            elevation: 3,
            minHeight: 200,
            overflow: 'hidden',
        }}
            onPressIn={() => setIsFocused(true)}
            onPressOut={() => setIsFocused(false)}
            onPress={() => router.push({
                pathname: '../chat',
                params: {
                    agentName: agent.name,
                    agentInitialText: agent.initialText,
                    agentPrompt: agent.prompt,
                    agentId: agent.id,
                }
            })}
        >
            <View style={{
                padding: 15

            }}>
                {/*@ts-ignore */}
                <Image source={agent.image} style={{
                    width: '70',
                    height: 70,
                    borderBottomLeftRadius: 15,
                    borderBottomRightRadius: 15,
                    resizeMode: 'cover'
                }} />
                <Text style={{
                    fontSize: 20,
                    fontWeight: 'bold'
                }}>{agent.name}</Text>
                <Text
                    numberOfLines={2}
                    style={{
                        color: color.GREY,
                        marginTop: 2
                    }}>{agent.desc}</Text>
            </View>

            <View style={{
                overflow: 'hidden',
                position: 'absolute',
                right: 0,
                bottom: 0

            }}>

            </View>

        </TouchableOpacity>
    )
}


export default NonFeaturedAgentCart

const styles = StyleSheet.create({})