import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';

interface BorderedButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
}

const BorderedButton = ({ title, onPress, style }: BorderedButtonProps) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 2,
    width: '80%',
    borderWidth: 1,
    borderColor: '#004AAD',
    marginBottom: 20,
  },
  text: {
    fontWeight: 'bold',
    color: '#004AAD',
  },
});

export default BorderedButton;