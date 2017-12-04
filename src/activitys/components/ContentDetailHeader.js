import React from "react";
import { StyleSheet, View, Image, Text, TouchableOpacity } from "react-native";
import px2dp from "../../utils/px2dp";

const HeaderBox = ({ data, navigate }) => {
  console.log("在head里面", data);
  return Object.keys(data).length > 0 ? (
    <View>
      <View style={styles.title}>
        <Text style={styles.h2}>{data.title}</Text>
      </View>
      <View style={styles.info}>
        <TouchableOpacity
          onPress={() => {
            navigate("Center", { user: data.author.loginname });
          }}
        >
          <Image
            source={{ uri: data.author.avatar_url }}
            style={styles.avatar}
          />
        </TouchableOpacity>
        <View style={styles.col}>
          <Text style={styles.span}>{data.author.loginname}</Text>
          <View style={styles.headBottom}>
            <Image
              style={styles.icon}
              source={require("../../assets/images/time_last.png")}
              resizeMode="contain"
            />
            <Text style={styles.iconFont}>{data.create_at}</Text>
            <Image
              style={styles.icon}
              source={require("../../assets/images/watch.png")}
              resizeMode="contain"
            />
            <Text style={styles.iconFont}>{data.visit_count}</Text>
          </View>
        </View>
        {/* <View style={styles.right}>
          <View style={[styles[data.tab], styles.tab]}>
            <Text style={styles.tag}>{data.sort}</Text>
          </View>
          <Text style={styles.span}>{data.visit_count}次浏览</Text>
        </View> */}
      </View>
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  title: {
    padding: 5,
    margin: 15,
    borderRadius: 5
  },
  headBottom: {
    flexDirection: "row",
    flexWrap: "wrap",
    height: px2dp(10)
  },
  icon: {
    width: px2dp(10),
    height: px2dp(10),
    // marginLeft: px2dp(10),
    marginRight: px2dp(4),
    justifyContent: "center",
    alignItems: "center"
  },
  iconFont: {
    fontSize: px2dp(9),
    marginRight: px2dp(10),
    lineHeight: px2dp(11),
    justifyContent: "center",
    alignItems: "center"
  },
  iconFontLast: {
    fontSize: px2dp(10),
    justifyContent: "flex-end"
  },
  h2: {
    color: "#2e2e2e",
    fontSize: px2dp(20),
    lineHeight: 1.5 * 18
  },

  info: {
    alignItems: "center",
    flexWrap: "wrap",
    flexDirection: "row",
    paddingLeft: 15,
    paddingRight: 15
  },

  avatar: {
    width: px2dp(40),
    height: px2dp(40),
    borderRadius: px2dp(20),
    marginRight: px2dp(15)
  },

  col: {
    flex: 1,
    flexDirection: "column"
  },

  h3: {
    flex: 1,
    overflow: "hidden",
    fontSize: 16,
    fontWeight: "bold"
  },

  tab: {
    paddingTop: 5,
    paddingLeft: 15,
    paddingBottom: 5,
    paddingRight: 15,
    borderRadius: 3
  },

  tag: {
    textAlign: "center",
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "bold"
  },

  span: {
    flex: 1,
    alignItems: "flex-start",
    color: "#2e2e2e",
    fontSize: 15,
    fontWeight: "600"
  },

  right: {
    alignItems: "flex-end"
  },

  top: {
    backgroundColor: "#e74c3c"
  },

  ask: {
    backgroundColor: "#3498db"
  },

  good: {
    backgroundColor: "#e67e22"
  },

  share: {
    backgroundColor: "#1abc9c"
  },

  job: {
    backgroundColor: "#6A8FFF"
  },

  default: {
    backgroundColor: "#e7e7e7"
  }
});

export default HeaderBox;
