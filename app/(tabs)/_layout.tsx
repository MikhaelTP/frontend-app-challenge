import { Tabs, Redirect } from 'expo-router';
import { Image, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../src/constants/theme';
import { useAuthStore } from '../../src/store/authStore';

interface TabIconProps {
  focused: boolean;
  source: ReturnType<typeof require>;
}

function TabIcon({ focused, source }: TabIconProps) {
  return (
    <Image
      source={source}
      style={{
        width: 24,
        height: 24,
        opacity: focused ? 1 : 0.4,
      }}
      resizeMode="contain"
    />
  );
}

export default function TabsLayout() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { bottom } = useSafeAreaInsets();

  if (!isAuthenticated) return <Redirect href="/(auth)/login" />;

  const tabBarHeight = (Platform.OS === 'ios' ? 60 : 56) + bottom;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.brandDark,
        tabBarInactiveTintColor: colors.textInput,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.borderGray,
          borderTopWidth: 1,
          height: tabBarHeight,
          paddingBottom: bottom || 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} source={require('../../assets/images/icons/inicio.png')} />
          ),
        }}
      />
      <Tabs.Screen
        name="historial"
        options={{
          title: 'Historial',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} source={require('../../assets/images/icons/historial.png')} />
          ),
        }}
      />
      <Tabs.Screen
        name="cuentas"
        options={{
          title: 'Cuentas',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} source={require('../../assets/images/icons/cuentas.png')} />
          ),
        }}
      />
      <Tabs.Screen
        name="koinks"
        options={{
          title: 'Koinks',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} source={require('../../assets/images/icons/koinks.png')} />
          ),
          tabBarBadgeStyle: {
            backgroundColor: colors.brandTeal,
            color: colors.brandDark,
            fontSize: 8,
            fontWeight: '700',
          },
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} source={require('../../assets/images/icon-perfil.png')} />
          ),
        }}
      />
      <Tabs.Screen name="alertas" options={{ href: null }} />
      <Tabs.Screen name="ayuda" options={{ href: null }} />
    </Tabs>
  );
}
