import { get, post } from "../utils/HttpUtils";
import cheerio from 'cheerio-without-node-native';

export function postToken(params) {
  return post("/accesstoken", params);
}

export function queryUser(loginname ) {
  return get(`/user/${loginname }`);
}

export function queryUserInformation(usermessage) {
  return new Promise(async (resolve,reject)=>{
    const html = await get(`https://cnodejs.org/user/${usermessage.loginname}`);
    if(html.status === 200 && html.data) {
      const $ = cheerio.load(html.data);
      const home = $('.unstyled .fa-home').next().text();
      const location = $('.unstyled .fa-map-marker').next().text();
      const weibo = $('.unstyled .fa-twitter').next().text();
      const signature = $('.user_card .signature').text().replace(/[\r\n\s“”]/g, '');
      resolve({...usermessage,home,location,weibo,signature})
    }else{
      resolve({...usermessage,home:'',location:'',weibo:'',signature:''})
    }
  })
}