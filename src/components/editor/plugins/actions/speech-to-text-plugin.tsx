"use client"

import { useEffect, useState } from "react"
import { MicIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { SPEECH_TO_TEXT_COMMAND } from "./fix"
// pull your command logic out here

function SpeechToTextPluginImpl() {
  const [editor] = useLexicalComposerContext()
  const [isSpeechToText, setIsSpeechToText] = useState(false)

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={() => {
            editor.dispatchCommand(SPEECH_TO_TEXT_COMMAND, !isSpeechToText)
            setIsSpeechToText(!isSpeechToText)
          }}
          variant={isSpeechToText ? "secondary" : "ghost"}
          title="Speech To Text"
          aria-label={`${isSpeechToText ? "Disable" : "Enable"} speech to text`}
          className="p-2"
          size="sm"
        >
          <MicIcon size={16} />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Speech To Text</TooltipContent>
    </Tooltip>
  )
}

export function SpeechToTextPlugin() {
  const [supported, setSupported] = useState(false)

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)
    ) {
      setSupported(true)
    }
  }, [])

  if (!supported) return null
  return <SpeechToTextPluginImpl />
}
