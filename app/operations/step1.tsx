import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AppSelect from '../../src/components/ui/AppSelect';
import AppAlert from '../../src/components/ui/AppAlert';
import AppButton from '../../src/components/ui/AppButton';
import StepProgressBar from '../../src/components/ui/StepProgressBar';
import AccountSelectModal from '../../src/components/modals/AccountSelectModal';
import AddAccountModal from '../../src/components/modals/AddAccountModal';
import { useTransactionStore } from '../../src/store/transactionStore';
import banksData from '../../src/mocks/bankAccounts.json';
import sourceFundsData from '../../src/mocks/sourceFunds.json';
import type { BankAccount } from '../../src/types';
import { colors } from '../../src/constants/theme';
import { formatMoney } from '../../src/utils/format';

const BANK_OPTIONS = banksData.map((b) => ({ value: b.id, label: b.name }));
const FUND_OPTIONS = sourceFundsData.map((f) => ({ value: f.id, label: f.name }));

export default function Step1Screen() {
  const router = useRouter();
  const { current, savedAccounts, setDestinationAccount, setSourceOfFunds } =
    useTransactionStore();

  const [originBankId, setOriginBankId] = useState<number | null>(null);
  const [fundId, setFundId] = useState<number | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const isValid = originBankId && selectedAccount && fundId;

  const kambistRate = current.exchangeRate ?? 0;
  // 0.011 represents the typical bank spread above Kambista's rate, shown crossed-out to highlight savings
  const bankRate = (kambistRate - 0.011).toFixed(3);
  const kambistRateStr = kambistRate.toFixed(3);

  function handleContinue() {
    const fund = sourceFundsData.find((f) => f.id === fundId);
    if (!isValid || !selectedAccount || !fund) return;
    setDestinationAccount(selectedAccount);
    setSourceOfFunds(fund);
    router.push('/operations/step2');
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F6F6F9]" edges={['top']}>
      {/* Header */}
      <View className="bg-[#F6F6F9] px-4 py-1 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} hitSlop={8} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={24} color={colors.textDark} />
        </TouchableOpacity>
        <Text className="flex-1 text-lg font-bold text-text-dark text-center">
          Completa los datos
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Progress bar */}
      <StepProgressBar current={1} />

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 34, paddingBottom: 40, paddingTop: 10 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Summary card */}
        <View className="bg-white rounded-2xl p-4 mb-4">
          {/* Tú envías */}
          <View className="flex-row justify-between items-center py-1">
            <Text className="text-base text-[#060F26]">Tú envías</Text>
            <Text className="text-base font-bold text-[#060F26]">
              {formatMoney(current.sendAmount, current.originCurrency ?? 'USD')}
            </Text>
          </View>

          {/* Tú recibes */}
          <View className="flex-row justify-between items-center py-1">
            <Text className="text-base text-[#060F26]">Tú recibes</Text>
            <Text className="text-base font-semibold text-[#060F26]">
              {formatMoney(current.receiveAmount, current.destinationCurrency ?? 'PEN')}
            </Text>
          </View>

          {/* Cupón */}
          {current.coupon && (
            <View className="flex-row justify-between items-center py-1">
              <Text className="text-base text-[#060F26]">Cupón aplicado</Text>
              <Text className="text-base font-bold text-[#060F26]">{current.coupon}</Text>
            </View>
          )}

          {/* Separator */}
          <View className="h-px bg-text-muted my-1" />

          {/* Exchange rate */}
          <View className="flex-row justify-between items-center py-2">
            <Text className="text-base font-bold text-text-dark">
              Tipo de cambio utilizado
            </Text>
            <View className="flex-row items-center gap-2">
              <Text
                style={{
                  fontSize: 16,
                  color: colors.error,
                  textDecorationLine: 'line-through',
                  fontWeight: 'bold',
                }}
              >
                {bankRate}
              </Text>
              <Text className="text-base font-bold text-text-dark">{kambistRateStr}</Text>
            </View>
          </View>
        </View>

        {/* Timer alert */}
        <View className="mb-4">
          <AppAlert type="info">
            <Text className="text-base leading-5">
              Tiempo estimado de espera{' '}
              <Text className="font-bold">BCP, Interbank, BanBif, Pichincha</Text>: 15 minutos.{'\n'}
              <Text className="font-bold">Otros bancos</Text>: 1 día hábil
            </Text>
          </AppAlert>
        </View>

        {/* Origin bank */}
        <View className="mb-4">
          <Text className="text-base text-text-muted mb-1.5">
            ¿Desde qué banco nos envías tu dinero?
          </Text>
          <AppSelect
            options={BANK_OPTIONS}
            value={originBankId}
            onChange={(v) => setOriginBankId(Number(v))}
            placeholder="Selecciona"
          />
        </View>

        {/* Destination account */}
        <View className="mb-4">
          <Text className="text-base text-text-muted mb-1.5">
            ¿En qué cuenta deseas recibir tu dinero?
          </Text>
          <TouchableOpacity
            onPress={() => setShowAccountModal(true)}
            activeOpacity={0.7}
            className="flex-row items-center justify-between border border-brand-border rounded-xl px-4 bg-white"
            style={{ minHeight: 52 }}
          >
            <Text
              className="flex-1 text-base py-0"
              style={{ color: selectedAccount ? colors.textDark : colors.textInput }}
            >
              {selectedAccount
                ? `${selectedAccount.alias} — ${selectedAccount.bank.name}`
                : 'Selecciona'}
            </Text>
            <Ionicons name="chevron-down" size={20} color={colors.textDark} />
          </TouchableOpacity>
        </View>

        {/* Warn alert */}
        <View className="mb-4">
          <AppAlert type="warn">
            <Text className="text-base leading-5">
              Recuerda que las cuentas deben estar{' '}
              <Text className="font-bold">a tu nombre.</Text> Kambista{' '}
              <Text className="font-bold">no transfiere a cuentas de terceros</Text>
            </Text>
          </AppAlert>
        </View>

        {/* Source of funds */}
        <View className="mb-2">
          <Text className="text-base text-text-muted mb-1.5">Origen de fondos</Text>
          <AppSelect
            options={FUND_OPTIONS}
            value={fundId}
            onChange={(v) => setFundId(Number(v))}
            placeholder="Selecciona"
          />
        </View>

        <AppButton
          label="CONTINUAR"
          onPress={handleContinue}
          disabled={!isValid}
          variant="teal"
        />
      </ScrollView>

      <AccountSelectModal
        visible={showAccountModal}
        accounts={savedAccounts}
        selectedId={selectedAccount?.id}
        currency={current.destinationCurrency ?? 'PEN'}
        onSelect={(account) => {
          setSelectedAccount(account);
          setShowAccountModal(false);
        }}
        onAddAccount={() => {
          setShowAccountModal(false);
          setShowAddModal(true);
        }}
        onClose={() => setShowAccountModal(false)}
      />

      <AddAccountModal
        visible={showAddModal}
        currency={current.destinationCurrency ?? 'PEN'}
        onSaved={(account) => {
          setSelectedAccount(account);
          setShowAddModal(false);
        }}
        onClose={() => setShowAddModal(false)}
      />
    </SafeAreaView>
  );
}
