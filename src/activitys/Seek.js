import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Dimensions,
  Platform,
  ToastAndroid,
  AsyncStorage,
  DeviceEventEmitter,
  TouchableOpacity
} from "react-native";
import px2dp from "../utils/px2dp";
import { queryUser, queryUserInformation } from "../config/API_Login";

const { width } = Dimensions.get("window");
const inputWidth = width - 300; // 减去的宽度分别是 导航栏按钮+margin*2，关闭按钮
const rightWidth = width - px2dp(60);

class Seek extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      visible: false
    };
  }

  _onSearch = async user => {
    user = user.replace(/(^\s*)|(\s*$)/g, "");
    const islogin = await queryUser(user);
    if (islogin.status === 200 && islogin.data.success) {
      console.log("------", islogin.data.data);
      const {
        loginname, //用户名
        avatar_url, //头像
        score, //积分
        githubUsername, //github用户名
        create_at //创建于
      } = islogin.data.data;
      ToastAndroid.show("查询成功", ToastAndroid.SHORT);
      const userinfo_local = await AsyncStorage.getItem("userinfo");
      let is_friend = 0;

      // console.log(userinfo_local);
      // if (userinfo_local) {
      //   is_friend = JSON.parse(userinfo_local).loginname === loginname ? 2 : 0;
      // } else {
      //   is_friend = 0;
      // }

      console.log("............", {
        loginname, //用户名
        avatar_url, //头像
        score, //积分
        githubUsername, //github用户名
        create_at, //创建于
        is_friend // 是否是好友或者自己
      });
      const userinfo = await queryUserInformation({
        loginname, //用户名
        avatar_url, //头像
        score, //积分
        githubUsername, //github用户名
        create_at, //创建于
        is_friend // 是否是好友或者自己
      });
      console.log("userinfo", userinfo);
      // console.log(this.props.searchUserMessage);
      // this.props.searchUserMessage({ loginname, avatar_url });
      DeviceEventEmitter.emit("search_user", JSON.stringify(userinfo));
    } else {
      ToastAndroid.show("查询失败", ToastAndroid.SHORT);
    }
  };

  render() {
    const height = Platform.OS == "ios" ? 28 : 32;
    return (
      <View style={styles.headerRight}>
        <View style={[styles.inputView, { height, borderRadius: 3 }]}>
          <Image
            style={styles.headerBtn}
            source={require("../assets/images/search.png")}
            resizeMode="contain"
          />
          <TextInput
            style={styles.input}
            placeholder="搜索用户"
            value={this.state.text}
            underlineColorAndroid="transparent"
            onChangeText={text => {
              this.setState({ text, visible: true });
            }}
          />
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => {
              this.setState({ text: "", visible: false });
            }}
          >
            {this.state.visible ? (
              <Image
                style={styles.closeImg}
                source={require("../assets/images/cleanup.png")}
                resizeMode="contain"
              />
            ) : null}
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.headerTouch}
          onPress={() => {
            this._onSearch(this.state.text);
          }}
        >
          <Text style={styles.text}>搜索</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerRight: {
    flex: 1,
    width: rightWidth,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },

  headerTouch: {
    padding: px2dp(15),
    alignItems: "center"
  },

  text: {
    fontSize: px2dp(15),
    textAlign: "center",
    width: px2dp(44),
    fontWeight: "bold",
    color: "#fff",
    marginRight: px2dp(15)
  },

  inputView: {
    flexDirection: "row",
    flex: 1,
    paddingLeft: px2dp(3),
    backgroundColor: "#F9F9F9",
    borderWidth: px2dp(1),
    alignItems: "center",
    borderColor: "#FFFFFF",
    justifyContent: "center"
  },

  input: {
    padding: 0,
    fontSize: px2dp(14),
    flex: 1
  },

  headerBtn: {
    width: px2dp(15),
    height: px2dp(15),
    margin: px2dp(4)
  },

  closeImg: {
    width: px2dp(20),
    height: px2dp(20)
  },

  closeBtn: {
    width: px2dp(20),
    height: px2dp(20),
    margin: 4
  }
});

export default Seek;
