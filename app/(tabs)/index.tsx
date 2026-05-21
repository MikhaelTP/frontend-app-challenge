import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useExchangeStore } from '../../src/store/exchangeStore';
import { useTransactionStore } from '../../src/store/transactionStore';
import { colors } from '../../src/constants/theme';
import { formatAmount, formatRate } from '../../src/utils/format';

export default function HomeScreen() {
  const router = useRouter();
  const store = useExchangeStore();
  const initTransaction = useTransactionStore((s) => s.initTransaction);

  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [coupon, setCoupon] = useState('');
  const [localAmount, setLocalAmount] = useState(String(store.sendAmount));

  const rotAnim = useRef(new Animated.Value(0)).current;
  const rotDeg = useRef(0);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const prevReceive = useRef(store.receiveAmount);
  const entryAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    store.fetchRates().then(() => store.calculate());
    Animated.spring(entryAnim, {
      toValue: 1,
      tension: 60,
      friction: 10,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (prevReceive.current !== store.receiveAmount && store.receiveAmount > 0) {
      prevReceive.current = store.receiveAmount;
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 0.6, duration: 150, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
      ]).start();
    }
  }, [store.receiveAmount]);

  function handleTabChange(tab: 'buy' | 'sell') {
    setActiveTab(tab);
    store.setActiveTab(tab);
    setLocalAmount(String(store.sendAmount));
  }

  function handleAmountChange(text: string) {
    setLocalAmount(text);
    const num = parseFloat(text.replace(/,/g, '')) || 0;
    store.setSendAmount(num);
    store.calculate();
  }

  function handleSwap() {
    rotDeg.current += 180;
    Animated.timing(rotAnim, {
      toValue: rotDeg.current,
      duration: 400,
      useNativeDriver: true,
    }).start();
    store.swapCurrencies();
    setActiveTab((t) => (t === 'buy' ? 'sell' : 'buy'));
  }

  function handleStartOperation() {
    initTransaction({
      sendAmount: store.sendAmount,
      receiveAmount: store.receiveAmount,
      exchangeRate: activeTab === 'buy' ? store.buyRate : store.sellRate,
      originCurrency: store.sendCurrency,
      destinationCurrency: store.receiveCurrency,
      coupon: coupon || undefined,
      savingsAmount: store.savingsAmount,
    });
    router.push('/operations/step1');
  }

  const rotate = rotAnim.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  const entryStyle = {
    opacity: entryAnim,
    transform: [{ translateY: entryAnim.interpolate({ inputRange: [0, 1], outputRange: [32, 0] }) }],
  };

  const sendLabel = store.sendCurrency === 'USD' ? 'Dólares' : 'Soles';
  const receiveLabel = store.receiveCurrency === 'PEN' ? 'Soles' : 'Dólares';

  return (
    <SafeAreaView className="flex-1 bg-brand-gray" edges={['top']}>
      {/* Header */}
      <View className="bg-brand-gray px-4 items-center">
        <Image
          source={require('../../assets/images/logo-completo.png')}
          style={{ width: 180, height: 120 }}
          resizeMode="contain"
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>
        <Animated.View style={entryStyle}>
        {/* Calculator card */}
        <View className="bg-white rounded-2xl overflow-hidden mb-4">

          {/* Buy/Sell tabs */}
          <View className="flex-row">
            {(['buy', 'sell'] as const).map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => handleTabChange(tab)}
                activeOpacity={0.85}
                className={`flex-1 py-3 items-center  ${activeTab === tab ? 'bg-brand-dark' : 'bg-white'}`}
              >
                <Text className={`text-sm font-bold ${activeTab === tab ? 'text-white' : 'text-text-input'}`}>
                  {tab === 'buy'
                    ? `Compra: ${formatRate(store.buyRate)}`
                    : `Venta: ${formatRate(store.sellRate)}`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View className="p-4">
            {/* Send row */}
            <View className="flex-row rounded-xl overflow-hidden" style={{ zIndex: 1 }}>
              <View className="flex-1 bg-[#E0E0E0] px-4 py-3">
                <Text className="text-base text-text-muted mb-1">¿Cuánto envías?</Text>
                <TextInput
                  value={localAmount}
                  onChangeText={handleAmountChange}
                  keyboardType="decimal-pad"
                  className="text-xl font-bold"
                  style={{ color: colors.textDark, padding: 0, includeFontPadding: false } as any}
                />
              </View>
              <TouchableOpacity
                className="bg-brand-dark px-4 py-3 justify-center items-center"
                style={{ minWidth: 120 }}
                activeOpacity={0.8}
              >
                <View className="flex-row items-center gap-2">
                  <Text className="text-white font-bold text-xl">{sendLabel}</Text>
                  <Ionicons name="chevron-down" size={14} color="#fff" />
                </View>
              </TouchableOpacity>
            </View>

            {/* Swap button — overlaps both rows with negative margin */}
            <View style={{ alignItems: 'flex-end', paddingRight: 100, zIndex: 10, marginVertical: -10 }}>
              <Animated.View style={{ transform: [{ rotate }] }}>
                {/* Outer ring */}
                <View style={{
                  width: 32, height: 32, borderRadius: 24,
                  borderWidth: 2, borderColor: '#C8C8C8',
                  alignItems: 'center', justifyContent: 'center',
                  backgroundColor: '#C8C8C8'
                }}>
                  <TouchableOpacity
                    onPress={handleSwap}
                    activeOpacity={0.8}
                    style={{
                      width: 36, height: 36, borderRadius: 18,
                      backgroundColor: '#fff',
                      alignItems: 'center', justifyContent: 'center',
                      elevation: 12,
                      shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 12, shadowOffset: { width: 0, height: 4 },
                    }}
                  >
                    <Ionicons name="sync-outline" size={26} color={colors.textDark} />
                  </TouchableOpacity>
                </View>
              </Animated.View>
            </View>

            {/* Receive row */}
            <View className="flex-row rounded-xl overflow-hidden mb-4" style={{ zIndex: 1 }}>
              <View className="flex-1 bg-[#E0E0E0] px-4 py-3">
                <Text className="text-base text-text-muted mb-1">Entonces recibes</Text>
                {store.loading ? (
                  <ActivityIndicator size="small" color={colors.brandDark} />
                ) : (
                  <Animated.Text
                    style={{ fontSize: 18, fontWeight: '700', color: colors.textDark, opacity: pulseAnim }}
                  >
                    {formatAmount(store.receiveAmount)}
                  </Animated.Text>
                )}
              </View>
              <TouchableOpacity
                className="bg-brand-dark px-4 py-3 justify-center items-center"
                style={{ minWidth: 120 }}
                activeOpacity={0.8}
              >
                <View className="flex-row items-center gap-2">
                  <Text className="text-white font-bold text-xl">{receiveLabel}</Text>
                  <Ionicons name="chevron-down" size={14} color="#fff" />
                </View>
              </TouchableOpacity>
            </View>

            {/* Savings & Koins */}
            <View className="flex-row justify-between mb-2">
              <View>
                <Text className="text-base text-text-dark">Ahorro estimado:</Text>
                <Text className="text-base font-bold text-text-dark">
                  {store.savingsCurrency} {formatAmount(store.savingsAmount)}
                </Text>
              </View>
              <View className="items-end">
                <Text className="text-base text-text-dark">Koins:</Text>
                <View className="flex-row items-center gap-1">
                  <Text className="px-3 text-base font-bold text-text-dark">
                    {store.koinksEarned.toLocaleString()}
                  </Text>
                </View>
              </View>
            </View>

            {/* Coupon */}
            <View className="flex-row rounded-xl overflow-hidden border border-brand-border mb-4"
              style={{ borderBottomColor: 'rgba(0,0,0,0.12)', borderBottomWidth: 3 }}>
              <TextInput
                value={coupon}
                onChangeText={setCoupon}
                placeholder="Ingresa el cupón"
                placeholderTextColor={colors.textInput}
                className="flex-1 px-4 py-3 text-base"
                style={{ color: colors.textDark, padding: 0, textAlign: 'center' }}
                autoCapitalize="characters"
              />
              <TouchableOpacity className="bg-brand-dark px-5 items-center justify-center">
                <Text className="text-white text-base tracking-widest">APLICAR</Text>
              </TouchableOpacity>
            </View>

            {/* Preferential rate */}
            <View className="flex-row px-5 items-center gap-2 bg-white">
              <Image
                source={require('../../assets/images/icon-preferencial.png')}
                style={{ width: 22, height: 22 }}
              />
              <Text className="flex-1 text-base text-text-dark">
                ¿Monto mayor a $5.000 o S/18.000?{' '}
                <Text className="font-bold underline">¡Obtén un Tipo de Cambio Preferencial!</Text>
              </Text>
            </View>
          </View>
        </View>

        {/* CTA */}
        <TouchableOpacity
          onPress={handleStartOperation}
          activeOpacity={0.85}
          className="bg-brand-teal rounded-2xl py-4 items-center"
        >
          <Text className="text-brand-dark font-bold text-base tracking-widest">INICIAR OPERACIÓN</Text>
        </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
