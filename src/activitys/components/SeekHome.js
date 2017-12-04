import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Dimensions,
  Platform,
  ToastAndroid,
  AsyncStorage,
  DeviceEventEmitter,
  TouchableOpacity
} from "react-native";
import px2dp from "../../utils/px2dp";
import { queryUser, queryUserInformation } from "../../config/API_Login";
import { querySearch, parseSearch } from "../../config/API_Home";
import Loding from "./Loding";
const { width } = Dimensions.get("window");
const inputWidth = width - 300; // 减去的宽度分别是 导航栏按钮+margin*2，关闭按钮
const rightWidth = width - px2dp(60);

class SeekHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      visible: false,
      isLoding: false
    };
  }

  _onSearch = async searchname => {
    this.setState({
      isLoding: true
    });
    searchname = searchname.replace(/(^\s*)|(\s*$)/g, "");
    const result = await querySearch({ content: searchname });
    let records = await AsyncStorage.getItem("records");
    if (result.status === 200) {
      DeviceEventEmitter.emit(
        "search_notes",
        JSON.stringify({ result: parseSearch(result.data) })
      );
    } else {
      ToastAndroid.show("查询失败", ToastAndroid.SHORT);
    }
    if (records) {
      let recordsArray = JSON.parse(records).records;
      if (recordsArray.indexOf(searchname) !== -1) {
        return;
      }
      AsyncStorage.setItem(
        "records",
        JSON.stringify({ records: [searchname, ...recordsArray] })
      );
    } else {
      AsyncStorage.setItem(
        "records",
        JSON.stringify({ records: [searchname] })
      );
    }
    this.setState({
      isLoding: false
    });
  };

  render() {
    const height = Platform.OS == "ios" ? 28 : 32;
    return (
      <View style={styles.headerRight}>
        {this.state.isLoding ? <Loding /> : null}
        <View style={[styles.inputView, { height, borderRadius: 3 }]}>
          <Image
            style={styles.headerBtn}
            source={require("../../assets/images/search.png")}
            resizeMode="contain"
          />
          <TextInput
            style={styles.input}
            placeholder="搜索用户"
            value={this.state.text}
            underlineColorAndroid="transparent"
            onChangeText={text => {
              this.setState({ text, visible: true });
            }}
          />
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => {
              this.setState({ text: "", visible: false });
            }}
          >
            {this.state.visible ? (
              <Image
                style={styles.closeImg}
                source={require("../../assets/images/cleanup.png")}
                resizeMode="contain"
              />
            ) : null}
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.headerTouch}
          onPress={() => {
            this._onSearch(this.state.text);
          }}
        >
          <Text style={styles.text}>搜索</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerRight: {
    flex: 1,
    width: rightWidth,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },

  headerTouch: {
    padding: px2dp(15),
    alignItems: "center"
  },

  text: {
    fontSize: px2dp(15),
    textAlign: "center",
    width: px2dp(44),
    fontWeight: "bold",
    color: "#fff",
    marginRight: px2dp(15)
  },

  inputView: {
    flexDirection: "row",
    flex: 1,
    paddingLeft: px2dp(3),
    backgroundColor: "#F9F9F9",
    borderWidth: px2dp(1),
    alignItems: "center",
    borderColor: "#FFFFFF",
    justifyContent: "center"
  },

  input: {
    padding: 0,
    fontSize: px2dp(14),
    flex: 1
  },

  headerBtn: {
    width: px2dp(15),
    height: px2dp(15),
    margin: px2dp(4)
  },

  closeImg: {
    width: px2dp(20),
    height: px2dp(20)
  },

  closeBtn: {
    width: px2dp(20),
    height: px2dp(20),
    margin: 4
  }
});

export default SeekHome;
