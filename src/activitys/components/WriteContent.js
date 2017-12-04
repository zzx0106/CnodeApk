import React, { PureComponent } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
  DeviceEventEmitter,
  AsyncStorage,
  ToastAndroid,
  KeyboardAvoidingView
} from "react-native";
import theme from "../../pubilc/theme";
import px2dp from "../../utils/px2dp";
import { postComment, postReply } from "../../config/API_Detail";
import { collect, de_collect, queryCollects } from "../../config/API_Collect";
export default class WriteContent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      reply_user: "",
      height: 0,
      hiddenIcon: true,
      showChatBox: false,
      chatFocus: false,
      isCollect: false
    };
    this.onChangeText = this.onChangeText.bind(this);
    this.onChangeSize = this.onChangeSize.bind(this);
    this.isCollectNote = this.isCollectNote.bind(this);
    this.onCollectNote = this.onCollectNote.bind(this);
    this.deCollectNote = this.deCollectNote.bind(this);
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
  componentDidMount() {
    this.isMount = true;
    DeviceEventEmitter.addListener("addUserName", params => {
      const { reply_user, reply_id } = params;
      if (this.isMount) {
        this.setState({
          text: reply_user,
          reply_user,
          reply_id
        });
      }
    });
    this.isCollectNote();
  }
  componentWillMount() {
    this.isMount = false;
  }
  async onSubmitContent() {
    if (!this.state.text.replace(/(^\s*)|(\s*$)/g, "")) {
      ToastAndroid.show("输入不能为空", ToastAndroid.SHORT);
      return;
    }
    console.log(this.state.text.split(this.state.reply_user));
    if (this.state.reply_user) {
      if (this.state.text.split(this.state.reply_user).length === 1) {
        ToastAndroid.show("输入不能为空", ToastAndroid.SHORT);
        return;
      }
    }
    const accesstoken = await AsyncStorage.getItem("accesstoken");
    const content = this.state.text;
    const { id } = this.props.data;
    if (!accesstoken) {
      ToastAndroid.show("请先登录再评论", ToastAndroid.SHORT);
      return;
    }
    let params = { accesstoken, content, topic_id: id };
    if (content.indexOf("@") === 0) {
      params.reply_id = this.state.reply_id;
      const toReply = await postReply(params);
      if (toReply) {
        console.log(toReply);
        if (toReply.data.success) {
          ToastAndroid.show("回复成功", ToastAndroid.SHORT);
        }
      } else {
        ToastAndroid.show("回复失败", ToastAndroid.SHORT);
      }
    } else {
      const toComment = await postComment(params);
      if (toComment) {
        console.log(toComment);
        if (toComment.data.success) {
          ToastAndroid.show("评论成功", ToastAndroid.SHORT);
        } else {
          ToastAndroid.show("请求失败", ToastAndroid.SHORT);
        }
      } else {
        ToastAndroid.show("请求失败", ToastAndroid.SHORT);
      }
    }
    this.setState({
      text: ""
    });
  }
  async isCollectNote() {
    const accesstoken = await AsyncStorage.getItem("accesstoken");
    const { id } = this.props.data;
    if (!accesstoken) {
      this.setState({
        isCollect: false
      });
      return;
    }
    const userinfo = await AsyncStorage.getItem("userinfo");
    if (!userinfo) {
      this.setState({
        isCollect: false
      });
      ToastAndroid.show("获取个人信息失败", ToastAndroid.SHORT);
      return;
    }
    const collectList = await queryCollects({
      user: JSON.parse(userinfo).loginname
    });
    if (collectList.status === 200 && collectList.data.success) {
      this.setState({
        collects: collectList.data
      });
      if (collectList.data.data.filter(item => item.id === id).length > 0) {
        //判断收藏数组中是否有当前文章
        this.setState({
          isCollect: true
        });
      } else {
        this.setState({
          isCollect: false
        });
      }
    } else {
      this.setState({
        isCollect: false
      });
      ToastAndroid.show("获取收藏列表失败", ToastAndroid.SHORT);
    }
    console.log(collectList);
  }
  async onCollectNote() {
    const accesstoken = await AsyncStorage.getItem("accesstoken");
    const { id } = this.props.data;
    if (!accesstoken) {
      ToastAndroid.show("请先登录再收藏", ToastAndroid.SHORT);
      return;
    }
    const collectResult = await collect({ accesstoken, topic_id: id });
    if (collectResult) {
      console.log(collectResult);
      if (collectResult.data.success) {
        this.setState({ isCollect: true });
        ToastAndroid.show("收藏成功", ToastAndroid.SHORT);
      } else {
        this.setState({ isCollect: false });
        ToastAndroid.show("收藏失败", ToastAndroid.SHORT);
      }
    } else {
      this.setState({ isCollect: false });
      ToastAndroid.show("收藏失败", ToastAndroid.SHORT);
    }
  }
  async deCollectNote() {
    const accesstoken = await AsyncStorage.getItem("accesstoken");
    const { id } = this.props.data;
    if (!accesstoken) {
      ToastAndroid.show("请先登录再收藏", ToastAndroid.SHORT);
      return;
    }
    const deCollect = await de_collect({ accesstoken, topic_id: id });
    if (deCollect) {
      console.log(deCollect);
      if (deCollect.data.success) {
        this.setState({ isCollect: false });
        ToastAndroid.show("取消收藏成功", ToastAndroid.SHORT);
      } else {
        this.setState({ isCollect: true });
        ToastAndroid.show("取消收藏失败", ToastAndroid.SHORT);
      }
    } else {
      this.setState({ isCollect: true });
      ToastAndroid.show("取消收藏失败", ToastAndroid.SHORT);
    }
  }
  render() {
    const { data } = this.props;
    return (
      <View
        style={{
          position: "absolute",
          bottom: 0
        }}
      >
        <View style={styles.content_box}>
          <TouchableNativeFeedback
            style={styles.content_box_left}
            onPressIn={() => {
              console.log("快速响应1");
              this.setState({ showChatBox: true, chatFocus: true });
            }}
          >
            <View style={styles.content_box_left}>
              {this.state.hiddenIcon ? (
                <Image
                  style={styles.content_box_left_icon}
                  source={require("../../assets/images/write.png")}
                />
              ) : null}
              <KeyboardAvoidingView style={styles.inputBox}>
                <TextInput
                  style={[
                    styles.input,
                    {
                      height: Math.max(px2dp(30), this.state.height),
                      width: Math.max(35, this.state.width)
                    }
                  ]}
                  onFocus={() =>
                    this.setState({
                      hiddenIcon: false
                    })}
                  multiline={true}
                  placeholder="发表评论..."
                  underlineColorAndroid="transparent"
                  onContentSizeChange={this.onChangeSize}
                  maxLength={200}
                  value={this.state.text}
                  onChangeText={this.onChangeText}
                  onBlur={() => this.setState({ hiddenIcon: true })}
                />
              </KeyboardAvoidingView>

              {/* <Text style={styles.content_box_left_content}>写评论...</Text> */}
            </View>
          </TouchableNativeFeedback>
          {this.state.hiddenIcon ? (
            <View style={styles.content_box_right}>
              <View style={styles.content_box_right_icon}>
                <Image
                  style={styles.content_box_right_icon}
                  source={require("../../assets/images/chat.png")}
                />
                <Text style={styles.content_box_right_icon_tag}>
                  {data.replies.length}
                </Text>
              </View>
              {this.state.isCollect ? (
                <TouchableWithoutFeedback onPress={() => this.deCollectNote()}>
                  <Image
                    style={styles.content_box_right_icon}
                    source={require("../../assets/images/save_open.png")}
                  />
                </TouchableWithoutFeedback>
              ) : (
                <TouchableWithoutFeedback onPress={() => this.onCollectNote()}>
                  <Image
                    style={styles.content_box_right_icon}
                    source={require("../../assets/images/save_close.png")}
                  />
                </TouchableWithoutFeedback>
              )}
              <Image
                style={styles.content_box_right_icon}
                source={require("../../assets/images/share.png")}
              />
            </View>
          ) : (
            <TouchableOpacity onPress={() => this.onSubmitContent()}>
              <Text
                style={[
                  styles.send,
                  {
                    color:
                      this.state.text.length > 0
                        ? theme.linkColor
                        : theme.darkColor
                  }
                ]}
              >
                发表
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 44,
    backgroundColor: "#FFFFFF"
  },
  webview: {
    flex: 1,
    height: 300
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#FFFFFF"
  },

  headerLeft: {
    width: px2dp(23),
    marginLeft: px2dp(18)
  },

  connect: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#F0F0F0"
  },

  reply: {
    flexDirection: "row",
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#F0F0F0"
  },

  total: {
    color: "#42b983",
    fontWeight: "bold"
  },

  inputView: {},

  contentTouch: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center"
  },

  contentImg: {
    width: px2dp(24),
    height: px2dp(24)
  },

  content_view: {
    width: theme.screenWidth,
    minHeight: px2dp(40),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: px2dp(1),
    borderTopColor: "#F9F9F9"
  },
  content_box: {
    width: theme.screenWidth,
    minHeight: px2dp(40),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: px2dp(1),
    borderTopColor: "#F9F9F9"
    // backgroundColor: "#fff"
  },
  content_box_left: {
    flex: 1,
    flexDirection: "row",
    borderRadius: px2dp(30),
    minHeight: px2dp(30),
    paddingLeft: px2dp(15),
    paddingRight: px2dp(15),
    marginLeft: px2dp(20),
    marginRight: px2dp(20),
    backgroundColor: "#F9F9F9",
    alignItems: "center"
  },
  content_view_left: {
    flex: 1,
    flexDirection: "row",
    borderRadius: px2dp(30),
    paddingLeft: px2dp(15),
    paddingRight: px2dp(15),
    marginLeft: px2dp(20),
    marginRight: px2dp(20),
    backgroundColor: "#F9F9F9",
    alignItems: "center"
  },
  content_box_left_icon: {
    width: px2dp(20),
    height: px2dp(20),
    marginRight: px2dp(5)
  },
  content_box_left_content: {
    fontSize: px2dp(13)
  },
  content_box_right: {
    flexDirection: "row",
    width: px2dp(150),
    height: px2dp(30),
    alignItems: "center",
    justifyContent: "space-around"
  },
  content_box_right_icon: {
    width: px2dp(22),
    height: px2dp(22),
    alignItems: "center"
  },
  content_box_right_icon_tag: {
    position: "absolute",
    minWidth: px2dp(15),
    minHeight: px2dp(10),
    backgroundColor: theme.highLightColor,
    color: "#ffffff",
    right: -5,
    top: -2,
    borderRadius: px2dp(8),
    fontSize: px2dp(8),
    textAlign: "center"
  },
  content_view_right: {
    flexDirection: "row",
    width: px2dp(70),
    height: px2dp(30),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "red"
  },
  inputBox: {
    flex: 1,
    minHeight: px2dp(30),
    borderTopRightRadius: px2dp(30),
    borderBottomRightRadius: px2dp(30),
    paddingRight: px2dp(0),
    paddingTop: px2dp(0),
    paddingBottom: px2dp(0),
    marginLeft: px2dp(5)
  },
  input: {
    flex: 1,
    minHeight: px2dp(30),
    borderTopRightRadius: px2dp(30),
    borderBottomRightRadius: px2dp(30),
    paddingRight: px2dp(0),
    paddingTop: px2dp(0),
    paddingBottom: px2dp(0),
    marginLeft: px2dp(5),
    fontSize: px2dp(13)
  },

  send: {
    width: px2dp(50),
    alignItems: "center",
    fontSize: px2dp(13)
  }
});
