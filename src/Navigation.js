import React, { PureComponent, Component } from "react";
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
  BackHandler,
  TouchableOpacity
} from "react-native";
import JPushModule from "jpush-react-native";
import ModalDropdown from "react-native-modal-dropdown";
import { StackNavigator, TabNavigator, TabBarBottom } from "react-navigation";
import CardStackStyleInterpolator from "react-navigation/src/views/CardStack/CardStackStyleInterpolator";
import theme from "./pubilc/theme";
import px2dp from "./utils/px2dp";
import TabBarItem from "./widget/TabBarItem";

import HomeSceen from "./fragments/HomeSceen";
import RecruitSceen from "./fragments/RecruitSceen";
import NoticeSceen from "./fragments/NoticeSceen";
import MySceen from "./fragments/MySceen";

import GoLogin from "./activitys/GoLogin";
import Setting from "./activitys/Setting";
import ContentDetail from "./activitys/ContentDetail";
import QRPager from "./activitys/QRPager";
import Dynamic from "./activitys/Dynamic";
import Collect from "./activitys/Collect";
import AddFriend from "./activitys/AddFriend";
import UserInformation from "./activitys/UserInformation";
import Chat from "./activitys/Chat";
import Search from "./activitys/Search";
import Credits from './activitys/Credits';//积分
import PersonCenter from './activitys/PersonCenter';//个人中心

import { createTopic, updateTopic } from "./config/API_Topic";
export default class Navigation extends (PureComponent || Component) {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: (
      <Text
        style={{
          color: "#ccc",
          height: px2dp(18)
        }}
      >
        搜搜看有什么好东西
      </Text>
    ),
    headerStyle: {
      backgroundColor: theme.highLightColor,
      height: px2dp(45)
    }
  });
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      hidenADD: false,
      text: "",
      title: "",
      tab: ""
    };
    StatusBar.setBarStyle("light-content");
    this.addNote = this.addNote.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
    this.onChangeSize = this.onChangeSize.bind(this);
    this._submit = this._submit.bind(this);
    this.tabDictionary = this.tabDictionary.bind(this);
    this.handleBack = this.handleBack.bind(this);
  }
  async addNote() {
    const userinfo = await AsyncStorage.getItem("userinfo");
    const accesstoken = await AsyncStorage.getItem("accesstoken");
    if (!(userinfo && accesstoken)) {
      ToastAndroid.show("请先登录再发表文章", ToastAndroid.SHORT);
    }
    this.setState({
      visible: true
    });
  }
  closeNode() {
    this.setState({
      visible: false
    });
  }
  onChangeSize(event) {
    console.log(event.nativeEvent.contentSize.height);
    this.setState({
      height: event.nativeEvent.contentSize.height
    });
  }
  onChangeText(text) {
    this.setState({
      text: text
    });
  }
  async _submit() {
    const userinfo = await AsyncStorage.getItem("userinfo");
    const accesstoken = await AsyncStorage.getItem("accesstoken");
    if (userinfo && accesstoken) {
      const { loginname, avatar_url, id } = JSON.parse(userinfo);
      if (!this.tabDictionary(this.state.tab)) {
        ToastAndroid.show("分类不能为空", ToastAndroid.SHORT);
        return;
      }
      if (!this.state.text.trim()) {
        ToastAndroid.show("内容不能为空", ToastAndroid.SHORT);
        return;
      }
      if (!this.state.title.trim()) {
        ToastAndroid.show("标题不能为空", ToastAndroid.SHORT);
        return;
      }
      const isCreateTopic = await createTopic({
        accesstoken,
        title: this.state.title,
        tab: this.tabDictionary(this.state.tab),
        content: this.state.text
      });
      if (isCreateTopic.status === 200) {
        if (isCreateTopic.data.success) {
          this.setState({
            //清空数据
            tab: "",
            title: "",
            text: "",
            visible: false //关闭窗口
          });
          ToastAndroid.show("新建主题成功!", ToastAndroid.SHORT);
        } else {
          ToastAndroid.show("新建主题失败!", ToastAndroid.SHORT);
        }
      } else {
        ToastAndroid.show("发送请求失败", ToastAndroid.SHORT);
      }
      console.log(isCreateTopic);
    } else {
      ToastAndroid.show("请先登录再发表文章", ToastAndroid.SHORT);
    }
    console.log();
    alert(this.state.text);
  }
  tabDictionary(tabZH) {
    if ("问答" === tabZH) {
      return "ask";
    } else if ("分享" === tabZH) {
      return "share";
    } else if ("测试" === tabZH) {
      return "dev";
    } else if ("招聘" === tabZH) {
      return "job";
    } else {
      return "";
    }
  }
  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.handleBack);
    // JPushModule.notifyJSDidLoad();
    // 新版本必需写回调函数
    JPushModule.notifyJSDidLoad(resultCode => {
      if (resultCode === 0) {
      }
    });

    // 接收自定义消息
    JPushModule.addReceiveCustomMsgListener(message => {
      this.setState({ pushMsg: message });
    });
    // 接收推送通知
    JPushModule.addReceiveNotificationListener(message => {
      console.log("receive notification: " + message);
    });
    // 打开通知
    JPushModule.addReceiveOpenNotificationListener(map => {
      console.log("Opening notification!");
      console.log("map.extra: " + map.extras);
      // 可执行跳转操作
      // JPushModule.jumpToPushActivity("SecondActivity");
    });
  }
  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBack);
    JPushModule.removeReceiveCustomMsgListener();
    JPushModule.removeReceiveNotificationListener();
  }
  handleBack() {
    console.log("visible11", this.state.visible);
    if (this.state.visible) {
      this.setState({
        visible: false
      });
    }
  }
  render() {
    return (
      <View style={{ flex: 1, height: theme.screenHeight }}>
      <StatusBar backgroundColor={theme.highLightColor} />
        <Navigator
          onNavigationStateChange={(prevState, currentState) => {
            console.log("prevState", prevState);
            console.log("currentState", currentState);
            if (currentState.index - prevState.index > 0) {
              this.setState({
                hidenADD: true
              });
            } else {
              if (currentState.index === 0) {
                this.setState({
                  hidenADD: false
                });
              } else {
                this.setState({
                  hidenADD: true
                });
              }
            }
          }}
        />
        {this.state.hidenADD ? null : (
          <TouchableWithoutFeedback onPress={() => this.addNote()}>
            <View style={styles.addBox}>
              <Image
                source={require("./assets/images/add.png")}
                style={styles.addImg}
              />
            </View>
          </TouchableWithoutFeedback>
        )}

        <Modal
          animationType={"slide"}
          transparent={true}
          visible={this.state.visible}
          onRequestClose={() => null} //修复安卓modal的告警
        >
          <View style={styles.NoteBox}>
            <View style={styles.headBox}>
              <TouchableNativeFeedback onPress={() => this.closeNode()}>
                <Text
                  style={{
                    textAlignVertical: "center",
                    color: "#2e2e2e"
                  }}
                >
                  取消
                </Text>
              </TouchableNativeFeedback>
              <TouchableNativeFeedback onPress={() => this._submit()}>
                <Text
                  style={[
                    {
                      textAlignVertical: "center",
                      fontWeight: "800",
                      color:
                        this.state.text.length > 0
                          ? theme.linkColor
                          : theme.darkColor
                    }
                  ]}
                >
                  发布
                </Text>
              </TouchableNativeFeedback>
            </View>
            <View
              style={{
                flexDirection: "row",
                marginLeft: px2dp(10),
                marginRight: 10
              }}
            >
              <TextInput
                style={{
                  height: px2dp(40),
                  flex: 1,
                  backgroundColor: "#f9f9f9",
                  paddingBottom: 0,
                  paddingTop: 0
                }}
                onChangeText={title => this.setState({ title })}
                autoFocus={true}
                placeholder="请输入标题"
                underlineColorAndroid="transparent"
              />
              <ModalDropdown
                style={styles.modalDropdownStyle}
                textStyle={styles.modalDropdownTextStyle}
                dropdownStyle={{
                  height: "auto"
                }}
                renderRow={item => (
                  <Text style={styles.renderItem}>{item}</Text>
                )}
                defaultValue={"分类"}
                options={["问答", "分享", "测试", "招聘"]}
                onSelect={(index, value) => this.setState({ tab: value })}
              />
            </View>
            <TextInput
              style={[
                styles.input,
                {
                  textAlignVertical: "top",
                  height: Math.max(px2dp(100), this.state.height),
                  width: Math.max(35, this.state.width)
                }
              ]}
              multiline={true}
              placeholder="说点什么吧"
              underlineColorAndroid="transparent"
              onContentSizeChange={this.onChangeSize}
              maxLength={300}
              value={this.state.text}
              onChangeText={this.onChangeText}
              onBlur={() => this.setState({ hiddenIcon: true })}
            />
          </View>
        </Modal>
      </View>
    );
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
            normalImage={require("./assets/images/home_close.png")}
            selectedImage={require("./assets/images/home_open.png")}
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
            normalImage={require("./assets/images/job_close.png")}
            selectedImage={require("./assets/images/job_open.png")}
          />
        )
      })
    },
    AddTopic: {
      screen: RecruitSceen,
      navigationOptions: ({ navigation }) => ({
        tabBarLabel: " "
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
            normalImage={require("./assets/images/notice_close.png")}
            selectedImage={require("./assets/images/notice_open.png")}
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
            normalImage={require("./assets/images/my_close.png")}
            selectedImage={require("./assets/images/my_open.png")}
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
        height: px2dp(45),
        backgroundColor: "#ffffff"
      }
    }
  }
);

const Navigator = StackNavigator(
  {
    Tab: { screen: Tab },
    ContentDetail: { screen: ContentDetail },
    GoLogin: { screen: GoLogin },
    Setting: { screen: Setting },
    QRPager: { screen: QRPager },
    Dynamic: { screen: Dynamic },
    Collect: { screen: Collect },
    AddFriend: { screen: AddFriend },
    UserInformation: { screen: UserInformation },
    Chat: { screen: Chat },
    Search: { screen: Search },
    Credits: { screen: Credits },
    PersonCenter: { screen: PersonCenter }
  },
  {
    initialRouteName: "Tab",
    navigationOptions: {
      headerBackTitle: null,
      headerTintColor: "#FFF",
      showIcon: true,
      headerTitleStyle: {
        alignSelf: "center"
      }
    },
    mode: "modal",
    transitionConfig: () => ({
      screenInterpolator: CardStackStyleInterpolator.forHorizontal // 安卓导航进入 左右方式
    })
  }
);

const styles = StyleSheet.create({
  addBox: {
    position: "absolute",
    backgroundColor: "#fff",
    width: px2dp(45),
    height: px2dp(45),
    borderRadius: px2dp(45),
    borderWidth: px2dp(0.5),
    borderColor: "#ccc",
    top: theme.screenHeight - px2dp(76),
    left: (theme.screenWidth - px2dp(45)) / 2,
    zIndex: 1000,
    alignItems: "center",
    justifyContent: "center"
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
