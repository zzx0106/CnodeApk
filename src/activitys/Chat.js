import React, { PureComponent } from "react";
import { GiftedChat, Actions, Bubble } from "react-native-gifted-chat";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  Image,
  StatusBar,
  FlatList,
  Dimensions,
  TouchableOpacity,
  ToastAndroid
} from "react-native";
import { HX_sendMessage } from "../config/API_Notice";

const { width } = Dimensions.get("window");
const defaultInputWidth = width - 40;

class Chat extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      messages: []
    };
  }

  static navigationOptions = ({ navigation }) => {
    const { state, setParams, navigate } = navigation;
    const { user } = state.params;
    return {
      headerTitle: `${user.name}`,
      headerRight: (
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.headerTouch}
            onPress={() => {
              navigate("ChatMessage", { user });
            }}
          >
            <Image
              style={styles.headerBtn}
              source={require("../assets/images/user.png")}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      )
    };
  };

  componentDidMount() {
    const { user } = this.props.navigation.state.params;
    const { owner } = this.props;
    // this.props.fetchMessage({ user })
    // this.props.cleanCount({ user, owner })
  }

  componentWillUnmount() {
    const { user } = this.props.navigation.state.params;
    const { owner } = this.props;
    this.props.cleanCount({ user, owner });
  }

  _onSend = async (messages = []) => {
    // const isSendSuccess = await HX_sendMessage({
    //   msg: messages.text,
    //   username: messages.user.name
    // });
    // if (!isSendSuccess) {
    //   ToastAndroid.show("发送失败", ToastAndroid.SHORT);
    //   return;
    // }
    // this.setState(previousState => ({
    //   messages: GiftedChat.append(previousState.messages, messages)
    // }));
    // const [message] = messages
    // const { user } = this.props.navigation.state.params;
    // const { owner } = this.props
    // const params = { to: user.name, msg: message.text }
    // this.props.sendMessage(params)
    // this.props.saveMessage({ user, owner, message })
  };

  _renderBubble(props) {
    return (
      <Bubble {...props} wrapperStyle={{ left: { backgroundColor: "#FFF" } }} />
    );
  }

  _renderFooter(props) {
    if (this.state.typingText) {
      return (
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>{this.state.typingText}</Text>
        </View>
      );
    }
    return null;
  }

  render() {
    const {
      messages = [
        {
          _id: 1,
          text: "My message",
          createdAt: new Date(Date.UTC(2016, 5, 11, 17, 20, 0)),
          user: {
            _id: 2,
            name: "React Native",
            avatar: "https://facebook.github.io/react/img/logo_og.png"
          },
          image: "https://facebook.github.io/react/img/logo_og.png"
          // Any additional custom parameters are passed through
        }
      ],
      owner = { loginname: "zzx0106" },
      loading
    } = this.props;
    const { navigate } = this.props.navigation;

    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <GiftedChat
          messages={this.state.messages}
          placeholder="请输入..."
          isAnimated={true}
          showUserAvatar={true}
          onSend={messages => this._onSend(messages)}
          renderBubble={this._renderBubble.bind(this)}
          renderFooter={this._renderFooter.bind(this)}
          user={{ _id: owner.loginname, name: owner.loginname }}
        />
      </View>
    );
  }
}

function mapStateToProps(state) {
  const { messages, loading } = state.notice;
  const { user: owner } = state.home;
  return { messages, owner, loading };
}

function mapDispatchToProps(dispatch) {
  return {
    sendMessage(params) {
      dispatch({
        type: "notice/send_message",
        payload: params
      });
    },
    fetchMessage(params) {
      dispatch({
        type: "notice/fetch_message",
        payload: params
      });
    },
    saveMessage(params) {
      dispatch({
        type: "notice/save_message",
        payload: params
      });
    },
    cleanCount(params) {
      dispatch({
        type: "notice/clean_count",
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

  headerRight: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center"
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

  inputView: {
    position: "absolute",
    bottom: 0
  },

  contentTouch: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center"
  },

  contentImg: {
    width: 24,
    height: 24
  },

  contentView: {
    height: 44,
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#FFF"
  },

  input: {
    width: defaultInputWidth,
    fontSize: 16,
    paddingLeft: 15,
    paddingRight: 15
  },

  commentTouch: {
    height: 30
  }
});

export default Chat;
