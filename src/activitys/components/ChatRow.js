import React, { Component, PureComponent } from "react";
import {
  StyleSheet,
  View,
  Image,
  Text,
  Alert,
  TouchableHighlight
} from "react-native";

class ChatRow extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  _onLongPress = user => {
    const { owner } = this.props;
    Alert.alert("删除信息？", null, [
      { text: "取消", onPress: () => console.log("cancle") },
      { text: "确定", onPress: () => this.props.delete({ user, owner }) }
    ]);
  };

  _renderWidth = ({ count }) => {
    if (count < 10) return 10;
    else if (count > 10 && count < 100) return 10 * 2;
    else if (count > 100 && count < 1000) return 10 * 3;
    else if (count >= 1000) return 10 * 4;
  };

  render() {
    const { item, navigate } = this.props;
    const width = this._renderWidth(item);
    item.count = item.count <= 999 ? item.count : "+999";

    return (
      <TouchableHighlight
        onPress={() => {
          navigate("Chat", { user: item });
        }}
        onLongPress={() => {
          this._onLongPress(item);
        }}
      >
        <View style={styles.row}>
          <View style={styles.avatarBox}>
            {/* <Image style={styles.avatar} source={{ uri: item.avatar }} /> */}
          </View>
          <View style={styles.rowInner}>
            <View style={styles.info}>
              <Text numberOfLines={1} style={styles.name}>
                {item.name ? item.name : "未知"}
              </Text>
              <Text numberOfLines={1} style={styles.time}>
                {item.createdAt}
              </Text>
            </View>
            <Text numberOfLines={1} style={styles.content}>
              {item.text}
            </Text>
            {item.count !== 0 ? (
              <View style={styles.countBox}>
                <Text numberOfLines={1} style={[styles.count, { width }]}>
                  {item.count}
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    paddingLeft: 27,
    paddingRight: 27,
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 0.5,
    borderColor: "#cccccc"
  },
  avatarBox: {
    width: 50,
    height: 50,
    justifyContent: "center"
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20
  },

  rowInner: {
    flex: 1,
    paddingTop: 15,
    paddingBottom: 15
  },

  info: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },

  name: {
    fontSize: 16,
    fontWeight: "400"
  },

  content: {
    fontSize: 14,
    color: "#999",
    paddingTop: 3
  },

  time: {
    fontSize: 12,
    color: "#999"
  },

  countBox: {
    position: "absolute",
    bottom: 15,
    right: 0,
    width: 16,
    height: 16,
    padding: 5,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F03737"
  },

  count: {
    fontSize: 11,
    textAlign: "center",
    color: "#FFFFFF"
  }
});

export default ChatRow;
