import React, { useEffect, useRef } from 'react';
import { Animated, View, Text, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '../../src/components/ui/AppButton';
import { useTransactionStore } from '../../src/store/transactionStore';
import { formatMoney } from '../../src/utils/format';
import { colors } from '../../src/constants/theme';

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={{ fontSize: 16, fontWeight: '700',color: colors.textMuted, paddingHorizontal: 10 }}>{label}</Text>
      <Text style={{ fontSize: 18, fontWeight: '700',paddingHorizontal: 10, color: colors.textDark, marginTop: 2 }}>
        {value}
      </Text>
    </View>
  );
}

export default function OperationSuccess() {
  const router = useRouter();
  const { current, reset } = useTransactionStore();

  const cardY = useRef(new Animated.Value(60)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const illustrationScale = useRef(new Animated.Value(0.4)).current;
  const illustrationOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(cardOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
      Animated.spring(cardY, { toValue: 0, stiffness: 140, damping: 18, useNativeDriver: true }),
      Animated.sequence([
        Animated.delay(200),
        Animated.parallel([
          Animated.timing(illustrationOpacity, { toValue: 1, duration: 250, useNativeDriver: true }),
          Animated.spring(illustrationScale, { toValue: 1, stiffness: 180, damping: 10, useNativeDriver: true }),
        ]),
      ]),
    ]).start();
  }, []);

  function handleBack() {
    reset();
    router.replace('/(tabs)');
  }

  const receiveStr = formatMoney(current.receiveAmount, current.destinationCurrency ?? 'PEN');
  const estimatedTime = current.estimatedTime ?? '20h 15min';
  const kambistCode = current.kambistCode ?? 'km------';

  return (
    <SafeAreaView className="flex-1 bg-[#F6F6F9]" edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, padding: 20, paddingBottom: 35, justifyContent: 'center' }}
        showsVerticalScrollIndicator={false}
      >
        {/* Main card */}
        <Animated.View
          style={{ opacity: cardOpacity, transform: [{ translateY: cardY }], backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: '#E0E4EB' }}
        >
          {/* Illustration */}
          <Animated.View style={{ alignItems: 'center', marginBottom: 16, opacity: illustrationOpacity, transform: [{ scale: illustrationScale }] }}>
            <Image
              source={require('../../assets/images/success-illustration.png')}
              style={{ width: 120, height: 120 }}
              resizeMode="contain"
            />
          </Animated.View>

          {/* Title */}
          <Text
            style={{
              fontSize: 22,
              fontWeight: '700',
              color: colors.textDark,
              textAlign: 'center',
              marginBottom: 14,
            }}
          >
            ¡Constancia enviada!
          </Text>

          {/* Separator */}
          <View style={{ height: 1.5, backgroundColor: '#A7A7A7', marginBottom: 8, marginHorizontal: 10 }} />

          {/* Kambist code */}
          <View style={{}}>
            <Text style={{ fontSize: 16, color: colors.textMuted, fontWeight: '700', paddingHorizontal: 10 }}>Código Kambista</Text>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '700',
                color: colors.textDark,
                marginTop: 2,
                marginBottom: 4,
                paddingHorizontal: 10,
              }}
            >
              {kambistCode}
            </Text>
            <Text style={{ fontSize: 16, color: colors.textDark, marginBottom: 8,paddingHorizontal: 10 }}>
              *Usa tu código para dar seguimiento a {'\n'}tu operación.
            </Text>
          </View>

          {/* Monto + tiempo */}
          <InfoBlock label="Monto a recibir" value={receiveStr} />
          <InfoBlock label="Tiempo estimado de espera" value={estimatedTime} />
        </Animated.View>

        {/* Promo banner */}
        <Image
          source={require('../../assets/images/success-promo-banner.png')}
          style={{ width: '100%', height: 96, borderRadius: 16, marginBottom: 16 }}
          resizeMode="cover"
        />

        {/* Footer note */}
        <Text
          style={{
            fontSize: 16,
            color: colors.textDark,
            textAlign: 'center',
            lineHeight: 20,
            marginBottom: 24,
          }}
        >
          Verificaremos tu operación. Puedes ver su{'\n'}estado en "Mis operaciones".
        </Text>

        <AppButton
          label="VOLVER A INICIO"
          onPress={handleBack}
          variant="teal"
        />
      </ScrollView>
    </SafeAreaView>
  );
}
