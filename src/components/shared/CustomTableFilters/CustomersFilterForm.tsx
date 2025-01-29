"use client";
import { FaArrowRight, FaCircle } from 'react-icons/fa';
import {Select, SelectItem} from "@nextui-org/select";
import { IoIosSearch } from 'react-icons/io'
import { IoArrowForward } from 'react-icons/io5';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useMutation } from "react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { selectSearchTerm, setSearchTerm } from '@/redux/slices/search';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { HiFilter } from 'react-icons/hi';
import CButton from '../CButton';
import { log } from 'util';

const countryData:any[] = [
  {
		key:'all',
		label:'Tous',
	},
	{
		key:'CM',
		label:'Cameroun',
	},
	{
		key:'GA',
		label:'Gabon',
	},
	{
		key:'NG',
		label:'Nigeria',
	}
];


export const filterSchema = z.object({
  decreasingWalletOrder: z.boolean().default(false).optional(),
  country: z.string().optional(),
});

interface FilterProps {
  // searchTerm?: string; 
  filterContent?:any; 
	setFilterContent?:(data?:any)=>void;
}

const CustomersFilterForm: React.FC<FilterProps> = ({filterContent, setFilterContent}) => {
  const dispatch = useDispatch();
  // const searchTerm:string = useSelector(selectSearchTerm);
  const form = useForm<z.infer<typeof filterSchema>>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      // search: setFilterContent ? filterContent : null,
    },
  });


  const onSubmit = (data: any) => {
    console.log("setFilterContent ::: ", data);  

    if (setFilterContent) {
      setFilterContent(data);
    }
	};

	const onError = (err: any) => {
		console.error("any", err);
	};

  return (
    <div className=''>
      <div className={`flex gap-2 items-center font-bold text-md`}><HiFilter/> Filtres</div>
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onError)} className='w-full flex flex-col gap-7'>
        
        <div className={`flex gap-10 items-center`}>
          
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem className='w-[200px]'>
                {/* <FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">Pays de résidence</FormLabel> */}
                <FormControl>
                  <Select 
                    {...field}
                    placeholder="Sélectionner le pays" 
                    style={{width:'100%', background: '#F4EFE3'}}
                    className={`rounded-xs text-gray-900 font-normal`}
                    // defaultSelectedKeys={[field.value]}
                    onChange={(data) => form.setValue('country', data.target.value)}
                  >
                    {countryData.map((item,idx) => (
                    <SelectItem key={item.key} value={item.key}>
                      {item.label}
                    </SelectItem>
                    ))}
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField            
            control={form.control}
            name="decreasingWalletOrder"
            render={({ field }) => (
                <FormItem  className=''>
                <FormControl>
                  <label htmlFor={`customCheckboxUsers`} className="flex items-center cursor-pointer">                
                    <div className="relative">                
                      <input
                      checked={field.value}
                      onChange={(e)=>form.setValue('decreasingWalletOrder', e.target.checked)}
                       type="checkbox" id={`customCheckboxUsers`} name={`customCheckboxUsers`} className="customCheckbox sr-only"/>                
                      <div className="checkboxContainer block p-[3px] border border-solid border-1 border-gray-300 bg-[#f2f2f2] rounded-full flex items-center text-xs">
                        {/* <FaCircle className='checkboxContentTransparent' color="transparent" size={12} /> */}
                         {field.value ?
                         <FaCircle className={''} color={"#18BC7A"} size={12} />
                        :
                        <FaCircle className={''} color={"#ffffff00"} size={12} />}
                      </div>
                    </div>
                    <div className='pl-3 py-4 text-sm'>
                      Ordre decroissant de solde
                    </div>
                  </label>
                </FormControl>
                {/* <FormMessage className="text-red-400"/> */}
                </FormItem>
            )}
          />
        </div>
        <div>
          <CButton
          text={'Valider'}
          // icon={<HiFilter/>}
          btnStyle={'green'}
          height={'32px'}
          type="submit"
          /> 
        </div>       
        {/* <button type="submit"  className="btn px-2 opacity-50 hover:opacity-100">
        <IoArrowForward size={24} color='#7e7e7e'/>
        </button> */}
      </form>
      </Form>
    </div>
  )
}

export default CustomersFilterForm
