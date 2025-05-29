'use strict'
const extension = Editor.I18n.t('menu.extension')

module.exports = {
  editor_menu: `${extension}`,
  // editor_menu_free: `${extension}/标准计算器(免费版)`,
  open_panel: '标准计算器',
  open_about: '关于',
  description: '简单易用的标准计算器',

  panel_default_title: '标准计算器',
  panel_about_title: '关于',

  action_bar_buttons_info: '关于',
  action_bar_buttons_copy: '复制',
  action_bar_buttons_paste: '粘贴',
  action_bar_buttons_history: '历史记录',

  memory_bar_buttons_clear: '清除所有记忆',
  memory_bar_buttons_recall: '记忆调用',
  memory_bar_buttons_add: '记忆加法',
  memory_bar_buttons_subtract: '记忆减法',
  memory_bar_buttons_store: '记忆存储',
  memory_bar_buttons_list: '记忆',

  memory_panel_buttons_trash: '清除所有记忆',
  memory_panel_buttons_clear: '清除记忆项',
  memory_panel_buttons_add: '增加到记忆项',
  memory_panel_buttons_subtract: '从记忆项中减去',

  history_panel_buttons_trash: '清除所有历史记录',

  about_panel_studio_name: '机灵鸟工作室',
  about_panel_studio_website: 'www.boltbirdie.cn',

  error_number_out_of_safe_range: '数值超出范围',
}
