export function useValidation() {
  const validateEmail = (value: string): string => {
    if (!value.trim()) return 'El correo es requerido';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Correo inválido';
    return '';
  };

  const validatePassword = (value: string): string => {
    if (!value) return 'La contraseña es requerida';
    if (value.length < 6) return 'Mínimo 6 caracteres';
    return '';
  };

  // Requires at least first name + last name (two words)
  const validateName = (value: string): string => {
    if (!value.trim()) return 'El nombre es requerido';
    if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(value)) return 'Solo letras';
    if (value.trim().split(/\s+/).length < 2) return 'Ingresa nombre y apellido';
    if (value.trim().length < 5) return 'Mínimo 5 caracteres';
    return '';
  };

  const validateDocument = (type: string, value: string): string => {
    if (!value) return 'El documento es requerido';
    if (type === 'DNI' && !/^\d{8}$/.test(value)) return 'DNI debe tener 8 dígitos';
    if (type === 'CCE' && !/^\d{9}$/.test(value)) return 'CCE debe tener 9 dígitos';
    if (type === 'Pasaporte' && !/^[a-zA-Z0-9]{8,15}$/.test(value))
      return 'Pasaporte: 8-15 caracteres';
    return '';
  };

  // Peruvian mobile numbers: 9 digits starting with 9
  const validatePhone = (value: string): string => {
    if (!value) return 'El celular es requerido';
    if (!/^\d{9}$/.test(value)) return 'Debe tener 9 dígitos';
    if (!value.startsWith('9')) return 'El número debe empezar con 9';
    return '';
  };

  const validateBirthDate = (value: string): string => {
    if (!value) return 'La fecha es requerida';
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) return 'Formato: DD/MM/AAAA';
    const [day, month, year] = value.split('/').map(Number);
    // Verify it's a real calendar date (e.g. 31/02 is rejected)
    const date = new Date(year, month - 1, day);
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day ||
      year < 1900
    ) return 'Fecha inválida';
    // Accurate age check: compare full date, not just year
    const today = new Date();
    const hasHadBirthday =
      today.getMonth() > month - 1 ||
      (today.getMonth() === month - 1 && today.getDate() >= day);
    const age = today.getFullYear() - year - (hasHadBirthday ? 0 : 1);
    if (age < 18) return 'Debes ser mayor de 18 años';
    return '';
  };

  // Peruvian bank accounts: 8–20 digits (covers CCI 20, standard accounts 8-18)
  const validateAccountNumber = (value: string): string => {
    if (!value) return 'El número de cuenta es requerido';
    if (!/^\d+$/.test(value)) return 'Solo dígitos';
    if (value.length < 8) return 'Mínimo 8 dígitos';
    if (value.length > 20) return 'Máximo 20 dígitos';
    return '';
  };

  const validateAlias = (value: string): string => {
    if (!value.trim()) return 'El alias es requerido';
    if (value.trim().length < 2) return 'Mínimo 2 caracteres';
    if (value.length > 30) return 'Máximo 30 caracteres';
    return '';
  };

  return {
    validateEmail,
    validatePassword,
    validateName,
    validateDocument,
    validatePhone,
    validateBirthDate,
    validateAccountNumber,
    validateAlias,
  };
}
