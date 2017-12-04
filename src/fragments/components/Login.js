import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Linking,
  Dimensions,
  TouchableOpacity,
  AsyncStorage,
  ToastAndroid,
  DeviceEventEmitter,
  TouchableNativeFeedback
} from "react-native";
import px2dp from "../../utils/px2dp";
import { moment } from "../../utils/tool";
import { queryUser } from "../../config/API_Login";
export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {}
    };
  }
  async componentDidMount() {
    console.log();
    this.listenerLoginout = DeviceEventEmitter.addListener("loginout", () => {
      console.log("退出了");
      this.setState({
        data: {} //刷新页面,清空缓存数据
      });
    });
    this.listenerLoginsuccess = DeviceEventEmitter.addListener(
      "loginsuccess",
      msg => {
        console.log("接收到广播，开始请求数据");
        this.queryUserMessage();
      }
    );
    this.queryUserMessage();
  }
  async queryUserMessage() {
    this.mounted = true; //flag
    if (this.mounted) {
      let userInfo = await AsyncStorage.getItem("userinfo");
      if (userInfo) {
        let data = JSON.parse(userInfo);
        if (data.success) {
          let userMessage = await queryUser(data.loginname);
          console.log("usermessage", userMessage);
          if (userMessage.status === 200 && userMessage.data.success) {
            AsyncStorage.setItem(
              "usermessage",
              JSON.stringify(userMessage.data.data)
            );
            console.log("到这里了", userMessage.data.data);
            DeviceEventEmitter.emit("getmessagesuccess", "");
            this.setState({
              data: userMessage.data.data
            });
          }
        } else {
          ToastAndroid.show("验证失败", ToastAndroid.SHORT);
        }
      }
    }
  }
  componentWillUnMount() {
    console.log("login组件被销毁");
    this.mounted = false; //重置flag
    this.listenerLoginsuccess.remove();
    this.listenerLoginout.remove();
  }
  render() {
    const { navigate } = this.props;
    const { data } = this.state;
    return Object.keys(data).length == 0 ? (
      <TouchableNativeFeedback
        onPress={() => {
          navigate("GoLogin");
        }}
      >
        <View style={styles.header}>
          <View style={styles.inner}>
            <Image
              source={require("../../assets/images/login_user.png")}
              style={styles.avatar}
            />
            <View style={styles.col}>
              <Text style={styles.login}>未登录</Text>
            </View>
          </View>
        </View>
      </TouchableNativeFeedback>
    ) : (
      <View>
        <TouchableNativeFeedback
          onPress={() => {
            navigate("PersonCenter", { loginname: data.loginname });
          }}
        >
          <View style={styles.header}>
            <View style={styles.inner}>
              <Image source={{ uri: data.avatar_url }} style={styles.avatar} />
              <View style={styles.col}>
                <Text style={[styles.span, styles.name]}>{data.loginname}</Text>
                <Text style={styles.sub}>
                  注册于：{" "}
                  {moment(data.create_at)
                    .startOf("minute")
                    .fromNow()}
                </Text>
              </View>
            </View>
          </View>
        </TouchableNativeFeedback>
        <View style={styles.rowList}>
          <TouchableNativeFeedback
            onPress={() => {
              navigate("Credits", { data });
            }}
          >
            <View style={styles.row}>
              <Image
                style={styles.rowImg}
                source={require("../../assets/images/integral.png")}
                resizeMode="contain"
              />
              <View style={styles.rowInner}>
                <Text style={styles.rowText}>论坛积分</Text>
                <Text style={styles.span}>{data.score}</Text>
              </View>
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback
            onPress={() => {
              Linking.openURL(`https://github.com/${data.githubUsername}`);
            }}
          >
            <View style={styles.row}>
              <Image
                style={styles.rowImg}
                source={require("../../assets/images/github.png")}
                resizeMode="contain"
              />
              <View style={styles.rowInner}>
                <Text style={styles.rowText}>代码仓库</Text>
                <Text style={styles.span}>{data.githubUsername}</Text>
              </View>
            </View>
          </TouchableNativeFeedback>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#FFFFFF"
  },

  inner: {
    alignItems: "center",
    flexDirection: "row",
    marginLeft: px2dp(15),
    marginRight: px2dp(15),
    padding: px2dp(15),
    borderBottomWidth: px2dp(0.5),
    borderColor: "#F0F0F0"
  },

  avatar: {
    width: px2dp(50),
    height: px2dp(50),
    borderRadius: px2dp(25),
    marginRight: px2dp(15)
  },

  sub: {
    paddingTop: px2dp(5),
    paddingBottom: px2dp(5),
    color: "#999",
    fontSize: px2dp(12)
  },

  login: {
    fontSize: px2dp(18),
    marginLeft: px2dp(15)
  },

  name: {
    color: "#000000",
    fontSize: px2dp(16)
  },

  col: {
    flex: 1
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
    paddingTop: px2dp(20),
    paddingBottom: px2dp(20),
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
