function compileTpl(tpl, params) {
  let start = 0
  let end = 0
  let re = tpl
  for (let i = 0; i < tpl.length; i += 1) {
    if (tpl[i] === '\\') {
      // eslint-disable-next-line no-continue
      continue
    }
    if (tpl[i] === '{') {
      start = i + 1
      end = i + 1
    } else if (tpl[i] === '}') {
      end = i
      const item = tpl.slice(start, end)
      if (params[item] !== undefined) {
        re = re.replace(`{${item}}`, params[item])
      }
    }
  }
  return re
}

module.exports = function (source) {
  const { tplValue: value } = this.getOptions()
  return compileTpl(source, value)
}
