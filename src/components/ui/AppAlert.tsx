import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

type AlertType = 'info' | 'warn' | 'error';

interface AppAlertProps {
  type?: AlertType;
  children: React.ReactNode;
  dismissible?: boolean;
}

const styles: Record<AlertType, { container: string; text: string; icon: string }> = {
  info: {
    container: 'bg-alert-info-bg',
    text: 'text-blue-800',
    icon: 'ℹ️',
  },
  warn: {
    container: 'bg-alert-warn-bg',
    text: 'text-orange-900',
    icon: '⚠️',
  },
  error: {
    container: 'bg-red-50 border border-red-200',
    text: 'text-red-800',
    icon: '✕',
  },
};

export default function AppAlert({ type = 'info', children, dismissible = false }: AppAlertProps) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  const s = styles[type];

  return (
    <View className={`flex-row items-start rounded-lg p-3 gap-2 ${s.container}`}>
      <Text className="text-sm mt-0.5">{s.icon}</Text>
      <Text className={`flex-1 text-xs leading-4 ${s.text}`}>{children}</Text>
      {dismissible && (
        <TouchableOpacity onPress={() => setDismissed(true)} hitSlop={8}>
          <Text className={`text-xs font-bold ${s.text}`}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
