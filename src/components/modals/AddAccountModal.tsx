import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AppInput from '../ui/AppInput';
import AppSelect from '../ui/AppSelect';
import AppButton from '../ui/AppButton';
import AppAlert from '../ui/AppAlert';
import { useTransactionStore } from '../../store/transactionStore';
import { useValidation } from '../../hooks/useValidation';
import banksData from '../../mocks/bankAccounts.json';
import type { BankAccount, Currency } from '../../types';
import { colors } from '../../constants/theme';

interface Props {
  visible: boolean;
  currency: Currency;
  onSaved: (account: BankAccount) => void;
  onClose: () => void;
}

const ACCOUNT_TYPES = [
  { value: 'Ahorros', label: 'Ahorros' },
  { value: 'Corriente', label: 'Corriente' },
];

const BANK_OPTIONS = banksData.map((b) => ({ value: b.id, label: b.name }));

function SheetContent({ currency, onSaved, onClose }: Omit<Props, 'visible'>) {
  const { bottom } = useSafeAreaInsets();
  const addSavedAccount = useTransactionStore((s) => s.addSavedAccount);
  const { validateAccountNumber, validateAlias } = useValidation();

  const [accountType, setAccountType] = useState<string>('Ahorros');
  const [bankId, setBankId] = useState<number | null>(null);
  const [accountNumber, setAccountNumber] = useState('');
  const [alias, setAlias] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(currency);
  const [ownershipChecked, setOwnershipChecked] = useState(false);
  const [errors, setErrors] = useState({ accountNumber: '', alias: '' });

  const isValid =
    !!accountType &&
    !!bankId &&
    !validateAccountNumber(accountNumber) &&
    !validateAlias(alias) &&
    ownershipChecked;

  function handleSave() {
    const accErr = validateAccountNumber(accountNumber);
    const aliasErr = validateAlias(alias);
    setErrors({ accountNumber: accErr, alias: aliasErr });
    if (accErr || aliasErr || !bankId) return;

    const bank = banksData.find((b) => b.id === bankId)!;
    const account: BankAccount = {
      id: `acc-${Date.now()}`,
      bank,
      accountType: accountType as 'Ahorros' | 'Corriente',
      accountNumber,
      alias,
      currency: selectedCurrency,
    };

    addSavedAccount(account);
    onSaved(account);

    setAccountType('Ahorros');
    setBankId(null);
    setAccountNumber('');
    setAlias('');
    setOwnershipChecked(false);
    setErrors({ accountNumber: '', alias: '' });
  }

  const currencyLabel = selectedCurrency === 'PEN' ? 'soles' : 'dólares';

  return (
    <View className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl" style={{ maxHeight: '92%' }}>
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View className="px-5 pt-4 pb-3">
          <View className="flex-row items-start justify-between">
            <Text style={{ fontSize: 20, fontWeight: '700', color: colors.textDark, flex: 1 }}>
              Agregar cuenta {currencyLabel}
            </Text>
            <TouchableOpacity onPress={onClose} hitSlop={8} style={{ marginTop: 2 }}>
              <Ionicons name="close" size={22} color={colors.textMuted} />
            </TouchableOpacity>
          </View>
        </View>

        <View className="h-px bg-brand-border mx-5 mb-4" />

        <View style={{ paddingHorizontal: 20, paddingBottom: 32 + bottom, gap: 12 }}>
          <Text style={{ fontSize: 18, color: colors.textDark, lineHeight: 20 }}>
            La cuenta que registres{' '}
            <Text style={{ fontWeight: '700' }}>debe estar a tu nombre</Text>
            {' '}(titular de este perfil en Kambista)
          </Text>

          <AppSelect
            label="Tipo de cuenta bancaria"
            options={ACCOUNT_TYPES}
            value={accountType}
            onChange={(v) => setAccountType(String(v))}
          />

          <AppSelect
            label="Entidad financiera"
            options={BANK_OPTIONS}
            value={bankId}
            onChange={(v) => setBankId(Number(v))}
            placeholder="Selecciona"
          />

          <AppAlert type="info">
            <Text className="text-base leading-5">
              Operamos en Lima con todos los bancos. Y en provincia con el{' '}
              <Text className="font-bold">BCP</Text> y cuentas digitales{' '}
              <Text className="font-bold">Interbank</Text>.
            </Text>
          </AppAlert>

          <View>
            <Text className="text-base text-text-muted mb-1">Moneda</Text>
            <View className="flex-row gap-8">
              {(['PEN', 'USD'] as Currency[]).map((cur) => {
                const active = selectedCurrency === cur;
                return (
                  <TouchableOpacity
                    key={cur}
                    onPress={() => setSelectedCurrency(cur)}
                    activeOpacity={0.8}
                    style={{
                      flex: 1,
                      paddingVertical: 12,
                      borderRadius: 10,
                      alignItems: 'center',
                      backgroundColor: active ? '#0B1629' : '#fff',
                      borderWidth: 1,
                      borderColor: active ? '#0B1629' : '#E5E7EB',
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: '400',
                        letterSpacing: 1,
                        color: active ? '#fff' : colors.textMuted,
                      }}
                    >
                      {cur === 'PEN' ? 'SOLES' : 'DÓLARES'}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <AppInput
            label="Número de cuenta"
            placeholder="Escribe tu cuenta de destino"
            value={accountNumber}
            onChangeText={(v) => {
              setAccountNumber(v);
              setErrors((e) => ({ ...e, accountNumber: validateAccountNumber(v) }));
            }}
            keyboardType="numeric"
            maxLength={20}
            error={errors.accountNumber}
          />

          <AppInput
            label="Ponle nombre a tu cuenta"
            placeholder="Escribe un alias"
            value={alias}
            onChangeText={(v) => {
              setAlias(v);
              setErrors((e) => ({ ...e, alias: validateAlias(v) }));
            }}
            autoCapitalize="words"
            maxLength={30}
            error={errors.alias}
          />

          <TouchableOpacity
            onPress={() => setOwnershipChecked((v) => !v)}
            className="flex-row items-center gap-2"
            activeOpacity={0.7}
          >
            <View
              style={{
                width: 18,
                height: 18,
                borderRadius: 3,
                borderWidth: 1.5,
                borderColor: ownershipChecked ? '#0B1629' : '#E5E7EB',
                backgroundColor: ownershipChecked ? '#0B1629' : '#fff',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {ownershipChecked && <Ionicons name="checkmark" size={11} color="#fff" />}
            </View>
            <Text style={{ fontSize: 12, color: colors.textMuted }}>
              Declaro que esta cuenta es mía
            </Text>
          </TouchableOpacity>

          <AppButton
            label="GUARDAR CUENTA"
            onPress={handleSave}
            disabled={!isValid}
            variant="teal"
          />
        </View>
      </ScrollView>
    </View>
  );
}

export default function AddAccountModal({ visible, currency, onSaved, onClose }: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide" statusBarTranslucent>
      <TouchableOpacity className="flex-1 bg-black/40" activeOpacity={1} onPress={onClose}>
        <SafeAreaProvider>
          <SheetContent currency={currency} onSaved={onSaved} onClose={onClose} />
        </SafeAreaProvider>
      </TouchableOpacity>
    </Modal>
  );
}
