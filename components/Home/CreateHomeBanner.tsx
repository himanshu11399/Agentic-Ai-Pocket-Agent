import { StyleSheet, Text, TouchableOpacity, View, Image, Animated, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import color from '@/shared/color'
import { useRouter } from 'expo-router'
import UseCreateAgent from './UseCreateAgent'

const CreateHomeBanner = () => {
    const router = useRouter();
    const [visible, setVisible] = useState(false);



    return (
        <View style={styles.container}>
            <Image
                source={require('../../assets/images/agentGroup.png')}
                style={{ height: 95, width: 160, position: 'absolute', left: 0, bottom: 0 }} />
            <View style={{ minWidth: '50%', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', }}>
                <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 10, color: color.WHITE }}>Create Your Own AI Agent!</Text>
                <TouchableOpacity style={{ backgroundColor: color.WHITE, padding: 10, borderRadius: 8, marginBottom: 10 }} onPress={() => setVisible(true)}>
                    <Text style={{ color: color.PRIMARY, fontWeight: 'bold' }}>Create Now</Text>
                </TouchableOpacity>
            </View>

            {/**Modal */}
            <Modal visible={visible} animationType='slide' style={{ height: '90%' }} presentationStyle='pageSheet' >
                <View>
                 <UseCreateAgent onClose={()=>setVisible(false)} />
                </View>
            </Modal>
        </View>
    )
}

export default CreateHomeBanner

const styles = StyleSheet.create({
    container: {
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 10,
        padding: 15,
        minHeight: 120,
        backgroundColor: color.PRIMARY,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-end',
        overflow: 'hidden',
    }

})