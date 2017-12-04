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
const ItemTemplate = ({ item, navigate }) => (
  <TouchableNativeFeedback
    onPress={() => {
      navigate("ContentDetail", { topic_id: item.id });
    }}
  >
    <View style={styles.list}>
      <View style={styles.header}>
        <View style={styles.bottomLeft}>
          <View style={[styles[item.tab], styles.tab]}>
            <Text style={styles.sort}>{item.sort}</Text>
          </View>
          <Text numberOfLines={2} style={styles.h3}>
            {item.title}
          </Text>
        </View>
        <Image
          source={{ uri: item.author.avatar_url }}
          style={styles.avatar}
          resizeMode="contain"
        />
      </View>
      <View style={styles.bottom}>
        <View style={styles.bottomLeft}>
          <Image
            source={require("../../assets/images/author.png")}
            style={styles.icon}
            resizeMode="contain"
          />
          <Text style={styles.iconFont}>{item.author.loginname}</Text>
          <Image
            source={require("../../assets/images/watch.png")}
            style={styles.icon}
            resizeMode="contain"
          />
          <Text style={styles.iconFont}>{item.visit_count}</Text>
          <Image
            source={require("../../assets/images/chat.png")}
            style={styles.icon}
            resizeMode="contain"
          />
          <Text style={styles.iconFont}>{item.reply_count}</Text>
          <Image
            source={require("../../assets/images/time.png")}
            style={styles.icon}
            resizeMode="contain"
          />
          <Text style={styles.iconFont}>{item.create_at}</Text>
        </View>
        <Text style={styles.iconFontLast}>最后回复</Text>
        <Text style={styles.iconFontLast}>{item.last_reply_at}</Text>
      </View>
    </View>
  </TouchableNativeFeedback>
);

const styles = StyleSheet.create({
  list: {
    paddingTop: px2dp(10),
    paddingLeft: px2dp(15),
    paddingRight: px2dp(15),
    paddingBottom: px2dp(5),
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderColor: "#F0F0F0"
  },

  header: {
    flex: 1,
    alignItems: "flex-start",
    flexWrap: "wrap",
    flexDirection: "row"
  },

  tab: {
    marginRight: px2dp(10),
    paddingTop: px2dp(3),
    paddingLeft: px2dp(5),
    paddingBottom: px2dp(3),
    paddingRight: px2dp(5),
    borderRadius: px2dp(3)
  },

  sort: {
    fontSize: px2dp(10),
    color: "#FFFFFF",
    fontWeight: "bold"
  },

  h3: {
    flex: 1,
    overflow: "hidden",
    marginTop: px2dp(-3),
    fontSize: px2dp(16),
    color: "#2e2e2e",
    // fontWeight: 'bold',
    alignItems: "flex-start"
  },

  top: {
    backgroundColor: "#ED4040"
  },

  ask: {
    backgroundColor: "#739A97"
  },

  good: {
    backgroundColor: "#D81E06"
  },

  share: {
    backgroundColor: "#1296DB"
  },

  job: {
    backgroundColor: "#6A8FFF"
  },

  dev: {
    backgroundColor: "#7A86A2"
  },

  default: {
    backgroundColor: "#e7e7e7"
  },

  content: {
    paddingTop: px2dp(10),
    flexDirection: "row"
  },

  avatar: {
    width: px2dp(40),
    height: px2dp(40),
    borderRadius: px2dp(7),
    marginRight: px2dp(10)
  },
  bottom: {
    paddingTop: px2dp(5),
    paddingLeft: px2dp(-4),
    flexDirection: "row",
    alignItems: "center"
  },
  bottomLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    flexWrap: "wrap",
    flexDirection: "row"
  },
  icon: {
    width: px2dp(10),
    height: px2dp(10),
    // marginLeft: px2dp(10),
    marginRight: px2dp(4),
    marginTop: px2dp(3)
  },
  iconFont: {
    fontSize: px2dp(10),
    marginRight: px2dp(10)
  },
  iconFontLast: {
    fontSize: px2dp(10),
    justifyContent: "flex-end"
  },
  info: {
    flex: 1
  },

  p: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: px2dp(3)
  },

  status: {
    flexDirection: "row"
  },

  name: {
    fontSize: px2dp(12)
  },

  time: {
    fontSize: px2dp(12)
  },

  b: {
    fontSize: px2dp(12),
    fontWeight: "bold"
  },

  reply: {
    color: "#42b983"
  }
});

export default ItemTemplate;
