import React from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


const SelectComponent = () => {
  return (
    <Select>
      <SelectTrigger className="w-full bg-gray-100">
        <SelectValue placeholder="Inactif depuis plus d'un mois " />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="light">Light</SelectItem>
        <SelectItem value="dark">Dark</SelectItem>
        <SelectItem value="system">System</SelectItem>
      </SelectContent>
    </Select>

  )
}

export default SelectComponent
