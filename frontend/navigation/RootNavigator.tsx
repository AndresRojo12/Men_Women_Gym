import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppStack from "./AppStack";

const RootNavigator = () => {
  return (
    <NavigationContainer>
      <AppStack />
    </NavigationContainer>
  );
};

export default RootNavigator;