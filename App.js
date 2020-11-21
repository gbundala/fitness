import "react-native-gesture-handler";
import React from "react";
import { View } from "react-native";
import { Provider } from "react-redux";
import AddEntry from "./components/AddEntry";
import { store } from "./redux/store";
import History from "./components/History";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Provider store={store}>
        <View style={{ flex: 1 }}>
          <View style={{ height: 20 }} />
          <Tab.Navigator>
            <Tab.Screen name="AddEntry" component={AddEntry} />
            <Tab.Screen name="History" component={History} />
          </Tab.Navigator>
        </View>
      </Provider>
    </NavigationContainer>
  );
};

export default App;
