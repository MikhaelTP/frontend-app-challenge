import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/constants/theme';

const FAQS = [
  {
    id: 1,
    question: '¿Cómo realizo un cambio de divisas?',
    answer:
      'Ingresa el monto que deseas cambiar en la pantalla de Inicio, selecciona si compras o vendes dólares, registra tus cuentas bancarias y sigue los pasos de la operación. El proceso toma menos de 5 minutos.',
  },
  {
    id: 2,
    question: '¿Cuánto tiempo demora en acreditarse?',
    answer:
      'Las transferencias interbancarias demoran entre 30 minutos a 2 horas en días hábiles. Los depósitos en el mismo banco son casi inmediatos.',
  },
  {
    id: 3,
    question: '¿Qué documentos necesito para operar?',
    answer:
      'Solo necesitas tu DNI o documento de identidad válido. Debes completar tu perfil antes de realizar tu primera operación.',
  },
  {
    id: 4,
    question: '¿Cuál es el monto mínimo y máximo?',
    answer:
      'El monto mínimo es de USD 50 o S/ 185. Para montos mayores a USD 5,000 o S/ 18,000 contáctanos para obtener un tipo de cambio preferencial.',
  },
  {
    id: 5,
    question: '¿Cómo funcionan los Koinks?',
    answer:
      'Por cada dólar equivalente que cambies, ganas 1 Koink. Los Koinks son canjeables por beneficios exclusivos y mejoras en tu tipo de cambio.',
  },
];

const CONTACT_ITEMS = [
  {
    id: 'whatsapp',
    icon: 'logo-whatsapp' as const,
    label: 'WhatsApp',
    value: '+51 978 473 936',
    color: '#25D366',
    bg: '#DCFCE7',
    onPress: () => Linking.openURL('https://wa.me/51987654321'),
  },
  {
    id: 'email',
    icon: 'mail-outline' as const,
    label: 'Correo',
    value: 'ayuda@kambista.com',
    color: '#2563EB',
    bg: '#DBEAFE',
    onPress: () => Linking.openURL('mailto:ayuda@kambista.com'),
  },
  {
    id: 'phone',
    icon: 'call-outline' as const,
    label: 'Teléfono',
    value: '(01) 123 4567',
    color: colors.textDark,
    bg: '#F5F7FA',
    onPress: () => Linking.openURL('tel:+5101123456'),
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <TouchableOpacity
      onPress={() => setOpen((v) => !v)}
      activeOpacity={0.85}
      className="bg-white rounded-2xl overflow-hidden mb-2"
    >
      <View className="flex-row items-center gap-3 px-4 py-4">
        <Text style={{ flex: 1, fontSize: 15, fontWeight: '600', color: colors.textDark }}>{question}</Text>
        <Ionicons
          name={open ? 'chevron-up' : 'chevron-down'}
          size={16}
          color={colors.textInput}
        />
      </View>
      {open && (
        <View className="px-4 pb-4">
          <View className="h-px bg-brand-border mb-3" />
          <Text style={{ fontSize: 15, color: colors.textMuted, lineHeight: 22 }}>{answer}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function AyudaScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-brand-gray" edges={['top']}>
      {/* Header */}
      <View className="bg-white px-4 py-3 border-b border-brand-border flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} hitSlop={8} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={24} color={colors.textDark} />
        </TouchableOpacity>
        <Text className="flex-1 text-lg font-bold text-text-dark text-center">
          Ayuda y soporte
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Contact cards */}
        <Text style={{ fontSize: 16, fontWeight: '700', color: colors.textDark, marginBottom: 12 }}>Contáctanos</Text>
        <View className="flex-row gap-3" style={{ marginBottom: 24 }}>
          {CONTACT_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={item.onPress}
              activeOpacity={0.8}
              className="flex-1 bg-white rounded-2xl p-4 items-center"
            >
              <View
                className="items-center justify-center mb-2"
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: item.bg,
                }}
              >
                <Ionicons name={item.icon} size={22} color={item.color} />
              </View>
              <Text style={{ fontSize: 13, fontWeight: '700', color: colors.textDark }}>{item.label}</Text>
              <Text style={{ fontSize: 13, color: colors.textMuted, marginTop: 2, textAlign: 'center' }}>{item.value}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Hours */}
        <View
          className="rounded-2xl p-4 mb-6 flex-row items-center gap-3"
          style={{ backgroundColor: '#EFF6FF', borderWidth: 1, borderColor: '#BFDBFE' }}
        >
          <Ionicons name="time-outline" size={20} color="#082774" />
          <View>
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#082774' }}>
              Horario de atención
            </Text>
            <Text style={{ fontSize: 13, color: '#082774', marginTop: 2 }}>
              Lun–Vie 9:00am – 7:00pm · Sáb 9:00am – 2:00pm
            </Text>
          </View>
        </View>

        {/* FAQ */}
        <Text style={{ fontSize: 16, fontWeight: '700', color: colors.textDark, marginBottom: 12 }}>Preguntas frecuentes</Text>
        {FAQS.map((faq) => (
          <FAQItem key={faq.id} question={faq.question} answer={faq.answer} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
