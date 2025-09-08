"use client"

import * as React from "react"
import { Moon } from "lucide-react"
import Switcher4 from "../toggleSwitch"

export function ModeToggle() {

  return (
    <div className="flex justify-between w-full items-center">
      <div className="flex items-center">
      <Moon/>
      <p className="ml-2">Dark Mode</p>
      </div>
      <Switcher4 />
    </div>
  )
}
