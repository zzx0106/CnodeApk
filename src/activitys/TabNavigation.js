import React, { PureComponent } from "react";
import {
  StatusBar,
  Text,
  View,
  Image,
  StyleSheet,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
  TouchableNativeFeedback,
  AsyncStorage,
  ToastAndroid,
  Picker,
  TouchableOpacity
} from "react-native";
import { StackNavigator, TabNavigator, TabBarBottom } from "react-navigation";
import px2dp from "../utils/px2dp";
import theme from "../pubilc/theme";
import TabBarItem from "../widget/TabBarItem";
import HomeSceen from "../fragments/HomeSceen";
import RecruitSceen from "../fragments/RecruitSceen";
import NoticeSceen from "../fragments/NoticeSceen";
import MySceen from "../fragments/MySceen";
import AddTopic from "./AddTopic";
export default class TabNavigation extends PureComponent {
  render() {
    return <Tab />;
  }
}
const Tab = TabNavigator(
  {
    Home: {
      screen: HomeSceen,
      navigationOptions: ({ navigation }) => ({
        tabBarLabel: "首页",
        tabBarIcon: ({ focused, tintColor }) => (
          <TabBarItem
            tintColor={tintColor}
            focused={focused}
            normalImage={require("../assets/images/home_close.png")}
            selectedImage={require("../assets/images/home_open.png")}
          />
        )
      })
    },
    Recruit: {
      screen: RecruitSceen,
      navigationOptions: ({ navigation }) => ({
        tabBarLabel: "招聘",
        tabBarIcon: ({ focused, tintColor }) => (
          <TabBarItem
            tintColor={tintColor}
            focused={focused}
            normalImage={require("../assets/images/job_close.png")}
            selectedImage={require("../assets/images/job_open.png")}
          />
        )
      })
    },
    AddTopic: {
      screen: AddTopic,
      navigationOptions: ({ navigation }) => ({
        tabBarLabel: (
          <View style={styles.addBox}>
            <Image
              source={require("../assets/images/add.png")}
              style={styles.addImg}
            />
          </View>
        )
      })
    },
    Notice: {
      screen: NoticeSceen,
      navigationOptions: ({ navigation }) => ({
        tabBarLabel: "消息",
        tabBarIcon: ({ focused, tintColor }) => (
          <TabBarItem
            tintColor={tintColor}
            focused={focused}
            normalImage={require("../assets/images/notice_close.png")}
            selectedImage={require("../assets/images/notice_open.png")}
          />
        )
      })
    },
    My: {
      screen: MySceen,
      navigationOptions: ({ navigation }) => ({
        tabBarLabel: "我的",
        tabBarIcon: ({ focused, tintColor }) => (
          <TabBarItem
            tintColor={tintColor}
            focused={focused}
            normalImage={require("../assets/images/my_close.png")}
            selectedImage={require("../assets/images/my_open.png")}
          />
        )
      })
    }
  },
  {
    tabBarComponent: TabBarBottom,
    tabBarPosition: "bottom",
    swipeEnabled: false,
    animationEnabled: false,
    lazy: true,
    tabBarOptions: {
      activeTintColor: theme.highLightColor,
      inactiveTintColor: theme.darkColor,
      style: {
        backgroundColor: "#ffffff"
      }
    }
  }
);
const styles = StyleSheet.create({
  addBox: {
    position: "absolute",
    backgroundColor: "#fff",
    width: px2dp(50),
    height: px2dp(50),
    borderRadius: px2dp(50),
    borderWidth: px2dp(0.5),
    borderColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: px2dp(-10),
    top: 0,
    left: (theme.screenWidth / 5 - px2dp(50)) / 2
    // zIndex: 1000,
  },
  addImg: {
    width: px2dp(35),
    height: px2dp(35)
  },
  NoteBox: {
    width: theme.screenWidth,
    height: theme.screenHeight,
    marginTop: px2dp(45),
    backgroundColor: "#fff"
  },
  input: {
    marginTop: px2dp(10),
    marginLeft: px2dp(10),
    marginRight: px2dp(10),
    backgroundColor: "#f9f9f9"
  },
  headBox: {
    width: theme.screenWidth - px2dp(20),
    flexDirection: "row",
    height: px2dp(45),
    marginLeft: px2dp(10),
    marginRight: px2dp(10),
    justifyContent: "space-between"
  },
  modalDropdownStyle: {
    width: px2dp(70),
    height: px2dp(40),
    backgroundColor: theme.highLightColor,
    borderBottomRightRadius: px2dp(8),
    borderTopRightRadius: px2dp(8)
  },
  modalDropdownTextStyle: {
    height: px2dp(40),
    color: "#fff",
    fontSize: px2dp(15),
    fontWeight: "800",
    textAlign: "center",
    textAlignVertical: "center"
  },
  renderItem: {
    height: px2dp(30),
    width: px2dp(70),
    fontSize: px2dp(12),
    textAlign: "center",
    textAlignVertical: "center"
  }
});
