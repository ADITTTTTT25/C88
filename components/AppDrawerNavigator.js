import { createDrawerNavigator } from "react-navigation-drawer";
import  CustomSidebarMenu  from "./CustomSidebarMenu";
import { AppTabNavigator } from "./AppTabNavigator";
import SettingScreen from "../screens/SettingScreen";
import MyDonationScreen from "../screens/MyDonationScreen";
import NotificationScreen from "../screens/NotificationScreen"
export const AppDrawerNavigator = createDrawerNavigator(
  {
    Home: {
      screen: AppTabNavigator,
    },
    MyDonation:{
      screen: MyDonationScreen
    },
    NotificationScreen:{
      screen: NotificationScreen
    },
    Settings:{
      screen: SettingScreen
    },
  },
  { contentComponent: CustomSidebarMenu },
  { initialRouteName: "Home" },
  
);
