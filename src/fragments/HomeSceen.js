import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ListView,
  Image,
  StatusBar,
  BackHandler,
  ToastAndroid,
  FlatList
} from "react-native";
import theme from "../pubilc/theme";
import ScrollableTabView, {
  DefaultTabBar
} from "react-native-scrollable-tab-view";
import HomeTabItem from "./components/HomeTabItem";
import { queryTopics, parseTopics } from "../config/API_Home";
import px2dp from "../utils/px2dp";
export default class HomeScene extends PureComponent {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: (
      <TouchableOpacity
        style={styles.searchBar}
        onPress={() => {
          navigation.navigate("Search");
        }}
      >
        <Image
          source={require("../assets/images/search.png")}
          style={styles.searchIcon}
        />
        <Text
          style={{
            color: "#ccc",
            height: px2dp(18)
          }}
        >
          搜搜看有什么好东西
        </Text>
      </TouchableOpacity>
    ),
    headerLeft: (
      <Image
        resizeMode="contain"
        source={require("../assets/images/cnode.png")}
        style={styles.headerLeft}
      />
    ),
    headerStyle: {
      backgroundColor: theme.highLightColor,
      height: px2dp(45)
    }
  });
  constructor(props) {
    super(props);
    this.handleBack = this.handleBack.bind(this);
    this.state = {
      isShow: false,
      firstClick: 0 //双击两次退出
    };
  }
  componentDidMount() {
    this.initData();
    BackHandler.addEventListener("hardwareBackPress", this.handleBack);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBack);
  }
  handleBack() {
    var navigator = this.navigator;
    console.log(this.state);
    if (navigator && navigator.getCurrentRoutes().length > 1) {
      navigator.pop();
      return true;
    } else {
      var timestamp = new Date().valueOf();
      if (timestamp - this.state.firstClick > 2000) {
        this.setState({
          firstClick: timestamp
        });
        ToastAndroid.show("再按一次退出", ToastAndroid.SHORT);
        return true;
      } else {
        return false;
      }
    }
  }
  async initData(tab = "all") {
    // alert(tab)
    const response = await queryTopics({
      page: 1,
      tab: tab,
      limit: 20,
      mdrender: true
    });
    if (
      response.status === 200 &&
      response.data.success &&
      response.data.data.length > 0
    ) {
      this.setState({
        data: parseTopics(response.data.data),
        isShow: true
      });
    }
  }
  render() {
    let titles = ["推荐", "精品", "分享", "问答", "测试"];
    let types = ["all", "good", "share", "ask", "dev"];
    if (this.state.isShow) {
      return (
        <ScrollableTabView
          style={styles.container}
          tabBarBackgroundColor="white"
          tabBarActiveTextColor="#FE566D"
          tabBarInactiveTextColor="#555555"
          tabBarTextStyle={styles.tabBarText}
          tabBarUnderlineStyle={styles.tabBarUnderline}
          renderTabBar={() => <DefaultTabBar />}
        >
          {titles.map((item, index) => (
            <HomeTabItem
              tabLabel={item}
              key={index}
              tab={types[index]}
              navigation={this.props.navigation}
            />
          ))}
        </ScrollableTabView>
      );
    } else {
      return <Text />;
    }
  }
}

const styles = StyleSheet.create({
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
  }
});
