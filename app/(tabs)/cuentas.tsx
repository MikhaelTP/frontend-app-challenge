import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTransactionStore } from '../../src/store/transactionStore';
import AddAccountModal from '../../src/components/modals/AddAccountModal';
import type { BankAccount, Currency } from '../../src/types';
import { colors } from '../../src/constants/theme';
import { maskAccount } from '../../src/utils/format';

function AccountCard({ account }: { account: BankAccount }) {
  return (
    <View className="bg-white rounded-2xl p-4 mb-3">
      <View className="flex-row items-center gap-3">
        <View className="bg-brand-gray items-center justify-center" style={{ width: 46, height: 46, borderRadius: 23 }}>
          <Image
            source={account.currency === 'USD' ? require('../../assets/images/flag-usd.png') : require('../../assets/images/flag-pen.png')}
            style={{ width: 30, height: 30, borderRadius: 15 }}
            resizeMode="cover"
          />
        </View>
        <View className="flex-1">
          <Text style={{ fontSize: 15, fontWeight: '700', color: colors.textDark }}>{account.alias}</Text>
          <Text style={{ fontSize: 13, color: colors.textMuted, marginTop: 2 }}>
            {account.bank.name} · {account.accountType}
          </Text>
          <Text style={{ fontSize: 13, color: colors.textMuted }}>{maskAccount(account.accountNumber)}</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.textInput} />
      </View>
    </View>
  );
}

function AddButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className="flex-row items-center justify-center gap-2 border border-dashed border-brand-border rounded-2xl p-4 mb-6"
    >
      <Ionicons name="add-circle-outline" size={20} color={colors.textDark} />
      <Text style={{ fontSize: 15, fontWeight: '600', color: colors.textDark }}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function CuentasScreen() {
  const { savedAccounts } = useTransactionStore();
  const [showAdd, setShowAdd] = useState(false);
  const [addCurrency, setAddCurrency] = useState<Currency>('PEN');

  const penAccounts = savedAccounts.filter((a: BankAccount) => a.currency === 'PEN');
  const usdAccounts = savedAccounts.filter((a: BankAccount) => a.currency === 'USD');

  function openAdd(currency: Currency) {
    setAddCurrency(currency);
    setShowAdd(true);
  }

  return (
    <SafeAreaView className="flex-1 bg-brand-gray" edges={['top']}>
      <View className="bg-white px-4 py-3 border-b border-brand-border">
        <Text className="text-lg font-bold text-text-dark text-center">Mis Cuentas</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <Text style={{ fontSize: 12, fontWeight: '700', color: colors.textMuted, marginBottom: 12, letterSpacing: 0.8 }}>
          SOLES (PEN)
        </Text>
        {penAccounts.length === 0 && (
          <View className="bg-white rounded-2xl p-4 items-center mb-3">
            <Text style={{ fontSize: 15, color: colors.textMuted }}>Sin cuentas en Soles</Text>
          </View>
        )}
        {penAccounts.map((a: BankAccount) => <AccountCard key={a.id} account={a} />)}
        <AddButton label="Agregar cuenta en Soles" onPress={() => openAdd('PEN')} />

        <Text style={{ fontSize: 12, fontWeight: '700', color: colors.textMuted, marginBottom: 12, letterSpacing: 0.8 }}>
          DÓLARES (USD)
        </Text>
        {usdAccounts.length === 0 && (
          <View className="bg-white rounded-2xl p-4 items-center mb-3">
            <Text style={{ fontSize: 15, color: colors.textMuted }}>Sin cuentas en Dólares</Text>
          </View>
        )}
        {usdAccounts.map((a: BankAccount) => <AccountCard key={a.id} account={a} />)}
        <AddButton label="Agregar cuenta en Dólares" onPress={() => openAdd('USD')} />
      </ScrollView>

      <AddAccountModal visible={showAdd} currency={addCurrency} onSaved={() => setShowAdd(false)} onClose={() => setShowAdd(false)} />
    </SafeAreaView>
  );
}
