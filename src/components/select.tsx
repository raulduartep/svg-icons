import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { search } from 'fast-fuzzy'
import figures from 'figures'
import imageToAscii from 'image-to-ascii'
import { Box, Text, useInput } from 'ink'
import open from 'open'
import sharp from 'sharp'

import { useTerminalDimensions } from '../hooks/useTerminalDimensions.js'

import { TextInput } from './text-input.js'

export type TSelectOption = {
  label: string
  value: string
  description?: string
  preview?: string
}

type TSelectPreviewImgProps = {
  src: string
  terminalWidth?: number
}

function SelectPreviewImg({ src, terminalWidth }: TSelectPreviewImgProps) {
  const [imgBuffer, setImgBuffer] = useState<Buffer>()
  const [asciiImg, setAsciiImg] = useState<string>()

  const fixedWidth = useMemo(() => (terminalWidth ? Math.min(terminalWidth - 4, 48) : 48), [terminalWidth])

  useEffect(() => {
    sharp(src).png().toBuffer().then(setImgBuffer)
  }, [src])

  useEffect(() => {
    if (!imgBuffer) return

    imageToAscii(
      imgBuffer as any,
      {
        pixels: ' .:-=+*#%@',
        size: { height: fixedWidth, width: fixedWidth },
        reverse: false,
        colored: false,
        bg: false,
        size_options: {
          preserve_aspect_ratio: true,
          fit_screen: false,
          px_size: {
            width: 1,
            height: 0.5,
          },
        },
      } as any,
      (err, converted) => {
        if (err) return

        setAsciiImg(converted)
      }
    )
  }, [terminalWidth, imgBuffer])

  return (
    <Box minWidth={fixedWidth}>
      <Text>{asciiImg}</Text>
    </Box>
  )
}

type TSelectOptionProps = {
  isFocused: boolean
  isSelected: boolean
  option: TSelectOption
}

function SelectOption({ isFocused, isSelected, option }: TSelectOptionProps) {
  return (
    <Box flexDirection="column" width="100%" alignItems="flex-start">
      <Box gap={1} paddingLeft={isFocused ? 0 : 2}>
        {isFocused && <Text color="blue">{figures.pointer}</Text>}

        <Text color={isSelected ? 'green' : isFocused ? 'blue' : 'white'} wrap="truncate-middle">
          {option.label}
        </Text>

        {isSelected && <Text color="green">{figures.tick}</Text>}
      </Box>

      {option.description && (
        <Box width="100%">
          <Text color="gray">{figures.info}</Text>

          <Box width="90%">
            <Text color="gray" wrap="truncate" underline={true}>
              {option.description}
            </Text>
          </Box>
        </Box>
      )}
    </Box>
  )
}

type TSelectTipsProps = {
  multiple?: boolean
  focusedOption?: TSelectOption
}

function SelectTips({ multiple, focusedOption }: TSelectTipsProps) {
  return (
    <Box columnGap={1} flexWrap="wrap" flexGrow={1}>
      <Box columnGap={1}>
        <Text color="blue" bold>
          {figures.arrowUp}/{figures.arrowDown}
        </Text>
        <Text color="gray" dimColor>
          Navigate
        </Text>
      </Box>

      <Box columnGap={1}>
        <Text color="blue" bold>
          {'<enter>'}
        </Text>
        <Text color="gray" dimColor>
          Confirm
        </Text>
      </Box>

      {multiple && (
        <Box columnGap={1}>
          <Text color="blue" bold>
            {'<tab>'}
          </Text>

          <Text color="gray" dimColor>
            Tab Toggle
          </Text>
        </Box>
      )}

      {focusedOption?.preview && (
        <Box columnGap={1}>
          <Text color="blue" bold>
            {'<ctrl+p>'}
          </Text>

          <Text color="gray" dimColor>
            Preview Image
          </Text>
        </Box>
      )}
    </Box>
  )
}

type TSelectProps<T extends boolean> = {
  options: TSelectOption[]
  multiple?: T
  visibleOptionCount?: number
  onSubmit?: (value: T extends true ? TSelectOption[] : TSelectOption) => void
}

export function Select<T extends boolean = false>({
  options,
  multiple,
  onSubmit,
  visibleOptionCount = 4,
}: TSelectProps<T>) {
  const { width } = useTerminalDimensions()

  const [focusedOptionIndex, setFocusedOptionIndex] = useState(0)
  const [selectedOptions, setSelectedOptions] = useState<TSelectOption[]>([])
  const [filter, setFilter] = useState('')

  const scrollOffsetRef = useRef(0)

  const isLessThan70 = useMemo(() => width < 70, [width])

  const filteredOptions = useMemo(() => {
    const lowerFilter = filter.toLocaleLowerCase().trim()

    let filtered = options

    if (lowerFilter) {
      filtered = search(filter, options, { keySelector: obj => obj.label })
    }

    return filtered
  }, [options, filter])

  const visibleOptions = useMemo(() => {
    const visibleCount = isLessThan70 ? 4 : visibleOptionCount
    if (filteredOptions.length <= visibleCount) {
      return filteredOptions
    }

    const scrollOffset = scrollOffsetRef.current
    let newScrollOffset = scrollOffset

    // Scroll down if focused option is below visible area
    if (focusedOptionIndex >= scrollOffset + visibleCount) {
      newScrollOffset = focusedOptionIndex - visibleCount + 1
    }

    // Scroll up if focused option is above visible area
    if (focusedOptionIndex < scrollOffset) {
      newScrollOffset = focusedOptionIndex
    }

    // Ensure bounds
    newScrollOffset = Math.max(0, Math.min(newScrollOffset, filteredOptions.length - visibleCount))

    // Update scroll offset if it changed
    if (newScrollOffset !== scrollOffset) {
      scrollOffsetRef.current = newScrollOffset
    }

    return filteredOptions.slice(newScrollOffset, newScrollOffset + visibleCount)
  }, [filteredOptions, focusedOptionIndex, isLessThan70])

  const handleChangeFilter = (newFilter: string) => {
    setFilter(newFilter)
  }

  const focusedOption = filteredOptions[focusedOptionIndex] as TSelectOption | undefined

  useInput((input, key) => {
    if (key.downArrow) {
      setFocusedOptionIndex(prev => Math.min(prev + 1, filteredOptions.length - 1))
      return
    }

    if (key.upArrow) {
      setFocusedOptionIndex(prev => Math.max(prev - 1, 0))
      return
    }

    if (key.ctrl && input === 'p' && focusedOption?.preview) {
      open(focusedOption.preview).catch()
      return
    }

    if (key.tab && focusedOption && multiple) {
      setSelectedOptions(prev => {
        const isSelected = prev.some(opt => opt.value === focusedOption.value)

        if (isSelected) {
          return prev.filter(opt => opt.value !== focusedOption.value)
        } else {
          return multiple ? [...prev, focusedOption] : [focusedOption]
        }
      })
      handleChangeFilter('')
      return
    }

    if ((key.backspace || key.delete) && filter.length === 0 && multiple) {
      setSelectedOptions(prev => prev.slice(0, -1))
      return
    }

    if (key.return) {
      onSubmit?.((multiple ? selectedOptions : focusedOption) as T extends true ? TSelectOption[] : TSelectOption)
      return
    }
  })

  return (
    <Box flexDirection="column" flexGrow={1}>
      <SelectTips multiple={multiple} focusedOption={focusedOption} />

      <Box borderRight={false} borderLeft={false} borderTop={false} borderStyle="round" borderColor="blue" gap={1}>
        <Text bold color="blue">
          {figures.arrowRight}
        </Text>

        <Box columnGap={1} flexWrap="wrap">
          {selectedOptions.length > 0 &&
            selectedOptions.map(option => (
              <Fragment key={`selected-${option.value}`}>
                <Text bold color="green">
                  {option.label}
                </Text>

                <Text color="blue">{figures.line}</Text>
              </Fragment>
            ))}

          <TextInput onChangeValue={handleChangeFilter} value={filter} />
        </Box>
      </Box>

      <Box gap={isLessThan70 ? 1 : 5} width="100%" flexDirection={isLessThan70 ? 'column' : 'row'}>
        <Box flexDirection="column" flexGrow={1}>
          {visibleOptions.map(option => {
            return (
              <SelectOption
                key={option.value}
                isFocused={focusedOption?.value === option.value}
                isSelected={selectedOptions.some(selected => selected.value === option.value)}
                option={option}
              />
            )
          })}
        </Box>

        {focusedOption?.preview && <SelectPreviewImg src={focusedOption.preview} terminalWidth={width} />}
      </Box>
    </Box>
  )
}
