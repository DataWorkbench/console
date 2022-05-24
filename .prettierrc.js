module.exports = {
  printWidth: 100, // 一行最多 100 字符 / default: 80
  tabWidth: 2, // 指定每个缩进级别的空格数 / default: 2
  useTabs: false, // 使用制表符而不是空格缩进行 / default: false
  semi: false, // 行尾需要有分号 / default: true
  singleQuote: true, // 使用单引号 / default: false
  /*
    "as-needed" -仅在需要时在对象属性周围添加引号。***default
    "consistent" -如果对象中至少有一个属性需要用引号引起来，请用所有引号引起来。
    "preserve" -尊重对象属性中引号的输入使用。
  */
  quoteProps: 'as-needed',
  jsxSingleQuote: false, // jsx使用单引号 / default: false
  /*
    "es5" -在ES5中有效的结尾逗号（对象，数组等）***default
    "none" -没有尾随逗号。
    "all"-尽可能使用尾随逗号（包括函数参数列表和调用中的尾随逗号）
  */
  trailingComma: 'none',
  bracketSpacing: true, // 大括号内的首尾需要空格 / default: true
  jsxBracketSameLine: false, // 将 > 多行JSX元素的放在最后一行的末尾，而不是一个人放在下一行（不适用于自闭元素） / default: false
  /*
    "always"-始终包含括号。例子：(x) => x   ***default
    "avoid"-如果可能的话，省去parens。例子：x => x
  */
  arrowParens: 'always',
  /* 每个文件格式化的范围是文件的全部内容 */
  rangeStart: 0,
  rangeEnd: Infinity,
  requirePragma: false, // 不需要写文件开头的 @prettier / default: false
  insertPragma: false, // 不需要自动在文件开头插入 @format / default: false
  /*
    "always" -如果散文超过打印宽度，则将其包裹起来。
    "never" -不要包裹散文。
    "preserve"-按原样包装散文。v1.9.0中首次可用 ***default
  */
  proseWrap: 'preserve',
  /*
    指定HTML文件的全局空格敏感度
    "css"-遵守CSSdisplay属性的默认值。***default
    "strict" -空白被认为是敏感的。
    "ignore" -空白被认为是不敏感的。
  */
  htmlWhitespaceSensitivity: 'ignore',
  vueIndentScriptAndStyle: false, // 是否缩进Vue文件中的代码<script>和<style>标签的缩进 / default: false
  /*
    "lf"–仅\n换行（），在Linux和macOS以及git repos内通用 ***default
    "crlf"-回车符+换行符（\r\n），在Windows上很常见
    "cr"-仅回车符（\r），很少使用
    "auto" -维持现有的行尾（通过查看第一行后的内容对一个文件中的混合值进行归一化）
  */
  endOfLine: 'auto'
}
