import React from 'react'

interface LegendItemProps {
    label: string;
    color: string;
    value?: string;
}

const LegendItem: React.FC<LegendItemProps> = ({ label, color, value }) => {
  return (
    <div className='flex justify-between items-center w-full gap-1'>
      <span className='rounded-full p-2' style={{background:color}}/>
      <span className='text-xs font-normal flex-1 ml-1'>{label}</span>
      <span className='text-xs font-semibol text-[#18BC7A]'>{value}</span>
    </div>
  )
}

export default LegendItem;