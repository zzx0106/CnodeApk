import React, { Component } from "react";
import { View, Text, ActivityIndicator, Modal, StyleSheet } from "react-native";

import theme from "../../pubilc/theme";
import px2dp from "../../utils/px2dp";
export default class Loading extends Component {
  render() {
    return (
      <Modal transparent={true} onRequestClose={() => this.onRequestClose()}>
        <View style={styles.loadingBox}>
          <ActivityIndicator
            animating={true}
            color={theme.highLightColor}
            style={{
              width: px2dp(55),
              height: px2dp(55)
            }}
            size="large"
          />
        </View>
      </Modal>
    );
  }
}
const styles = StyleSheet.create({
  loadingBox: {
    // Loading居中
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)" // 半透明
  }
});
