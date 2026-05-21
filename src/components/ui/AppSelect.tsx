import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/theme';

interface Option {
  value: number | string;
  label: string;
}

interface AppSelectProps {
  label?: string;
  options: Option[];
  value: number | string | null;
  onChange: (value: number | string) => void;
  placeholder?: string;
  error?: string;
}

interface SheetProps {
  label?: string;
  options: Option[];
  onSelect: (value: number | string) => void;
  onClose: () => void;
}

function OptionSheet({ label, options, onSelect, onClose }: SheetProps) {
  const { bottom } = useSafeAreaInsets();

  return (
    <View
      className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-96"
      style={{ paddingBottom: bottom }}
    >
      <View className="py-4 px-4 border-b border-brand-border flex-row justify-between items-center">
        <View style={{ width: 24 }} />
        <Text className="flex-1 font-semibold text-text-dark text-lg text-center">
          {label ?? 'Selecciona una opción'}
        </Text>
        <TouchableOpacity onPress={onClose} hitSlop={8}>
          <Ionicons name="close" size={20} color={colors.textMuted} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={options}
        keyExtractor={(item) => String(item.value)}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => onSelect(item.value)}
            className="px-8 py-3.5"
          >
            <Text style={{ fontSize: 15, fontWeight: '400', color: colors.textDark }}>
              {item.label}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

export default function AppSelect({
  label,
  options,
  value,
  onChange,
  placeholder = 'Selecciona',
  error,
}: AppSelectProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  function handleSelect(val: number | string) {
    onChange(val);
    setOpen(false);
  }

  return (
    <View className="mb-1">
      {label ? (
        <Text className="text-base text-text-muted mb-1">{label}</Text>
      ) : null}

      <TouchableOpacity
        onPress={() => setOpen(true)}
        activeOpacity={0.7}
        className={`flex-row items-center justify-between border rounded-xl px-4 bg-white ${
          error ? 'border-error' : 'border-brand-border'
        }`}
        style={{ minHeight: 40 }}
      >
        <Text
          className="text-base flex-1"
          style={{ color: selected ? colors.textDark : colors.textInput }}
        >
          {selected ? selected.label : placeholder}
        </Text>
        <Ionicons name="chevron-down" size={20} color={colors.textDark} />
      </TouchableOpacity>

      {error ? (
        <Text className="text-error text-xs mt-1">{error}</Text>
      ) : null}

      <Modal visible={open} transparent animationType="slide" statusBarTranslucent>
        <TouchableOpacity
          className="flex-1 bg-black/40"
          activeOpacity={1}
          onPress={() => setOpen(false)}
        >
          <SafeAreaProvider>
            <OptionSheet
              label={label}
              options={options}
              onSelect={handleSelect}
              onClose={() => setOpen(false)}
            />
          </SafeAreaProvider>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
