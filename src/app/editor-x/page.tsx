"use client"

import { useEffect, useState } from "react"
import { SerializedEditorState } from "lexical"
import { Editor } from "@/components/blocks/editor-x/editor"

export const initialValue = {
  root: {
    children: [
      {
        children: [
          {
            detail: 0,
            format: 0,
            mode: "normal",
            style: "",
            text: "Hello World 🚀",
            type: "text",
            version: 1,
          },
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "paragraph",
        version: 1,
      },
    ],
    direction: "ltr",
    format: "",
    indent: 0,
    type: "root",
    version: 1,
  },
} as unknown as SerializedEditorState

export default function EditorPage({ onChange }: { onChange?: (value: SerializedEditorState) => void }) {
  const [editorState, setEditorState] = useState<SerializedEditorState>(initialValue)

  useEffect(() => {
    if (onChange) {
      onChange(editorState) // 👈 push latest JSON to parent
    }
  }, [editorState, onChange])

  return (
    <Editor
      editorSerializedState={editorState}
      onSerializedChange={(value) => setEditorState(value)}
    />
  )
}
