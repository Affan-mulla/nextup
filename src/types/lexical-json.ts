// types/lexical-json.ts
export interface LexicalJsonNode {
  type: string
  src?: string
  text?: string
  children?: LexicalJsonNode[]
  [key: string]: unknown
}


export interface LexicalEditorState {
  root: LexicalJsonNode
}
