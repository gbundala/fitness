import AsyncStorage from "@react-native-async-storage/async-storage";
import { CALENDAR_STORAGE_KEY, formatCalendarResults } from "./_calender";

export const fetchCalenderResults = async () => {
  const formatedCalendarResults = await AsyncStorage.getItem(
    CALENDAR_STORAGE_KEY
  );
  return formatCalendarResults(formatedCalendarResults);
};

export const submitEntry = ({ key, entry }) => {
  return AsyncStorage.mergeItem(
    CALENDAR_STORAGE_KEY,
    JSON.stringify({
      [key]: entry,
    })
  );
};

export const removeEntry = async (key) => {
  const results = await AsyncStorage.getItem(CALENDAR_STORAGE_KEY);
  const data = JSON.parse(results);
  data[key] = undefined;
  delete data[key];
  AsyncStorage.setItem(CALENDAR_STORAGE_KEY, JSON.stringify(data));
};
