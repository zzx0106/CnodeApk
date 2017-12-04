import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  FlatList,
  Dimensions,
  AsyncStorage,
  DeviceEventEmitter,
  TouchableOpacity
} from "react-native";
import { querySearch, parseSearch } from "../../config/API_Home";
import Loding from "./Loding";
const { height } = Dimensions.get("window");

class History extends Component {
  constructor(props) {
    super(props);
    this.state = {
      records: [],
      isLoding: false
    };
  }

  async componentDidMount() {
    console.log("lodinginginging...........");
    const records = await AsyncStorage.getItem("records");
    if (records) {
      this.setState({
        records: JSON.parse(records).records
      });
    }
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

  _onDelet = async index => {
    let records = await AsyncStorage.getItem("records");
    if (records) {
      let new_records = JSON.parse(records).records.filter(
        (item, _index) => _index !== index
      );
      console.log("new_", new_records);
      this.setState({
        records: new_records
      });
      AsyncStorage.setItem("records", JSON.stringify({ records: new_records }));
    }
  };

  render() {
    const hosts = [
      "NodeJs",
      "Web",
      "ReactJs",
      "Vuejs",
      "Mysql",
      "JavaScript",
      "Express",
      "ES6"
    ];
    const { visible, loading } = this.props;
    const { records } = this.state;
    return (
      <View style={styles.container}>
        {this.state.isLoding ? <Loding /> : null}
        <View style={styles.hots}>
          <View style={styles.titleView}>
            <Text style={styles.title}>热门搜索</Text>
          </View>
          <View style={styles.hotsRow}>
            {hosts.map((host, index) => (
              <TouchableOpacity
                key={index}
                style={styles.hotsBtn}
                onPress={() => {
                  this._onSearch(host);
                }}
              >
                <Text style={styles.hotsText}>{host}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        {records.length > 0 ? (
          <View style={styles.records}>
            <View style={styles.titleView}>
              <Text style={styles.title}>搜索记录</Text>
            </View>
            {records.map((record, index) => (
              <TouchableOpacity
                key={index}
                style={styles.recordRow}
                onPress={() => {
                  this._onSearch(record);
                }}
              >
                <View style={styles.left}>
                  <Image
                    style={styles.icon}
                    source={require("../../assets/images/time.png")}
                    resizeMode="contain"
                  />
                  <Text style={styles.recordText}>{record}</Text>
                </View>
                <TouchableOpacity
                  key={index}
                  style={styles.delet}
                  onPress={() => {
                    this._onDelet(index);
                  }}
                >
                  <Image
                    style={styles.icon}
                    source={require("../../assets/images/cleanup.png")}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        ) : null}
      </View>
    );
  }
}

function mapStateToProps(state) {
  const { records, loading } = state.search;
  return { records, loading };
}

function mapDispatchToProps(dispatch) {
  return {
    query(params) {
      dispatch({
        type: "search/query",
        payload: params
      });
    },
    delet(params) {
      dispatch({
        type: "search/records",
        payload: params
      });
    }
  };
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF"
  },

  hots: {
    marginLeft: 15,
    marginTop: 15
  },

  titleView: {
    marginBottom: 15
  },

  title: {
    color: "#999999",
    fontSize: 12
  },

  hotsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between"
  },

  hotsBtn: {
    paddingTop: 5,
    paddingBottom: 5,
    paddingRight: 12,
    paddingLeft: 12,
    borderRadius: 3,
    marginRight: 15,
    marginBottom: 15,
    backgroundColor: "#eeeeee"
  },

  hotsText: {
    color: "#2e2e2e"
  },

  records: {
    marginLeft: 15,
    marginRight: 15
  },

  recordRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 0.5,
    borderColor: "#eee",
    paddingTop: 15,
    paddingBottom: 15
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },

  icon: {
    width: 20,
    height: 20,
    marginLeft: 6,
    marginRight: 12
  },

  recordText: {
    fontSize: 14
  }
});

export default History;
