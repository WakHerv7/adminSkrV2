"use client"
import Main from './Main'
import Side from './Side'
import Layout from '@/components/shared/Layout'
import { CardService } from '@/api/services/card';
import { useTitle } from '@/hooks/useTitle';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useQuery } from 'react-query';
import { selectCardSearchTerm, selectCurrentCard, setCardSearchTerm, setCardTransactions, setCurrentCard } from '@/redux/slices/card';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import urls from '@/config/urls';

const getOneCard = async ({queryKey}:any) => {
  const [_key, id] = queryKey;
  const response = await CardService.get_one_card(id);
  const responseJson = await response.json();
  if (!response.ok) {
    throw new Error(responseJson.message || 'Failed to get card ' + id); 
  }  
  return responseJson.data; 
};

const getCardTransactions = async ({queryKey}:any) => {
  const [_key, cardId, st] = queryKey;
  let params:any = {};
  if(st) params.searchTerm = st;
  if(cardId) params.cardId = cardId;
  const response = await CardService.get_card_transactions(params);
  const responseJson = await response.json();
  if (!response.ok) {
    throw new Error(responseJson.message || 'Failed to card transactions'); 
  }
  console.log("responseJson.data : ", responseJson.data);
  return responseJson.data; 
};


export default function Page() {
  useTitle("Sekure | Carte", true); 
  const {id} = useParams();
  const dispatch = useDispatch();
  const router = useRouter();

  // const cardSearchTerm:any = useSelector(selectCardSearchTerm);
  const [search, setSearch] = useState('');

  //------------------------------------------------
  const oneCardQueryRes = useQuery({
    queryKey: ["oneCard", id],
    queryFn: getOneCard,
    onError: (err) => {
      toast.error("Failed to get user : "+id);
    },  
  });
  dispatch(setCurrentCard(oneCardQueryRes.data));
  console.log("oneCardQueryRes.data : ", oneCardQueryRes.data);
  const cardData = oneCardQueryRes.data;
  //------------------------------------------------
  const cardTransactionsQueryRes = useQuery({
    queryKey: ["cardTransactions", id, search?.trim()],
    queryFn: getCardTransactions,
    onError: (err) => {
      toast.error("Failed to get card transactions : "+id);
    },
  });
  dispatch(setCardTransactions(cardTransactionsQueryRes.data));
  console.log("cardTransactionsQueryRes.data : ", cardTransactionsQueryRes.data);
  const cardTransactionsData = cardTransactionsQueryRes.data;
  //------------------------------------------------



  return (
    <Layout 
    title="Details Carte"
    goBack={()=>router.back()} //urls.cards.manage
    >
        <section 
        className="grid grid-cols-12 w-[100%] gap-5 mt-3 mb-6">
        <div className="col-span-3">
          <Side 
          isLoading={oneCardQueryRes.status == 'loading'}
          />
        </div>
        <div className="col-span-9">
          <Main 
          isLoading={cardTransactionsQueryRes.status == 'loading'}        
          isLoadingStats={oneCardQueryRes.status == 'loading'}
          search={search}
          setSearch={setSearch}
          />
        </div>
        </section>
    </Layout>
  )
}
