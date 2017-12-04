import React, { PureComponent } from "react";
import Seek from "./Seek";
import Tip from "./components/Tip";
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
  DeviceEventEmitter,
  TouchableNativeFeedback,
  TouchableOpacity
} from "react-native";
import px2dp from "../utils/px2dp";
import theme from "../pubilc/theme";
import { moment } from "../utils/tool";
class AddFriend extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      searchUser: [],
      ifHasUser: 1
    };
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
      headerRight: <Seek />,
      headerStyle: {
        backgroundColor: theme.highLightColor,
        height: px2dp(45)
      }
    };
  };
  componentDidMount() {
    DeviceEventEmitter.addListener("search_user", payload => {
      if (payload) {
        let searchUser = JSON.parse(payload);
        if (Object.keys(payload).length > 0) {
          console.log("获取", payload);
          this.setState({
            searchUser,
            ifHasUser: 3
          });
        } else {
          this.setState({
            ifHasUser: 2
          });
        }
      }
    });
  }
  componentWillUnmount() {}

  render() {
    const { navigate } = this.props.navigation;
    const { searchUser } = this.state;
    return (
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            onRefresh={() => {
              this.props.information({ user: info.name });
            }}
            refreshing={false}
          />
        }
      >
        {/* <StatusBar barStyle="light-content" /> */}
        {Object.keys(searchUser).length > 0 ? (
          <View style={styles.rowList}>
            <TouchableOpacity
              onPress={() => {
                navigate("UserInformation", { user: searchUser });
              }}
            >
              <View style={styles.row}>
                <Image
                  style={styles.rowImg}
                  source={{ uri: searchUser.avatar_url }}
                />
                <View style={styles.rowInner}>
                  <View style={{ flexDirection: "row" }}>
                    <Text style={[styles.rowText]}>用户名: </Text>
                    <Text style={[styles.rowText, { color: "#3F429E" }]}>
                      {searchUser.loginname}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <Text style={[styles.rowText]}>GitHub: </Text>
                    <Text style={[styles.rowText, { color: "#3F429E" }]}>
                      {searchUser.githubUsername}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <Text style={[styles.rowText]}>创建于: </Text>
                    <Text style={[styles.rowText, { color: "#3F429E" }]}>
                      {moment(searchUser.create_at)
                        .startOf("minute")
                        .fromNow()}
                    </Text>
                  </View>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text style={[styles.rowText, styles.score]}>积分: </Text>
                  <Text style={[styles.rowText, styles.score]}>
                    {searchUser.score}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        ) : null}
        {this.state.ifHasUser === 1 ? (
          <Tip message={{ text: "暂无数据" }} />
        ) : null}
        {this.state.ifHasUser === 2 ? (
          <Tip message={{ text: "该用户不存在" }} />
        ) : null}
      </ScrollView>
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
  rowList: {
    margin: px2dp(10),
    borderRadius: px2dp(10),
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowColor: "rgba(0,0,0,0.3)",
    //注意：这一句是可以让安卓拥有灰色阴影
    elevation: 3
  },

  row: {
    paddingLeft: px2dp(27),
    paddingRight: px2dp(27),
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#FFFFFF"
  },

  rowImg: {
    width: px2dp(55),
    height: px2dp(55),
    borderRadius: px2dp(18),
    marginRight: px2dp(20)
  },

  rowInner: {
    flex: 1,
    paddingTop: px2dp(20),
    paddingBottom: px2dp(20),
    borderBottomWidth: px2dp(0.5),
    borderColor: "#F0F0F0"
  },

  rowText: {
    fontSize: px2dp(14),
    fontWeight: "400"
  },
  score: {
    color: "#f4ea2a",
    fontSize: px2dp(18)
  }
});

export default AddFriend;
