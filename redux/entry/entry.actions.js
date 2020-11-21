import { EntryActionTypes } from "./entry.types";

export const receiveEntries = (entries) => ({
  type: EntryActionTypes.RECEIVE_ENTRIES,
  payload: entries,
});

export const addEntry = (entry) => ({
  type: EntryActionTypes.ADD_ENTRY,
  payload: entry,
});
