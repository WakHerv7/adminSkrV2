import React from 'react'

interface LegendItemProps {
    label: string;
    color: string;
    value?: string;
    iconSize?: number;
    key?: number | string;
}

const LegendItem: React.FC<LegendItemProps> = ({ key, label, color, value, iconSize }) => {
  return (
    <div key={key} className='flex justify-between items-center w-full gap-1'>
      <span className={`rounded-full ${iconSize ? '' : 'p-2'}`} style={{background:color, padding: `${iconSize ?? 7}px`}}/>
      <span className='text-xs font-normal flex-1 ml-1'>{label}</span>
      <span className='text-xs font-semibol text-[#18BC7A]'>{value}</span>
    </div>
  )
}

export default LegendItem;