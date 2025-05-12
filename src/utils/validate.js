/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * 判断给定的 URL 是否是外部链接
 * @param {string} path - 需要判断的 URL 路径
 * @returns {Boolean} 如果是外部链接，则返回 true；否则返回 false
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path);
  // 使用正则表达式匹配：
  // - `https?:` 表示 HTTP 或 HTTPS 协议（`http://` 或 `https://`）
  // - `mailto:` 表示邮件链接
  // - `tel:` 表示电话链接
  // 只要路径以这些协议开头，就被认为是外部链接
}

/**
 * 校验用户名是否为系统允许的有效用户名
 * @param {string} str - 需要验证的用户名
 * @returns {Boolean} 如果用户名在允许列表中，则返回 true；否则返回 false
 */
export function validUsername(str) {
  const valid_map = ["admin", "editor"]; // 预定义的有效用户名列表
  return valid_map.indexOf(str.trim()) >= 0;
  // `trim()` 去除字符串首尾的空格
  // `indexOf()` 方法检查 `str` 是否在 `valid_map` 数组中：
  // - 如果 `str` 存在于数组中，则返回其索引（>= 0），表示是有效用户名
  // - 如果 `str` 不存在，则返回 -1，表示无效用户名
}
