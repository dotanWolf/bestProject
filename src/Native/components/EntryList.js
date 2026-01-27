import { ScrollView, View, Text, StyleSheet } from "react-native";
import Entry from "./Entry";

export default function EntryList({
  entries,
  handlePress,
  handleDelete,
  handleRename,
  handleStar,
  handleDetails,
  refreshFiles,
  setParentIdInTab,
}) {
  return (
    <ScrollView>
      {entries.map((entry) => (
        <Entry
          key={entry.id}
          entry={entry}
          handlePress={handlePress}
          handleDelete={handleDelete}
          handleRename={handleRename}
          handleStar={handleStar}
          handleDetails={handleDetails}
          refreshFiles={refreshFiles}
          setParentIdInTab={setParentIdInTab}
        />
      ))}
    </ScrollView>
  );
}
