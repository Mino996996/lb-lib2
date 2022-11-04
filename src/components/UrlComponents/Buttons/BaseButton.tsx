import React from 'react'
interface Props {
  onClickCallback: () => void
  name: string
}

const BaseButton: React.FC<Props> = ({ onClickCallback, name }) => {
  return (
    <button
      className="px-2 bg-green-50 rounded border border-gray-400 text-sm text-gray-700"
      onClick={onClickCallback}
    >
      {name}
    </button>
  )
}

export default BaseButton
