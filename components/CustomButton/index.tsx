import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';

interface CustomButtonProps {
  text: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle; // Permite passar estilos adicionais
}

const CustomButton: React.FC<CustomButtonProps> = ({ text, onPress, disabled = false, style }) => {
  return (
    <TouchableOpacity
      style={[styles.button, style, { opacity: disabled ? 0.5 : 1 }]} // Aplica o estilo adicional
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#004AAD',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CustomButton;
