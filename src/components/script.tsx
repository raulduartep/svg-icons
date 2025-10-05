/* eslint-disable @typescript-eslint/no-unnecessary-type-constraint */
import React, { ReactNode, useCallback, useRef, useState } from 'react'
import figures from 'figures'
import { Box, DOMElement, Text } from 'ink'

import { Spinner } from './spinner.js'

// import { ScriptCommand } from '../hooks/useScript'

export type TScriptCompleteCommandParams<T = any> = { value: T; id: string; display?: string }

export type TScriptCommandComponentProps<T = any> = {
  onSubmit: (params?: Omit<TScriptCompleteCommandParams<T>, 'id'>) => void
  onUpdateDisplay?: (display: string) => void
}

export type TScriptCommand<T = string | { value: string }> = {
  id: string
  title: string
  status: 'running' | 'success' | 'error'
  component: (props: TScriptCommandComponentProps<T>) => ReactNode
  display?: string
}

export type TScriptApi = {
  commands: TScriptCommand[]
  addCommand: <T extends any>(command: Omit<TScriptCommand<T>, 'status'>) => Promise<T>
  updateCommand: (id: string, updates: Partial<TScriptCommand>) => void
  completeCommand: (params: TScriptCompleteCommandParams) => void
}

type TProps = {
  api: TScriptApi
}

export function useScript() {
  const [commands, setCommands] = useState<TScriptCommand[]>([])
  const resolversRef = useRef<Map<string, (value: any) => void>>(new Map())

  const addCommand = useCallback(<T extends any>(command: Omit<TScriptCommand<T>, 'status'>): Promise<T> => {
    const newCommand: TScriptCommand<T> = { ...command, status: 'running' }

    setCommands(prev => [...prev, newCommand as TScriptCommand])

    return new Promise<T>(resolve => {
      resolversRef.current.set(command.id, resolve)
    })
  }, [])

  const completeCommand = useCallback(({ id, value, display }: TScriptCompleteCommandParams) => {
    updateCommand(id, { status: 'success', display })

    const resolver = resolversRef.current.get(id)
    if (resolver) {
      resolver(value)
      resolversRef.current.delete(id)
    }
  }, [])

  const updateCommand = useCallback((id: string, updates: Partial<TScriptCommand>) => {
    setCommands(prev => prev.map(command => (command.id === id ? { ...command, ...updates } : command)))
  }, [])

  return {
    commands,
    updateCommand,
    addCommand,
    completeCommand,
  }
}

export function Script({ api }: TProps) {
  const { commands, completeCommand, updateCommand } = api

  const ref = useRef<DOMElement>(null)

  return (
    <Box ref={ref} flexGrow={1} flexDirection="column">
      {commands.map(command => {
        return (
          <Box
            key={`command-${command.id}`}
            flexDirection={command.status === 'success' ? 'row' : 'column'}
            alignItems={command.status === 'success' ? 'center' : undefined}
            flexWrap="nowrap"
            width="90%"
          >
            <Box gap={1} flexWrap="wrap">
              <Box gap={1}>
                {command.status === 'running' ? (
                  <Spinner />
                ) : (
                  <Text color="blue" bold>
                    {figures.tick}
                  </Text>
                )}

                <Text wrap="truncate" bold color={command.status === 'success' ? 'white' : 'gray'}>
                  {command.title}
                </Text>
              </Box>

              {command.display && (
                <Text wrap="truncate" bold color="blue">
                  {command.display}
                </Text>
              )}
            </Box>

            {command.status !== 'success' && (
              <Box marginLeft={2}>
                <command.component
                  onUpdateDisplay={value => {
                    updateCommand(command.id, { display: value })
                  }}
                  onSubmit={values => {
                    completeCommand({ value: values?.value, display: values?.display, id: command.id })
                  }}
                />
              </Box>
            )}
          </Box>
        )
      })}
    </Box>
  )
}
