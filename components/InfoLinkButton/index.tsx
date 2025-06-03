import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  ScrollView,
  StyleProp,
  ViewStyle,
} from 'react-native';

type InfoLinkButtonProps = {
  title: string;
  contentText: string;
  modalTitle?: string; // opcional, default "Informativo"
  style?: StyleProp<ViewStyle>; // estilo extra para o TouchableOpacity
};

export default function InfoLinkButton({
  title,
  contentText,
  modalTitle = 'Informativo',
  style,
}: InfoLinkButtonProps) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <TouchableOpacity onPress={() => setVisible(true)} style={style}>
        <Text style={styles.link}>{title}</Text>
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{modalTitle}</Text>

            <ScrollView style={styles.modalContent}>
              <Text style={styles.contentText}>{contentText}</Text>
            </ScrollView>

            <Pressable
              style={styles.closeButton}
              onPress={() => setVisible(false)}
              android_ripple={{ color: '#f46f6f55' }}
            >
              <Text style={styles.closeButtonText}>Fechar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  link: {
    color: '#F46F6F',
    textDecorationLine: 'underline',
    fontWeight: '600',
    // marginTop removido para alinhar em linha
    // textAlign removido para alinhamento lado a lado
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontWeight: '700',
    fontSize: 18,
    marginBottom: 12,
    textAlign: 'center',
  },
  modalContent: {
    marginBottom: 20,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 22,
  },
  closeButton: {
    backgroundColor: '#F46F6F',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
