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
    } else if (tpl[i] === '}' && start < i) {
      end = i
      const tplItem = tpl.slice(start, end)
      let defaultValue
      let item
      if (tplItem.includes('|')) {
       [item,  defaultValue] = tplItem.split('|')
      } else {
        [item,  defaultValue] = [tplItem, undefined]
      }
      if (params[item] !== undefined) {
        re = re.replace(`{${tplItem}}`, params[item])
        start = tpl.length
      } else if (defaultValue !== undefined) {
        re = re.replace(`{${tplItem}}`, defaultValue)
        start = tpl.length
      }
    }
  }
  return re
}

module.exports = function (source) {
  const { tplValue: value } = this.getOptions()
  return compileTpl(source, value)
}
