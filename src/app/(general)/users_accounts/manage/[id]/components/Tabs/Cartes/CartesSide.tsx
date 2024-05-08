import CartesCard from "@/components/cards/CartesCard/CartesCard";
import Doughnut from "@/components/charts/Doughnut";
import LegendItem from "@/components/shared/LegendItem";
import { HiLightBulb } from "react-icons/hi";
import { FaLock } from "react-icons/fa";
import { MdDeleteForever, MdLightbulbCircle, MdCheckCircle, MdRemoveCircle } from "react-icons/md"
import { IoIosCloseCircle } from "react-icons/io";
// import { doughnutData } from "@/constants/Index";

export const doughnutData = {
  labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
  datasets: [
    {
      label: 'My First Dataset',
      // data: [300, 50, 100, 40, 120, 80],
      data: Array.from({length: 6}, () => Math.floor(Math.random() * 301) + 100),
      backgroundColor: [
        '#FFDB5A',
        '#F85D4B',
        '#6200EE',
        '#FD8A49',
        '#33E89C',
        '#5BCEFF',
      ],
      hoverOffset: 4,
    },
  ],
};

const CartesSide = ({nbCards}:{nbCards: string | number}) => {
  return (
    <>      
      <div className="w-60">
        <h1 className="text-sm font-semibold tracking-tight mb-1">Nombre de cartes</h1>
        <h1 className="text-2xl text-[#18BC7A] font-semibold ">{nbCards}</h1>
        <div className="flex justify-between items-center gap-2 w-full my-5">
          <p title="Actives" className=" flex items-center gap-3 text-sm font-normal">
            {/* Actives  */}
            <MdCheckCircle size={22} color="#18BC7A"/>
            <span className="ml-1 font-bold">3</span>
          </p>
          <p title="Bloquées" className=" flex items-center gap-3 text-sm font-normal">
            {/* <MdRemoveCircle size={22} color="#FFDB5A"/> */}
            <MdRemoveCircle size={22} color="#777"/>
            <span className="ml-1 font-bold">3</span>
          </p>
          <p title="Supprimées" className=" flex items-center gap-3 text-sm font-normal">
            <IoIosCloseCircle size={22} color="#F85D4B"/>
            <span className="ml-1 font-bold">3</span>
          </p>
          {/* <p className="text-xs font-normal">
            Bloquées 
            <span className=" text-[#444] ml-1 font-bold">2</span></p>
          <p className="text-xs font-normal">
            Supprimées 
            <span className=" text-[#F85D4B] ml-1 font-bold">3</span></p> */}
        </div>
        <h1 className="text-sm font-semibold tracking-tight">Total solde Cartes</h1>
        <h1 className="text-2xl text-[#18BC7A] font-semibold mb-5">8 450 Fcfa</h1>
        <h1 className="text-sm font-semibold tracking-tight">Total Paiements</h1>
        <h1 className="text-2xl text-[#18BC7A] font-semibold mb-5">8 450 Fcfa</h1>

        <h1 className="text-sm font-semibold">Origine des utilisateurs</h1>
        {/* <div className="w-full flex justify-center items-center">
          <Doughnut data={doughnutData} />
        </div> */}
        <div className="relative  overflow-hidden">
            {/* <h1 className='text-md lg:text-lg font-semibold text-black text-left '>Traffic de paiements</h1> */}
            <Doughnut data={doughnutData} />
            <div className='flex flex-wrap gap-x-10 gap-3'>
                <LegendItem  label={`Facebook.com`} color={`#33E89C`} value={`46%`}/>
                <LegendItem  label={`Amazon.com`} color={`#FFDB5A`} value={`46%`}/>
                <LegendItem  label={`Tinder.com`} color={`#FD8A49`} value={`46%`}/>
                <LegendItem  label={`Alibaba.com`} color={`#6200EE`} value={`46%`}/>
                <LegendItem  label={`Google ads`} color={`#5BCEFF`} value={`46%`}/>
                <LegendItem  label={`Autres`} color={`#F85D4B`} value={`46%`}/>
            </div>
        </div>
      </div>
    </>
  )
}

export default CartesSide;