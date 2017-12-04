import React, { PureComponent } from "react";
import SearchCard from "./components/SearchCard";
import SeekHome from "./components/SeekHome";
import History from "./components/History";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TextInput,
  Button,
  Image,
  StatusBar,
  FlatList,
  Dimensions,
  TouchableNativeFeedback,
  DeviceEventEmitter,
  TouchableOpacity
} from "react-native";
import theme from "../pubilc/theme";
import px2dp from "../utils/px2dp";
import { parseSearch } from "../config/API_Home";
class Search extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      searchNotes: []
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
      headerRight: <SeekHome />,
      headerStyle: {
        backgroundColor: theme.highLightColor,
        height: px2dp(45)
      }
    };
  };

  componentDidMount() {
    DeviceEventEmitter.addListener("search_notes", payload => {
      if (payload) {
        let searchNotes = JSON.parse(payload);
        if (Object.keys(payload).length > 0) {
          console.log("获取", searchNotes);
          this.setState({
            searchNotes: searchNotes.result
          });
        }
      }
    });
    // this.props.init();
  }

  componentWillUnmount() {
    // this.props.clean()
  }
  _searchResult(data) {
    alert(data);
  }
  _onEndReached = pageSize => {
    const page = pageSize + 1;
    const { content } = this.props;
  };

  render() {
    const { data, page, content, visible = true, loading } = this.props;
    const { navigate } = this.props.navigation;
    const { width } = Dimensions.get("window");
    const { searchNotes } = this.state;
    console.log("searchNotes.length > 0", searchNotes.length);
    return (
      <View style={styles.container}>
        {/* <StatusBar barStyle="light-content" /> */}
        {!searchNotes.length > 0 ? (
          <ScrollView>
            <History />
          </ScrollView>
        ) : (
          <FlatList
            style={{ width: width }}
            data={searchNotes}
            extraData={this.state}
            keyExtractor={(item, index) => index}
            renderItem={({ item }) => (
              <SearchCard navigate={navigate} item={item} />
            )}
            //   onRefresh={() => { this.props.query({ content }) }}
            onEndReached={() => {
              this._onEndReached(page);
            }} // 如果直接 this.props.query() 会请求两次
            onEndReachedThreshold={0.5}
            refreshing={loading}
          />
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

export default Search;
