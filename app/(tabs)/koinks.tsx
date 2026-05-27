import React from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/store/authStore';
import { colors } from '../../src/constants/theme';

const KOINKS_HISTORY = [
  { id: 1, description: 'Operación USD 500', date: '18/05/2025', points: 500, type: 'earn' },
  { id: 2, description: 'Operación USD 1,200', date: '02/05/2025', points: 1200, type: 'earn' },
  { id: 3, description: 'Canje de beneficio', date: '28/04/2025', points: -450, type: 'redeem' },
];

export default function KoinksScreen() {
  const user = useAuthStore((s) => s.user);
  const total = user?.koinks ?? 0;

  return (
    <SafeAreaView className="flex-1 bg-brand-gray" edges={['top']}>
      <View className="bg-white px-4 py-3 border-b border-brand-border flex-row items-center justify-center gap-2">
        <Text className="text-lg font-bold text-text-dark">Koinks</Text>
        <View className="bg-brand-teal px-2 py-0.5 rounded-full">
          <Text style={{ color: '#0B1629', fontSize: 10, fontWeight: '700' }}>NUEVO</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        {/* Balance card */}
        <View className="rounded-2xl p-6 items-center mb-4" style={{ backgroundColor: '#0B1629' }}>
          <Image source={require('../../assets/images/icon-koink.png')} style={{ width: 56, height: 56 }} resizeMode="contain" />
          <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 15, marginTop: 12 }}>Tu saldo de Koinks</Text>
          <Text style={{ color: '#fff', fontSize: 48, fontWeight: '700', marginTop: 4, lineHeight: 56 }}>
            {total.toLocaleString()}
          </Text>
          <View className="mt-4 px-4 py-2 rounded-full" style={{ backgroundColor: 'rgba(0,227,194,0.15)' }}>
            <Text style={{ color: '#00E3C2', fontSize: 13, fontWeight: '600' }}>1 Koink = 1 USD de operación</Text>
          </View>
        </View>

        {/* How to earn */}
        <View className="bg-white rounded-2xl p-4 mb-4">
          <View className="flex-row items-center gap-2 mb-2">
            <Ionicons name="information-circle-outline" size={20} color={colors.textDark} />
            <Text style={{ fontSize: 16, fontWeight: '700', color: colors.textDark }}>¿Cómo ganar Koinks?</Text>
          </View>
          <Text style={{ fontSize: 15, color: colors.textMuted, lineHeight: 22 }}>
            Ganas Koinks en cada operación de cambio. Por cada dólar equivalente que cambies,
            recibes 1 Koink. ¡Canjeables por beneficios exclusivos!
          </Text>
        </View>

        {/* Benefits promo */}
        <View className="rounded-2xl p-4 mb-4 flex-row items-center gap-3" style={{ backgroundColor: 'rgba(0,227,194,0.12)' }}>
          <Image source={require('../../assets/images/icons/beneficios.png')} style={{ width: 36, height: 36 }} resizeMode="contain" />
          <View className="flex-1">
            <Text style={{ fontSize: 15, fontWeight: '700', color: colors.textDark }}>¡Canjea tus Koinks!</Text>
            <Text style={{ fontSize: 13, color: colors.textMuted, marginTop: 3, lineHeight: 18 }}>
              Úsalos en tu próxima operación para obtener un mejor tipo de cambio.
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textInput} />
        </View>

        {/* History */}
        <Text style={{ fontSize: 16, fontWeight: '700', color: colors.textDark, marginBottom: 12 }}>Historial de Koinks</Text>

        {KOINKS_HISTORY.map((item, i) => (
          <View
            key={item.id}
            className="bg-white rounded-2xl p-4 flex-row items-center gap-3"
            style={{ marginBottom: i < KOINKS_HISTORY.length - 1 ? 8 : 0 }}
          >
            <View
              className="items-center justify-center"
              style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: item.type === 'earn' ? '#DCFCE7' : '#FEE2E2' }}
            >
              <Ionicons name={item.type === 'earn' ? 'arrow-up' : 'arrow-down'} size={20} color={item.type === 'earn' ? '#16A34A' : '#DC2626'} />
            </View>
            <View className="flex-1">
              <Text style={{ fontSize: 15, fontWeight: '600', color: colors.textDark }}>{item.description}</Text>
              <Text style={{ fontSize: 13, color: colors.textMuted, marginTop: 2 }}>{item.date}</Text>
            </View>
            <Text style={{ fontSize: 16, fontWeight: '700', color: item.type === 'earn' ? '#16A34A' : '#DC2626' }}>
              {item.type === 'earn' ? '+' : ''}{item.points}
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
