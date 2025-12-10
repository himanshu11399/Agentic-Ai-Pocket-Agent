import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { MoveLeftIcon } from 'lucide-react-native'
import color from '@/shared/color'
import { Router, useRouter } from 'expo-router'

const PaymentComponent = () => {
    const router=useRouter();

    const handleback=()=>{
       router.replace('./')
    }
    return (
        <View>
            {/* header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={()=>handleback()}>
                    <MoveLeftIcon size={28} color={color.PRIMARY} />
                </TouchableOpacity>
                <Text style={{ fontSize: 20, fontWeight: 'bold', paddingLeft: 20 }}>Payment</Text>
            </View>
        </View>
    )
}

export default PaymentComponent

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
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
})