import { get, post } from "../utils/HttpUtils";
import WebIM from "../utils/webIM";
import { moment } from "../utils/tool";
import { Alert, ToastAndroid } from "react-native";
export function queryNotics(params) {
  const { accesstoken, mdrender = false } = params;
  return get(`/messages?accesstoken=${accesstoken}&mdrender=${mdrender}`);
}

// export function register(params) {
//   const { username, password, nickname } = params
//   const body = { username, password, nickname: nickname || username }
//   return WebIM.api.register(body);
// }

export function HX_register(params) {
  console.log("parmas", params);
  const { username, password, nickname } = params;
  let options = {
    username: username.trim().toLowerCase(),
    password: password,
    nickname: username.trim().toLowerCase()
  };
  console.log(options);
  return new Promise((resolve, reject) => {
    WebIM.api
      .register(options)
      .then(({ data }) => {
        if (data.error) {
          Alert.alert("Error", data.error_description);
          resolve(false);
        }
        resolve(true);
        ToastAndroid.show("登录成功", ToastAndroid.SHORT);
      })
      .catch(() => {
        resolve(false);
      });
  });
}
export function HX_login(params) {
  const { username, password } = params;
  if (WebIM.conn.isOpened()) {
    WebIM.conn.close("logout");
  }
  WebIM.conn.open({
    apiUrl: WebIM.config.apiURL,
    user: username.trim().toLowerCase(),
    pwd: password.trim().toLowerCase(),
    //  accessToken: password,
    appKey: WebIM.config.appkey
  });
}
export function HX_sendMessage(params) {
  // return new Promise((resolve, reject) => {
  //   const { message, username } = params;
  //   var id = conn.getUniqueId(); // 生成本地消息id
  //   var msg = new WebIM.message("txt", id); // 创建文本消息
  //   msg.set({
  //     msg: message, // 消息内容
  //     to: username, // 接收消息对象（用户id）
  //     roomType: false,
  //     success: function(id, serverMsgId) {
  //       console.log("send private text Success");
  //       resolve(true);
  //     },
  //     fail: function(e) {
  //       console.log("Send private text error");
  //       resolve(false);
  //     }
  //   });
  //   msg.body.chatType = "singleChat";
  //   WebIM.conn.send(msg.body);
  // });
}
export function HX_saveMessage(params) {
  // const { msg, username } = params;
  // var id = conn.getUniqueId(); // 生成本地消息id
  // var msg = new WebIM.message("txt", id); // 创建文本消息
  // return new Promise((resolve, reject) => {
  //   msg.set({
  //     msg: msg, // 消息内容
  //     to: username, // 接收消息对象（用户id）
  //     roomType: false,
  //     success: function(id, serverMsgId) {
  //       console.log("send private text Success");
  //       resolve(true);
  //     },
  //     fail: function(e) {
  //       console.log("Send private text error");
  //       resolve(false);
  //     }
  //   });
  //   msg.body.chatType = "singleChat";
  //   WebIM.conn.send(msg.body);
  // });
}
export function HX_parseMessage(state, payload) {
  const { user: { name }, message, owner } = payload;
  const total_messages = state.total_messages;
  const { messages: user_messages = [] } = total_messages[name] || {};
  const messages = [message, ...user_messages];
  total_messages[name] = { messages };
  const filter_chats = state.chat_history.filter(chat => chat.name !== name);
  const [state_chat = {}] = state.chat_history.filter(
    chat => chat.name === name
  );
  let { count = 0 } = state_chat;
  if (message.user.name !== owner.loginname) count += 1; // 只有是对方的信息才增加
  const chat_user = {
    name,
    count,
    avatar: "https://facebook.github.io/react/img/logo_og.png",
    ...message
  };
  chat_user.createdAt = moment(chat_user.createdAt).format("HH:mm");
  const chat_history = [chat_user, ...filter_chats];
  return { messages, total_messages, chat_history };
}
export function attemptLogin(params) {
  const { username, password } = params;

  const body = {
    username,
    password,
    grant_type: "password",
    timestamp: +new Date()
  };
  return WebIM.api.login(body);
}

export function loginWebim(params) {
  const { apiURL, appkey } = WebIM.config;
  const { username, password } = params;
  var options = {
    apiUrl: apiURL,
    user: username,
    pwd: password,
    appKey: appkey
  };
  WebIM.conn.open(options);
}

export function tokenLoginWebim(params) {
  const { apiURL, appkey } = WebIM.config;
  const { user, accessToken } = params;
  var options = { apiUrl: apiURL, user, accessToken, appKey: appkey };
  WebIM.conn.open(options);
}

export function addFriends(params) {
  const { loginname, message } = params;
  console.log("添加好友");
  WebIM.conn.subscribe({
    to: "username",
    // Demo里面接收方没有展现出来这个message，在status字段里面
    message: "加个好友呗!"
  });
  // WebIM.conn.subscribe({ to: 'zzx', message });
}

export function onSubscribe(params) {
  const { to, from } = params;
  WebIM.conn.subscribed({ to: from, message: "[resp:true]" });
  WebIM.conn.subscribe({ to, message: "[resp:true]" });
}

export function removeFriends(params) {
  const { loginname } = params;
  const success = () => {
    WebIM.conn.unsubscribed({ to: loginname });
    console.log("=== remove friend success ===");
  };
  const error = () => console.log(`=== remove friend error ===`);
  WebIM.conn.removeRoster({ to: loginname, success, error });
}

export function sendTxtMessage(params) {
  const { msg, to, chatType = "singleChat", roomType = false } = params;
  var id = WebIM.conn.getUniqueId();
  var message = new WebIM.message("txt", id);
  const success = (id, serverMsgId) =>
    console.log("=== send message success ===");
  const fail = e => console.log(`=== Send message error: ${e} ===`);
  message.set({ msg, to, roomType, success, fail });
  message.body.chatType = chatType;
  WebIM.conn.send(message.body);
}

export function mark_oneMessages(params) {
  const { accesstoken, msg_id } = params;
  const body = { accesstoken };
  return post(`/message/mark_one/${msg_id}`, body);
}

export function parseNotics(data) {
  const has_read_messages = data.has_read_messages.map(message => {
    const last_reply_at = message.topic.last_reply_at;
    const create_at = message.reply.create_at;
    message.topic.last_reply_at = moment(last_reply_at)
      .startOf("minute")
      .fromNow();
    message.reply.create_at = moment(create_at)
      .startOf("minute")
      .fromNow();
    return message;
  });
  const hasnot_read_messages = data.hasnot_read_messages.map(message => {
    const last_reply_at = message.topic.last_reply_at;
    const create_at = message.reply.create_at;
    message.topic.last_reply_at = moment(last_reply_at)
      .startOf("minute")
      .fromNow();
    message.reply.create_at = moment(create_at)
      .startOf("minute")
      .fromNow();
    return message;
  });
  return { has_read_messages, hasnot_read_messages };
}

export function parseRead(data, state) {
  const { marked_msg_id } = data;
  const hasnot_read_messages = state.hasnot_read_messages.filter(
    messages => messages.id !== marked_msg_id
  );
  const [read_messages] = state.hasnot_read_messages.filter(messages => {
    if (messages.id === marked_msg_id) {
      messages.has_read = true;
      return messages;
    }
  });
  const has_read_messages = [read_messages, ...state.has_read_messages];
  return { has_read_messages, hasnot_read_messages };
}

export function parseMessage(state, payload) {
  const { user: { name }, message, owner } = payload;
  const total_messages = state.total_messages;
  const { messages: user_messages = [] } = total_messages[name] || {};
  const messages = [message, ...user_messages];
  total_messages[name] = { messages };
  const filter_chats = state.chat_history.filter(chat => chat.name !== name);
  const [state_chat = {}] = state.chat_history.filter(
    chat => chat.name === name
  );
  let { count = 0 } = state_chat;
  if (message.user.name !== owner.loginname) count += 1; // 只有是对方的信息才增加
  const chat_user = {
    name,
    count,
    avatar: "https://facebook.github.io/react/img/logo_og.png",
    ...message
  };
  chat_user.createdAt = moment(chat_user.createdAt).format("HH:mm");
  const chat_history = [chat_user, ...filter_chats];
  return { messages, total_messages, chat_history };
}

export function cleanCount(state, payload) {
  const { user: { name }, owner } = payload;
  const chat_history = state.chat_history.map(chat => {
    if (chat.name === name) chat.count = 0;
    return chat;
  });
  return { chat_history };
}

export function parseSigleHistory(state, user) {
  const { name } = user;
  const total_messages = state.total_messages;
  delete total_messages[name];
  const chat_history = state.chat_history.map(chat => {
    if (chat.name === name) chat = { ...chat, text: "[已清除]", createdAt: "" };
    return chat;
  });
  return { messages: [], total_messages, chat_history };
}

export function parseSigleChat(state, user) {
  const { name } = user;
  const total_messages = state.total_messages;
  delete total_messages[name];
  const chat_history = state.chat_history.filter(chat => chat.name !== name);
  return { messages: [], total_messages, chat_history };
}

export function parseFriends(state, payload) {
  const { name, subscription } = payload;
  payload.avatar = "https://facebook.github.io/react/img/logo_og.png";
  let contacts = state.contacts.filter(contact => contact.name != name);
  switch (subscription) {
    case "remove":
      break;
    case "both":
      contacts = [payload, ...state.contacts];
      break;
    default:
      break;
  }
  return { contacts };
}

export function parseApplication(state, user) {
  const { name } = user;
  const strangers = state.strangers.filter(chat => chat.name !== name);
  return { strangers };
}

export function handlePresence(state, payload) {
  const { from, type, fromJid } = payload;
  const filter_strangers = state.strangers.filter(
    stranger => stranger.from != from
  );
  const filter_contacts = state.contacts.filter(
    contact => contact.name != from
  );
  let { strangers, contacts } = state;
  payload.name = from;
  payload.avatar = "https://facebook.github.io/react/img/logo_og.png";
  const roster = {
    groups: [],
    jid: fromJid,
    avatar: "https://facebook.github.io/react/img/logo_og.png",
    name: from,
    subscription: "none"
  };
  switch (type) {
    //若e.status中含有[resp:true],则表示为对方同意好友后反向添加自己为好友的消息，demo中发现此类消息，默认同意操作，完成双方互为好友；如果不含有[resp:true]，则表示为正常的对方请求添加自己为好友的申请消息。
    case "subscribe":
      strangers = [payload, ...filter_strangers];
      break;
    //(发送者允许接收者接收他们的出席信息)，即别人同意你加他为好友
    case "subscribed":
      roster.subscription = "both";
      contacts = [roster, ...filter_contacts];
      strangers = [payload, ...filter_strangers];
      break;
    //（发送者取消订阅另一个实体的出席信息）,即删除现有好友
    case "unsubscribe":
      break;
    //（订阅者的请求被拒绝或以前的订阅被取消），即对方单向的删除了好友
    case "unsubscribed":
      contacts = filter_contacts;
      break;
    default:
      break;
  }
  return { contacts, strangers };
}

export function parseRosters(state, rosters) {
  const { contacts, strangers } = state;
  rosters.map(roster => {
    roster.avatar = "https://facebook.github.io/react/img/logo_og.png";
    if (roster.subscription === "both" || roster.subscription === "to")
      contacts.push(roster);
    // else strangers.push(roster)
  });
  return { contacts, strangers };
}

export function parseHistory(messages) {
  const history = messages.map(message => {
    if (
      typeof message.createdAt === "object" ||
      message.createdAt.length > 16
    ) {
      message.createdAt = moment(message.createdAt).format("HH:mm");
      // message.createdAt = moment(message.createdAt).startOf('minute').fromNow()
    }
    return message;
  });
  return history;
}
