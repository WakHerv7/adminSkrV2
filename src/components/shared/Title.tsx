import React from 'react'

interface TitleProps {
    title: string;
    subtitle?: string;
    size?: number;
}

const Title: React.FC<TitleProps> = ({ title, subtitle, size }) => {
  return (
    <div className='flex-1 flex flex-col gap-1'>
        <span className={`text-md lg:text-[${size ?? 18}'px'] font-semibold text-black`}>{title}</span>
        <span className='text-sm text-gray-900'>{subtitle}</span>
    </div>
  )
}

export default Title;