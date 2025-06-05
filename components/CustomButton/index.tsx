import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, Dimensions } from 'react-native'; 

const { width, height } = Dimensions.get('window'); 

interface CustomButtonProps {
  text: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
}

const CustomButton: React.FC<CustomButtonProps> = ({ text, onPress, disabled = false, style }) => {
  return (
    <TouchableOpacity
      style={[styles.button, style, { opacity: disabled ? 0.5 : 1 }]}
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
    borderRadius: width * 0.05,
    paddingVertical: height * 0.015, 
    paddingHorizontal: width * 0.06, 
    alignItems: 'center',
    marginBottom: height * 0.025,
  },
  buttonText: {
    color: '#004AAD',
    fontWeight: 'bold',
    fontSize: width * 0.04, 
  },
});

export default CustomButton;