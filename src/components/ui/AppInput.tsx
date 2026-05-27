import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/theme';

interface AppInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  maxLength?: number;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  editable?: boolean;
}

export default function AppInput({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  secureTextEntry = false,
  keyboardType = 'default',
  maxLength,
  autoCapitalize = 'none',
  editable = true,
}: AppInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = secureTextEntry;

  return (
    <View className="mb-1">
      {label ? (
        <Text className="text-base text-text-muted mb-1.5">{label}</Text>
      ) : null}

      <View
        className={`flex-row items-center border rounded-xl px-4 bg-white ${
          error ? 'border-error' : 'border-brand-border'
        }`}
        style={{ minHeight: 40 }}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textInput}
          secureTextEntry={isPassword && !showPassword}
          keyboardType={keyboardType}
          maxLength={maxLength}
          autoCapitalize={autoCapitalize}
          editable={editable}
          className="flex-1 py-1 text-base text-text-dark"
          style={{ color: colors.textDark }}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword((v) => !v)}
            hitSlop={10}
            className="pl-2"
          >
            <Ionicons
              name={showPassword ? 'eye' : 'eye-outline'}
              size={22}
              color={showPassword ? colors.brandDark : colors.textInput}
            />
          </TouchableOpacity>
        )}
      </View>

      {error ? (
        <Text className="text-error text-xs mt-1">{error}</Text>
      ) : null}
    </View>
  );
}
