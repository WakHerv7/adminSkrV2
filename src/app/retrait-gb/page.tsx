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
import RetraitBJModalForm from "./modals/RetraitBJModalForm";
import RetraitGBModalForm from "./modals/RetraitGBModalForm";
import { selectCurrentGetSekureApiToken, selectCurrentToken } from "@/redux/slices/auth";
import { useSelector } from "react-redux";
import { TransactionService } from "@/api/services/transaction";
import { GabonService } from "@/api/services/gabon";
import { useQuery } from "react-query";
import toast from "react-hot-toast";
import { BeninService } from "@/api/services/benin";
import { CameroonService } from "@/api/services/cameroon";

const getGabonBalance = async ({queryKey}:any) => {
  const [_key, token] = queryKey;
  if (token) {
    const response = await GabonService.get_gabon_balance({token});
    const responseJson = await response.json();
    if (!response.ok) {
      throw new Error(responseJson.message || 'Failed to get Gabon Balance'); 
    }  
    return responseJson.data; 
  } else {
    return {data: {message:"No token provided"}}
  }
};

const getBeninBalance = async ({queryKey}:any) => {
  const [_key, token] = queryKey;
  if (token) {
    const response = await BeninService.get_benin_balance({token});
    const responseJson = await response.json();
    if (!response.ok) {
      throw new Error(responseJson.message || 'Failed to get Benin Balance'); 
    }  
    return responseJson.data; 
  } else {
    return {data: {message:"No token provided"}}
  }
};


const getCameroonBalance = async ({queryKey}:any) => {
  const [_key, token] = queryKey;
  if (token) {
    const response = await CameroonService.get_cameroon_balance({token});
    const responseJson = await response.json();
    if (!response.ok) {
      throw new Error(responseJson.message || 'Failed to get Cameroon Balance'); 
    }  
    return responseJson.data; 
  } else {
    return {data: {message:"No token provided"}}
  }
};


export default function RetraitGBPage() {

  const getSekureApiToken = useSelector(selectCurrentGetSekureApiToken);

  const gabonBalanceQueryRes = useQuery({
    queryKey: ["gabon", getSekureApiToken],
    queryFn: getGabonBalance,
    onError: (err) => {
      toast.error("Failed to get Gabon balance.");
    },
    // enabled: false,
    refetchInterval: 60000, // Fetches data every 60 seconds
  });

  const beninBalanceQueryRes = useQuery({
    queryKey: ["benin", getSekureApiToken],
    queryFn: getBeninBalance,
    onError: (err) => {
      toast.error("Failed to get Benin balance.");
    },
    // enabled: false,
    refetchInterval: 60000, // Fetches data every 60 seconds
  });

  const cameroonBalanceQueryRes = useQuery({
    queryKey: ["cameroon", getSekureApiToken],
    queryFn: getCameroonBalance,
    onError: (err) => {
      toast.error("Failed to get Cameroon balance.");
    },
    // enabled: false,
    refetchInterval: 60000, // Fetches data every 60 seconds
  });

  console.log("gabonBalanceQueryRes.data : ", gabonBalanceQueryRes.data);
  console.log("beninBalanceQueryRes.data : ", beninBalanceQueryRes.data);
  console.log("cameroonBalanceQueryRes.data : ", cameroonBalanceQueryRes.data);

  useTitle("Sekure | Accueil", true);
  return (
    <Layout
      title="Retraits"
    >
      <div
      className="flex flex-col justify-center items-center"
      >
        <div className="text-xl font-bold mb-3">{`Solde Gabon (XAF)`}</div>
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


      <div
      className="flex flex-col justify-center items-center mt-[100px]"
      >
        <div className="text-xl font-bold mb-3">{`Solde Benin (XOF)`}</div>
        <div
        className={`h-10  mb-3 min-w-[300px] text-xl font-bold text-[#18BC7A] border-none bg-gray-100 rounded-md outline-none px-3
          flex justify-center items-center`}
        >
          {Number(beninBalanceQueryRes?.data?.balances?.[0]?.balance || 0).toLocaleString('fr-FR') ?? 0}
        </div>
        <div className="flex flex-wrap items-center gap-y-4 mt-3">
          <CButton
          text={"Retirer"}
          btnStyle={"green"}
          icon={<FourDots />}
          href="?withdrawBJ=true"
          />          
        </div>
      </div>


      <div
      className="flex flex-col justify-center items-center mt-[100px]"
      >
        <div className="text-xl font-bold mb-3">{`Solde Cameroun Pawapay (XAF)`}</div>
        <div
        className={`h-10  mb-3 min-w-[300px] text-xl font-bold text-[#18BC7A] border-none bg-gray-100 rounded-md outline-none px-3
          flex justify-center items-center`}
        >
          {Number(cameroonBalanceQueryRes?.data?.balances?.[0]?.balance || 0).toLocaleString('fr-FR') ?? 0}
        </div>
        <div className="flex flex-wrap items-center gap-y-4 mt-3">
          <CButton
          text={"Retirer"}
          btnStyle={"green"}
          icon={<FourDots />}
          href="?withdrawBJ=true"
          />          
        </div>
      </div>

      <Modal name={'withdrawGB'} modalContent={<RetraitGBModalForm amount={Number(gabonBalanceQueryRes?.data?.amount || 0)}/>}/>
      <Modal name={'withdrawBJ'} modalContent={<RetraitBJModalForm amount={Number(beninBalanceQueryRes?.data?.balances?.[0]?.balance || 0)}/>}/>
      <Modal name={'withdrawCM'} modalContent={<RetraitBJModalForm amount={Number(cameroonBalanceQueryRes?.data?.balances?.[0]?.balance || 0)}/>}/>
    </Layout>
  )
}
