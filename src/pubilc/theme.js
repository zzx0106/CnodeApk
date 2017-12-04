"use strict";

import { PixelRatio, Dimensions, Platform } from "react-native";
import px2dp from "../utils/px2dp";

const globalTextColor = "#000";
export default {
  screenWidth: Dimensions.get("window").width,
  screenHeight: Dimensions.get("window").height,
  highLightColor: "#ED4040",
  darkColor: "#666666",
  linkColor: "#3F429E",
  highLightColorOpacity: "rgba(255, 0, 0, 0.3)",
  textSize: px2dp(16)
};
