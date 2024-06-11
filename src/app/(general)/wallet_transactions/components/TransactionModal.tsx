
import Title from '@/components/shared/Title';
import cstyle from'../styles/style.module.scss';
import Link from 'next/link';
import { FaX } from 'react-icons/fa6';
import { usePathname } from 'next/navigation';
import { TDataList } from "@/components/cards/InfoCard";
import {
    checkCircleIcon,
    ongoingCircleIcon,
    haltCircleIcon,
    transferIcon,
    calendarIcon,
    transferIconToday,
    transferIconAvg,
    transferIconTotal,
    mobileMoneyIcon,
    sekureIcon,
    transferIconMomoToday,
    transferIconMomoTotal,
    transferIconSekureToday,
    transferIconSekureTotal,
  } from '@/constants/Index';
import CButton from '@/components/shared/CButton';
import { FourDots } from '@/components/shared/icons';
import { IoCopyOutline } from 'react-icons/io5';


  const infoData: TDataList[] = [
    [
        [{
            key: 'type',
            label:{text: 'Type', fw:"bold", color:"#444"},
            value:{text:"Compte a compte", fw:"bold", color:"#444"}
        }],
        [{
            key: 'date',
            label:{text: 'Date', fw:"bold", color:"#444"},
            value:{text:"22 juin 2024", fw:"bold", color:"#444"}
        }],
        [{
            key: 'status',
            label:{text: 'Statut', fw:"bold", color:"#444"},
            value:{text:"Réussi", color:"#18BC7A"}
        }],
        [{
            key: 'name',
            label:{text: 'Nom utilisateur', fw:"bold", color:"#444"},
            value:{text:"ATEBA Jean", color:"#444"}
        }],
        [{
            key: 'country',
            label:{text: 'Pays', fw:"bold", color:"#444"},
            value:{text:"Gabon", color:"#444"}
        }],
        [{
            key: 'phone',
            label:{text: 'Téléphone', fw:"bold", color:"#444"},
            value:{text:"+237 699 58 62 35", color:"#444"}
        }],
        [{
            key: '',
            label:{text: 'Téléphone débiteur', fw:"bold", color:"#444"},
            value:{text:"+237 699 58 62 35", color:"#444"}
        }],
        
    ],
    [
        [{
            key: '',
            label:{text: 'Heure', fw:"bold", color:"#444"},
            value:{text:"14h55",  color:"#444"}
        }],
        [{
            key: 'idTrx',
            label:{text: 'ID Transaction', fw:"bold", color:"#444"},
            value:{text:"SKR54DSG354SDG", color:"#444"}
        }],
        [{
            key: 'paymentMethod',
            label:{text: 'Moyen de paiement', fw:"bold", color:"#444"},
            value:{text:"Orange Money",  color:"#444"}
        }],
        [{
            key: 'amount',
            label:{text: 'Montant', fw:"bold", color:"#444"},
            value:{text:"50 000 XAF", fw:"bold", color:"#444"}
        }],
        [{
            key: 'amount',
            label:{text: 'Montant débité', fw:"bold", color:"#444"},
            value:{text:"50 350 XAF", fw:"bold", color:"#F85D4B"}
        }],
        [{
            key: '',
            label:{text: 'Solde préc.', fw:"bold", color:"#444"},
            value:{text:"353 000 XAF", color:"#444"}
        }],
        [{
            key: '',
            label:{text: 'Nouv. solde', fw:"bold", color:"#444"},
            value:{text:"225 000 XAF", fw:"bold", color:"#18BC7A"}
        }],
    ],    
];


interface TransferModalProps {
    item: object,
}
export default function TransactionModal({item}:TransferModalProps) {
    const pathname = usePathname();
    
    const itemData = (itm: object, infoData: TDataList[]): TDataList[] => {
        // Assuming TDataList is an array of arrays or a similar structure that supports forEach
        let modifiedInfoData: TDataList[] = JSON.parse(JSON.stringify(infoData)); // Shallow copy
        Object.keys(itm).forEach((key, itmIndex) => {
            modifiedInfoData.forEach((data, dataIndex) => {
                data.forEach((line, lineIndex) => {
                    line.forEach((x, xIndex) => {
                        if (key.toString() === String(x.key)) {
                            if (key.toString() === 'status') {
                                x.value.text = itm[key]? 'Réussi' : 'Echoué';
                                x.value.color = itm[key]? '#18BC7A' : '#F85D4B';
                            } else {
                                x.value.text = String(itm[key]);
                            }
                        }
                    });
                });
            });
        });
        return modifiedInfoData; // Consider adjusting the return type if necessary
    };

    return (
    <div className="bg-white m-auto p-8 rounded-md">
        <div className="flex justify-between mb-5">
            <Title
            title={"Details de la transaction"}
            />
            <Link href={pathname}>
                <FaX size={16} color={"#444"}/>
            </Link>
        </div>
        <div className={`${cstyle['dualGrid']}`}>
            {itemData(item, infoData).map((data, index) => (
                <div key={index} className={``}>
                {data.map((line, index1) => (
                    <div key={index1} className={`flex flex-wrap justify-between items-center mx-1`}>
                    {line.map((item, index2) => (                        
                        <div key={index2} className={`my-3 grid grid-cols-2 gap-3 w-full`}>
                            <span title={item.label.tooltip ?? ''} style={{fontSize: item.label.fs ?? '14px', color:item.label.color ?? '#444'}} className={`font-${item.label.fw ?? 'normal'}`}>
                                {item.label.text}
                            </span>
                            <span title={item.value.tooltip ?? ''} style={{fontSize: item.value.fs ?? '14px', color:item.value.color ?? '#444'}} className={`font-${item.value.fw ?? 'normal'}`}>
                                {item.value.text}
                            </span>
                        </div>
                    ))}
                    </div>
                ))}
                </div>
            ))}
        </div>
        <div className='flex gap-5 mt-8'>
                <CButton
                text={'Voir utilisateur'}
                href={``}
                btnStyle={'dark'}
                icon={<FourDots />}  
                height={'32px'}            
                width={'100%'}
                />
                <CButton
                text={'Copier'}
                icon={<IoCopyOutline/>}
                btnStyle={'lightGreen'}
                height={'32px'}
                width={'100%'}
                />
        </div>
    </div>
  )
}
