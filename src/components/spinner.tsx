import React, { useEffect, useMemo, useState } from 'react'
import spinners, { type SpinnerName } from 'cli-spinners'
import { Text } from 'ink'

export type SpinnerProps = {
  type?: SpinnerName
}

export function Spinner({ type = 'dots' }: SpinnerProps) {
  const [frame, setFrame] = useState(0)

  const spinner = useMemo(() => spinners[type], [type])

  useEffect(() => {
    const timer = setInterval(() => {
      setFrame(previousFrame => {
        const isLastFrame = previousFrame === spinner.frames.length - 1
        return isLastFrame ? 0 : previousFrame + 1
      })
    }, spinner.interval)

    return () => {
      clearInterval(timer)
    }
  }, [spinner])

  return <Text color="blue">{spinner.frames[frame] ?? ''}</Text>
}
