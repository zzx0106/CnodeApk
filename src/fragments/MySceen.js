import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TouchableNativeFeedback,
  ListView,
  Image,
  StatusBar,
  BackHandler,
  ToastAndroid,
  AsyncStorage,
  DeviceEventEmitter,
  FlatList
} from "react-native";
import theme from "../pubilc/theme";
import ScrollableTabView, {
  DefaultTabBar
} from "react-native-scrollable-tab-view";
import HomeTabItem from "./components/HomeTabItem";
import px2dp from "../utils/px2dp";
import Login from "./components/Login";
export default class MySceen extends PureComponent {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: (
      <Text
        style={{
          backgroundColor: theme.highLightColor,
          height: px2dp(45),
          width: "100%",
          color: "#fff",
          fontSize: px2dp(20),
          textAlign: "center",
          textAlignVertical: "center"
        }}
      >
        我的
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
      isShow: false,
      data: {
        recent_replies: [""],
        recent_topics: [],
        loginname: ""
      }
    };
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({ isShow: true });
    }, 0);
    AsyncStorage.getItem("usermessage").then(function(data) {
      console.log("jjboy", data);
    });
    this.listenerLoginsuccess = DeviceEventEmitter.addListener(
      "getmessagesuccess",
      async msg => {
        console.log("usermessage请求完毕开始接收数据");
        const usermessage = await AsyncStorage.getItem("usermessage");
        if (usermessage) {
          this.setState({
            data: JSON.parse(usermessage)
          });
        } else {
          ToastAndroid.show("usermessage为空", ToastAndroid.SHORT);
        }
      }
    );
  }
  componentWillUnmount() {
    this.listenerLoginsuccess.remove();
  }
  render() {
    const { data } = this.state;
    // const { user, collects, data, loading } = this.props
    const { navigate } = this.props.navigation;
    const headerProps = { data, navigate };

    return (
      <ScrollView>
        <StatusBar backgroundColor={theme.highLightColor} />
        <Login {...headerProps} />
        <View style={styles.rowList}>
          <TouchableNativeFeedback
            onPress={() => {
              navigate("Dynamic", {
                title: "最近回复",
                data: data.recent_replies
              });
            }}
          >
            <View style={styles.row}>
              <Image
                style={styles.rowImg}
                source={require("../assets/images/my_rep.png")}
                resizeMode="contain"
              />
              <View style={styles.rowInner}>
                <Text style={styles.rowText}>最近回复</Text>
                <Text style={styles.span}>
                  {data.recent_replies ? data.recent_replies.length : "0"}
                </Text>
              </View>
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback
            onPress={() => {
              navigate("Dynamic", {
                title: "最新发布",
                data: data.recent_topics
              });
            }}
          >
            <View style={styles.row}>
              <Image
                style={styles.rowImg}
                source={require("../assets/images/my_new.png")}
                resizeMode="contain"
              />
              <View style={styles.rowInner}>
                <Text style={styles.rowText}>最新发布</Text>
                <Text style={styles.span}>
                  {data.recent_topics ? data.recent_topics.length : "0"}
                </Text>
              </View>
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback
            onPress={() => {
              navigate("Collect", { user: data.loginname });
            }}
          >
            <View style={styles.row}>
              <Image
                style={styles.rowImg}
                source={require("../assets/images/my_love.png")}
                resizeMode="contain"
              />
              <View style={styles.rowInner}>
                <Text style={styles.rowText}>话题收藏</Text>
              </View>
            </View>
          </TouchableNativeFeedback>
        </View>
        <View style={styles.rowList}>
          <TouchableNativeFeedback
            onPress={() => {
              navigate("Setting");
            }}
          >
            <View style={styles.row}>
              <Image
                style={styles.rowImg}
                source={require("../assets/images/my_setting.png")}
                resizeMode="contain"
              />
              <View style={styles.rowInner}>
                <Text style={styles.rowText}>设置</Text>
              </View>
            </View>
          </TouchableNativeFeedback>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8"
  },

  rowList: {
    marginTop: px2dp(10)
  },

  row: {
    paddingLeft: px2dp(27),
    paddingRight: px2dp(27),
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#FFFFFF"
  },

  rowImg: {
    width: px2dp(20),
    height: px2dp(20),
    marginRight: px2dp(20)
  },

  rowInner: {
    flex: 1,
    paddingTop: px2dp(15),
    paddingBottom: px2dp(15),
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: px2dp(0.5),
    borderColor: "#F0F0F0"
  },

  rowText: {
    fontSize: px2dp(16),
    fontWeight: "400"
  },

  iconBtn: {
    width: px2dp(25),
    height: px2dp(25)
  },

  span: {
    color: "#999",
    fontSize: px2dp(14)
  }
});
