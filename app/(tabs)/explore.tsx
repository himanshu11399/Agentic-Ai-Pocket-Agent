import { View, Text, StyleSheet, ScrollView } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import CreateHomeBanner from '@/components/Home/CreateHomeBanner';
import UserCreatedAgentList from '@/components/Explore/UserCreatedAgentList';
import AgentListComponent from '@/components/Home/AgentListComponent';
import { LinearGradient } from 'expo-linear-gradient';

const Explore = () => {
  return (
    <View style={styles.safeArea}>
       <LinearGradient
              colors={['#c3a2e1ff', "#74bbbbff"]} // light to dark blue tone
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.gradientContainer}
            >
      {/* Header */}
        <View style={styles.header}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Explore</Text>
        </View>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 50 }}
        showsVerticalScrollIndicator={false}
      >
        

        {/* Create Agent */}
        <View style={{ padding: 8 }}>
          <CreateHomeBanner />

          <View style={{ padding: 10 }}>
            {/* Render user-created agents */}
            <UserCreatedAgentList />

            <Text style={{ fontSize: 18, fontWeight: 'bold', marginVertical: 10 }}>
              Featured Agent:
            </Text>

            {/* Render featured agents */}
            <AgentListComponent isFeatured={true} />
            <View style={{height:80}}>

            </View>
          </View>
        </View>
      </ScrollView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  gradientContainer: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#fff', // fallback if gradient fails to load
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
});

export default Explore;
