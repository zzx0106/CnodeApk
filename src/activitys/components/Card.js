import React from "react";
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableHighlight,
  TouchableNativeFeedback
} from "react-native";
import px2dp from "../../utils/px2dp";
import { moment } from "../../utils/tool";
const Card = ({ item, navigate }) => {
  return (
    <TouchableNativeFeedback
      onPress={() => {
        navigate("Detail", { topic_id: item.id });
      }}
    >
      <View style={styles.list}>
        <View style={styles.header}>
          <Text numberOfLines={1} style={styles.h3}>
            标题 : {item.title}
          </Text>
        </View>
        <View style={styles.p}>
          <Text numberOfLines={1} style={styles.name}>
            作者 : {item.author.loginname}
          </Text>
        </View>
        <View style={styles.p}>
          <Text numberOfLines={1} style={styles.name}>
            时间 :{moment(item.last_reply_at)
              .startOf("minute")
              .fromNow()}
          </Text>
        </View>
      </View>
    </TouchableNativeFeedback>
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderColor: "#F0F0F0"
  },

  header: {
    flex: 1,
    flexWrap: "wrap",
    alignItems: "center",
    flexDirection: "row"
  },

  h3: {
    flex: 1,
    overflow: "hidden",
    fontSize: px2dp(16),
    fontWeight: "bold"
  },

  content: {
    flex: 1,
    flexWrap: "wrap",
    alignItems: "center",
    flexDirection: "row"
  },

  avatar: {
    width: px2dp(40),
    height: px2dp(40),
    borderRadius: px2dp(20),
    marginRight: px2dp(10)
  },

  timeView: {
    flex: 2,
    padding: px2dp(3),
    borderRadius: px2dp(3),
    marginRight: px2dp(10),
    backgroundColor: "#4B8CE2"
  },

  p: {
    flex: 1,
    flexWrap: "wrap",
    alignItems: "center",
    flexDirection: "row"
  },

  name: {
    flex: 1,
    overflow: "hidden",
    fontSize: px2dp(12),
    fontWeight: "bold"
  },

  time: {
    flex: 1,
    overflow: "hidden",
    fontSize: px2dp(12),
    fontWeight: "bold"
  }
});

export default Card;
