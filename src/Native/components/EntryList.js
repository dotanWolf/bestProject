import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "../styles/EntryList.styles";
import Entry from "./Entry"

export default function EntryList({ entries, handlePress }) {
  return (
    <View style={styles.container}>
      {entries.map((entry) => (
        <Entry handlePress={handlePress} key={entry.id} entry={entry}></Entry>
      ))}
    </View>
  );
}
