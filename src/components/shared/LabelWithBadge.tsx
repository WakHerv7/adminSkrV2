import React from 'react'
import { Button } from '../ui/button'

const LabelWithBadge = ({ 
  label, badgeColor, textColor
}: {   
  label: string,
  badgeColor?: string,
  textColor?: string,
}) => {
  return (
    <div className="relative pl-5">
      <div className={`absolute top-[5px] left-0 w-[10px] h-[10px] bg-[${badgeColor}] rounded-full 
      text-center flex justify-center items-center text-[10px] font-bold text-white`}>                
      </div>
      <span style={{color:textColor ?? '#444'}}>{label}</span>
    </div>
  )
}

export default LabelWithBadge;