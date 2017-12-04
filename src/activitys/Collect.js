import React, { PureComponent } from "react";
import Tip from "./components/Tip";
import Card from "./components/Card";
import {
  StyleSheet,
  View,
  Text,
  Button,
  Image,
  StatusBar,
  FlatList,
  Dimensions,
  BackHandler,
  TouchableNativeFeedback,
  ToastAndroid,
  TouchableOpacity
} from "react-native";
import theme from "../pubilc/theme";
import px2dp from "../utils/px2dp";
import { queryCollects } from "../config/API_Collect";

class Collect extends PureComponent {
  static navigationOptions = ({ navigation }) => {
    const { state, setParams } = navigation;
    const { params } = navigation.state;
    return {
      headerTitleStyle: {
        color: "white",
        marginLeft: px2dp(0)
      },
      headerStyle: {
        backgroundColor: theme.highLightColor,
        height: px2dp(45)
      },
      // headerLeft: (
      //   <TouchableNativeFeedback onPress={() => navigation.goBack(null)}>
      //     <Image
      //       style={styles.headerLeft}
      //       source={require("../assets/images/left.png")}
      //       resizeMode="contain"
      //     />
      //   </TouchableNativeFeedback>
      // )
    };
  };

  constructor(props) {
    super(props);
    this.state = { collects: [] };
    this.queryCollect = this.queryCollect.bind(this);
  }

  componentDidMount() {
    const { params } = this.props.navigation.state;
    this.queryCollect(params);
  }
  async queryCollect(params) {
    if (params.user) {
      this.setState({ loading: true });
      const collectList = await queryCollects(params);
      console.log("collectList", collectList);
      if (collectList.status === 200 && collectList.data.success) {
        this.setState({
          collects: collectList.data.data
        });
      } else {
        ToastAndroid.show("获取收藏列表失败", ToastAndroid.SHORT);
      }
    } else {
      ToastAndroid.show("params中的user參數不能为空", ToastAndroid.SHORT);
    }
    this.setState({ loading: false });
  }

  render() {
    // const { collects, loading } = this.props;
    const { navigate } = this.props.navigation;
    const { params } = this.props.navigation.state;
    const { collects } = this.state;

    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        {collects.length > 0 ? (
          <FlatList
            style={{ width: theme.screenWidth }}
            data={collects}
            extraData={this.state}
            keyExtractor={(item, index) => index}
            renderItem={({ item }) => <Card navigate={navigate} item={item} />}
            onRefresh={() => {
              this.queryCollect(params);
            }}
            refreshing={this.state.loading}
          />
        ) : (
          <Tip message={{ text: "暂无消息" }} />
        )}
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
  }
});

export default Collect;
