import React, { PureComponent } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  Image,
  StatusBar,
  FlatList,
  Dimensions,
  TouchableOpacity,
  TouchableNativeFeedback,
  ToastAndroid,
  AsyncStorage,
  DeviceEventEmitter,
  Modal,
  KeyboardAvoidingView
} from "react-native";
import BarcodeScanner, { FocusMode } from "react-native-barcode-scanner-google";
import { BlurView, VibrancyView } from "react-native-blur";
import theme from "../pubilc/theme";
import px2dp from "../utils/px2dp";
import Loding from "./components/Loding";
import { postToken } from "../config/API_Login";
export default class Login extends PureComponent {
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
    this.state = {
      data: {},
      accesstoken: "",
      show2233zindex: 100,
      isLoding: false,
      visible: false,
      searchNumber: 0
    };
    this.hiden2233 = this.hiden2233.bind(this);
    this.show2233 = this.show2233.bind(this);
    this.onLogin = this.onLogin.bind(this);
  }
  hiden2233() {
    this.setState({
      show2233zindex: -this.state.show2233zindex
    });
  }
  show2233() {
    this.setState({
      show2233zindex: -this.state.show2233zindex
    });
  }
  componentDidMount() {}
  async onLogin(accesstoken) {
    if (!accesstoken) {
      ToastAndroid.show("请输入accesstoken", ToastAndroid.SHORT);
      return;
    }
    this.setState({
      isLoding: true
    });
    this.state.textInput1.blur(); //让input失去焦点
    const response = await postToken({ accesstoken });
    if (response.status === 200 && response.data.success && response.data) {
      console.log("用户数据", response.data);
      AsyncStorage.setItem("userinfo", JSON.stringify(response.data));
      AsyncStorage.setItem("accesstoken", accesstoken);
      // this.setState({
      //   data: response.data
      // });
      ToastAndroid.show("登录成功", ToastAndroid.SHORT);
      console.log("发送一次广播");
      DeviceEventEmitter.emit("loginsuccess", "");
      this.props.navigation.goBack();
    } else {
      ToastAndroid.show("登录失败_(:з」∠✿)_", ToastAndroid.SHORT);
    }
    this.setState({ isLoding: false, searchNumber: 0 });
  }
  render() {
    const { loading, navigation } = this.props;
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        {this.state.isLoding ? <Loding /> : null}
        {/* <StatusBar barStyle="light-content" /> */}
        <View style={styles.logoView}>
          <View style={styles.logo22Box}>
            <Image
              style={[styles.logo22, { zIndex: this.state.show2233zindex }]}
              source={require("../assets/images/ic_22.png")}
              resizeMode="contain"
            />
            <Image
              style={[styles.logo22, { zIndex: -this.state.show2233zindex }]}
              source={require("../assets/images/ic_22_hide.png")}
              resizeMode="contain"
            />
          </View>
          <View style={styles.logoBox}>
            <Image
              style={styles.logo}
              source={require("../assets/images/logo.png")}
              resizeMode="contain"
            />
            <Text style={styles.logoName}>社区</Text>
          </View>
          <View style={styles.logo33Box}>
            <Image
              style={[styles.logo33, { zIndex: this.state.show2233zindex }]}
              source={require("../assets/images/ic_33.png")}
              resizeMode="contain"
            />
            <Image
              style={[styles.logo33, { zIndex: -this.state.show2233zindex }]}
              source={require("../assets/images/ic_33_hide.png")}
              resizeMode="contain"
            />
          </View>
        </View>
        <View style={styles.inputView}>
          <KeyboardAvoidingView>
            <TextInput
              ref={e => this.setState({ textInput1: e })}
              style={styles.input}
              value={this.state.accesstoken}
              secureTextEntry={true}
              blurOnSubmit={true} //提交时失去焦点
              placeholder="输入 Access Token"
              underlineColorAndroid="transparent"
              onFocus={() => this.hiden2233()}
              onBlur={() => this.show2233()}
              onChangeText={accesstoken => {
                this.setState({ accesstoken });
              }}
            />
          </KeyboardAvoidingView>
          <TouchableNativeFeedback
            onPress={() => {
              console.log("跳转的干活");
              // navigate("QRPager");
              this.setState({
                visible: true //关闭窗口
              });
            }}
          >
            <Image
              style={styles.scan}
              source={require("../assets/images/scan.png")}
            />
          </TouchableNativeFeedback>
        </View>
        <TouchableNativeFeedback
          onPress={() => {
            this.onLogin(this.state.accesstoken);
          }}
        >
          <View style={styles.loginBtn}>
            <Text style={styles.login}>登录</Text>
          </View>
        </TouchableNativeFeedback>
        <Modal
          style={{ marginTop: px2dp(100) }}
          animationType={"slide"}
          transparent={true}
          visible={this.state.visible}
          onRequestClose={() => null} //修复安卓modal的告警
        >
          <View style={styles.NoteBox}>
            <BarcodeScanner
              style={{
                width: theme.screenWidth,
                height: theme.screenHeight,
                backgroundColor: "#FFF"
              }}
              focusMode={FocusMode.AUTO} //聚焦方式(自动)
              onBarcodeRead={({ data, type }) => {
                // handle your scanned barcodes here!
                // as an example, we show an alert:
                if (data && this.state.searchNumber < 1) {
                  this.setState({
                    searchNumber: 1
                  });
                  this.onLogin(data);
                }
                // Alert.alert(`Barcode '${data}' of type '${type}' was scanned.`);
              }}
              onException={exceptionKey => {
                // check instructions on Github for a more detailed overview of these exceptions.
                switch (exceptionKey) {
                  case Exception.NO_PLAY_SERVICES:
                    alert("需要更新Google Play服务");
                    break;
                  // tell the user they need to update Google Play Services
                  case Exception.LOW_STORAGE:
                    alert("没有足够的存储空间");
                    break;
                  // tell the user their device doesn't have enough storage to fit the barcode scanning magic
                  case Exception.NOT_OPERATIONAL:
                    alert(" Google的条形码控件正在下载，但尚未运作");
                    break;
                  // Google's barcode magic is being downloaded, but is not yet operational.
                  default:
                    break;
                }
              }}
            />
            <View style={styles.btnBackground}>
              <TouchableNativeFeedback
                onPress={() =>
                  this.setState({
                    visible: false
                  })}
              >
                <View style={{ flexDirection: "column" }}>
                  <View style={styles.btnBox}>
                    <Image
                      style={styles.btn}
                      source={require("../assets/images/close.png")}
                    />
                  </View>

                  <Text style={styles.btnText}>关闭</Text>
                </View>
              </TouchableNativeFeedback>
              <TouchableNativeFeedback
                onPress={() =>
                  this.setState({
                    visible: false
                  })}
              >
                <View style={{ flexDirection: "column" }}>
                  <View style={styles.btnBox}>
                    <Image
                      style={styles.btn}
                      source={require("../assets/images/flashlight.png")}
                    />
                  </View>

                  <Text style={styles.btnText}>电筒</Text>
                </View>
              </TouchableNativeFeedback>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF"
  },
  headerLeft: {
    width: px2dp(23),
    marginLeft: px2dp(18)
  },
  bgImageWrapper: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },

  bgImage: {
    flex: 1,
    resizeMode: "stretch"
  },

  logoView: {
    height: px2dp(130),
    margin: px2dp(15),
    flexDirection: "row",
    marginBottom: 0,
    borderRadius: px2dp(5),
    backgroundColor: "#f0f0f0",
    justifyContent: "space-between"
  },
  logoBox: {
    flex: 1,
    height: px2dp(100)
  },
  logo: {
    width: "100%",
    height: px2dp(70)
  },
  logoName: {
    fontSize: px2dp(25),
    textAlign: "center",
    textAlignVertical: "center"
  },
  logo22Box: {
    width: px2dp(120),
    flexDirection: "column",
    alignItems: "flex-end",
    justifyContent: "flex-end"
  },
  logo33Box: {
    flexDirection: "column",
    width: px2dp(120),
    alignItems: "flex-end",
    justifyContent: "flex-end"
  },
  logo22: {
    width: px2dp(124),
    height: px2dp(112),
    position: "absolute"
  },
  logo33: {
    width: px2dp(115),
    height: px2dp(120),
    position: "absolute"
  },
  inputView: {
    height: px2dp(44),
    marginLeft: px2dp(15),
    marginRight: px2dp(15),
    marginBottom: 0,
    borderRadius: px2dp(5),
    borderWidth: px2dp(1),
    borderColor: "#FFFFFF",
    justifyContent: "center",
    backgroundColor: "#F8F8F8"
  },

  input: {
    fontSize: px2dp(14),
    paddingLeft: px2dp(15),
    paddingRight: px2dp(15)
  },
  scan: {
    position: "absolute",
    width: px2dp(20),
    height: px2dp(20),
    right: px2dp(10),
    zIndex: 100
  },
  loginBtn: {
    padding: px2dp(10),
    margin: px2dp(15),
    borderRadius: px2dp(5),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.highLightColor,
    shadowColor: "#000",
    shadowOffset: {
      width: px2dp(1),
      height: px2dp(3)
    },
    shadowOpacity: px2dp(0.4),
    elevation: px2dp(3)
  },

  login: {
    color: "#FFF",
    fontSize: px2dp(16),
    fontWeight: "bold"
  },
  NoteBox: {
    width: "100%",
    height: "100%",
    // alignItems: "center",
    // justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  },
  btnBackground: {
    position: "absolute",
    bottom: px2dp(0),
    width: "100%",
    height: px2dp(200),
    backgroundColor: "rgba(0,0,0,0.2)",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: px2dp(50)
  },
  btnBox: {
    width: px2dp(80),
    height: px2dp(80),
    borderWidth: px2dp(1),
    borderColor: "#fff",
    borderRadius: px2dp(70),
    alignItems: "center",
    justifyContent: "center"
  },
  btn: {
    width: px2dp(40),
    height: px2dp(40)
  },
  btnText: {
    fontSize: px2dp(15),
    color: "#fff",
    textAlign: "center",
    textAlignVertical: "center",
    marginTop: px2dp(8)
  }
});
