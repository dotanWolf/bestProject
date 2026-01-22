import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import Input from './Input';
import Button from './Button';
import {styles} from '../styles/addMenu.styles'
export default function AddMenu({ visible, onClose, onCreateFolder, onUploadFile }) {
  const [folderName, setFolderName] = useState('');
  const [isNamingFolder, setIsNamingFolder] = useState(false);

  const handleCreate = () => {
    onCreateFolder(folderName);
    setFolderName('');
    setIsNamingFolder(false);
    onClose();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {!isNamingFolder ? (
              // Selection View
              <View style={styles.menuContainer}>
                <Text style={styles.modalTitle}>Create New</Text>
                <TouchableOpacity style={styles.option} onPress={() => setIsNamingFolder(true)}>
                  <Text style={styles.optionIcon}>📁</Text>
                  <Text style={styles.optionText}>Folder</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.option} onPress={onUploadFile}>
                  <Text style={styles.optionIcon}>📄</Text>
                  <Text style={styles.optionText}>Upload File</Text>
                </TouchableOpacity>
              </View>
            ) : (
              // Name Folder View
              <View style={styles.inputContainer}>
                <Text style={styles.modalTitle}>New Folder</Text>
                <Input
                  text="Folder name"
                  value={folderName}
                  onChangeText={setFolderName}
                  style={styles.inputOverride}
                />
                <View style={styles.buttonRow}>
                  <Button title="Cancel" onPress={() => setIsNamingFolder(false)} />
                  <Button title="Done" onPress={handleCreate} />
                </View>
              </View>
            )}
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}
