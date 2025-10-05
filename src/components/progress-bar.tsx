import React from 'react'
import figures from 'figures'
import { Box, Text } from 'ink'

import { useTerminalDimensions } from '../hooks/useTerminalDimensions.js'
export type ProgressBarProps = {
  readonly value: number
}

export function ProgressBar({ value }: ProgressBarProps) {
  const { width } = useTerminalDimensions()
  const fixedWidth = width - 30

  const progress = Math.min(100, Math.max(0, value))
  const complete = Math.round((progress / 100) * fixedWidth)
  const remaining = fixedWidth - complete

  return (
    <Box flexGrow={1} gap={1} alignItems="center">
      <Text bold color="blue">{`${progress}%`}</Text>

      {complete > 0 && <Text color="blue">{figures.square.repeat(complete)}</Text>}

      {remaining > 0 && <Text dimColor={true}>{figures.squareLightShade.repeat(remaining)}</Text>}
    </Box>
  )
}
