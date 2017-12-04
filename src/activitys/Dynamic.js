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
  TouchableNativeFeedback,
  TouchableOpacity
} from "react-native";
import theme from "../pubilc/theme";
import px2dp from "../utils/px2dp";
class Dynamic extends PureComponent {
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
    this.state = {};
  }

  render() {
    const { navigate, state } = this.props.navigation;
    const { data = [] } = state.params;
    console.log(state.params)
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        {data.length > 0 ? (
          <FlatList
            style={{ width: theme.screenWidth }}
            data={data}
            extraData={this.state}
            keyExtractor={(item, index) => index}
            renderItem={({ item }) => <Card navigate={navigate} item={item} />}
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

export default Dynamic;
