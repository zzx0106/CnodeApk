import { get, post } from '../utils/HttpUtils';
import { moment } from '../utils/tool';
import cheerio from 'cheerio-without-node-native';
export function queryTopics(params) {
  const { page = 1, tab = 'all', limit = 20, mdrender = true } = params
  console.log('url',`/topics?page=${page}&limit=${limit}&tab=${tab}&mdrender=${mdrender}`)
  return get(`/topics?page=${page}&limit=${limit}&tab=${tab}&mdrender=${mdrender}`);
}

export function parseTopics(data) {
  console.log('这里的data',data)
  const tabs = { 'top': '顶', 'ask': '问', 'good': '精', 'share': '享', 'job': '聘', 'dev': '测', 'default': '无' }
  const topics = data.map(topic => {
    const create_at = moment(topic.create_at).startOf('minute').fromNow()
    const last_reply_at = moment(topic.last_reply_at).startOf('minute').fromNow()
    const avatar_url = topic.author.avatar_url
    if (avatar_url && !avatar_url.startsWith('https')) topic.author.avatar_url = 'https:' + avatar_url
    let tab = topic.tab ? topic.tab : 'default'
    if (topic.top) tab = 'top'
    if (topic.good) tab = 'good'
    const sort = tabs[tab]
    const title = topic.title.replace(/[\r\n]/g, '')
    return { ...topic, create_at, last_reply_at, tab, title, sort }
  })
  return topics
}

export async function querySearch(params) {
  const { content, page = 1 } = params
  return get(`https://m.baidu.com/from=844b/s?pn=${page}0&usm=1&word=site%3Acnodejs.org+${content}`)
}

export function parseSearch(data) {
  const $ = cheerio.load(data);
  var lists = [];
  const results = $('#results .c-result')
  results.each(function (i, elem) {
    const dataLog = $(this).attr('data-log').replace(/'/g, '"')
    const id = JSON.parse(dataLog).mu.replace(/.*?topic\/(.*?)$/, '$1')
    const title = $(this).find('h3').text()
    const content = $(this).find('p').text()
    const list = { id, title, content };
    if (id.length == 24) lists.push(list) // 话题ID长度
  });
  return lists;
}