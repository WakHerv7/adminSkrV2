import React from 'react'
import { Button } from '../ui/button'
import LabelWithBadge from './LabelWithBadge';

const ActiveYesNo = ({ 
  isActive, label, color, textColor, className
}: {   
  isActive: boolean | React.ReactNode,  
  label?: string,
  color?: string,
  textColor?: string,
  className?: string,
}) => {
  return (
    <>
    {isActive ? 
    <LabelWithBadge 
    label={label ?? 'Actif'}
    badgeColor={color ?? '#18BC7A'}
    className={className}
    textColor={textColor ?? '#444'}
    />
    :
    <LabelWithBadge 
    label={label ?? 'Inactif'}
    badgeColor={color ?? '#444'}
    className={className}
    textColor={textColor ?? '#444'}
    />
    }
    </>
  )
}

export default ActiveYesNo;