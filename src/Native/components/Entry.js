import { Text, View } from "react-native";
import { styles } from "../styles/Entry.styles";
import FileActionMenu from "./FileActionMenu";
import { Pressable } from "react-native";

export default function EntryList({ entry, handlePress }) {
  return (
    <Pressable style={styles.container} onPress={() => {handlePress(entry)}}>
      <View style={styles.info}>
        <Text>{entry.type === "folder" ? "📁" : "📄"}</Text>
        <Text>{entry.name}</Text>
      </View>
      <FileActionMenu
        // file={entry}
        // refreshFiles={fetchFiles}
        // onNavigate={onNavigate}
        // show={show}
      />
    </Pressable>
  );
}
