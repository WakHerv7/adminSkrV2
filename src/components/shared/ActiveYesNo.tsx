import React from 'react'
import { Button } from '../ui/button'
import LabelWithBadge from './LabelWithBadge';

const ActiveYesNo = ({ 
  isActive, activeLabel, inactiveLabel, activeColor, inactiveColor, textColor, className
}: {   
  isActive: boolean | React.ReactNode,  
  activeLabel?: string,
  inactiveLabel?: string,
  activeColor?: string,
  inactiveColor?: string,
  textColor?: string,
  className?: string,
}) => {
  return (
    <>
    {isActive ? 
    <LabelWithBadge 
    label={activeLabel ?? 'Actif'}
    badgeColor={activeColor ?? '#18BC7A'}
    className={className}
    />
    :
    <LabelWithBadge 
    label={inactiveLabel ?? 'Inactif'}
    badgeColor={inactiveColor ?? '#444'}
    className={className}
    />
    }
    </>
  )
}

export default ActiveYesNo;