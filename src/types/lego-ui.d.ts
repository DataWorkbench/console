declare module '@QCFE/lego-ui' {
  type Item<T = string> = {
    label: 'string'
    value: T
  }

  interface RFC {
    children?: React.ReactNode
    className?: string
    style?: React.CSSProperties
    onClick?: (e: React.MouseEvent | any) => void
    [key: string]: any
  }

  type ButtonType =
    | 'primary'
    | 'default'
    | 'danger'
    | 'text'
    | 'outlined'
    | 'static'
  interface RadioGroupProps extends RFC {
    name?: string
    disabled?: boolean
    direction?: 'column' | 'row'
    options?: { value: any; label: string }[]
    value?: any
    defaultValue?: any
    onChange?: (value: any) => void
    size?: 'large' | 'default' | 'small'
    buttonWidth?: string
  }

  export function RadioGroup({
    children,
    ...others
  }: RadioGroupProps): JSX.Element

  interface RadioButtonProps extends RFC {
    value?: any
    disabled?: boolean
    checked?: boolean
    defaultChecked?: boolean
  }

  export function RadioButton({
    children,
    ...others
  }: RadioButtonProps): JSX.Element

  interface TabsProps extends RFC {
    type?: 'line' | 'card'
    onChange?: (name: string) => void
    direction?: 'horizon' | 'vertical'
    alignment?: 'start' | 'middle' | 'end'
    activeName?: string
    defaultActiveName?: string
  }

  interface TabPanelProps extends RFC {
    name?: string
    label?: React.ReactNode
    disabled?: boolean
    closable?: boolean
    forceRender?: boolean
  }

  export function Tabs({ children, ...others }: TabsProps): JSX.Element

  export interface SelectProps<O, V = string> extends RFC {
    name?: string
    id?: string
    defaultValue?: string | string[]
    value?: string | string[] | number | number[]
    onChange?: (value: V, option: O) => void
    options?: O[]
    labelKey?: string
    valueKey?: string
    className?: string
    style?: React.CSSProperties
    menuContainerStyle?: React.CSSProperties
    menuStyle?: React.CSSProperties
    placeholder?: string
    multi?: boolean
    withoutCheckBox?: boolean
    disabled?: boolean
    searchable?: boolean
    openOnClick?: boolean
    openOnClear?: boolean
    prefixIcon?: React.ReactNode
    autoFocus?: boolean
    backspaceRemoves?: boolean
    deleteRemoves?: boolean
    clearable?: boolean
    clearAllText?: string
    clearValueText?: string
    closeOnSelect?: boolean
    isLoading?: boolean
    isLoadingAtBottom?: boolean
    arrowRenderer?: (props: {
      onMouseDown: boolean
      isOpen: boolean
      disabled: boolean
    }) => JSX.Element
    optionRenderer?: (props: Item) => JSX.Element
    valueRenderer?: (props: Item) => JSX.Element
    bottomText?: string
    bottomTextVisible?: boolean
    noResultsText?: string
    onBlurResetsInput?: boolean
    onCloseResetsInput?: boolean
    onSelectResetsInput?: boolean
  }

  export function Select<O, V = string>({
    children,
    ...rest
  }: SelectProps<O, V>): JSX.Element

  interface IconProps extends RFC {
    prefix?: string
    name?: string
    type?: 'dark' | 'light' | 'coloured'
    size?: 'small' | 'medium' | 'large' | number
    color?:
      | {
          primary: string
          secondary: string
        }
      | string
    changeable?: boolean
    clickable?: boolean
    onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
    disabled?: boolean
  }

  export function Icon({ children, ...others }: IconProps): JSX.Element

  interface ButtonProps extends RFC {
    type?: ButtonType
    size?: 'small' | 'default' | 'large'
    disabled?: boolean
    className?: string
    href?: string
    target?: string
    htmlType?: 'button' | 'reset' | 'submit'
    onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  }

  interface ButtonGroupProps extends RFC {}

  export function Button({ children, ...others }: ButtonProps): JSX.Element

  export function ButtonGroup(props: ButtonGroupProps): JSX.Element

  interface InputProps extends RFC {
    name?: string
    defaultValue?: string | number
    value?: string | number
    placeholder?: string
    size?: 'small' | 'default' | 'large'
    onChange?: (e: React.MouseEvent, value: string | number) => void
    onKeyDown?: (e: React.KeyboardEvent) => void
    onPressEnter?: (e: React.KeyboardEvent) => void
    readOnly?: boolean
    disabled?: boolean
  }

  export function Input({ ...others }: InputProps): JSX.Element

  interface SearchProps extends InputProps {
    onClear?: () => void
  }

  export function InputSearch({ ...others }: SearchProps): JSX.Element
  interface InputNumberProps extends RFC {
    name?: string
    defaultValue?: number
    value?: number
    min?: number
    max?: number
    step?: number
    showButton?: boolean
    onChange?: (value: number) => void
    onKeyDown?: (e: React.KeyboardEvent) => void
    upHandler?: (value: number) => void
    downHandler?: (value: number) => void
    formatter?: (value: number) => any
    readOnly?: boolean
    disabled?: boolean
  }

  export function InputNumber({ ...others }: InputNumberProps): JSX.Element
  interface CheckboxProps extends RFC {
    defaultChecked?: boolean
    checked?: boolean
    disabled?: boolean
    indeterminate?: boolean
    onChange?: (e: React.MouseEvent, checked: boolean) => void
    value?: any
  }

  export function Checkbox({ ...others }: CheckboxProps): JSX.Element

  interface CheckboxGroupProps extends RFC {
    name?: string
    wrapClassName?: string
    options?: { label: string; value: string }[]
    value?: any[]
    defaultValue?: any[]
    direction?: string
    onChange?: (value: any[], name: string) => void
  }

  export function CheckboxGroup(props: CheckboxGroupProps): JSX.Element

  type MessageType = 'success' | 'info' | 'warning' | 'error'

  interface OpenProps {
    content: string
    type?: MessageType
    duration?: number
    key?: string
    btns?: any
    onClose?: () => void
    placement?:
      | 'topRight'
      | 'topCenter'
      | 'topLeft'
      | 'bottomLeft'
      | 'bottomCenter'
      | 'bottomRight'
  }

  type MessageMethod = (props: OpenProps | string) => void

  export interface Message {
    (props: any): JSX.Element
    open: MessageMethod
    success: MessageMethod
    warning: MessageMethod
    error: MessageMethod
  }

  export const Message: Message

  interface RadioProps extends RFC {
    value?: any
    disabled?: boolean
    checked?: boolean
    defaultChecked?: boolean
  }

  export function Radio({ children, ...others }: RadioProps): JSX.Element

  export interface Layout {
    (props: any): JSX.Element
    LayoutHeader: (props: any) => JSX.Element
    LayoutContent: (props: any) => JSX.Element
  }

  export const Layout: Layout

  export interface Form {
    (props: any): JSX.Element
    TextField: (props: any) => JSX.Element
    SelectField: (props: any) => JSX.Element
    PasswordField: (props: any) => JSX.Element
    TextAreaField: (props: any) => JSX.Element
    TextGroupField: (props: any) => JSX.Element
    NumberField: (props: any) => JSX.Element
    RadioGroupField: (props: any) => JSX.Element
    CheckboxGroupField: (props: any) => JSX.Element
    ToggleField: (props: any) => JSX.Element
    ButtonField: (props: any) => JSX.Element
    SliderField: (props: any) => JSX.Element
    DatePickerField: (props: any) => JSX.Element
  }

  export const Form: Form

  export interface Collapse {
    (props: any): JSX.Element
    CollapsePanel: (props: any) => JSX.Element
  }

  export const Collapse: Collapse

  export interface TooltipProps {
    content: React.ReactNode
    style?: React.CSSProperties
    [key: string]: unknown
  }

  export interface Notification {
    (props: any): JSX.Element
    error: (message?: string) => void
    open: (o: Record<string, unknown>) => void
  }

  export interface Locale {
    get: (key: string) => string
  }

  export const Notification: Notification

  export function Header(props: any): JSX.Element
  export function Footer(props: any): JSX.Element
  export function Section(props: any): JSX.Element
  export function Container(props: any): JSX.Element
  export function Content(props: any): JSX.Element
  export function Columns(props: any): JSX.Element
  export function Column(props: any): JSX.Element
  export function Level(props: any): JSX.Element
  export function LevelLeft(props: any): JSX.Element
  export function LevelRight(props: any): JSX.Element
  export function LevelItem(props: any): JSX.Element
  export function Box(props: any): JSX.Element
  export function Panel(props: any): JSX.Element
  export function PanelHeading(props: any): JSX.Element
  export function PanelTabs(props: any): JSX.Element
  export function PanelBlock(props: any): JSX.Element
  export function Control(props: any): JSX.Element
  export function Label(props: any): JSX.Element
  export function Field(props: any): JSX.Element
  export function FieldLabel(props: any): JSX.Element
  export function FieldBody(props: any): JSX.Element
  export function Addons(props: any): JSX.Element
  export function Group(props: any): JSX.Element
  export function Buttons(props: any): JSX.Element
  export function Title(props: any): JSX.Element
  export function Navbar(props: any): JSX.Element
  export function NavbarBrand(props: any): JSX.Element
  export function NavbarItem(props: any): JSX.Element
  export function NavbarBurger(props: any): JSX.Element
  export function NavbarMenu(props: any): JSX.Element
  export function NavbarStart(props: any): JSX.Element
  export function NavbarEnd(props: any): JSX.Element

  export function Alert(props: any): JSX.Element
  export function AutoComplete(props: any): JSX.Element
  export function TextArea(props: any): JSX.Element
  export function InputPassword(props: any): JSX.Element
  export function Menu(props: any): JSX.Element
  export function MenuGroup(props: any): JSX.Element
  export function Breadcrumb(props: any): JSX.Element
  export function LocaleProvider(props: any): JSX.Element
  export const locale: Locale
  export function Tooltip(props: TooltipProps): JSX.Element
  export function Notify(props: any): JSX.Element
  export function Dropdown(props: any): JSX.Element
  export function Tree(props: any): JSX.Element
  export function TreeNode(props: any): JSX.Element
  export function PopConfirm(props: any): JSX.Element
  export function Progress(props: any): JSX.Element
  export function Loading(props: any): JSX.Element
  export function PageProgress(props: any): JSX.Element
  export function Transition(props: any): JSX.Element
  export function TransitionGroup(props: any): JSX.Element
  export function Pagination(props: any): JSX.Element
  export function Table(props: any): JSX.Element
  export function Toggle(props: any): JSX.Element
  export function Tag(props: any): JSX.Element
  export function Slider(props: {
    min?: number
    max?: number
    name?: string
    label?: string
    range?: boolean
    hasTooltip?: boolean
    tipFormatter?: (value: any) => any
    tipProps?: Record<string, any>
    marks?: Record<number, string>
    markDots?: boolean
    step?: number
    stepDots?: boolean
    disabled?: boolean
    defaultValue?: any
    value?: any
    onChange?: (value: any) => void
    className?: string
    handleStyle?: CSSStyleDeclaration
    railStyle?: CSSStyleDeclaration
    trackStyle?: CSSStyleDeclaration
    dotStyle?: CSSStyleDeclaration
    activeDotStyle?: CSSStyleDeclaration
    vertical?: boolean
  }): JSX.Element
  export function Steps(props: any): JSX.Element
  export function Navigation(props: any): JSX.Element
  export function List(props: any): JSX.Element
  export function Banner(props: any): JSX.Element
  export function DatePicker(props: any): JSX.Element
  export function Timeline(props: any): JSX.Element
  export function Upload(props: any): JSX.Element
  export function MentionsInput(props: any): JSX.Element
  export function Mention(props: any): JSX.Element
  export function Rate(props: any): JSX.Element
  export function Badge(props: any): JSX.Element
  export function Sortable(props: any): JSX.Element
  export function ContextMenu(props: any): JSX.Element
  export function GridTable(props: any): JSX.Element
}
