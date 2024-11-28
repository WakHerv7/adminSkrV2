"use client";

import { useTitle } from "@/hooks/useTitle";
import Layout from "@/components/shared/Layout";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { transfertsSchema } from "@/validation/FormValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CButton from "@/components/shared/CButton";
import { FourDots } from "@/components/shared/icons";
import Modal from "@/components/shared/Modal/Modal";
import RetraitModalForm from "./modals/RetraitModalForm";
import { selectCurrentGetSekureApiToken, selectCurrentToken } from "@/redux/slices/auth";
import { useSelector } from "react-redux";
import { TransactionService } from "@/api/services/transaction";
import { GabonService } from "@/api/services/gabon";
import { useQuery } from "react-query";
import toast from "react-hot-toast";

const getGabonBalance = async ({queryKey}:any) => {
  const [_key, token] = queryKey;
  if (token) {
    const response = await GabonService.get_gabon_balance({token});
    const responseJson = await response.json();
    if (!response.ok) {
      throw new Error(responseJson.message || 'Failed to get users statistics'); 
    }  
    return responseJson.data; 
  } else {
    return {data: {message:"No token provided"}}
  }
  
};


export default function RetraitGBPage() {

  const getSekureApiToken = useSelector(selectCurrentGetSekureApiToken);

  const gabonBalanceQueryRes = useQuery({
    queryKey: ["allCustomers", getSekureApiToken],
    queryFn: getGabonBalance,
    onError: (err) => {
      toast.error("Failed to get Gabon balance.");
    },
    // enabled: false,
    refetchInterval: 60000, // Fetches data every 60 seconds
  });

  console.log("gabonBalanceQueryRes.data : ", gabonBalanceQueryRes.data);

  useTitle("Sekure | Accueil", true);
  return (
    <Layout
      title="Retrait Gabon"
    >
      <div
      className="flex flex-col justify-center items-center"
      >
        <div className="text-xl font-bold mb-3">{`Solde (XAF)`}</div>
        <div
        className={`h-10  mb-3 min-w-[300px] text-xl font-bold text-[#18BC7A] border-none bg-gray-100 rounded-md outline-none px-3
          flex justify-center items-center`}
        >
          {gabonBalanceQueryRes?.data?.amount?.toLocaleString('fr-FR') ?? 0}
        </div>
        <div className="flex flex-wrap items-center gap-y-4 mt-3">
          <CButton
          text={"Retirer"}
          btnStyle={"green"}
          icon={<FourDots />}
          href="?withdrawGB=true"
          />          
        </div>
      </div>
      <Modal name={'withdrawGB'} modalContent={<RetraitModalForm amount={Number(gabonBalanceQueryRes?.data?.amount ?? 0)}/>}/>
    </Layout>
  )
}
