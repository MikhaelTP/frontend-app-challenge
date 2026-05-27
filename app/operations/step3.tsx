import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AppButton from '../../src/components/ui/AppButton';
import StepProgressBar from '../../src/components/ui/StepProgressBar';
import { useTransactionStore } from '../../src/store/transactionStore';
import { colors } from '../../src/constants/theme';

interface SelectedFile {
  uri: string;
  name: string;
  size?: number;
}

const MAX_SIZE_BYTES = 10 * 1024 * 1024;

export default function Step3Screen() {
  const router = useRouter();
  const completeTransaction = useTransactionStore((s) => s.completeTransaction);

  const [file, setFile] = useState<SelectedFile | null>(null);
  const [fileError, setFileError] = useState('');
  const [loading, setLoading] = useState(false);

  function validateFile(size: number | undefined, name: string): string {
    if (size && size > MAX_SIZE_BYTES) return 'El archivo no debe superar 10 MB';
    const ext = name.split('.').pop()?.toLowerCase() ?? '';
    if (!['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'].includes(ext))
      return 'Formato no válido. Usa imagen, PDF o Word.';
    return '';
  }

  async function handlePickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso requerido', 'Necesitamos acceso a tu galería.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: false,
    });
    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      const name = asset.uri.split('/').pop() ?? 'imagen.jpg';
      const err = validateFile(asset.fileSize, name);
      if (err) { setFileError(err); return; }
      setFile({ uri: asset.uri, name, size: asset.fileSize });
      setFileError('');
    }
  }

  async function handlePickDocument() {
    const result = await DocumentPicker.getDocumentAsync({
      type: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ],
      copyToCacheDirectory: true,
    });
    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      const err = validateFile(asset.size, asset.name);
      if (err) { setFileError(err); return; }
      setFile({ uri: asset.uri, name: asset.name, size: asset.size ?? undefined });
      setFileError('');
    }
  }

  function showPickOptions() {
    Alert.alert('Subir constancia', 'Elige el tipo de archivo', [
      { text: 'Imagen (galería)', onPress: handlePickImage },
      { text: 'PDF o Word', onPress: handlePickDocument },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  }

  async function handleSubmit() {
    if (!file) { setFileError('Por favor sube tu constancia de transferencia.'); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    completeTransaction();
    setLoading(false);
    router.replace('/operations/success');
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F6F6F9]" edges={['top']}>
      {/* Header */}
      <View className="bg-[#F6F6F9] px-4 py-1 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} hitSlop={8} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={24} color={colors.textDark} />
        </TouchableOpacity>
        <Text className="flex-1 text-lg font-bold text-text-dark text-center">
          Envía tu constancia
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Progress bar */}
      <StepProgressBar current={3} />

      <ScrollView
        contentContainerStyle={{ padding: 26, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Main card */}
        <View
          className="bg-white rounded-2xl px-6 mb-4"
          style={{ borderWidth: 1, borderColor: '#E0E4EB' }}
        >
          {/* Illustration */}
          <View className="items-center">
            <Image
              source={require('../../assets/images/step3-illustration.png')}
              style={{ width: 130, height: 130 }}
              resizeMode="contain"
            />
          </View>

          {/* Description */}
          <Text style={{ fontSize: 18, color: colors.textDark, lineHeight: 22, marginBottom: 16 }}>
            Adjunta la constancia de tu transferencia para poder verificar tu operación.
          </Text>

          {/* Upload inner card */}
          <View
            style={{
              borderWidth: 1,
              borderColor: '#E5E7EB',
              borderRadius: 12,
              overflow: 'hidden',
            }}
          >
            {/* Upload card header */}
            <View
              style={{
                paddingHorizontal: 14,
                paddingVertical: 12,
              }}
            >
              <Text style={{ fontSize: 17, fontWeight: '400', color: colors.textMuted }}>
                Sube el archivo de tu constancia
              </Text>
            </View>

            {/* Selector row */}
            <TouchableOpacity
              onPress={showPickOptions}
              activeOpacity={0.7}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 14,
                paddingVertical: 14,
                marginHorizontal: 7,
                borderRadius: 20,
                backgroundColor: '#F5F7FA',
                borderWidth: 1,
                borderColor: '#E5E5E5',
              }}
            >
              {file ? (
                <Text
                  style={{ flex: 1, fontSize: 13, color: colors.textDark, fontWeight: '600' }}
                  numberOfLines={1}
                >
                  {file.name}
                </Text>
              ) : (
                <Text style={{ flex: 1, fontSize: 16, color: colors.textInput, textAlign: 'center' }}>
                  Selecciona archivo
                </Text>
              )}
              <Image
                source={require('../../assets/images/icon-upload.png')}
                style={{ width: 28, height: 28, opacity: 1 }}
                resizeMode="contain"
              />
            </TouchableOpacity>

            {/* Max size note */}
            <View
              style={{
                paddingHorizontal: 14,
                paddingVertical: 8,
              }}
            >
              <Text style={{ fontSize: 12, color: colors.textMuted, textAlign: 'center' }}>
                *Tamaño máximo permitido del archivo 10 Mb
              </Text>
            </View>
          </View>

          {fileError ? (
            <Text style={{ fontSize: 12, color: colors.error, marginTop: 8 }}>
              {fileError}
            </Text>
          ) : null}

          {file && (
            <TouchableOpacity
              onPress={() => { setFile(null); setFileError(''); }}
              style={{ marginTop: 8, alignSelf: 'flex-start' }}
            >
              <Text style={{ fontSize: 12, color: colors.error, textDecorationLine: 'underline' }}>
                Eliminar archivo
              </Text>
            </TouchableOpacity>
          )}

          {/* Reminders */}
          <View className="mb-6 mt-2 px-2">
            <Text style={{ fontSize: 16, fontWeight: '400', color: colors.textMuted, marginBottom: 6 }}>
              Recuerda:
            </Text>
            {[
              <>El voucher enviado debe tener el <Text style={{ fontWeight: '700' }}>monto, datos, del beneficiario, fecha y hora.</Text></>,
              <>El voucher debe ser legible</>,
              <>Archivos permitidos <Text style={{ fontWeight: '700' }}>imágenes, word y PDF</Text></>,
            ].map((item, i) => (
              <View key={i} style={{ flexDirection: 'row', marginBottom: 4 }}>
                <Text style={{ fontSize: 13, color: colors.textMuted, marginRight: 6 }}>•</Text>
                <Text style={{ flex: 1, fontSize: 16, color: colors.textMuted, lineHeight: 20 }}>
                  {item}
                </Text>
              </View>
            ))}
          </View>

        </View>

        

        <AppButton
          label="ENVIAR CONSTANCIA"
          onPress={handleSubmit}
          loading={loading}
          disabled={!file}
          variant="teal"
        />
      </ScrollView>
    </SafeAreaView>
  );
}
