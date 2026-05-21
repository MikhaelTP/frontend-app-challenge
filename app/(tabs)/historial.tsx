import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/constants/theme';

const MOCK_HISTORY = [
  { id: 'KM1A2B3C', date: '18/05/2025', sendAmount: 'USD 500.00', receiveAmount: 'S/ 1,860.00', sendCurrency: 'USD', status: 'Completado' },
  { id: 'KM4D5E6F', date: '10/05/2025', sendAmount: 'S/ 2,000.00', receiveAmount: 'USD 537.63', sendCurrency: 'PEN', status: 'Completado' },
  { id: 'KM7G8H9I', date: '02/05/2025', sendAmount: 'USD 1,200.00', receiveAmount: 'S/ 4,464.00', sendCurrency: 'USD', status: 'En proceso' },
];

const FILTERS = ['Todos', 'Completado', 'En proceso'] as const;

export default function HistorialScreen() {
  const [filter, setFilter] = useState<string>('Todos');
  const filtered = filter === 'Todos' ? MOCK_HISTORY : MOCK_HISTORY.filter((tx) => tx.status === filter);

  return (
    <SafeAreaView className="flex-1 bg-brand-gray" edges={['top']}>
      <View className="bg-white px-4 py-3 border-b border-brand-border">
        <Text className="text-lg font-bold text-text-dark text-center">Historial</Text>
      </View>

      <View className="flex-row gap-2 px-4 py-3">
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f)}
            activeOpacity={0.8}
            className={`px-4 py-2 rounded-full ${filter === f ? 'bg-brand-dark' : 'bg-white border border-brand-border'}`}
          >
            <Text style={{ fontSize: 13, fontWeight: '600', color: filter === f ? '#fff' : colors.textMuted }}>
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        {filtered.length === 0 && (
          <View className="items-center py-16">
            <Ionicons name="receipt-outline" size={48} color={colors.textInput} />
            <Text style={{ fontSize: 15, color: colors.textMuted, marginTop: 12 }}>No hay operaciones</Text>
          </View>
        )}

        {filtered.map((tx, i) => (
          <TouchableOpacity
            key={tx.id}
            activeOpacity={0.85}
            className="bg-white rounded-2xl p-4"
            style={{ marginBottom: i < filtered.length - 1 ? 10 : 0 }}
          >
            <View className="flex-row items-center gap-3">
              <View className="bg-brand-gray items-center justify-center" style={{ width: 46, height: 46, borderRadius: 23 }}>
                <Image
                  source={tx.sendCurrency === 'USD' ? require('../../assets/images/flag-usd.png') : require('../../assets/images/flag-pen.png')}
                  style={{ width: 30, height: 30, borderRadius: 15 }}
                  resizeMode="cover"
                />
              </View>

              <View className="flex-1">
                <View className="flex-row items-center gap-1.5">
                  <Text style={{ fontSize: 15, fontWeight: '700', color: colors.textDark }}>{tx.sendAmount}</Text>
                  <Ionicons name="arrow-forward" size={12} color={colors.textMuted} />
                  <Text style={{ fontSize: 15, color: colors.textMuted }}>{tx.receiveAmount}</Text>
                </View>
                <Text style={{ fontSize: 13, color: colors.textMuted, marginTop: 3 }}>Código: {tx.id}</Text>
              </View>

              <View className="items-end" style={{ gap: 6 }}>
                <Text style={{ fontSize: 13, color: colors.textMuted }}>{tx.date}</Text>
                <View className="px-2 py-0.5 rounded-full" style={{ backgroundColor: tx.status === 'Completado' ? '#DCFCE7' : '#FEF9C3' }}>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: tx.status === 'Completado' ? '#16A34A' : '#854D0E' }}>
                    {tx.status}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
