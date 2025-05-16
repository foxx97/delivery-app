import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Link, router } from 'expo-router';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useAuth } from '@/context/AuthContext';
import { Mail, Lock, ArrowRight } from 'lucide-react-native';

export default function RegisterScreen() {
  const colors = useThemeColor();
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await signUp(email, password);
      Alert.alert(
        'Registration Successful',
        'Your account has been created successfully.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(tabs)'),
          },
        ]
      );
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
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
    header: {
      marginBottom: 40,
    },
    title: {
      fontFamily: 'Inter-Bold',
      fontSize: 32,
      color: colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontFamily: 'Inter-Regular',
      fontSize: 16,
      color: colors.textSecondary,
    },
    form: {
      gap: 16,
    },
    inputContainer: {
      marginBottom: 16,
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: 12,
      paddingHorizontal: 16,
      borderWidth: 1,
      borderColor: colors.border,
      height: 56,
    },
    input: {
      flex: 1,
      marginLeft: 12,
      color: colors.text,
      fontFamily: 'Inter-Regular',
      fontSize: 16,
    },
    button: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      height: 56,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 24,
    },
    buttonDisabled: {
      opacity: 0.7,
    },
    buttonText: {
      color: colors.buttonText,
      fontFamily: 'Inter-Medium',
      fontSize: 18,
      marginRight: 8,
    },
    error: {
      color: colors.error,
      fontFamily: 'Inter-Regular',
      fontSize: 14,
      textAlign: 'center',
      marginTop: 10,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 20,
    },
    footerText: {
      color: colors.textSecondary,
      fontFamily: 'Inter-Regular',
      fontSize: 14,
    },
    footerLink: {
      color: colors.primary,
      fontFamily: 'Inter-Medium',
      fontSize: 14,
      marginLeft: 5,
    },
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Sign up to start tracking your deliveries
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Mail size={20} color={colors.textSecondary} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={colors.textSecondary}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Lock size={20} color={colors.textSecondary} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={colors.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete="new-password"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Lock size={20} color={colors.textSecondary} />
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor={colors.textSecondary}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoComplete="new-password"
              />
            </View>
          </View>

          {error && <Text style={styles.error}>{error}</Text>}

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color={colors.buttonText} />
            ) : (
              <>
                <Text style={styles.buttonText}>Create Account</Text>
                <ArrowRight size={20} color={colors.buttonText} />
              </>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <Link href="/login" asChild>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Sign In</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}