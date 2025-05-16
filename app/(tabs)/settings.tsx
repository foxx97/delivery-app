import React, { useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemeContext } from '@/context/ThemeContext';
import { OrderContext } from '@/context/OrderContext';
import { useAuth } from '@/context/AuthContext';
import { Sun, Moon, Monitor, Trash2, LogOut } from 'lucide-react-native';

export default function Settings() {
  const colors = useThemeColor();
  const { theme, setTheme } = useContext(ThemeContext);
  const { resetData } = useContext(OrderContext);
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      Alert.alert('Error', 'Failed to sign out. Please try again.');
    }
  };

  const handleReset = () => {
    Alert.alert(
      'Reset All Data',
      'Are you sure you want to reset all data? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await resetData();
            Alert.alert('Success', 'All data has been reset.');
          },
        },
      ]
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      flexGrow: 1,
      padding: 20,
    },
    sectionTitle: {
      fontFamily: 'Inter-Bold',
      fontSize: 18,
      color: colors.text,
      marginTop: 15,
      marginBottom: 10,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      marginBottom: 20,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    themeButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 8,
      marginVertical: 4,
    },
    themeButtonSelected: {
      backgroundColor: colors.primary + '20',
    },
    themeButtonText: {
      fontFamily: 'Inter-Medium',
      fontSize: 16,
      color: colors.text,
      marginLeft: 12,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: 12,
    },
    dangerButton: {
      backgroundColor: colors.error,
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
    },
    signOutButton: {
      backgroundColor: colors.card,
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    buttonText: {
      color: '#FFFFFF',
      fontFamily: 'Inter-Medium',
      fontSize: 16,
      marginLeft: 8,
    },
    signOutButtonText: {
      color: colors.text,
      fontFamily: 'Inter-Medium',
      fontSize: 16,
      marginLeft: 8,
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        <View style={styles.card}>
          <TouchableOpacity
            style={[
              styles.themeButton,
              theme === 'light' && styles.themeButtonSelected,
            ]}
            onPress={() => setTheme('light')}>
            <Sun size={20} color={colors.text} />
            <Text style={styles.themeButtonText}>Light Theme</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.themeButton,
              theme === 'dark' && styles.themeButtonSelected,
            ]}
            onPress={() => setTheme('dark')}>
            <Moon size={20} color={colors.text} />
            <Text style={styles.themeButtonText}>Dark Theme</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.themeButton,
              theme === 'system' && styles.themeButtonSelected,
            ]}
            onPress={() => setTheme('system')}>
            <Monitor size={20} color={colors.text} />
            <Text style={styles.themeButtonText}>System Default</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Data Management</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.dangerButton} onPress={handleReset}>
            <Trash2 size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}>Reset All Data</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <LogOut size={20} color={colors.text} />
            <Text style={styles.signOutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}