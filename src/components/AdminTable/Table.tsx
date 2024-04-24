import { BsUiRadiosGrid } from 'react-icons/bs';
import { Button } from '../ui/button'
import { FourDots } from '../shared/icons';


export interface ITableData {
  name: string;
  email: string;
  status: boolean;
  access: string;
 date: string;
}

type Props = {
  data: ITableData[];
  headerData: string[];
}


const AdminTable = (props: Props) => {
  const {data, headerData} = props
  return (
    <table className='w-full'>
      <thead className='bg-gray-800 py-6'>
        <tr className='h-10 rounded-md'>
        {headerData?.length ? headerData.map((item, index) => (
          <th key={index} className='px-2 text-start text-white font-semibold text-sm'>{item}</th>
        )): <></>}
          {/* <th className='text-white font-normal text-sm'>S/N</th>
          <th className='text-white font-normal text-sm'>Name</th>
          <th className='text-white font-normal text-sm'>Email</th>
          <th className='text-white font-normal text-sm'>Status</th>
          <th className='text-white font-normal text-sm'>Access</th>
          <th className='text-white font-normal text-sm'>Date of Creation</th>
          <th className='text-white font-normal text-sm' aria-label='edit'></th>
          <th className='text-white font-normal text-sm' aria-label="support"></th> */}
        </tr>
      </thead>
      <tbody>
        {data.length !== 0 ? data.map((item, index) => (
          <tr key={index} className='h-[50px] border-b border-gray-100 hover:bg-gray-50'>
            <td className='px-2 text-sm'>{index + 1}</td>
            <td className='px-2 text-sm'>{item.name}</td>
            <td className='px-2 text-sm'>{item.email}</td>
            <td className='px-2 text-sm'>              
                {item.status ? 
                <div className="relative pl-5">
                  <div className='absolute top-[5px] left-0 w-[10px] h-[10px] bg-[#18BC7A] rounded-full 
                  text-center flex justify-center items-center text-[10px] font-bold text-white'>                
                  </div>
                  <span>Actif</span>
                </div>
                :
                <div className="relative pl-5">
                  <div className='absolute top-[5px] left-0 w-[10px] h-[10px] bg-[#444] rounded-full 
                  text-center flex justify-center items-center text-[10px] font-bold text-white'>                
                  </div>
                  <span>Inactif</span>
                </div>
                }
            </td>
            <td className='px-2 text-sm text-[#18BC7A] font-bold'>{item.access}</td>
            <td className='px-2 text-sm mr-36'>{item.date}</td>
            <td className='px-2 text-sm w-10 px-3'>
              <div className='flex gap-5'>
              <Button className='border border-solid border-2 border-[#18BC7A] rounded-full 
              px-4 bg-transparent text-faded-green hover:bg-[#18BC7A]/20 
              font-semibold flex gap-2 text-[#18BC7A]'>
                <FourDots color={'#18BC7A'}/> Editer
              </Button>
              <Button className='border border-solid border-2 border-[#444] font-semibold 
              rounded-full px-6 bg-transparent text-[#202020] hover:bg-gray-300/50
              flex gap-2'>
                <FourDots color={'#202020'}/> Supprimer
              </Button>
              </div>
            </td>
          </tr>
        )): <tr className='h-10 border-b border-gray-100'>
          <td className='text-sm text-center' colSpan={8}>No data available</td>
        </tr>
        }
      </tbody>
      <tfoot>
      </tfoot>
    </table>
  )
}

export default AdminTable
