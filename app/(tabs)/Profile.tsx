import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Image, Modal } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { UserIcon, PlusCircle, Clock, Compass, LogOut } from 'lucide-react-native'
import color from '@/shared/color'
import { useAuth, useUser } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import UseCreateAgent from '@/components/Home/UseCreateAgent'
import { LinearGradient } from 'expo-linear-gradient';



const Profile = () => {
  const { signOut } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const [visible, setVisible] = useState(false);


  const handleLogout = async () => {
    if (loading) return; // Prevent multiple logout attempts
    setLoading(true);
    try {
      await signOut();
      setLoading(false);
      console.log('User signed out successfully');
      Alert.alert('Logged Out', 'You have been successfully logged out.');
      setTimeout(() => {
        router.replace('/login');
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error during sign out:', error);
      Alert.alert('Logout Failed', 'An error occurred while logging out. Please try again.');
    }
  }
  return (
    <View style={styles.safeArea}>
      <LinearGradient
        colors={['#c3a2e1ff', "#74bbbbff"]} // light to dark blue tone
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradientContainer}
      >
        {/* header */}
        <View style={styles.header}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Profile</Text>
        </View>

        {loading === true ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}  >
            <ActivityIndicator size='large' color={color.PRIMARY} />
          </View>
        ) : (
          <View>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', minHeight: 250 }}  >
              <View style={{ height: 150, width: 150, borderRadius: 75, backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', borderColor: '#000', borderWidth: 2 }}>
                <Image source={{ uri: user?.imageUrl }} style={{ height: 150, width: 150 }} />
              </View>
              <Text style={{ fontSize: 26 }}>{user?.fullName}</Text>
            </View>

            {/* Profile Details */}
            <TouchableOpacity style={styles.button} onPress={() => setVisible(true)}>
              <PlusCircle size={24} color="#3692ff" />
              <Text style={{ marginLeft: 10, fontSize: 16, color: color.BLACK, }}>Create Agent</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => router.push('/Explore')} >
              <Compass size={24} color="#3692ff" />
              <Text style={{ marginLeft: 10, fontSize: 16, color: color.BLACK, }}>Explore</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => router.push('/(tabs)/History')}>
              <Clock size={24} color="#3692ff" />
              <Text style={{ marginLeft: 10, fontSize: 16, color: color.BLACK, }}>My History</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => handleLogout()}>
              <LogOut size={24} color="#ff0000" />
              <Text style={{ marginLeft: 10, fontSize: 16, color: color.BLACK, }}>Logout</Text>
            </TouchableOpacity>
          </View>


        )
        }

        <Modal visible={visible} animationType='slide' style={{ height: '90%' }} presentationStyle='pageSheet' >
          <View>
            <UseCreateAgent onClose={() => setVisible(false)} />
          </View>
        </Modal>


      </LinearGradient>
    </View >
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff', // fallback if gradient fails to load
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  gradientContainer: {
    flex: 1,
  },
  header: {
    marginTop:30,
    flexDirection: 'row',
    justifyContent: 'flex-start', // space out items
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#c3a2e1ff',
    borderBottomColor: '#5a5757ff',
    borderBottomWidth: 2,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 4,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderBottomColor: '#999595ff',
    borderBottomWidth: 1,
    marginHorizontal: 4
  }

})

export default Profile;