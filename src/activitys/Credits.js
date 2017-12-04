import React, { PureComponent } from "react";
import {
  StyleSheet,
  View,
  Text,
  Button,
  Image,
  StatusBar,
  FlatList,
  Dimensions,
  TouchableNativeFeedback,
  TouchableOpacity
} from "react-native";
import theme from "../pubilc/theme";
import px2dp from "../utils/px2dp";
class Credits extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static navigationOptions = ({ navigation }) => {
    const { state, setParams } = navigation;
    return {
      headerTitle: "论坛积分",
      headerTitleStyle: {
        color: "white",
        marginLeft: px2dp(0)
      },
      headerStyle: {
        backgroundColor: theme.highLightColor,
        height: px2dp(45),
        color: "#fff"
      }
      //   headerLeft: (
      //     <TouchableNativeFeedback onPress={() => navigation.goBack(null)}>
      //       <Image
      //         style={styles.headerLeft}
      //         source={require("../assets/images/left.png")}
      //         resizeMode="contain"
      //       />
      //     </TouchableNativeFeedback>
      //   )
    };
  };

  render() {
    const { data } = this.props.navigation.state.params;

    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.scoreView}>
          <Text style={styles.scoreSub}>当前积分</Text>
          <View style={styles.TextView}>
            <Text style={styles.scoreText}>{data.score}</Text>
          </View>
        </View>
        <View style={styles.subTitle}>
          <Text style={styles.subText}>如何获取积分?</Text>
        </View>
        <View style={styles.rowList}>
          <View style={styles.row}>
            <Image
              style={styles.rowImg}
              source={require("../assets/images/my_close.png")}
              resizeMode="contain"
            />
            <View style={styles.rowInner}>
              <View style={styles.left}>
                <Text style={styles.rowText}>登录论坛</Text>
                <View style={styles.subView}>
                  <Text style={styles.sub}>每天一次</Text>
                </View>
              </View>
              <Text style={styles.span}>+1</Text>
            </View>
          </View>
          <View style={styles.row}>
            <Image
              style={styles.rowImg}
              source={require("../assets/images/my_new.png")}
              resizeMode="contain"
            />
            <View style={styles.rowInner}>
              <View style={styles.left}>
                <Text style={styles.rowText}>发布话题</Text>
                <View style={styles.subView}>
                  <Text style={styles.sub}>每天最多5次</Text>
                </View>
              </View>
              <Text style={styles.span}>+10</Text>
            </View>
          </View>
          <View style={styles.row}>
            <Image
              style={styles.rowImg}
              source={require("../assets/images/interactive_close.png")}
              resizeMode="contain"
            />
            <View style={styles.rowInner}>
              <View style={styles.left}>
                <Text style={styles.rowText}>发表评论</Text>
                <View style={styles.subView}>
                  <Text style={styles.sub}>每天最多10次</Text>
                </View>
              </View>
              <Text style={styles.span}>+5</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
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
  scoreView: {
    padding: 30,
    backgroundColor: "#FFF",
    justifyContent: "center"
  },

  scoreImg: {
    marginTop: 15,
    width: 30,
    height: 30
  },

  scoreSub: {
    color: theme.linkColor,
    fontSize: 14
  },

  TextView: {
    marginTop: 15
  },

  scoreText: {
    color: "#F5DE19",
    fontSize: 50
  },

  subTitle: {
    paddingTop: 15,
    paddingLeft: 15
  },

  subText: {
    fontSize: 14,
    color: "#999"
  },

  rowList: {
    marginTop: 15
  },

  subView: {
    marginTop: 8
  },

  sub: {
    color: "#999",
    fontSize: 12
  },

  left: {
    flex: 1
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

  rowInner: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 20,
    flexDirection: "row",
    alignItems: "center",
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
    color: theme.highLightColor,
    fontSize: 16
  }
});

export default Credits;
