import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AppInput from '../../src/components/ui/AppInput';
import AppSelect from '../../src/components/ui/AppSelect';
import AppButton from '../../src/components/ui/AppButton';
import AppAlert from '../../src/components/ui/AppAlert';
import { useAuthStore } from '../../src/store/authStore';
import { useValidation } from '../../src/hooks/useValidation';
import { colors } from '../../src/constants/theme';

const DOC_TYPES = [
  { value: 'DNI', label: 'DNI' },
  { value: 'CCE', label: 'CCE' },
  { value: 'Pasaporte', label: 'Pasaporte' },
];

const DOC_MAX_LENGTH: Record<string, number> = { DNI: 8, CCE: 9, Pasaporte: 15 };

function Checkbox({
  checked,
  onPress,
  children,
}: {
  checked: boolean;
  onPress: () => void;
  children: React.ReactNode;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="flex-row items-start gap-2"
    >
      <View
        className={`w-4 h-4 rounded-sm border mt-0.5 items-center justify-center flex-shrink-0 ${
          checked ? 'bg-brand-dark border-brand-dark' : 'bg-white border-brand-border'
        }`}
      >
        {checked && (
          <Text style={{ color: '#fff', fontSize: 9, lineHeight: 13 }}>✓</Text>
        )}
      </View>
      <Text className="flex-1 text-xs text-text-muted leading-5">{children}</Text>
    </TouchableOpacity>
  );
}

export default function OnboardingScreen() {
  const router = useRouter();
  const completeOnboarding = useAuthStore((s) => s.completeOnboarding);
  const { validateName, validateDocument, validatePhone, validateBirthDate } = useValidation();

  const [form, setForm] = useState({
    fullName: '',
    docType: 'DNI',
    docNumber: '',
    phone: '',
    birthDate: '',
  });

  const [errors, setErrors] = useState({
    fullName: '',
    docNumber: '',
    phone: '',
    birthDate: '',
  });

  const [termsChecked, setTermsChecked] = useState(false);
  const [privacyChecked, setPrivacyChecked] = useState(false);
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function validateAll() {
    const e = {
      fullName: validateName(form.fullName),
      docNumber: validateDocument(form.docType, form.docNumber),
      phone: validatePhone(form.phone),
      birthDate: validateBirthDate(form.birthDate),
    };
    setErrors(e);
    return !Object.values(e).some(Boolean);
  }

  function handleBirthDate(text: string) {
    const digits = text.replace(/\D/g, '').slice(0, 8);
    let formatted = digits;
    if (digits.length > 2) formatted = digits.slice(0, 2) + '/' + digits.slice(2);
    if (digits.length > 4)
      formatted = digits.slice(0, 2) + '/' + digits.slice(2, 4) + '/' + digits.slice(4);
    update('birthDate', formatted);
  }

  async function handleSubmit() {
    if (!validateAll()) return;
    if (!termsChecked || !privacyChecked) {
      setApiError('Debes aceptar los términos y la política de privacidad.');
      return;
    }
    setLoading(true);
    setApiError('');
    try {
      await new Promise((r) => setTimeout(r, 1000));
      completeOnboarding(form.fullName);
      router.replace('/(onboarding)/success');
    } catch {
      setApiError('Ocurrió un error. Intenta de nuevo.');
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
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3">
          <TouchableOpacity onPress={() => router.back()} hitSlop={8} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={24} color={colors.textDark} />
          </TouchableOpacity>

          <Text className="text-base font-bold text-text-dark">Completa tus datos</Text>

          <TouchableOpacity onPress={() => router.replace('/(auth)/login')} hitSlop={8} activeOpacity={0.7}>
            <Image
              source={require('../../assets/images/icon-logout.png')}
              style={{ width: 24, height: 24, tintColor: colors.textDark }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Subtitle */}
          <Text className="text-base text-text-dark text-center mb-6 leading-6">
            Completa tus datos{' '}
            <Text className="font-bold">
              como figuran{'\n'}en tu documento de identidad
            </Text>
          </Text>

          {/* Nombres completos */}
          <View className="mb-4">
            <AppInput
              label="Nombres completos"
              placeholder="Escribe tus nombres y apellidos"
              value={form.fullName}
              onChangeText={(v) => { update('fullName', v); setErrors((e) => ({ ...e, fullName: '' })); }}
              autoCapitalize="words"
              error={errors.fullName}
            />
          </View>

          {/* Documento */}
          <View className="mb-3">
            <Text className="text-xs text-text-muted mb-1.5 font-medium">Documento</Text>
            <View className="flex-row gap-3">
              <View style={{ width: 110 }}>
                <AppSelect
                  options={DOC_TYPES}
                  value={form.docType}
                  onChange={(v) => update('docType', String(v))}
                  placeholder="Tipo"
                />
              </View>
              <View className="flex-1">
                <AppInput
                  placeholder="N° de documento"
                  value={form.docNumber}
                  onChangeText={(v) => { update('docNumber', v); setErrors((e) => ({ ...e, docNumber: '' })); }}
                  keyboardType="numeric"
                  maxLength={DOC_MAX_LENGTH[form.docType] ?? 15}
                  error={errors.docNumber}
                />
              </View>
            </View>
          </View>

          {/* Info alert */}
          <View className="mb-4">
            <AppAlert type="info">
              <Text className="text-xs leading-5">
                Tu documento de identidad debe coincidir con tus datos para evitar
                inconvenientes al momento de hacer una primera operación
              </Text>
            </AppAlert>
          </View>

          {/* Celular + Fecha nacimiento */}
          <View className="flex-row gap-3 mb-4">
            <View className="flex-1">
              <AppInput
                label="Celular"
                placeholder="N° de celular"
                value={form.phone}
                onChangeText={(v) => { update('phone', v); setErrors((e) => ({ ...e, phone: '' })); }}
                keyboardType="phone-pad"
                maxLength={9}
                error={errors.phone}
              />
            </View>
            <View className="flex-1">
              <AppInput
                label="Fecha de nacimiento"
                placeholder="DD/MM/AAAA"
                value={form.birthDate}
                onChangeText={handleBirthDate}
                keyboardType="numeric"
                maxLength={10}
                error={errors.birthDate}
              />
            </View>
          </View>

          {/* Checkboxes */}
          <View className="gap-3 mb-6">
            <Checkbox checked={termsChecked} onPress={() => setTermsChecked((v) => !v)}>
              He leído y acepto los{' '}
              <Text className="font-bold text-text-dark underline">
                Términos y condiciones
              </Text>
            </Checkbox>

            <Checkbox checked={privacyChecked} onPress={() => setPrivacyChecked((v) => !v)}>
              Acepto de manera expresa e informada la{' '}
              <Text className="font-bold text-text-dark underline">
                Política de Tratamiento de datos personales de Kambista
              </Text>
            </Checkbox>
          </View>

          {apiError ? (
            <View className="mb-4">
              <AppAlert type="error">{apiError}</AppAlert>
            </View>
          ) : null}

          <AppButton
            label="REGISTRARME"
            onPress={handleSubmit}
            loading={loading}
            variant="teal"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
