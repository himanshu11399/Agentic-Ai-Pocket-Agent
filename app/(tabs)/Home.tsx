import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Gem, Settings } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AgentListComponent from '@/components/Home/AgentListComponent';
import CreateHomeBanner from '@/components/Home/CreateHomeBanner';
import color from '@/shared/color';
import PaymentComponent from '@/components/Home/PaymentComponent';
import { LogBox } from 'react-native';

const Home = () => {

  const [probtn, setprobtn] = useState(false);

  LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

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
          {/* Left: Pro Button */}
          <TouchableOpacity activeOpacity={0.7} onPress={() => setprobtn(true)}>
            <View style={styles.proButton}>
              <Gem size={18} color="#FFD700" />
              <Text style={styles.proText}>Pro</Text>
            </View>
          </TouchableOpacity>

          {/* Center: Title */}
          <Text style={styles.headerTitle}>AI Pocket Agent</Text>

          {/* Right: Settings Icon */}
          <TouchableOpacity activeOpacity={0.6}>
            <Settings size={24} color="#000" />
          </TouchableOpacity>

        </View>

        {/* Content */}
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Featured Agent List */}
          <View style={styles.section}>
            <AgentListComponent isFeatured={true} />
          </View>

          {/* Create Banner */}
          <View style={styles.section}>
            <CreateHomeBanner />
          </View>

          {/* Non-featured Agent List */}
          <View style={styles.section}>
            <AgentListComponent isFeatured={false} />
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              © 2025 AI Agent. All rights reserved.
            </Text>
          </View>
        </ScrollView>

        {/* Modal */}
        <Modal
          visible={probtn}
          animationType="slide"
          presentationStyle="formSheet"
          onRequestClose={() => setprobtn(false)}
        >
          <PaymentComponent />
        </Modal>
      </LinearGradient>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff', // fallback if gradient fails to load
  },
  gradientContainer: {
    flex: 1,
  },
  header: {
    marginTop:30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1.5,
    borderBottomColor: '#999797ff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color:'#000',
    paddingRight:10
  },
  proButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007BFF',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
  },
  proText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
    marginLeft: 6,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  section: {
    padding: 10,
  },
  footer: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 16,
    color: '#fff',
  },
});
