import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/constants/theme';

interface Alert {
  id: number;
  type: 'above' | 'below';
  currency: 'USD' | 'PEN';
  rate: number;
  active: boolean;
  label: string;
}

const MOCK_ALERTS: Alert[] = [
  { id: 1, type: 'above', currency: 'USD', rate: 3.85, active: true, label: 'Compra mayor a' },
  { id: 2, type: 'below', currency: 'USD', rate: 3.65, active: false, label: 'Venta menor a' },
];

export default function AlertasScreen() {
  const router = useRouter();
  const [alerts, setAlerts] = useState<Alert[]>(MOCK_ALERTS);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  function toggleAlert(id: number) {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a)));
  }

  return (
    <SafeAreaView className="flex-1 bg-brand-gray" edges={['top']}>
      <View className="bg-white px-4 py-3 border-b border-brand-border flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} hitSlop={8} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={24} color={colors.textDark} />
        </TouchableOpacity>
        <Text className="flex-1 text-lg font-bold text-text-dark text-center">Alertas de tipo de cambio</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        {/* Global toggle */}
        <View className="bg-white rounded-2xl p-4 mb-4 flex-row items-center gap-3">
          <View className="items-center justify-center" style={{ width: 42, height: 42, borderRadius: 12, backgroundColor: '#F5F7FA' }}>
            <Ionicons name="notifications-outline" size={22} color={colors.textDark} />
          </View>
          <View className="flex-1">
            <Text style={{ fontSize: 15, fontWeight: '700', color: colors.textDark }}>Notificaciones activas</Text>
            <Text style={{ fontSize: 13, color: colors.textMuted, marginTop: 2 }}>
              Recibe alertas cuando el tipo de cambio alcance tu objetivo
            </Text>
          </View>
          <Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled} trackColor={{ false: '#E5E7EB', true: '#00E3C2' }} thumbColor="#fff" />
        </View>

        {/* Info banner */}
        <View className="rounded-2xl p-4 mb-4 flex-row items-start gap-2" style={{ backgroundColor: '#EFF6FF', borderWidth: 1, borderColor: '#BFDBFE' }}>
          <Ionicons name="information-circle-outline" size={18} color="#082774" style={{ marginTop: 1 }} />
          <Text style={{ flex: 1, fontSize: 13, color: '#082774', lineHeight: 20 }}>
            Te avisamos por notificación push cuando el tipo de cambio supere o baje del valor que configures.
          </Text>
        </View>

        <Text style={{ fontSize: 16, fontWeight: '700', color: colors.textDark, marginBottom: 12 }}>Mis alertas</Text>

        {alerts.map((alert, i) => (
          <View
            key={alert.id}
            className="bg-white rounded-2xl p-4"
            style={{ marginBottom: i < alerts.length - 1 ? 10 : 0, opacity: alert.active ? 1 : 0.55 }}
          >
            <View className="flex-row items-center gap-3">
              <View
                className="items-center justify-center"
                style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: alert.type === 'above' ? '#DCFCE7' : '#FEE2E2' }}
              >
                <Ionicons name={alert.type === 'above' ? 'trending-up' : 'trending-down'} size={20} color={alert.type === 'above' ? '#16A34A' : '#DC2626'} />
              </View>
              <View className="flex-1">
                <Text style={{ fontSize: 15, fontWeight: '600', color: colors.textDark }}>{alert.label}</Text>
                <View className="flex-row items-center gap-1 mt-1">
                  <Image source={require('../../assets/images/flag-usd.png')} style={{ width: 14, height: 14, borderRadius: 7 }} resizeMode="cover" />
                  <Text style={{ fontSize: 13, color: colors.textMuted }}>USD/PEN · S/ {alert.rate.toFixed(3)}</Text>
                </View>
              </View>
              <Switch value={alert.active} onValueChange={() => toggleAlert(alert.id)} trackColor={{ false: '#E5E7EB', true: '#00E3C2' }} thumbColor="#fff" />
            </View>
          </View>
        ))}

        <TouchableOpacity
          activeOpacity={0.8}
          className="flex-row items-center justify-center gap-2 border border-dashed border-brand-border rounded-2xl p-4 mt-3"
        >
          <Ionicons name="add-circle-outline" size={22} color={colors.textDark} />
          <Text style={{ fontSize: 15, fontWeight: '600', color: colors.textDark }}>Nueva alerta</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
