import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { GlobalModalProps } from '../../types/types';

const GlobalModal: React.FC<GlobalModalProps> = ({
  isVisible,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
}) => {
  return (
    <Modal isVisible={isVisible}>
      <View style={styles.modalContainer}>
        {title && <Text style={styles.title}>{title}</Text>}
        {message && <Text style={styles.message}>{message}</Text>}
        <View style={styles.buttons}>
          {onCancel && <Button title={cancelText} onPress={onCancel} />}
          {onConfirm && <Button title={confirmText} onPress={onConfirm} />}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
  },
  title: {
    fontSize: 18,
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default GlobalModal;
