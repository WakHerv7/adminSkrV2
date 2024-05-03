import React from 'react'
import { Button } from '../ui/button'
import LabelWithBadge from './LabelWithBadge';

const ActiveYesNo = ({ 
  isActive, activeLabel, inactiveLabel, activeColor, inactiveColor, textColor
}: {   
  isActive: boolean | React.ReactNode,  
  activeLabel?: string,
  inactiveLabel?: string,
  activeColor?: string,
  inactiveColor?: string,
  textColor?: string,
}) => {
  return (
    <>
    {isActive ? 
    <LabelWithBadge 
    label={activeLabel ?? 'Actif'}
    badgeColor={activeColor ?? '#18BC7A'}
    />
    :
    <LabelWithBadge 
    label={inactiveLabel ?? 'Inactif'}
    badgeColor={inactiveColor ?? '#444'}
    />
    }
    </>
  )
}

export default ActiveYesNo;