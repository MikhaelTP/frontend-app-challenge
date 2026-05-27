import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';
import { colors } from '../../constants/theme';

interface AppButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'teal' | 'outline' | 'ghost';
}

export default function AppButton({
  label,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
}: AppButtonProps) {
  const isDisabled = disabled || loading;

  const bg =
    variant === 'teal'
      ? isDisabled ? 'bg-brand-teal/40' : 'bg-brand-teal'
      : variant === 'primary'
      ? isDisabled ? 'bg-text-input' : 'bg-brand-dark'
      : 'bg-transparent';

  const border = variant === 'outline' ? 'border border-brand-dark' : '';
  const textColor =
    variant === 'teal' ? 'text-brand-dark'
    : variant === 'primary' ? 'text-white'
    : 'text-brand-dark';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      className={`w-full rounded-xl py-4 items-center justify-center ${bg} ${border}`}
    >
      {loading ? (
        <View className="flex-row items-center gap-2">
          <ActivityIndicator color={colors.white} size="small" />
          <Text className={`font-semibold text-base ${textColor}`}>Cargando...</Text>
        </View>
      ) : (
        <Text className={`font-semibold text-base ${textColor}`}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}
