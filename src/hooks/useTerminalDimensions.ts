import { useLayoutEffect, useState } from 'react'
import { useStdout } from 'ink'

export function useTerminalDimensions() {
  const { stdout } = useStdout()
  const [dimensions, setDimensions] = useState({ width: stdout.columns, height: stdout.rows })

  useLayoutEffect(() => {
    function handler() {
      setDimensions({ width: stdout.columns, height: stdout.rows })
    }

    stdout.on('resize', handler)

    return () => {
      stdout.off('resize', handler)
    }
  }, [])

  return dimensions
}
