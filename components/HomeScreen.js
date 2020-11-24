import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React from "react";
import { Platform } from "react-native";
import { purple, white } from "../utils/colors";

import { FontAwesome, Ionicons } from "@expo/vector-icons";
import AddEntry from "./AddEntry";
import History from "./History";

const screenOptions = ({ route }) => ({
  tabBarIcon: ({ focused, color, size }) => {
    let iconName;

    if (route.name === "AddEntry") {
      iconName = focused ? "plus-square" : "plus-square";
    } else if (route.name === "History") {
      iconName = focused ? "ios-bookmarks" : "ios-bookmarks";
    }

    // You can return any component that you like here!
    return route.name === "AddEntry" ? (
      <FontAwesome name={iconName} size={size} color={color} />
    ) : (
      <Ionicons name={iconName} size={30} color={color} />
    );
  },
});

const tabBarOptions = {
  activeTintColor: Platform.OS === "ios" ? purple : white,
  // inactiveTintColor: "gray",
  style: {
    height: 50,
    backgroundColor: Platform.OS === "ios" ? white : purple,
    shadowColor: "rgba(0,0,0,0.24)",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 6,
    shadowOpacity: 1,
  },
};

const Tab =
  Platform.OS === "ios"
    ? createBottomTabNavigator()
    : createMaterialTopTabNavigator();

const Home = () => {
  return (
    <Tab.Navigator screenOptions={screenOptions} tabBarOptions={tabBarOptions}>
      <Tab.Screen name="Add Entry" component={AddEntry} />
      <Tab.Screen name="History" component={History} />
    </Tab.Navigator>
  );
};

export default Home;
