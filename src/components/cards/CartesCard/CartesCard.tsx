
"use client"
import { Button } from "@/components/ui/button";
import { PiCirclesFourFill } from "react-icons/pi";
import Link from "next/link";
import CButton from "@/components/shared/CButton";
import { FourDots } from "@/components/shared/icons";
import { GoDotFill } from "react-icons/go";
import { MdCheckCircle } from "react-icons/md";
import { IoIosCloseCircle } from "react-icons/io";

interface ICartesCard {
  cardNumber: string;
  type: string;
  matricule: string;
  date: string;
  solde: string;
  status: string;
  activateDate: string;
  title?: string;
  expanded?: boolean;
  nbPayments?: string;
  nbPaymentsSuccess?: string;
  nbPaymentsFailed?: string;
  cardBalance?: string;
  totalBalance?: string;
  average?: string;
}

const CartesCard = ({
  cardNumber,
  type,
  matricule,
  date,
  solde,
  status,
  activateDate,
  title,
  expanded,
  nbPayments,
  nbPaymentsSuccess,
  nbPaymentsFailed,
  cardBalance,
  totalBalance,
  average,
}: ICartesCard) => {
  return (
    <div className="flex flex-col justify-start items-start gap-3">
      <h1 className="text-base font-semibold tracking-tight">{title ?? 'Carte 1'}</h1>
      <div className={`px-3 py-3 bg-[#FFDB5A] outline-none border-none shadow-sm 
      flex justify-center items-center rounded-2xl w-full`}>
        <h1 className="text-lg font-bold tracking-wide">
          <span className="flex flex-wrap items-center gap-2">
            {[1,1,1].map((item, idx) => (
              <span key={idx} className="flex h-5 items-center">
                {[1,1,1,1].map((si, sidx) => (
                  <GoDotFill key={sidx} size={10}/>
                ))}
              </span>
            ))}
            {cardNumber.slice(14).trim()}
          </span>
        </h1>
      </div>
      <div className="flex justify-between items-center w-full mb-2">
        <div className="flex flex-col justify-start p-1">
          <h1 className="text-sm font-semibold text-left tracking-tight">Type</h1>
          <h1 className="text-sm font-semibold text-left tracking-tight">Matricule</h1>
          <h1 className="text-sm font-semibold text-left tracking-tight">Créé le</h1>
          <h1 className="text-sm font-semibold text-left tracking-tight">Solde</h1>
          <h1 className="text-sm font-semibold text-left tracking-tight">Etat</h1>
          <h1 className="text-sm font-semibold text-left tracking-tight">Dernière activité</h1>
        </div>
        <div className="flex flex-col justify-start p-1">
          <span className="text-sm font-[300] tracking-tighter">{type}</span>
          <span className="text-sm font-[300] tracking-tighter">{matricule}</span>
          <span className="text-sm font-[300] tracking-tighter">{date}</span>
          <span className="text-sm font-[300] tracking-tighter">{solde}</span>
          <span className="text-sm font-[300] tracking-tighter">{status}</span>
          <span className="text-sm font-[300] tracking-tighter">{activateDate}</span>
        </div>
        <br />
      </div>
      {expanded ?
      <>
        <h1 className="text-sm font-semibold tracking-tight">Nombre de paiements</h1>
        <h1 className="text-2xl text-[#18BC7A] font-semibold ">{nbPayments}</h1>
        <div className="flex items-center gap-3 w-full my-2">
          <p title="Actives" className=" flex items-center gap-3 text-sm font-normal">
            {/* Actives  */}
            <MdCheckCircle size={22} color="#18BC7A"/>
            <span className="ml-1 font-bold">{nbPaymentsSuccess}</span>
          </p>
          <p title="Echouées" className=" flex items-center gap-3 text-sm font-normal">
            <IoIosCloseCircle size={22} color="#F85D4B"/>
            <span className="ml-1 font-bold">{nbPaymentsFailed}</span>
          </p>
          {/* <p className="text-xs font-normal">
            Bloquées 
            <span className=" text-[#444] ml-1 font-bold">2</span></p>
          <p className="text-xs font-normal">
            Supprimées 
            <span className=" text-[#F85D4B] ml-1 font-bold">3</span></p> */}
        </div>
        <h1 className="text-sm font-semibold ">Solde Carte</h1>
        <h1 className="text-2xl text-[#18BC7A] font-semibold mb-3">{cardBalance} XAF</h1>
        <h1 className="text-sm font-semibold ">Total Paiements</h1>
        <h1 className="text-2xl text-[#18BC7A] font-semibold mb-3">{totalBalance} XAF</h1>
        <h1 className="text-sm font-semibold ">Moyenne par semaine</h1>
        <h1 className="text-2xl text-[#18BC7A] font-semibold mb-3">{average} XAF</h1>
      </>
      :<></>}
      <div className="grid grid-cols-2 gap-3">
          <CButton
            text={'Recharger'}
            href={`#`}
            btnStyle={'dark'}
            icon={<FourDots />}
                      
          />
          <CButton
            text={'Retirer'}
            href={`#`}
            btnStyle={'dark'}
            icon={<FourDots />}                    
          />
          <CButton
            text={'Bloquer'}
            href={`#`}
            btnStyle={'dark'}
            icon={<FourDots />}                    
          />
          <CButton
            text={'Supprimer'}
            href={`#`}
            btnStyle={'dark'}
            icon={<FourDots />}                    
          />
          <div className="col-span-2">
          {!expanded ?
            <CButton
              text={'Voir transactions'}
              href={`#`}
              btnStyle={'dark'}
              icon={<FourDots />}
              width={'100%'}            
            />
          :
          <></>}
          
          </div>
        {/* {[1, 2, 3, 4].map((_, idx) => (
          <Button key={idx} id={idx.toString()} type="button" className="text-sm text-gray-300 rounded-full w-[109px]" asChild>
            <Link href="#">
              <PiCirclesFourFill color="white" size={24} className="mr-1" />Bloquer
            </Link>
          </Button>
        ))}
        <Button type="button" className="text-sm text-gray-300 rounded-full px-6" asChild>
          <Link href="#">
            <PiCirclesFourFill color="white" size={24} className="mr-4" />Bloquer
          </Link>
        </Button> */}
      </div>
    </div>
  )
}

export default CartesCard;
