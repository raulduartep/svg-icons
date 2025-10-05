import React, { useMemo } from 'react'

import { Select, TSelectOption } from '../../components/select.js'

type TProps = {
  iconSetManifest: Map<string, string>
  onSubmit: (params: { value: string[]; display: string }) => void
}

export function SelectIconCommandComponent({ onSubmit, iconSetManifest }: TProps) {
  const handleSubmit = (selected: TSelectOption[]) => {
    const selectedValues = selected.map(option => option.value)
    onSubmit({ value: selectedValues, display: selectedValues.join(', ') })
  }

  const options = useMemo(() => {
    return Array.from(iconSetManifest.entries()).map(([name, fileUrl]) => ({
      label: name,
      value: name,
      preview: fileUrl,
    }))
  }, [iconSetManifest])

  return <Select options={options} multiple visibleOptionCount={24} onSubmit={handleSubmit} />
}
