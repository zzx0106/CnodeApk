import React, { PureComponent } from "react";
import {
  StyleSheet,
  View,
  Text,
  Button,
  Image,
  StatusBar,
  FlatList,
  Switch,
  Dimensions,
  TouchableNativeFeedback,
  AsyncStorage,
  DeviceEventEmitter,
  TouchableOpacity
} from "react-native";
import theme from "../pubilc/theme";
import px2dp from "../utils/px2dp";
export default class Setting extends PureComponent {
  static navigationOptions = ({ navigation }) => {
    const { state, setParams } = navigation;
    const { params } = navigation.state;
    return {
      headerTitleStyle: {
        color: "white",
        marginLeft: px2dp(0)
      },
      headerStyle: {
        backgroundColor: theme.highLightColor,
        height: px2dp(45)
      },
      // headerLeft: (
      //   <TouchableNativeFeedback onPress={() => navigation.goBack(null)}>
      //     <Image
      //       style={styles.headerLeft}
      //       source={require("../assets/images/left.png")}
      //       resizeMode="contain"
      //     />
      //   </TouchableNativeFeedback>
      // )
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      draft: true,
      notic: true,
      data: {}
    };
  }

  async componentDidMount() {
    const usermessage = await AsyncStorage.getItem("usermessage");
    if (usermessage) {
      const data = JSON.parse(usermessage);
      this.setState({
        data: data
      });
    }
    // const { setting } = this.props;
    // const { draft, notic } = setting;
    // this.setState({ draft, notic });
  }

  componentWillUnmount() {
    // const { draft, notic } = this.state;
    // const setting = { draft, notic };
    // this.props.config(setting);
  }

  _onLogout = () => {
    console.log("logoutOut");
    const { navigation } = this.props;
    AsyncStorage.removeItem("userinfo");
    AsyncStorage.removeItem("accesstoken");
    AsyncStorage.removeItem("usermessage");
    // AsyncStorage.removeItem("webim_user");
    // AsyncStorage.removeItem("webim_accesstoken");
    DeviceEventEmitter.emit("loginout", "");
    navigation.goBack();
  };

  render() {
    const { navigation } = this.props;
    const { navigate } = navigation;
    const { data } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.rowList}>
          <View style={styles.row}>
            <View style={styles.rowInner}>
              <View style={styles.left}>
                <Text style={styles.rowText}>新消息通知</Text>
                <View style={styles.subView}>
                  <Text style={styles.sub}>接收评论消息及系统消息通知</Text>
                </View>
              </View>
              <Switch
                style={styles.switch}
                value={this.state.notic}
                tintColor="#ccc"
                onTintColor={theme.highLightColorOpacity}
                thumbTintColor="#fff"
                onValueChange={value => {
                  this.setState({ notic: value });
                }}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.rowInner}>
              <View style={styles.left}>
                <Text style={styles.rowText}>保存草稿</Text>
                <View style={styles.subView}>
                  <Text style={styles.sub}>未发布的话题内容自动保存</Text>
                </View>
              </View>
              <Switch
                style={styles.switch}
                tintColor="#ccc"
                onTintColor={theme.highLightColorOpacity}
                thumbTintColor="#fff"
                value={this.state.draft}
                onValueChange={value => {
                  this.setState({ draft: value });
                }}
              />
            </View>
          </View>
        </View>
        <View style={styles.rowList}>
          <TouchableNativeFeedback
            onPress={() => {
              navigate("Cache");
            }}
          >
            <View style={styles.row}>
              <View style={styles.rowInner}>
                <Text style={styles.rowText}>清除缓存</Text>
              </View>
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback
            onPress={() => {
              navigate("Cache");
            }}
          >
            <View style={styles.row}>
              <View style={styles.rowInner}>
                <View style={styles.left}>
                  <Text style={styles.rowText}>检查更新</Text>
                  <View style={styles.subView}>
                    <Text style={styles.sub}>当前版本 1.0.0</Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableNativeFeedback>
        </View>
        {Object.keys(data).length > 0 ? (
          <View style={styles.rowList}>
            <TouchableNativeFeedback
              onPress={() => {
                this._onLogout();
              }}
            >
              <View style={styles.row}>
                <View style={styles.rowInner}>
                  <Text style={styles.rowText}>退出登录</Text>
                </View>
              </View>
            </TouchableNativeFeedback>
          </View>
        ) : null}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8"
  },

  rowList: {
    marginTop: 10
  },
  headerLeft: {
    width: px2dp(23),
    marginLeft: px2dp(18)
  },
  row: {
    paddingLeft: 27,
    paddingRight: 27,
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#FFFFFF"
  },

  rowImg: {
    width: 20,
    height: 20,
    marginRight: 20
  },

  rowInner: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomWidth: 0.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderColor: "#F0F0F0"
  },

  rowText: {
    fontSize: 16,
    fontWeight: "400"
  },

  subView: {
    marginTop: 8
  },

  sub: {
    color: "#999",
    fontSize: 12
  },

  left: {
    flex: 1
  },

  switch: {}
});
