import React, { useState } from 'react'
import { Box, Text, useInput } from 'ink'

type TProps = {
  onChangeValue: (value: string) => void
  value: string
}

export function TextInput({ onChangeValue, value }: TProps) {
  const [cursorPosition, setCursorPosition] = useState(0)

  const handleTextChange = (newText: string) => {
    onChangeValue?.(newText)
  }

  useInput((input, key) => {
    if (key.upArrow || key.downArrow || (key.ctrl && input === 'c') || key.tab || (key.shift && key.tab)) {
      return
    }

    if (key.leftArrow) {
      setCursorPosition(prev => Math.max(0, prev - 1))
      return
    }

    if (key.rightArrow) {
      setCursorPosition(prev => Math.min(value.length, prev + 1))
      return
    }

    if (key.backspace || key.delete) {
      if (cursorPosition > 0) {
        const newText = value.slice(0, cursorPosition - 1) + value.slice(cursorPosition)
        handleTextChange(newText)
        setCursorPosition(prev => prev - 1)
      }
      return
    }

    const newText = value.slice(0, cursorPosition) + input + value.slice(cursorPosition)
    handleTextChange(newText)
    setCursorPosition(prev => prev + 1)
  })

  const beforeCursor = value.slice(0, cursorPosition)
  const cursorChar = cursorPosition < value.length ? value[cursorPosition] : ' '
  const afterCursor = value.slice(cursorPosition + 1)

  return (
    <Box flexGrow={1}>
      <Text bold>{beforeCursor}</Text>
      <Text bold inverse>
        {cursorChar}
      </Text>
      <Text bold>{afterCursor}</Text>
    </Box>
  )
}
