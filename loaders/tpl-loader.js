function compileTpl(
    tpl,
    params
) {
  const keys = []
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
        keys.push(item)
      }
    }
  }
  return re
}

module.exports = function (source) {
  const { tplValue: value } = this.getOptions()
  const re = compileTpl(source, value)
  console.log(1111, source, re)
  return re
}
