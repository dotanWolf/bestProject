import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';

export const saveToken = async (token) => {
  if (isWeb) {
    localStorage.setItem('token', token);
  } else {
    await SecureStore.setItemAsync('token', token);
  }
};

export const getToken = async () => {
  if (isWeb) {
    return localStorage.getItem('token');
  } else {
    return await SecureStore.getItemAsync('token');
  }
};

export const removeToken = async () => {
  if (isWeb) {
    localStorage.removeItem('token');
  } else {
    await SecureStore.deleteItemAsync('token');
  }
};

export const saveUserId = async (id) => {
  if (isWeb) {
    localStorage.setItem('userId', id);
  } else {
    await SecureStore.setItemAsync('userId', id);
  }
};

export const getUserId = async () => {
  if (isWeb) {
    return localStorage.getItem('userId');
  } else {
    return await SecureStore.getItemAsync('userId');
  }
};

export const removeUserId = async () => {
  if (isWeb) {
    return localStorage.removeItem('userId');
  } else {
    return await SecureStore.deleteItemAsync('userId');
  }
};