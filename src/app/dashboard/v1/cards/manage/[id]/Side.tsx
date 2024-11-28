import { CardService } from "@/api/services/card";
import CartesCard from "@/components/cards/CartesCard/CartesCard";
import ActiveYesNo from "@/components/shared/ActiveYesNo";
import CButton from "@/components/shared/CButton";
import { FourDots } from "@/components/shared/icons";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { selectCurrentCard } from "@/redux/slices/card";
import { getFormattedDateTime } from "@/utils/DateFormat";
import { retrieveUSDAmount } from "@/utils/utils";
import Link from "next/link";
import { FaLock } from "react-icons/fa";
import { PiCirclesFourFill } from "react-icons/pi";
import { useSelector } from "react-redux";
import Doughnut from "@/components/charts/Doughnut";
import LegendItem from "@/components/shared/LegendItem";
import { getUserPaymentsGraphData } from "@/utils/graphs";

const cardOne = {
  id: 5,
  cardNumber: '1234 5678 9101 2345',
  type: "visa",
  matricule: 'skrcV55871327',
  date: '14 / 01 / 2024',
  solde: '215 000 Fcfa',
  status: 'Active',
  activateDate: 'il y a 02 mois'
};

type Props = {
	isLoading?:boolean;
	search?:string; 
	setSearch?:(data?:any)=>void;
}

export default function Side({isLoading}:Props) {
  
  const currentCardData:any = useSelector(selectCurrentCard);

  const cardXAFAmount = `${currentCardData?.card?.amount?.toLocaleString('fr-FR') ?? 0} XAF`;
  const cardUSDAmount = `${retrieveUSDAmount({amount:currentCardData?.card?.amount, amountUSD:currentCardData?.card?.amountUSD})?.toLocaleString('fr-FR')} USD`;

  const {
    userPaymentsGraphData, 
    userPaymentsData
  } = getUserPaymentsGraphData(currentCardData?.payments?.groups ?? [], 'Total des paiements');
  
  return (
    <div className="min-w-[200px] flex flex-col gap-y-[25px]  pr-5 border-r-1">
      {isLoading ? 
        <div className="flex justify-center w-full py-10">
            <div className={'loadingSpinner'}></div>
        </div>
        :
        <>
        <CartesCard
          key={currentCardData?.card?._id}
          index={currentCardData?.card?._id}
          title={'Informations de carte'}
          card={currentCardData?.card}
          cardNumber={currentCardData?.card?.number}
          type={currentCardData?.card?.brand ?? ""}
          matricule={currentCardData?.card?.reference ?? ""}
          date={getFormattedDateTime(currentCardData?.card?.createdAt) ?? ""}
          solde={cardXAFAmount}
          soldeUSD={cardUSDAmount}
          status={currentCardData?.card?.status ?? ""}
          activateDate={getFormattedDateTime(currentCardData?.card?.balanceUpdatedAt) ?? ""}
          customer={currentCardData?.card?.userDetails}
          expanded
          nbPayments={currentCardData?.paymentStats?.totalCount ?? 0}
          nbPaymentsSuccess={currentCardData?.paymentStats?.totalSuccessCount ?? 0}
          nbPaymentsFailed={currentCardData?.paymentStats?.totalFailedCount ?? 0}
          averagePaymentAmountPerWeek={currentCardData?.paymentStats?.averageTransactionsPerWeek?.amount ?? 0}
          totalPayments={currentCardData?.paymentStats?.totalSuccessAmount ?? 0}
          totalRetraits={currentCardData?.retraitStats?.totalSuccessAmount ?? 0}
          totalRecharges={currentCardData?.rechargeStats?.totalSuccessAmount ?? 0}
        />
        <div className="mt-3">
          <h1 
          style={{display:currentCardData?.payments?.groups?'block':'none'}} 
          className="text-sm font-semibold">
            Destination des paiements</h1>
          {/* <div className="w-full flex justify-center items-center">
            <Doughnut data={doughnutData} />
          </div> */}
          <div 
          style={{display:currentCardData?.payments?.groups?'block':'none'}} 
          className="relative  overflow-hidden">
              {/* <h1 className='text-md lg:text-lg font-semibold text-black text-left '>Traffic de paiements</h1> */}
              <Doughnut data={userPaymentsGraphData} />
              <div className='flex flex-wrap gap-x-10 gap-3'>
                  {userPaymentsData?.map((item:any, index:any) => (
                    <LegendItem key={index} label={item.merchant?.name} color={item.color} value={`${item.percentageOfTotal?.toFixed(2)}%`}/>
                  ))} 
                  {/* <LegendItem  label={`Facebook.com`} color={`#33E89C`} value={`46%`}/>
                  <LegendItem  label={`Amazon.com`} color={`#FFDB5A`} value={`46%`}/>
                  <LegendItem  label={`Tinder.com`} color={`#FD8A49`} value={`46%`}/>
                  <LegendItem  label={`Alibaba.com`} color={`#6200EE`} value={`46%`}/>
                  <LegendItem  label={`Google ads`} color={`#5BCEFF`} value={`46%`}/>
                  <LegendItem  label={`Autres`} color={`#F85D4B`} value={`46%`}/> */}
              </div>
          </div>
        </div>
        </>
      }
      </div>
  )
}
