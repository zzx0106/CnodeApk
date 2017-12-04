import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Image,
  Text,
  Modal,
  Dimensions,
  TouchableOpacity,
  TouchableNativeFeedback,
  DeviceEventEmitter,
  TouchableWithoutFeedback
} from "react-native";
import px2dp from "../../utils/px2dp";
import HtmlView from "./HtmlView";
import theme from "../../pubilc/theme";
const defaultMaxImageWidth = px2dp(theme.screenWidth - 30 - 20);
const defaultWidth = px2dp(theme.screenWidth - 90 * 2);

class FooterBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }
  _onReply(item) {
    console.log("回复", item);
    this.setState({ visible: false });
    if (item.reply_id) {
      const reply_user = `@${item.author.loginname} `;
      DeviceEventEmitter.emit("addUserName", {
        reply_user: reply_user,
        reply_id: item.reply_id
      });
    }
  }
  _onSelect() {
    console.log("复制");
    this.setState({ visible: false });
  }
  render() {
    const { item, navigate } = this.props;
    return (
      <View tyle={styles.container}>
        <TouchableNativeFeedback
          onLongPress={() => {
            this.setState({ visible: true });
          }}
        >
          <View style={styles.list}>
            <View style={styles.left}>
              <TouchableWithoutFeedback
                onPress={() => {
                  navigate("PersonCenter", { loginname: item.author.loginname });
                }}
              >
                <Image
                  source={{ uri: item.author.avatar_url }}
                  style={styles.avatar}
                />
              </TouchableWithoutFeedback>
            </View>
            <View style={styles.center}>
              <View style={styles.info}>
                <View style={styles.cl}>
                  <Text style={styles.username}>{item.author.loginname}</Text>
                </View>
              </View>
              <HtmlView html={item.content} styles={htmlStyles} />
              <View style={styles.center_bottom}>
                <Text style={styles.create_time}>{item.create_at}</Text>
                <Text style={styles.dot}>.</Text>
                {item.reply_id ? (
                  <TouchableOpacity
                    onPress={() => {
                      this._onReply(item);
                    }}
                  >
                    <Text style={styles.replie}>回复</Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.replie}>缺少参数无法回复</Text>
                )}
              </View>
            </View>
            <View style={styles.right}>
              <TouchableOpacity
                style={styles.iconBtn}
                onPress={() => {
                  this._onUps(item.id);
                }}
              >
                <Image
                  style={styles.icon}
                  source={
                    item.is_uped
                      ? require("../../assets/images/good_open.png")
                      : require("../../assets/images/good_close.png")
                  }
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <Text style={styles.ups}>{item.ups.length}</Text>
            </View>
          </View>
        </TouchableNativeFeedback>
        <Modal
          animationType={"fade"}
          transparent={true}
          visible={this.state.visible}
          onRequestClose={() => null} //修复安卓modal的告警
        >
          <TouchableWithoutFeedback
            onPress={() => {
              console.log("点击空白处");
              this.setState({ visible: false });
            }}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modal}>
                <TouchableOpacity
                  onPress={() => {
                    this._onReply(item);
                  }}
                >
                  <View style={styles.rowView}>
                    {item.reply_id ? (
                      <Text style={styles.rowText}>回复</Text>
                    ) : (
                      <Text style={styles.rowText}>缺少参数无法回复</Text>
                    )}
                  </View>
                  <View style={styles.rowLine} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this._onSelect();
                  }}
                >
                  <View style={styles.rowView}>
                    <Text style={styles.rowText}>复制</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  left: {
    // alignItems: "center",
    flexWrap: "wrap",
    flexDirection: "row",
    paddingLeft: px2dp(15),
    paddingRight: px2dp(15)
  },
  avatar: {
    width: px2dp(45),
    height: px2dp(45),
    borderRadius: px2dp(20),
    marginTop: px2dp(5)
  },
  center: {
    flex: 1
  },
  list: {
    flexDirection: "row",
    marginTop: px2dp(10),
    borderBottomWidth: px2dp(1),
    borderColor: "#F0F0F0"
  },

  right: {
    width: px2dp(60),
    marginTop: px2dp(5),
    flexDirection: "row",
    marginRight: px2dp(5)
  },
  icon: {
    padding: px2dp(5),
    width: px2dp(20),
    height: px2dp(20)
  },
  username: {
    color: "#3F429E",
    fontSize: px2dp(12),
    paddingTop: px2dp(5),
    paddingBottom: px2dp(5)
  },
  center_bottom: {
    flexDirection: "row",
    alignItems: "center"
  },
  create_time: {
    color: "#2e2e2e",
    fontSize: px2dp(10),
    paddingTop: px2dp(5),
    paddingBottom: px2dp(5)
  },
  dot: {
    borderRadius: px2dp(14),
    backgroundColor: "#2e2e2e",
    height: px2dp(2),
    width: px2dp(2),
    marginRight: px2dp(2),
    marginLeft: px2dp(2),
    alignItems: "flex-start"
  },
  replie: {
    color: "#3F429E",
    fontSize: px2dp(10),
    paddingTop: px2dp(5),
    paddingBottom: px2dp(5)
  },
  // user: {
  //   alignItems: "center",
  //   flexWrap: "wrap",
  //   flexDirection: "row",
  //   paddingLeft: px2dp(15),
  //   paddingRight: px2dp(15)
  // },

  // info: {
  //   flex: 1,
  //   flexDirection: "row"
  // },

  // head: {
  //   width: px2dp(40),
  //   height: px2dp(40),
  //   borderRadius: px2dp(20),
  //   marginRight: px2dp(15)
  // },

  // cl: {
  //   flex: 1
  // },

  // name: {
  //   color: "#3F429E",
  //   fontSize: px2dp(12),
  //   paddingTop: px2dp(5),
  //   paddingBottom: px2dp(5)
  // },

  // cr: {
  //   width: px2dp(60),
  //   marginTop: px2dp(5),
  //   alignItems: "center",
  //   flexDirection: "row",
  //   marginRight: px2dp(5)
  // },

  // iconBtn: {
  //   padding: px2dp(5)
  // },

  // icon: {
  //   width: px2dp(20),
  //   height: px2dp(20)
  // },

  // content: {
  //   marginTop: px2dp(5),
  //   marginBottom: px2dp(15),
  //   paddingLeft: px2dp(15),
  //   paddingRight: px2dp(15)
  // },

  // ups: {
  //   fontSize: px2dp(14),
  //   color: "#626262",
  //   paddingTop: px2dp(3),
  //   paddingBottom: px2dp(3)
  // },

  modalContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  },

  modal: {
    width: defaultWidth,
    borderRadius: px2dp(5),
    backgroundColor: "#FFF",
    justifyContent: "center"
  },

  rowView: {
    padding: px2dp(16)
  },

  rowLine: {
    height: px2dp(1),
    backgroundColor: "#F0F0F0"
  },

  rowText: {
    textAlign: "center"
  }
});

const htmlStyles = StyleSheet.create({
  a: {
    color: "#4078c0"
  },

  p: {
    fontSize: px2dp(14),
    lineHeight: px2dp(18)
  },

  img: {
    width: defaultMaxImageWidth
  }
});

export default FooterBox;
