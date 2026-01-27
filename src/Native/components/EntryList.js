import { ScrollView } from "react-native";
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
  enableActions = true, // 👈 1. Add default prop here
}) {
  return (
    <ScrollView>
      {entries.map((entry) => (
        <Entry
          key={entry._id}
          entry={entry}
          handlePress={handlePress}
          handleDelete={handleDelete}
          handleRename={handleRename}
          handleStar={handleStar}
          handleDetails={handleDetails}
          refreshFiles={refreshFiles}
          setParentIdInTab={setParentIdInTab}
          enableActions={enableActions} // 👈 2. Pass it down to Entry
        />
      ))}
    </ScrollView>
  );
}