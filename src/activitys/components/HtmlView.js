import React from "react";
import { View, Linking, WebView, StyleSheet, Image } from "react-native";
// import HTMLView from "react-native-htmlview";
import HTMLView from "react-native-html-render";
import CustomImage from "./CustomImage";
import theme from "../../pubilc/theme";
import px2dp from "../../utils/px2dp";
const regs = {
  http: {
    topic: /^https?:\/\/cnodejs\.org\/topic\/\w*/,
    user: /^https?:\/\/cnodejs\.org\/user\/\w*/
  },
  gif: /.*\.gif$/
};
class HtmlView extends React.Component {
  constructor(props) {
    super(props);
    this._parseImgUrl = this._parseImgUrl.bind(this);
    this._handleLinkPress = this._handleLinkPress.bind(this);
    this._renderNode = this._renderNode.bind(this);
  }
  _parseImgUrl(url) {
    if (/^\/\/.*/.test(url)) {
      url = "http:" + url;
    }
    return url;
  }
  _handleLinkPress(url) {
    Linking.canOpenURL(url)
      .then(support => {
        if (support) {
          Linking.openURL(url);
        }
      })
      .catch(err => console.log(err));
  }
  _renderNode(node, index, parent, type) {
    const name = node.name;
    const { styles, maxImageWidth } = this.props;
    let imgStyle = {
      height: theme.screenWidth - 50,
      width: theme.screenWidth - 50,
      resizeMode: Image.resizeMode.cover,
      borderRadius: 5,
      margin: 10
    };
    console.log(type);
    if (node.type === "block" && type === "block") {
      if (node.name === "img") {
        const uri = this._parseImgUrl(node.attribs.src);
        if (regs.gif.test(uri)) {
          return null;
        }
        return (
          // <Image
          //   source={{
          //     uri: uri,
          //     width: theme.screenWidth - px2dp(30),
          //     height: 300,
          //     resizeMode: "contain"
          //   }}
          //   key={index}
          // />
          <CustomImage
            key={index}
            uri={uri}
            style={imgStyle}
            defaultSize={{
              height: 300,
              width: theme.screenWidth - px2dp(30)
            }}
            maxImageWidth={theme.screenWidth - px2dp(30)}
          />
        );
      }
    }
  }

  render() {
    const { html, styles } = this.props;
    return (
      // <WebView
      // source={{html: html}}
      // style={[htmlstyle,{width:320,height:2000}]}
      // scalesPageToFit={true}
      // ></WebView>
      <View>
        <HTMLView
          value={html}
          /* style={{ flexDirection: "column" }} */
          stylesheet={styles}
          onLinkPress={this._handleLinkPress}
          renderNode={this._renderNode}
        />
      </View>
    );
  }
}
const htmlstyle = StyleSheet.create({
  img: {
    width: "100%",
    height: "auto"
  }
});
export default HtmlView;
