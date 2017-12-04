import React, { PureComponent } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  RefreshControl,
  Text,
  Button,
  Image,
  StatusBar,
  FlatList,
  Dimensions,
  TouchableOpacity,
  TouchableNativeFeedback,
  AsyncStorage,
  ToastAndroid,
  TouchableHighlight
} from "react-native";
import theme from "../pubilc/theme";
import ScrollableTabView, {
  DefaultTabBar
} from "react-native-scrollable-tab-view";
import HomeTabItem from "./components/HomeTabItem";
import px2dp from "../utils/px2dp";
import WebIM from "../utils/webIM/index";
import Tip from "../activitys/components/Tip";
import ChatRow from "../activitys/components/ChatRow";
import { HX_login, HX_register } from "../config/API_Notice";
// import { addFriends, parseRosters, parseMessage } from "../config/API_Notice";
export default class NoticeSceen extends PureComponent {
  static navigationOptions = ({ navigation }) => {
    const { navigate } = navigation;
    return {
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
          消息
        </Text>
      ),
      headerStyle: {
        backgroundColor: theme.highLightColor,
        height: px2dp(45)
      },
      headerLeft: (
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.headerTouch}
            onPress={() => {
              navigate("Contact");
            }}
          >
            <View style={styles.headerBtn} />
          </TouchableOpacity>
        </View>
      ),
      headerRight: (
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.headerTouch}
            onPress={() => {
              navigate("Group");
            }}
          >
            <Image
              style={styles.headerBtn}
              source={require("../assets/images/group.png")}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerTouch}
            onPress={() => {
              navigate("AddFriend");
            }}
          >
            <Image
              style={styles.headerBtn}
              source={require("../assets/images/add_firend.png")}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      )
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      isShow: false,
      isLogin: false,
      chat_history: []
    };
    this.init = this.init.bind(this);
    this.oneTouchLoginHXSDK = this.oneTouchLoginHXSDK.bind(this);
  }
  componentDidMount() {
    console.log("初始化");
  }
  componentWillUnmount() {}
  _onReceive = messages => {
    const { owner } = this.props;
    const name = messages.from;
    const message = {
      _id: Math.round(Math.random() * 1000000),
      text: messages.data,
      createdAt: new Date(),
      user: {
        _id: name,
        name: name,
        avatar: "https://facebook.github.io/react/img/logo_og.png"
      }
    };
    this.save_message({ user: { name }, owner, message });
  };

  _onRoster = messages => {
    const [message] = messages;
    const { subscription } = message;
    this.props.change_friends(message);
    console.log(`=== onRoster ${subscription} ===`);
  };
  oneTouchLoginHXSDK() {
    ToastAndroid.show("环信SDK功能暂时停止开发", ToastAndroid.SHORT);
    return;
    this.init();
  }
  async init() {
    const accesstoken = await AsyncStorage.getItem("accesstoken");
    const userinfo = await AsyncStorage.getItem("userinfo");
    if (!accesstoken || !userinfo) {
      ToastAndroid.show("您还没有登录", ToastAndroid.SHORT);
      return;
    }
    const { conn, api } = WebIM;
    console.log(conn);
    conn.listen({
      onOpened: message => {
        //连接成功回调
        // 如果isAutoLogin设置为false，那么必须手动设置上线，否则无法收消息
        // 手动上线指的是调用conn.setPresence(); 如果conn初始化时已将isAutoLogin设置为true
        // 则无需调用conn.setPresence();
        // conn.setPresence();
        ToastAndroid.show("环信SDK链接成功", ToastAndroid.SHORT);
        conn.getRoster({
          //获取好友列表
          success: roster => {
            console.log(`=== getRoster ===`, roster);
            // this.save_contacts(roster);
          }
        });
        this.setState({
          isLoginCnode: true
        });
        console.log(`=== onOpened ===`);
      },
      onTextMessage: message => {
        console.log(`=== onTextMessage ===`, message);
        this.setState({
          chat_history: [
            {
              count: 1,
              name: message.from,
              createdAt: "2017",
              text: message.data
            }
          ]
        });
      }, //收到文本消息
      onEmojiMessage: message => {
        console.log(`=== onEmojiMessage ===`);
      }, //收到表情消息
      onPictureMessage: message => {
        console.log(`=== onPictureMessage ===`);
      }, //收到图片消息
      onCmdMessage: message => {
        console.log(`=== onCmdMessage ===`);
      }, //收到命令消息
      onAudioMessage: message => {
        console.log(`=== onAudioMessage ===`);
      }, //收到音频消息
      onLocationMessage: message => {
        console.log(`=== onLocationMessage ===`);
      }, //收到位置消息
      onFileMessage: message => {
        console.log(`=== onFileMessage ===`);
      }, //收到文件消息
      onPresence: message => {
        console.log(`=== onPresence ===`);
      }, //处理“广播”或“发布-订阅”消息，如联系人订阅请求、处理群组、聊天室被踢解散等消息
      onReceivedMessage: message => {
        console.log(`=== onReceivedMessage ===`);
      }, //收到消息送达客户端回执
      onDeliveredMessage: message => {
        console.log(`=== onDeliveredMessage ===`);
      }, //收到消息送达服务器回执
      onReadMessage: message => {
        console.log(`=== onReadMessage ===`);
      }, //收到消息已读回执
      onMutedMessage: message => {
        console.log(`=== onMutedMessage ===`);
      }, //如果用户在A群组被禁言，在A群发消息会走这个回调并且消息不会传递给群其它成员

      onClosed: message => {
        console.log(`=== onClosed ===`);
      }, //连接关闭回调
      onPresence: message => {
        console.log(`=== onPresence ${message.type} ===`);
        this.props.on_presence(message);
      }, //处理“广播”或“发布-订阅”消息，如联系人订阅请求、处理群组、聊天室被踢解散等消息
      onRoster: messages => this._onRoster(messages), //处理好友申请
      onInviteMessage: message => {
        console.log(`=== onInviteMessage ===`);
      }, //处理群组邀请
      onOnline: () => {
        console.log(`=== onOnline... ===`);
      }, //本机网络连接成功
      onOffline: () => {
        console.log(`=== onOffline... ===`);
      }, //本机网络掉线
      onError: message => {
        console.log(`=== onError ===`, message);
      }, //失败回调
      onBlacklistUpdate: list => {
        console.log(`=== onBlacklistUpdate ===`);
      }, // 黑名单变动查询黑名单，将好友拉黑，将好友从黑名单移除都会回调这个函数，list则是黑名单现有的所有好友信息
      onCreateGroup: message => {
        console.log(`=== onCreateGroup ===`);
      } //创建群组成功回执（需调用createGroupNew）
    });
    // if (WebIM.conn.isOpened()) {
    //   WebIM.conn.close('logout')
    // }
    const loginname = JSON.parse(userinfo).loginname;
    const isRegister = await HX_register({
      username: loginname,
      password: loginname,
      nickname: loginname
    });
    if (!isRegister) {
      console.log("isRegister", isRegister);
      HX_login({
        username: loginname,
        password: loginname
      });
    } else {
      console.log("isRegister", isRegister);
      HX_login({
        username: loginname,
        password: loginname
      });
    }

    // var options = {
    //   username: "zzx0106",
    //   password: "zzx0106",
    //   apiUrl: WebIM.config.apiURL,
    //   //  accessToken: password,
    //   appKey: WebIM.config.appkey
    // };
    // console.log(options)
    // conn.open(options);

    // 单聊发送文本消息
    var sendPrivateText = function() {
      var id = conn.getUniqueId(); // 生成本地消息id
      var msg = new WebIM.message("txt", id); // 创建文本消息
      msg.set({
        msg: "帅的不敢想", // 消息内容
        to: "zzx0106", // 接收消息对象（用户id）
        roomType: false,
        success: function(id, serverMsgId) {
          console.log("send private text Success");
        },
        fail: function(e) {
          console.log("Send private text error");
        }
      });
      msg.body.chatType = "singleChat";
      conn.send(msg.body);
    };
    // sendPrivateText();
    // conn.registerUser(options);
    // var options = {
    //   apiUrl: WebIM.config.apiURL,
    //   user: 'username',
    //   pwd: 'password',
    //   appKey: WebIM.config.appkey
    // };
    // conn.open(options);
    // HX_login({ username: "zzx", password: "123456" });
  }
  async query(params) {
    dispatch({ type: "notice/query", payload: params });
  }
  async save_message(params) {
    const { user, owner: { loginname } } = params;
    const { messages, total_messages, chat_history } = parseMessage(
      state,
      payload
    );
    AsyncStorage.setItem(
      `${loginname}_total_messages`,
      JSON.stringify(total_messages)
    );
    AsyncStorage.setItem(
      `${loginname}_chat_history`,
      JSON.stringify(chat_history)
    );
    return { ...state, messages, total_messages, chat_history };
    dispatch({ type: "notice/save_message", payload: params });
  }
  async save_contacts(params) {
    parseRosters;
    // dispatch({ type: "notice/save_contacts", payload: params });
  }
  add_friends(params) {
    addFriends(params);
  }
  async change_friends(params) {
    dispatch({ type: "notice/change_friends", payload: params });
  }
  async on_presence(params) {
    dispatch({ type: "notice/on_presence", payload: params });
  }
  render() {
    const {
      hasnot_read_messages = [],
      accesstoken,
      strangers = [1, 2, 3]
    } = this.props;
    const { chat_history = [], isLoginCnode = false } = this.state;
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.noticebox}>
        <StatusBar backgroundColor={theme.highLightColor} />
        <View style={styles.rowList}>
          <TouchableHighlight
            onPress={() => {
              navigate("System");
            }}
          >
            <View style={styles.row}>
              <Image
                style={styles.rowImg}
                source={require("../assets/images/message.png")}
                resizeMode="contain"
              />
              <View style={styles.rowInner}>
                <Text style={styles.rowText}>系统消息</Text>
                {hasnot_read_messages.length > 0 ? (
                  <Text style={styles.span}>{hasnot_read_messages.length}</Text>
                ) : null}
              </View>
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={() => {
              navigate("Roster");
            }}
          >
            <View style={styles.row}>
              <Image
                style={styles.rowImg}
                source={require("../assets/images/friends.png")}
                resizeMode="contain"
              />
              <View style={styles.rowInner}>
                <Text style={styles.rowText}>好友申请</Text>
                {strangers.length > 0 ? (
                  <Text style={styles.span}>{strangers.length}</Text>
                ) : null}
              </View>
            </View>
          </TouchableHighlight>
        </View>

        {
          <ScrollView
            style={styles.container}
            refreshControl={
              <RefreshControl
                onRefresh={() => {
                  this.props.query({ accesstoken });
                }}
                refreshing={false}
              />
            }
          >
            {<StatusBar barStyle="light-content" />}

            {chat_history.length > 0 ? (
              <View style={styles.rowList}>
                <FlatList
                  style={{ width: theme.screenWidth }}
                  data={chat_history}
                  extraData={this.state}
                  keyExtractor={(item, index) => index}
                  renderItem={({ item, index }) => (
                    <ChatRow
                      navigate={navigate}
                      item={item}
                      isEnd={index === chat_history.length - 1}
                    />
                  )}
                />
              </View>
            ) : (
              <Tip message={{ text: "暂无聊天记录" }} />
            )}
          </ScrollView>
        }
        {!isLoginCnode ? (
          <View style={styles.onTouchBtn}>
            <Button title="一键登录" onPress={this.oneTouchLoginHXSDK} />
            <Text style={styles.warringText}>
              注：如果您已经登录cnode客户端，点击一键登录即可登录环信聊天平台
            </Text>
          </View>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  noticebox: {
    width: theme.screenWidth,
    height: theme.screenHeight - px2dp(100),
    backgroundColor: "white"
  },
  container: {
    flex: 1,
    marginTop: px2dp(-15),
    backgroundColor: "white"
  },
  searchBar: {
    width: px2dp(theme.screenWidth * 0.7),
    height: px2dp(30),
    borderRadius: px2dp(5),
    flexDirection: "row",
    // justifyContent: 'center',
    alignItems: "baseline",
    backgroundColor: "#eeeeee",
    alignSelf: "flex-end",
    marginRight: px2dp(theme.screenWidth * 0.02)
  },
  searchIcon: {
    width: px2dp(13),
    height: px2dp(13),
    margin: px2dp(10)
  },
  tabBarText: {
    fontSize: px2dp(14),
    marginTop: px2dp(27)
  },
  tabBarUnderline: {
    backgroundColor: "#fff"
  },
  headerLeft: {
    height: px2dp(45),
    width: px2dp(theme.screenWidth * 0.2),
    marginRight: px2dp(theme.screenWidth * 0.02),
    marginLeft: px2dp(theme.screenWidth * 0.06)
  },
  headerTouch: {
    height: 30
  },

  headerBtn: {
    flex: 1,
    width: 30,
    height: 30,
    marginRight: 15
  },

  rowList: {
    borderTopWidth: 0.5,
    borderColor: "#cccccc"
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

  avatar: {
    width: 40,
    height: 40,
    marginRight: 10,
    borderRadius: 20
  },

  rowInner: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 0.5,
    borderColor: "#F0F0F0"
  },

  rowText: {
    fontSize: 16,
    fontWeight: "400"
  },

  iconBtn: {
    width: 25,
    height: 25
  },

  span: {
    backgroundColor: theme.highLightColor,
    color: "#fff",
    borderRadius: 16,
    width: 16,
    height: 16,
    fontSize: 11,
    textAlignVertical: "center",
    textAlign: "center"
  },

  headerRight: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center"
  },

  headerTouch: {
    height: px2dp(30)
  },

  headerBtn: {
    flex: 1,
    width: px2dp(30),
    height: px2dp(30),
    marginRight: px2dp(15)
  },
  onTouchBtn: {
    width: theme.screenWidth - px2dp(30),
    marginLeft: px2dp(15),
    marginBottom: px2dp(80)
  },
  warringText: {
    fontSize: 12,
    color: theme.highLightColor,
    marginTop: px2dp(10)
  }
});
