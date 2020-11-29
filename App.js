import "react-native-gesture-handler";
import React, { Component } from "react";
import { View, StatusBar, Text } from "react-native";
import { Provider } from "react-redux";

import { store } from "./redux/store";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { purple, white } from "./utils/colors";
import Constants from "expo-constants";
import EntryDetail from "./components/EntryDetail";
import Home from "./components/HomeScreen";
import entryReducer from "./redux/entry/entry.reducer";
import { render } from "react-dom";
import { setLocalNotification } from "./utils/helpers";

const FitnessStatusBar = ({ backgroundColor, ...props }) => {
  return (
    <View style={{ backgroundColor, height: Constants.statusBarHeight }}>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </View>
  );
};

const Stack = createStackNavigator();

const commonOptions = {
  headerTintColor: white,
  headerStyle: {
    backgroundColor: purple,
  },
};

class App extends Component {
  componentDidMount() {
    setLocalNotification();
  }

  render() {
    return (
      <Provider store={store}>
        <NavigationContainer>
          <View style={{ flex: 1 }}>
            <FitnessStatusBar
              backgroundColor={purple}
              barStyle="light-content"
            />
            <Stack.Navigator
              initialRouteName="Home"
              screenOptions={commonOptions}
            >
              <Stack.Screen
                name="Home"
                component={Home}
                options={{
                  title: "Home",
                }}
              />
              <Stack.Screen
                name="EntryDetail"
                component={EntryDetail}
                options={({ route }) => {
                  const { entryId } = route.params;
                  const year = entryId.slice(0, 4);
                  const month = entryId.slice(5, 7);
                  const day = entryId.slice(8);

                  return {
                    title: `${day}/${month}/${year}`,
                  };
                }}
              />
            </Stack.Navigator>
          </View>
        </NavigationContainer>
      </Provider>
    );
  }
}

export default App;
