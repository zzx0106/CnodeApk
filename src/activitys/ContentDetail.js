import React, { PureComponent } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  RefreshControl,
  Button,
  Image,
  StatusBar,
  FlatList,
  Dimensions,
  TouchableOpacity,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
  ScrollView,
  WebView,
  KeyboardAvoidingView
} from "react-native";
import theme from "../pubilc/theme";
import { queryTopic, parseTopic } from "../config/API_Detail";
import HeaderBox from "./components/ContentDetailHeader";
import FooterBox from "./components/ContentDetailFooter";
import px2dp from "../utils/px2dp";
import HtmlView from "./components/HtmlView";
import WriteContent from "./components/WriteContent";
const defaultMaxImageWidth = theme.screenWidth - 30 - 20;
const defaultInputWidth = theme.screenWidth - 40;

export default class ContentDetail extends PureComponent {
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
      //   <TouchableOpacity onPress={() => console.log(navigation.goBack())}>
      //     <Image
      //       style={styles.headerLeft}
      //       source={require("../assets/images/left.png")}
      //       resizeMode="contain"
      //     />
      //   </TouchableOpacity>
      // )
    };
  };
  constructor(props) {
    super(props);
    this.initData = this.initData.bind(this);
    this.state = {
      data: {},
      refreshing: true
    };
  }
  componentDidMount() {
    this._isMounted = true;
    if (this._isMounted) {
      this.initData();
    }
  }
  async initData() {
    const { params } = this.props.navigation.state;
    const { accesstoken } = this.props;
    this.setState({
      refreshing: true
    });
    const response = await queryTopic({ ...params, accesstoken });
    if (
      response.status === 200 &&
      response.data.success &&
      response.data.data
    ) {
      this.setState({
        data: parseTopic(response.data.data)
      });
    }
    this.setState({
      refreshing: false
    });
  }
  componentWillUnmount() {
    this._isMounted = false;
    // this.props.clean()
  }

  render() {
    const { navigate, state } = this.props.navigation;
    const { data, refreshing } = this.state;
    const htmlProps = { html: data.content, styles: htmlStyles };
    const infoProps = { data, navigate };
    console.log("this.state.chatFocus", this.state.chatFocus);
    if (data.title) {
      return (
        <View style={styles.container}>
          <ScrollView
            style={styles.scrollView}
            ref="_scrollView"
            refreshControl={
              <RefreshControl
                onRefresh={() => {
                  this.initData;
                }}
                refreshing={refreshing}
              />
            }
          >
            <HeaderBox {...infoProps} />
            <View style={styles.connect}>
              <HtmlView {...htmlProps} />
              <FlatList
                style={{ width: theme.screenWidth }}
                data={data.replies}
                extraData={this.state}
                keyExtractor={(item, index) => index}
                renderItem={({ item }) => (
                  <FooterBox navigate={navigate} item={item} />
                )}
              />
            </View>
          </ScrollView>
          <WriteContent data={data} />
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <ScrollView
            style={styles.scrollView}
            ref="_scrollView"
            refreshControl={
              <RefreshControl
                onRefresh={() => {
                  this.initData;
                }}
                refreshing={refreshing}
              />
            }
          />
        </View>
      );
    }
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 44,
    backgroundColor: "#FFFFFF"
  },
  webview: {
    flex: 1,
    height: 300
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#FFFFFF"
  },

  headerLeft: {
    width: px2dp(23),
    marginLeft: px2dp(18)
  },

  connect: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#F0F0F0"
  },

  reply: {
    flexDirection: "row",
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#F0F0F0"
  },

  total: {
    color: "#42b983",
    fontWeight: "bold"
  },

  inputView: {},

  contentTouch: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center"
  },

  contentImg: {
    width: px2dp(24),
    height: px2dp(24)
  },

  content_view: {
    width: theme.screenWidth,
    minHeight: px2dp(40),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: px2dp(1),
    borderTopColor: "#F9F9F9"
  },
  content_box: {
    width: theme.screenWidth,
    height: px2dp(40),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: px2dp(1),
    borderTopColor: "#F9F9F9"
  },
  content_box_left: {
    flex: 1,
    flexDirection: "row",
    borderRadius: px2dp(30),
    height: px2dp(30),
    paddingLeft: px2dp(15),
    paddingRight: px2dp(15),
    marginLeft: px2dp(20),
    marginRight: px2dp(20),
    backgroundColor: "#F9F9F9",
    alignItems: "center"
  },
  content_view_left: {
    flex: 1,
    flexDirection: "row",
    borderRadius: px2dp(30),
    paddingLeft: px2dp(15),
    paddingRight: px2dp(15),
    marginLeft: px2dp(20),
    marginRight: px2dp(20),
    backgroundColor: "#F9F9F9",
    alignItems: "center"
  },
  content_box_left_icon: {
    width: px2dp(15),
    height: px2dp(15),
    marginRight: px2dp(5)
  },
  content_box_left_content: {
    fontSize: px2dp(13)
    // alignItems: "center",
    // justifyContent: "flex-start"
  },
  content_box_right: {
    flexDirection: "row",
    width: px2dp(150),
    height: px2dp(30),
    alignItems: "center",
    justifyContent: "space-around"
  },
  content_box_right_icon: {
    width: px2dp(22),
    height: px2dp(22),
    alignItems: "center"
  },
  content_box_right_icon_tag: {
    position: "absolute",
    minWidth: px2dp(15),
    minHeight: px2dp(10),
    backgroundColor: theme.highLightColor,
    color: "#ffffff",
    right: -5,
    top: -2,
    borderRadius: px2dp(8),
    fontSize: px2dp(8),
    textAlign: "center"
  },
  content_view_right: {
    flexDirection: "row",
    width: px2dp(70),
    height: px2dp(30),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "red"
  },
  input: {
    flex: 1,
    minHeight: px2dp(30),
    borderRadius: px2dp(30),
    paddingRight: px2dp(15),
    paddingTop: px2dp(0),
    paddingBottom: px2dp(0),
    marginLeft: px2dp(20),
    fontSize: px2dp(13),
    backgroundColor: "#f9f9f9"
  },

  send: {
    width: px2dp(50),
    alignItems: "center",
    fontSize: px2dp(13)
  }
});


const fontSize = px2dp(14);
const titleMargin = px2dp(5);
const width = theme.screenWidth;
const htmlStyles = StyleSheet.create({
  markdownText: {
    backgroundColor: "blue",
    width: px2dp(20)
  },
  p: {
    lineHeight: fontSize * 1.4,
    fontSize: fontSize,
    color: "rgba(0,0,0,0.8)"
  },
  pwrapper: {
    marginTop: px2dp(5),
    marginBottom: px2dp(5)
  },

  a: {
    color: "#3498DB",
    fontSize: fontSize,
    paddingLeft: px2dp(4),
    paddingRight: px2dp(4),
    marginRight: px2dp(10),
    marginLeft: px2dp(10)
  },
  h1: {
    fontSize: fontSize * 1.6,
    fontWeight: "bold",
    color: "rgba(0,0,0,0.8)"
  },
  h1wrapper: {
    marginTop: titleMargin,
    marginBottom: titleMargin
  },
  h2: {
    fontSize: fontSize * 1.5,
    fontWeight: "bold",
    color: "rgba(0,0,0,0.85)"
  },
  h2wrapper: {
    marginBottom: titleMargin,
    marginTop: titleMargin
  },
  h3: {
    fontWeight: "bold",
    fontSize: fontSize * 1.4,
    color: "rgba(0,0,0,0.8)"
  },
  h3wrapper: {
    marginBottom: titleMargin - 2,
    marginTop: titleMargin - 2
  },
  h4: {
    fontSize: fontSize * 1.3,
    color: "rgba(0,0,0,0.7)",
    fontWeight: "bold"
  },
  h4wrapper: {
    marginBottom: titleMargin - 2,
    marginTop: titleMargin - 2
  },
  h5: {
    fontSize: fontSize * 1.2,
    color: "rgba(0,0,0,0.7)",
    fontWeight: "bold"
  },
  h5wrapper: {
    marginBottom: titleMargin - 3,
    marginTop: titleMargin - 3
  },
  h6: {
    fontSize: fontSize * 1.1,
    color: "rgba(0,0,0,0.7)",
    fontWeight: "bold"
  },
  h6wrapper: {
    marginBottom: titleMargin - 3,
    marginTop: titleMargin - 3
  },
  li: {
    fontSize: fontSize * 0.9,
    color: "rgba(0,0,0,0.7)"
  },
  liwrapper: {
    paddingLeft: px2dp(20),
    marginBottom: px2dp(10)
  },
  strong: {
    fontWeight: "bold"
  },
  em: {
    fontStyle: "italic"
  },
  codeScrollView: {
    backgroundColor: "#333",
    flexDirection: "column",
    marginBottom: px2dp(15)
  },
  codeRow: {
    flex: 1,
    flexDirection: "row",
    height: px2dp(25),
    alignItems: "center"
  },
  codeFirstRow: {
    paddingTop: px2dp(20),
    height: px2dp(25 + 20)
  },
  codeLastRow: {
    paddingBottom: px2dp(20),
    height: px2dp(25 + 20)
  },
  codeFirstAndLastRow: {
    paddingBottom: px2dp(20),
    height: px2dp(25 + 40),
    paddingTop: px2dp(20)
  },
  lineNum: {
    width: px2dp(55),
    color: "rgba(255,255,255,0.5)"
  },
  lineNumWrapper: {
    width: px2dp(55),
    height: px2dp(25),
    backgroundColor: "rgba(0,0,0,0.1)",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: px2dp(20)
  },
  codeWrapper: {
    flexDirection: "column"
  },
  codeLineWrapper: {
    height: px2dp(25),
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: px2dp(20),
    paddingRight: px2dp(20)
  },
  blockquotewrapper: {
    paddingLeft: px2dp(20),
    borderLeftColor: "#3498DB",
    borderLeftWidth: px2dp(3)
  },
  img: {
    width: 0,
    height: 0,
    // resizeMode: Image.resizeMode.contain,
    // margin: 10
  },
  defaultImg: {
    height: theme.screenWidth - px2dp(50),
    width: theme.screenWidth - px2dp(50),
    resizeMode: Image.resizeMode.cover,
    borderRadius: px2dp(5),
    margin: px2dp(10)
  }
});
