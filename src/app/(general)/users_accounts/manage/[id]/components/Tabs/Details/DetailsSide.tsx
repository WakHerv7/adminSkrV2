import ActiveYesNo from "@/components/shared/ActiveYesNo";
import CButton from "@/components/shared/CButton";
import { FourDots } from "@/components/shared/icons";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { FaLock } from "react-icons/fa";
import { PiCirclesFourFill } from "react-icons/pi";

export default function DetailsSide() {

  return (
    <div className="w-64 flex flex-col gap-y-[25px]">
        
        <div>
          <h1 className="text-lg text-gray-700 font-bold">Informations de compte</h1>
          <p className="text-xs text-gray-500">liste en temps réel des dernieres transactions effectuées avec les cartes</p>
        </div>
        
        <div>
          <p className="text-gray-800 text-sm font-normal tracking-tight">Compte créé depuis le <span className="ml-3">24/01/2024</span></p>
        </div>
        
        <div className="">
          <p className="text-gray-800 text-sm font-normal tracking-tight">Total solde sekure</p>
          <p className="text-[#18BC7A] text-2xl font-bold tracking-tight my-1">24 558 450 Fcfa</p>
          <div className="flex justify-between items-center gap-3">
            <CButton
            text={'Recharger'}
            href={`#`}
            btnStyle={'dark'}
            icon={<FourDots />}
            width={'100%'}            
            />
            <CButton
            text={'Retirer'}
            href={`#`}
            btnStyle={'dark'}
            icon={<FourDots />}
            width={'100%'}              
            />
          </div>
        </div>

        <div className="">
          <p className="text-gray-800 text-sm font-normal tracking-tight">Total solde sekure</p>
          <p className="text-[#18BC7A] text-2xl font-bold tracking-tight my-1">24 558 450 Fcfa</p>
          <div className="flex justify-between items-center gap-3">
            <CButton
            text={'Recharger'}
            href={`#`}
            btnStyle={'dark'}
            icon={<FourDots />}
            width={'100%'}            
            />
            <CButton
            text={'Retirer'}
            href={`#`}
            btnStyle={'dark'}
            icon={<FourDots />}
            width={'100%'}              
            />
          </div>
        </div>

        <div className="flex flex-col justify-start gap-2">
          <div className="flex justify-between items-center w-full">
            <span className="text-gray-800 text-sm font-normal">Etat du compte</span>
            <ActiveYesNo className={`text-xs`} isActive={true}/>
          </div>
          <CButton 
          text={'Bloquer'} 
          btnStyle={'yellow'}
          icon={<FaLock />}
          width={'100%'}
          />
        </div>


        <div className="flex flex-col justify-start gap-2">
          <div className="flex justify-between items-center w-full">
            <p className="text-gray-800 text-sm font-normal tracking-tight">Etat du KYC</p>
            <ActiveYesNo className={`text-xs`} isActive={true}/>
          </div> 
          <CButton
            text={'Voir details KYC'}
            href={`#`}
            btnStyle={'dark'}
            width={'100%'}              
            />
        </div>


      </div>
  )
}
