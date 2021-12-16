import { languages } from 'monaco-editor'
// import 'monaco-editor/esm/vs/basic-languages/python/python.contribution'
import * as mod from 'monaco-editor/esm/vs/basic-languages/python/python'

export const { conf, language } = mod

export const { keywords } = language

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
