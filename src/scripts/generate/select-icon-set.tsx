import React from 'react'

import { Select, TSelectOption } from '../../components/select.js'
import { SORTED_ICON_SETS } from '../../constants/icon-set.js'
import { TIconSet } from '../../utils/types.js'

type TProps = {
  onSubmit: (params: { value: TIconSet; display: string }) => void
}

const options = SORTED_ICON_SETS.map<TSelectOption>(iconSet => ({
  label: iconSet.name,
  value: iconSet.id,
  description: iconSet.projectUrl,
}))

export function SelectIconSetCommandComponent({ onSubmit }: TProps) {
  const handleSubmit = (option: TSelectOption) => {
    const iconSet = SORTED_ICON_SETS.find(set => set.id === option.value)!
    onSubmit({ value: iconSet, display: iconSet.name })
  }

  return <Select options={options} onSubmit={handleSubmit} />
}
