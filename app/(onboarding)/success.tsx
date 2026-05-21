import React from 'react';
import { View, Text, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '../../src/components/ui/AppButton';
import { useAuthStore } from '../../src/store/authStore';

export default function OnboardingSuccess() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const firstName = user?.name?.split(' ')[0] ?? 'Usuario';

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="items-center py-4">
        <Text className="text-base font-bold text-text-dark">Perfil creado con éxito</Text>
      </View>

      {/* Content */}
      <View className="flex-1 items-center justify-center px-8">
        <Image
          source={require('../../assets/images/onboarding-success.png')}
          style={{ width: 180, height: 180 }}
          resizeMode="contain"
        />

        <Text className="text-2xl font-bold text-text-dark text-center mt-6 mb-4 leading-8">
          ¡Felicitaciones {firstName},{'\n'}tu perfil ha sido creado!
        </Text>

        <Text className="text-sm text-text-muted text-center leading-6">
          Ya puedes empezar a{' '}
          <Text className="italic">Kambiar</Text>
          {' '}con{'\n'}la mejor tasa del mercado
        </Text>

        <View className="w-full mt-14">
          <AppButton
            label="CONTINUAR"
            onPress={() => router.replace('/(tabs)')}
            variant="teal"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
