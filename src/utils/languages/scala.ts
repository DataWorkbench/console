import { languages } from 'monaco-editor'
// import 'monaco-editor/esm/vs/basic-languages/scala/scala.contribution'
import * as mod from 'monaco-editor/esm/vs/basic-languages/scala/scala'

export const { conf, language } = mod

export const keywords = language.keywords
  .concat(language.softKeywords)
  .concat(language.constants)
  .concat(language.modifiers)
  .concat(language.softModifiers)

export const completionItemProvider = {
  provideCompletionItems: () => ({
    suggestions: keywords.map((value: string) => {
      return {
        label: value,
        kind: languages.CompletionItemKind.Keyword,
        insertText: value,
        insertTextRules: languages.CompletionItemInsertTextRule.InsertAsSnippet,
      }
    }),
  }),
}
