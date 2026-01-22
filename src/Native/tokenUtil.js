import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'token';
const ID_KEY = 'userId'

export const saveToken = async (token) => {
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  } catch (error) {
    console.error("Error saving token:", error);
  }
};

export const getToken = async () => {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch (error) {
    console.error("Error fetching token:", error);
    return null;
  }
};

export const removeToken = async () => {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch (error) {
    console.error("Error removing token:", error);
  }
};

export const saveUserId = async (userId) => {
  try {
    await SecureStore.setItemAsync(ID_KEY, userId);
  } catch (error) {
    console.error("Error saving token:", error);
  }
};

export const getUserId = async () => {
  try {
    return await SecureStore.getItemAsync(ID_KEY);
  } catch (error) {
    console.error("Error fetching token:", error);
    return null;
  }
};