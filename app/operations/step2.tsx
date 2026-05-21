import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AppButton from '../../src/components/ui/AppButton';
import StepProgressBar from '../../src/components/ui/StepProgressBar';
import { useTransactionStore } from '../../src/store/transactionStore';
import { colors } from '../../src/constants/theme';
import { formatMoney } from '../../src/utils/format';

const KAMBISTA_BANK = {
  bank: 'Interbank',
  accountNumber: '201010000000000',
  ruc: '20601708141',
  holder: 'Kambista SAC',
  accountType: 'Corriente',
};

// Exchange rate is valid for 10 minutes; after this time it may be recalculated
function getUpdateTime(): string {
  const d = new Date(Date.now() + 10 * 60 * 1000);
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
}

interface CopyFieldProps {
  label: string;
  value: string;
}

function CopyField({ label, value }: CopyFieldProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await Clipboard.setStringAsync(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <View className="flex-row items-center justify-between py-2">
      <View className="flex-1">
        <Text style={{ fontSize: 12, fontWeight: '700', color: colors.textMuted }}>{label}</Text>
        <Text style={{ fontSize: 14, fontWeight: '700', color: colors.textDark, marginTop: 1, paddingLeft: 6 }}>
          {value}
        </Text>
      </View>
      <TouchableOpacity onPress={handleCopy} activeOpacity={0.7} hitSlop={8}>
        {copied ? (
          <Ionicons name="checkmark-circle" size={20} color="#16A34A" />
        ) : (
          <Image
            source={require('../../assets/images/icon-copy.png')}
            style={{ width: 18, height: 18, opacity: 0.6 }}
            resizeMode="contain"
          />
        )}
      </TouchableOpacity>
    </View>
  );
}

function StaticField({ label, value }: { label: string; value: string }) {
  return (
    <View className="py-2">
      <Text style={{ fontSize: 12, fontWeight: '700', color: colors.textMuted }}>{label}</Text>
      <Text style={{ fontSize: 14, fontWeight: '700', color: colors.textDark, marginTop: 1, paddingLeft: 6 }}>
        {value}
      </Text>
    </View>
  );
}

export default function Step2Screen() {
  const router = useRouter();
  const { current } = useTransactionStore();
  const [updateTime] = useState(getUpdateTime);

  const montoStr = formatMoney(current.sendAmount, current.originCurrency ?? 'PEN');

  return (
    <SafeAreaView className="flex-1 bg-brand-gray" edges={['top']}>
      {/* Header */}
      <View className="bg-[#F6F6F9] px-4 py-1 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} hitSlop={8} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={24} color={colors.textDark} />
        </TouchableOpacity>
        <Text className="flex-1 text-lg font-bold text-text-dark text-center">
          Transfiere a Kambista
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Progress bar */}
      <StepProgressBar current={2} />

      <ScrollView
        contentContainerStyle={{ padding: 26, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Rate update notice */}
        <View
          className="rounded-2xl px-4 py-0 flex-row items-center justify-between mb-4"
        >
          <Text style={{ fontSize: 12.5, color: colors.textMuted }}>
            El tipo de cambio podría actualizarse a las:
          </Text>
          <Text style={{ fontSize: 18, fontWeight: '700', color: colors.textMuted }}>
            {updateTime}
          </Text>
        </View>

        {/* Main card */}
        <View className="bg-white rounded-2xl p-4  mb-4 border border-[#E0E4EB]">
          {/* Illustration */}
          <View className="items-center mb-4">
            <Image
              source={require('../../assets/images/step2-illustration.png')}
              style={{ width: 100, height: 100 }}
              resizeMode="contain"
            />
          </View>

          {/* Instruction */}
          <Text style={{ fontSize: 17, color: colors.textDark, lineHeight: 22, marginBottom: 16, paddingLeft: 10 }}>
            Transfiere desde tu app bancaria y guarda el{' '}
            <Text style={{ fontWeight: '700', textDecorationLine: 'underline' }}>
              número o código de {'\n'} operación
            </Text>
            {' '}para el siguiente paso.
          </Text>

          {/* Bank details inner card */}
          <View
            style={{
              borderWidth: 1,
              borderColor: '#E5E7EB',
              borderRadius: 12,
              paddingHorizontal: 14,
              marginHorizontal: 20,
              overflow: 'hidden',
            }}
          >
            <StaticField label="Banco" value={KAMBISTA_BANK.bank} />
            <CopyField label="Monto" value={montoStr} />
            <CopyField label="Número de cuenta" value={KAMBISTA_BANK.accountNumber} />
            <CopyField label="RUC" value={KAMBISTA_BANK.ruc} />
            <StaticField label="Titular de la cuenta" value={KAMBISTA_BANK.holder} />
            <View className="py-3">
              <Text style={{ fontSize: 12, fontWeight: '700', color: colors.textMuted }}>Tipo de cuenta</Text>
              <Text style={{ fontSize: 14, fontWeight: '700', color: colors.textDark, marginTop: 1, paddingLeft: 6}}>
                {KAMBISTA_BANK.accountType}
              </Text>
            </View>
          </View>
        </View>

        <AppButton
          label="YA HICE MI TRANSFERENCIA"
          onPress={() => router.push('/operations/step3')}
          variant="teal"
        />
      </ScrollView>
    </SafeAreaView>
  );
}
