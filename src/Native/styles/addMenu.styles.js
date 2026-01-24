import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  centeredView: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  option: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  optionIcon: { fontSize: 24, marginRight: 15 },
  optionText: { fontSize: 16 },
  buttonRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 20, gap: 10 },
  inputOverride: { width: '100%', borderBottomColor: '#ccc' }
});