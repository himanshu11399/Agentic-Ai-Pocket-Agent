import React from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ScreenWrapperProps {
  children: React.ReactNode;
  headerTitle?: string;
  headerLeft?: React.ReactNode;
  headerRight?: React.ReactNode;
  headerStyle?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  headerTitle,
  headerLeft,
  headerRight,
  headerStyle,
  contentContainerStyle,
}) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#c3a2e1ff', '#74bbbbff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[styles.gradientContainer, contentContainerStyle]}
      >
        {headerTitle && (
          <View style={[styles.header, headerStyle]}>
            {headerLeft}
            <Text style={styles.headerTitle}>{headerTitle}</Text>
            {headerRight}
          </View>
        )}
        {children}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradientContainer: { flex: 1 },
  header: {
    marginTop: 30,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
});

export default ScreenWrapper;