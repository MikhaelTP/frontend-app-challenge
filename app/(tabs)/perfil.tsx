import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/store/authStore';
import { colors } from '../../src/constants/theme';

interface MenuItemProps {
  iconName: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  onPress: () => void;
  destructive?: boolean;
  isLast?: boolean;
}

function MenuItem({ iconName, label, onPress, destructive = false, isLast = false }: MenuItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className={`flex-row items-center gap-3 px-4 py-4 bg-white ${!isLast ? 'border-b border-brand-border' : ''}`}
    >
      <View
        className="items-center justify-center"
        style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: destructive ? '#FEE2E2' : '#F5F7FA' }}
      >
        <Ionicons name={iconName} size={20} color={destructive ? '#DC2626' : colors.textDark} />
      </View>
      <Text style={{ flex: 1, fontSize: 15, fontWeight: '500', color: destructive ? '#DC2626' : colors.textDark }}>
        {label}
      </Text>
      {!destructive && <Ionicons name="chevron-forward" size={18} color={colors.textInput} />}
    </TouchableOpacity>
  );
}

export default function PerfilScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  function handleLogout() {
    Alert.alert('Cerrar sesión', '¿Estás seguro de que quieres cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Cerrar sesión', style: 'destructive', onPress: () => { logout(); router.replace('/(auth)/login'); } },
    ]);
  }

  return (
    <SafeAreaView className="flex-1 bg-brand-gray" edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile hero */}
        <View className="px-4 pt-8 pb-10 items-center" style={{ backgroundColor: '#0B1629' }}>
          <View
            className="items-center justify-center mb-4"
            style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)' }}
          >
            <Image source={require('../../assets/images/icon-perfil.png')} style={{ width: 44, height: 44, tintColor: '#fff' }} resizeMode="contain" />
          </View>

          <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700' }}>{user?.name ?? 'Usuario'}</Text>
          <Text style={{ color: 'rgba(255,255,255,0.55)', fontSize: 15, marginTop: 4 }}>{user?.email ?? ''}</Text>

          <View className="flex-row items-center gap-2 mt-4 px-4 py-2 rounded-full" style={{ backgroundColor: 'rgba(0,227,194,0.15)' }}>
            <Image source={require('../../assets/images/icon-koink.png')} style={{ width: 18, height: 18 }} />
            <Text style={{ color: '#00E3C2', fontSize: 15, fontWeight: '600' }}>
              {(user?.koinks ?? 0).toLocaleString()} Koinks
            </Text>
          </View>
        </View>

        {/* Menu — main */}
        <View className="mx-4 mt-4 rounded-2xl overflow-hidden">
          <MenuItem iconName="receipt-outline" label="Historial de operaciones" onPress={() => router.push('/(tabs)/historial')} />
          <MenuItem iconName="card-outline" label="Mis cuentas bancarias" onPress={() => router.push('/(tabs)/cuentas')} />
          <MenuItem iconName="star-outline" label="Koinks y beneficios" onPress={() => router.push('/(tabs)/koinks')} />
          <MenuItem iconName="notifications-outline" label="Alertas de tipo de cambio" onPress={() => router.push('/(tabs)/alertas')} />
          <MenuItem iconName="help-circle-outline" label="Ayuda y soporte" onPress={() => router.push('/(tabs)/ayuda')} isLast />
        </View>

        {/* Menu — logout */}
        <View className="mx-4 mt-3 rounded-2xl overflow-hidden mb-6">
          <MenuItem iconName="log-out-outline" label="Cerrar sesión" onPress={handleLogout} destructive isLast />
        </View>

        <Text style={{ textAlign: 'center', fontSize: 13, color: colors.textMuted, paddingBottom: 16 }}>
          Kambista v1.0.0 · Lun-Vie 9am-7pm · Sáb 9am-2pm
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
