import { get, post } from '../utils/HttpUtils';
import { moment } from '../utils/tool';

  export function queryTopic(params) {
    const { topic_id, mdrender = true, accesstoken = null } = params
    return get(`/topic/${topic_id}?mdrender=${mdrender}&accesstoken=${accesstoken}`);
  }
  // 收藏主题
  export function collect(params) {
    const { topic_id, accesstoken } = params
    const body = { accesstoken, topic_id }
    return post('/topic_collect/collect', body);
  }
  // 取消收藏
  export function de_collect(params) {
    const { topic_id, accesstoken } = params
    const body = { accesstoken, topic_id }
    return post('/topic_collect/de_collect', body);
  }

  // 查询主题
  export function queryCollects(params) {
    const { user } = params
    return get(`/topic_collect/${user}`);
  }

  export function parseCollects(data) {
    const tabs = { 'top': '顶', 'ask': '问', 'good': '精', 'share': '享', 'job': '聘', 'default': '无' }
    const topics = data.map(topic => {
      const create_at = moment(topic.create_at).startOf('minute').fromNow()
      const last_reply_at = moment(topic.last_reply_at).startOf('minute').fromNow()
      const avatar_url = topic.author.avatar_url
      if (avatar_url && !avatar_url.startsWith('https')) topic.author.avatar_url = 'https:' + avatar_url
      let tab = topic.tab ? topic.tab : 'default'
      if (topic.top) tab = 'top'
      const sort = tabs[tab]
      const title = topic.title.replace(/[\r\n]/g, '')
      return { ...topic, create_at, last_reply_at, tab, title, sort }
    })
    return topics
  }