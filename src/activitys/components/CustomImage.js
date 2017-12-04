import React, { Component } from "react";
import {
  Image,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  Icon
} from "react-native";
import px2dp from "../../utils/px2dp";
import theme from "../../pubilc/theme";
export default class CustomImage extends Component {
  static defaultProps = {
    defaultSize: {
      height: px2dp(200),
      width: px2dp(200)
    }
  };

  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      size: props.defaultSize,
      isLoaded: false,
      error: false
    };
    this._loadImg(props.uri, props.maxImageWidth);
  }

  _loadImg(uri, maxImageWidth) {
    if (!uri) {
      return;
    }
    const startTime = new Date().getTime();
    Image.getSize(
      uri,
      (w, h) => {
        if (w >= maxImageWidth) {
          h = maxImageWidth / w * h;
          w = maxImageWidth;
        }
        let leftTime = 500 - (new Date().getTime() - startTime);
        if (leftTime > 0) {
          setTimeout(() => {
            this.setState({
              size: {
                width: w,
                height: h
              },
              isLoaded: true
            });
          }, 0);
        } else {
          this.setState({
            size: {
              width: w,
              height: h
            },
            isLoaded: true
          });
        }
      },
      () => {
        this.setState({
          error: true
        });
      }
    );
  }

  render() {
    const { uri, style } = this.props;
    const { size, isLoaded, error } = this.state;

    if (isLoaded) {
      return (
        <View
          style={{
            marginTop: px2dp(5),
            marginBottom: px2dp(5),
            alignItems: "center"
          }}
        >
          <Image source={{ uri }} style={[style, size]} resizeMode="cover" />
        </View>
      );
    } else if (error) {
      return (
        <TouchableOpacity
          onPress={() =>
            this._loadImg(this.props.uri, this.props.maxImageWidth)}
        >
          <Text style={[style, size]}>{<Text>点击重新加载图片</Text>}</Text>
        </TouchableOpacity>
      );
    } else {
      return <Text />;
    }

    // if

    // return (
    //   <Text style={[styles.container, size]}>
    //     {isLoaded ? <Image source={{ uri }} style={[style, size]} /> : null}
    //   </Text>
    // );
  }
}

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: "column",
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(0,0,0,0.05)",
//     borderRadius: 5,
//     margin: 1000
//   },
//   icon: {
//     color: "rgba(0,0,0,0.5)"
//   }
// });
