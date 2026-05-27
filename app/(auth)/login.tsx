import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppInput from '../../src/components/ui/AppInput';
import AppAlert from '../../src/components/ui/AppAlert';
import AppButton from '../../src/components/ui/AppButton';
import { useAuthStore } from '../../src/store/authStore';
import { useValidation } from '../../src/hooks/useValidation';

export default function LoginScreen() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const { validateEmail, validatePassword } = useValidation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  function validate() {
    const e = { email: validateEmail(email), password: validatePassword(password) };
    setErrors(e);
    return !e.email && !e.password;
  }

  async function handleLogin() {
    if (!validate()) return;
    setLoading(true);
    setApiError('');
    try {
      await login(email, password);
      router.replace('/(tabs)');
    } catch (err: unknown) {
      const e = err as { data?: { message?: string } };
      setApiError(e?.data?.message ?? 'Error al iniciar sesión. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, justifyContent: 'center' }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <View className="items-center">
            <Image
              source={require('../../assets/images/logo-completo.png')}
              style={{ width: 470, height: 182 }}
              resizeMode="contain"
            />
          </View>

          {/* Title */}
          <Text className="text-2xl font-bold text-text-dark text-center mb-8 -mt-6">
            Inicia sesión
          </Text>

          {/* Inputs */}
          <View className="gap-5 mb-4">
            <AppInput
              label="Correo electrónico"
              placeholder="demo@kambista.com"
              value={email}
              onChangeText={(v) => {
                setEmail(v);
                setErrors((e) => ({ ...e, email: validateEmail(v) }));
              }}
              keyboardType="email-address"
              error={errors.email}
            />

            <AppInput
              label="Contraseña"
              placeholder="demo1234"
              value={password}
              onChangeText={(v) => {
                setPassword(v);
                setErrors((e) => ({ ...e, password: validatePassword(v) }));
              }}
              secureTextEntry
              error={errors.password}
            />
          </View>

          {/* Remember me + Forgot password */}
          <View className="flex-row items-center justify-between mb-10">
            <TouchableOpacity
              onPress={() => setRememberMe((v) => !v)}
              activeOpacity={0.7}
              className="flex-row items-center gap-2"
            >
              <View
                className={`w-4 h-4 rounded-sm border items-center justify-center ${
                  rememberMe
                    ? 'bg-brand-dark border-brand-dark'
                    : 'border-brand-border bg-white'
                }`}
              >
                {rememberMe && (
                  <Text style={{ color: '#fff', fontSize: 10, lineHeight: 14 }}>✓</Text>
                )}
              </View>
              <Text className="text-sm text-text-muted">Recordarme</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')}>
              <Text className="text-sm text-text-muted underline">
                ¿Olvidaste tu contraseña?
              </Text>
            </TouchableOpacity>
          </View>

          {apiError ? (
            <View className="mb-4">
              <AppAlert type="error">{apiError}</AppAlert>
            </View>
          ) : null}

          <AppButton
            label="INICIA SESIÓN"
            onPress={handleLogin}
            loading={loading}
            variant="teal"
          />

          <View className="flex-row justify-center mt-6 pb-8">
            <Text className="text-sm text-text-muted">¿No tienes cuenta? </Text>
            <TouchableOpacity onPress={() => router.push('/(onboarding)')}>
              <Text className="text-sm text-text-dark underline">Regístrate aquí</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
