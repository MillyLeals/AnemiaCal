import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle, Dimensions } from 'react-native'; 
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';


const { width } = Dimensions.get('window');

interface BackButtonProps {
  style?: ViewStyle; 
}

const BackButton: React.FC<BackButtonProps> = ({ style }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.button, style]}>
      <Ionicons name="arrow-back" size={width * 0.07} color="#fff" /> 
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
  },
});

export default BackButton;