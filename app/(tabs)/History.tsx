import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { firestoreDb } from '@/config/firbaseconfig'
import { useUser } from '@clerk/clerk-expo'
import { MessageCircleMore } from 'lucide-react-native'
import color from '@/shared/color'
import { useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient';

type History = {
  agentInitialText: string,
  agentName: string,
  agentPrompt: string,
  messages: { content: string }[],
  userEmail: string
}

const History = () => {

  const { user } = useUser();
  const [userchats, setUserChats] = useState<History[]>([]);
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await getChats();
    setRefreshing(false);
  };

  useEffect(() => {
    if (user) getChats();
  }, [user]);

  const getChats = async () => {
    const q = query(
      collection(firestoreDb!, 'chats'),
      where('userEmail', '==', user?.primaryEmailAddress?.emailAddress)
    );

    const querySnapshot = await getDocs(q);

    // Create a temp array for storing data
    const chats: History[] = [];

    querySnapshot.forEach((doc) => {
      chats.push(doc.data() as History);
    });

    setUserChats(chats);
  };

  const OnhandleClick = (item: History) => {
    router.push({
      pathname: '/chat',
      params: {
        agentName: item.agentName,
        initialText: item.agentInitialText,
        agentPrompt: item.agentPrompt,
        agentId: item.userEmail,
        messagesList: JSON.stringify(item.messages)
      }
    });
  };

  return (
    <View style={styles.safeArea}>
      <LinearGradient
        colors={['#c3a2e1ff', "#74bbbbff"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradientContainer}
      >

        {/* Header */}
        <View style={styles.header}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>History</Text>
        </View>

        {/* FIX: FlatList without ScrollView */}
        <FlatList

          data={userchats}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity activeOpacity={0.6} onPress={() => OnhandleClick(item)}>
              <View style={styles.list}>
                <MessageCircleMore size={30} />
                <View style={{ width: '90%', paddingLeft: 10 }}>
                  <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{item.agentName}</Text>
                  <Text numberOfLines={2} style={{ color: color.GREY }}>
                    {item.messages?.[item.messages.length - 1]?.content}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}


          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }

          ListEmptyComponent={
              <View style={{ marginTop: 80, alignItems: "center" }}>
                <Text style={{ fontSize: 18, fontWeight: "600", color: "#555" }}>
                  No history found
                </Text>
                <Text style={{ fontSize: 14, color: "#888", marginTop: 4 }}>
                  Pull down to refresh
                </Text>
              </View>
            
          }

          contentContainerStyle={{ paddingBottom: 120 }}

        />

      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  gradientContainer: {
    flex: 1,
  },
  header: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#c3a2e1ff',
    borderBottomColor: '#ccc',
    borderBottomWidth: 2,
  },
  list: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderColor: '#373535ff',
    borderWidth: 1,
    margin: 10,
    borderRadius: 20,
  },
});

export default History;
