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
  FlatList,
  RefreshControl
} from "react-native";
import { queryTopics, parseTopics } from "../config/API_Jobs";
import theme from "../pubilc/theme";
import px2dp from "../utils/px2dp";
import ItemTemplate from "./components/ItemTemplate";
export default class RecruitSceen extends PureComponent {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: (
      <Text
        style={{
          backgroundColor: theme.highLightColor,
          height: px2dp(45),
          width: "100%",
          color: "#fff",
          fontSize: px2dp(20),
          textAlign: "center",
          textAlignVertical: "center"
        }}
      >
        招聘
      </Text>
    ),
    headerStyle: {
      backgroundColor: theme.highLightColor,
      height: px2dp(45)
    }
  });
  constructor(props) {
    super(props);
    this.state = {
      refreshing: true,
      loadedData: false,
      showList: false,
      dataBlob: [],
      data: [],
      page: 1
    };
  }
  componentDidMount() {
    this._isMounted = true;
    const { tab } = this.props;
    if (this._isMounted) {
      this.initData(tab);
    }
  }
  componentWillUnmount() {
    this._isMounted = false;
    // this.props.clean()
  }
  async initData(tab = "job") {
    this.setState({
      refreshing: true
    });
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
      console.log("===-=-=-=", parseTopics(response.data.data));
      this.setState({
        data: parseTopics(response.data.data),
        showList: true
      });
    }
    this.setState({
      refreshing: false
    });
  }
  async moreData(page = 1, tab = "all") {
    if (this.state.data.length > 0) {
      const response = await queryTopics({
        page: page,
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
          data: [...this.state.data, ...parseTopics(response.data.data)]
        });
      }
    }
  }
  onRefresh() {
    const { tab } = this.props;
    this.initData(tab);
  }
  onEndReached(pageSize) {
    const { tab } = this.props;
    const { page } = this.state;
    if (this.state.data.length > 0) {
      let nextPage = page + 1;
      this.setState({
        page: nextPage
      });
      this.moreData(nextPage, tab);
    }
  }
  render() {
    const { tab } = this.props;
    const { navigate } = this.props.navigation;
    console.log("this.state.data", this.state.data);
    if (this.state.showList) {
      return (
        <FlatList
          style={{ width: theme.screenWidth }}
          ref="_flatlist"
          initialNumToRender={10}
          data={this.state.data}
          extraData={this.state}
          keyExtractor={(item, index) => index}
          renderItem={({ item }) => (
            <ItemTemplate navigate={navigate} item={item} />
          )}
          onRefresh={this.onRefresh.bind(this)}
          onEndReached={this.onEndReached.bind(this)} // 如果直接 this.props.query() 会请求两次
          onEndReachedThreshold={0.01} //????骚操作,貌似只有到这里才能打底加载一次
          refreshing={this.state.refreshing}
        />
      );
    } else {
      return <Text />;
    }
  }
}
