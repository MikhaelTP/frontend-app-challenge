import React, { useState } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AppInput from '../../src/components/ui/AppInput';
import AppButton from '../../src/components/ui/AppButton';
import { useValidation } from '../../src/hooks/useValidation';
import { colors } from '../../src/constants/theme';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { validateEmail } = useValidation();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    const err = validateEmail(email);
    if (err) { setError(err); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSent(true);
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-brand-border">
          <TouchableOpacity onPress={() => router.back()} hitSlop={8} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={24} color={colors.textDark} />
          </TouchableOpacity>

          <Text className="text-base font-bold text-text-dark">Recuperar contraseña</Text>

          <TouchableOpacity onPress={() => router.replace('/(auth)/login')} hitSlop={8} activeOpacity={0.7}>
            <Image
              source={require('../../assets/images/icon-logout.png')}
              style={{ width: 24, height: 24, tintColor: colors.textDark }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, justifyContent: 'center', paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {sent ? (
            /* ── Success state ── */
            <View className="items-center">
              <View className="w-20 h-20 rounded-full bg-brand-teal/10 items-center justify-center mb-6">
                <Ionicons name="checkmark-circle" size={48} color={colors.brandTeal} />
              </View>
              <Text className="text-2xl font-bold text-text-dark text-center mb-3">
                ¡Correo enviado!
              </Text>
              <Text className="text-sm text-text-muted text-center mb-10 leading-6">
                Si el correo está registrado, recibirás las instrucciones para restablecer tu
                contraseña en breve.
              </Text>
              <AppButton
                label="Volver al inicio de sesión"
                onPress={() => router.replace('/(auth)/login')}
                variant="teal"
              />
            </View>
          ) : (
            /* ── Form state ── */
            <View>
              <View className="w-20 h-20 rounded-full bg-brand-dark/5 items-center justify-center mb-6 self-center">
                <Ionicons name="lock-closed-outline" size={36} color={colors.brandDark} />
              </View>

              <Text className="text-2xl font-bold text-text-dark text-center mb-3">
                Recuperar contraseña
              </Text>
              <Text className="text-sm text-text-muted text-center mb-8 leading-6">
                Ingresa tu correo y te enviaremos las instrucciones para restablecer tu contraseña.
              </Text>

              <View className="gap-5">
                <AppInput
                  label="Correo electrónico"
                  placeholder="Escribe tu correo"
                  value={email}
                  onChangeText={(v) => { setEmail(v); setError(''); }}
                  keyboardType="email-address"
                  error={error}
                />
                <AppButton
                  label="Enviar instrucciones"
                  onPress={handleSubmit}
                  loading={loading}
                  variant="teal"
                />
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
