export interface ITab {
  title: string
  description: string
  icon: string
  helpLink: string
}

export interface ISuggestionItem {
  label: string
  key: string
}

export interface ISuggestion extends ISuggestionItem {
  options?: ISuggestionItem[]
}

export interface ISuggestionTag {
  filter: string
  filterLabel: string
  value: any
  valueLabel?: string
}
