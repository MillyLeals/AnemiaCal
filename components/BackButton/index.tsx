import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

interface BackButtonProps {
  style?: ViewStyle; 
}

const BackButton: React.FC<BackButtonProps> = ({ style }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.button, style]}>
      <Ionicons name="arrow-back" size={30} color="#fff" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    position: 'absolute',
    top: 25,
    left: 20,
    zIndex: 1,
  },
});

export default BackButton;
