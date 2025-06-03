import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface GenderSelectorProps {
  selectedGender: string;
  onChange: (value: string) => void;
}

const GenderSelector: React.FC<GenderSelectorProps> = ({ selectedGender, onChange }) => {
  const options = ['feminino', 'masculino', 'outro'];

  return (
    <View>
      <Text style={styles.label}>Sexo</Text>
      <View style={styles.radioGroup}>
        {options.map((option) => (
          <TouchableOpacity key={option} onPress={() => onChange(option)} style={styles.radioOption}>
            <View style={styles.radioCircle}>
              {selectedGender === option && <View style={styles.radioSelected} />}
            </View>
            <Text style={styles.radioLabel}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default GenderSelector;

const styles = StyleSheet.create({
  label: {
    fontWeight: '600',
    marginBottom: 4,
    marginTop: 12,
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioCircle: {
    height: 16,
    width: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#888',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  radioSelected: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: '#F46F6F',
  },
  radioLabel: {
    fontSize: 14,
  },
});
