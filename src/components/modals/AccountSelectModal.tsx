import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { BankAccount, Currency } from '../../types';
import { colors } from '../../constants/theme';
import { maskAccount } from '../../utils/format';

interface Props {
  visible: boolean;
  accounts: BankAccount[];
  selectedId?: string;
  currency: Currency;
  onSelect: (account: BankAccount) => void;
  onAddAccount: () => void;
  onClose: () => void;
}

function SheetContent({
  accounts,
  currency,
  onSelect,
  onAddAccount,
  onClose,
}: Omit<Props, 'visible' | 'selectedId'>) {
  const { bottom } = useSafeAreaInsets();
  const filtered = accounts.filter((a) => a.currency === currency);

  return (
    <View
      className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl"
      style={{ paddingBottom: bottom }}
    >
      {/* Header */}
      <View className="py-4 px-4 border-b border-brand-border flex-row items-center">
        <View style={{ width: 24 }} />
        <Text className="flex-1 font-semibold text-text-muted text-lg text-start">
          Selecciona tu cuenta destino
        </Text>
        <TouchableOpacity onPress={onClose} hitSlop={8}>
          <Ionicons name="close" size={22} color={colors.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Empty state */}
      {filtered.length === 0 && (
        <View className="px-4 py-8 items-center">
          <Text className="text-text-muted text-sm text-center">
            No tienes cuentas en {currency === 'PEN' ? 'Soles' : 'Dólares'} registradas.
          </Text>
        </View>
      )}

      {/* Account list */}
      {filtered.length > 0 && (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          style={{ maxHeight: 320 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => onSelect(item)}
              activeOpacity={0.7}
              className="px-6 py-4"
            >
              <Text style={{ fontSize: 14, fontWeight: '700', color: colors.textDark }}>
                {item.alias} - {item.bank.name} - {item.currency}
              </Text>
              <Text style={{ fontSize: 12, fontWeight: '400', color: colors.textMuted, marginTop: 2 }}>
                {maskAccount(item.accountNumber)}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Add account */}
      <TouchableOpacity
        onPress={onAddAccount}
        activeOpacity={0.7}
        className="flex-row items-center gap-4 px-6 py-4"
      >
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 10,
            borderWidth: 1.5,
            borderColor: colors.textDark,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="add" size={22} color={colors.textDark} />
        </View>
        <Text style={{ fontSize: 14, fontWeight: '400', color: colors.textMuted }}>
          Agregar cuenta
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default function AccountSelectModal({
  visible,
  accounts,
  currency,
  onSelect,
  onAddAccount,
  onClose,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide" statusBarTranslucent>
      <TouchableOpacity className="flex-1 bg-black/40" activeOpacity={1} onPress={onClose}>
        <SafeAreaProvider>
          <SheetContent
            accounts={accounts}
            currency={currency}
            onSelect={onSelect}
            onAddAccount={onAddAccount}
            onClose={onClose}
          />
        </SafeAreaProvider>
      </TouchableOpacity>
    </Modal>
  );
}
