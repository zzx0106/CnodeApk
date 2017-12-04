import React, { Component } from "react";
import { AppRegistry, StyleSheet, Text, View } from "react-native";
import BarcodeScanner, { FocusMode } from "react-native-barcode-scanner-google";
import px2dp from "../utils/px2dp";
import theme from "../pubilc/theme";

export default class QRPager extends Component {
  render() {
    return (
      <View style={{ flex: 1, height: "50%", backgroundColor: "red" }}>
        <BarcodeScanner
          style={{
            width: theme.screenWidth / 2,
            height: theme.screenWidth / 2,
            justifyContent: "center",
            alignItems: "center"
          }}
          focusMode={FocusMode.AUTO} //聚焦方式(自动)
          onBarcodeRead={({ data, type }) => {
            // handle your scanned barcodes here!
            // as an example, we show an alert:
            console.log(`Barcode '${data}' of type '${type}' was scanned.`);
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
        <Text style={{ position: "absolute", top: px2dp(0), left: px2dp(50) }}>
          将二维码对准屏幕
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({});
