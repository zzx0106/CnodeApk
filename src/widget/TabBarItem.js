import React, { PureComponent } from "react";
import { Image } from "react-native";
import px2dp from "../utils/px2dp";
export default class TabBarItem extends PureComponent {
  render() {
    let selectedImage = this.props.selectedImage
      ? this.props.selectedImage
      : this.props.normalImage;
    if (this.props.focused) {
      return (
        <Image
          source={selectedImage}
          style={{
            tintColor: this.props.tintColor,
            width: px2dp(30),
            height: px2dp(30),
            marginBottom: px2dp(-5)
          }}
        />
      );
    } else {
      return (
        <Image
          source={this.props.normalImage}
          style={{
            tintColor: this.props.tintColor,
            width: px2dp(25),
            height: px2dp(25),
            marginBottom: px2dp(-5)
          }}
        />
      );
    }
  }
}
