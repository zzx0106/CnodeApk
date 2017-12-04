import React, { PureComponent } from "react";
import { Tip } from "./components/Tip";
import {
  StyleSheet,
  View,
  ScrollView,
  RefreshControl,
  Text,
  Alert,
  Image,
  StatusBar,
  FlatList,
  Dimensions,
  TouchableNativeFeedback,
  TouchableOpacity,
  AsyncStorage
} from "react-native";
import theme from "../pubilc/theme";
import px2dp from "../utils/px2dp";
import { addFriends, removeFriends } from "../config/API_Notice";
class UserInformation extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static navigationOptions = ({ navigation }) => {
    const { state, setParams } = navigation;
    return {
      // headerLeft: (
      //   <TouchableNativeFeedback onPress={() => navigation.goBack(null)}>
      //     <Image
      //       style={styles.headerLeft}
      //       source={require("../assets/images/left.png")}
      //       resizeMode="contain"
      //     />
      //   </TouchableNativeFeedback>
      // ),
      headerRight: <Text />,
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
          详细资料
        </Text>
      ),
      headerTitleStyle: {
        color: "white",
        marginLeft: px2dp(0)
      },
      headerStyle: {
        backgroundColor: theme.highLightColor,
        height: px2dp(45)
      }
    };
  };

  componentDidMount() {}

  componentWillReceiveProps(next) {
    const { contacts, navigation } = this.props;
    if (next.contacts && next.contacts !== contacts) {
      navigation.goBack();
    }
  }

  _removeFriends = ({ loginname }) => {
    Alert.alert("删除好友？", null, [
      { text: "取消", onPress: () => console.log("cancle") },
      { text: "确定", onPress: () => removeFriends({ loginname }) }
    ]);
  };
  _addFriends = payload => {
    const { loginname, message = "对方请求添加你为好友" } = payload;
    addFriends({ loginname, message });
  };
  render() {
    const { user } = this.props.navigation.state.params;
    const { navigate } = this.props.navigation;
    console.log(user);
    return (
      <ScrollView style={styles.container}>
        {/* <StatusBar barStyle="light-content" /> */}
        <TouchableOpacity
          onPress={() => {
            navigate("Center", { user });
          }}
        >
          <View style={styles.header}>
            <View style={styles.inner}>
              <Image source={{ uri: user.avatar_url }} style={styles.avatar} />
              <View style={styles.col}>
                <Text style={[styles.span, styles.name]}>{user.loginname}</Text>
                <Text style={styles.sub}>昵称: {user.loginname}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.rowList}>
          <View style={styles.row}>
            <View style={styles.rowInner}>
              <View style={styles.textView}>
                <Text style={styles.rowText}>微博</Text>
              </View>
              <View style={styles.spanView}>
                <Text numberOfLines={1} style={styles.span}>
                  {user.weibo ? user.weibo : "未填写"}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.rowInner}>
              <View style={styles.textView}>
                <Text style={styles.rowText}>个人网站</Text>
              </View>
              <View style={styles.spanView}>
                <Text numberOfLines={1} style={styles.span}>
                  {user.home ? user.home : "未填写"}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.rowInner}>
              <View style={styles.textView}>
                <Text style={styles.rowText}>所在地点</Text>
              </View>
              <View style={styles.spanView}>
                <Text numberOfLines={1} style={styles.span}>
                  {user.location ? user.location : "未填写"}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.rowInner}>
              <View style={styles.textView}>
                <Text style={styles.rowText}>GitHub</Text>
              </View>
              <View style={styles.spanView}>
                <Text numberOfLines={1} style={styles.span}>
                  {user.githubUsername
                    ? `https://github.com/${user.githubUsername}`
                    : "未填写"}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.rowInner}>
              <View style={styles.textView}>
                <Text style={styles.rowText}>个性签名</Text>
              </View>
              <View style={styles.spanView}>
                <Text numberOfLines={1} style={styles.span}>
                  {user.signature ? user.signature : "未填写"}
                </Text>
              </View>
            </View>
          </View>
        </View>
        {(user.is_friend || 0) === 0 ? (
          <TouchableOpacity
            style={[styles.btn, styles.addBtn]}
            onPress={() => {
              this._addFriends({ loginname: user.loginname });
            }}
          >
            <Text style={styles.send}>添加好友</Text>
          </TouchableOpacity>
        ) : null}
        {(user.is_friend || 0) === 1 ? (
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={[styles.btn, styles.sendBtn]}
              onPress={() => {
                navigate("Chat", { user });
              }}
            >
              <Text style={styles.send}>发送消息</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, styles.delBtn]}
              onPress={() => {
                this._removeFriends({ username: user.name });
              }}
            >
              <Text style={[styles.send, { color: "#000" }]}>删除好友</Text>
            </TouchableOpacity>
          </View>
        ) : null}
        {(user.is_friend || 0) === 2 ? (
          <TouchableOpacity style={[styles.btn, styles.selfBtn]}>
            <Text style={styles.send}>自己</Text>
          </TouchableOpacity>
        ) : null}
      </ScrollView>
    );
  }
}

function mapStateToProps(state) {
  const { info, loading } = state.zone;
  const { contacts } = state.notice;
  return { info, contacts, loading };
}

function mapDispatchToProps(dispatch) {
  return {
    information(params) {
      dispatch({
        type: "zone/information",
        payload: params
      });
    },
    addFriends(params) {
      dispatch({
        type: "notice/add_friends",
        payload: params
      });
    },
    removeFriends(params) {
      dispatch({
        type: "notice/remove_friends",
        payload: params
      });
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8"
  },
  headerLeft: {
    width: px2dp(23),
    marginLeft: px2dp(18)
  },
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
    fontSize: 12
  },

  login: {
    fontSize: 18,
    marginLeft: px2dp(15)
  },

  name: {
    color: "#000000",
    fontSize: 16
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
    paddingTop: px2dp(15),
    paddingBottom: px2dp(15),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: px2dp(0.5),
    borderColor: "#F0F0F0"
  },

  textView: {
    flex: 3
  },

  rowText: {
    fontSize: 16,
    fontWeight: "400"
  },

  spanView: {
    flex: 7,
    alignItems: "flex-end",
    justifyContent: "flex-end"
  },

  span: {
    color: "#999",
    fontSize: 14
  },

  btn: {
    flex: 1,
    padding: px2dp(10),
    margin: px2dp(10),
    marginBottom: 0,
    borderRadius: px2dp(3),
    alignItems: "center",
    borderWidth: px2dp(0.3),
    borderColor: "#DCDBDC",
    justifyContent: "center"
  },

  sendBtn: {
    backgroundColor: "#19A416"
  },

  delBtn: {
    backgroundColor: theme.highLightColor
  },

  addBtn: {
    backgroundColor: "#19A416"
  },
  selfBtn: {
    backgroundColor: "#68B8E8"
  },

  send: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold"
  }
});

export default UserInformation;
