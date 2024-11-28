import {Chart as ChartJS,
  Tooltip,
  Legend,
  LineController,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  CategoryScale,
} from 'chart.js'
import { Line } from 'react-chartjs-2';
import { FaArrowDown } from 'react-icons/fa6';

ChartJS.register(
  LineController,
  LinearScale,
  LineElement,
  CategoryScale,
  Tooltip
);

const DataCard = ({
  title, change_per, chartData, data, width
}: {
  title: string;
  change_per: string;
  chartData: any;
  width?: number;
  data: {
    today: string;
    total: string;
    average: string;
  }
}) => {

  const chartOptions = {
    responsive: true,
    plugins: {
       legend: {
         display: false,
       },
    },
    scales: {
      x: {
        display: false, // This hides the X axis
        grid: {
          display: false,
        },
      },
      y: {
        display: false, // This hides the Y axis
        grid: {
          display: false,
        },
      },
    }
   };

  return (
    <div className={`p-4 border outline-1 rounded-xl ${width ? 'max-w-['+width+'px]' : ''}`}> {/* max-w-[270px] */}
      <div className='flex justify-between items-start'>
        <h1 className='text-xs font-semibold'>{title}</h1>
        {/* <div className='px-4 py-2 border border-gray-300 rounded-full flex gap-3'>
          <span className='text-xs text-gray-800'>{change_per}</span><FaArrowDown />
        </div> */}
      </div>
      <div className='w-full mb-4'>
        <Line data={chartData} height={100} options={chartOptions} />
      </div>
      <div className='flex flex-col gap-1'>
        <div className='flex justify-between items-center gap-3'>
          <p className='text-xs'>{`Aujourd'hui`}</p>
          <h1 className='text-sm font-semibold'>{data.today}</h1>
        </div>
        <div className='flex justify-between items-center gap-3'>
          <p className='text-xs'>Total</p>
          <p className='text-xs text-right'>{data.total}</p>
        </div>
        <div className='flex justify-between items-center gap-3'>
          <p className='text-xs'>Moyenne</p>
          <p className='text-xs text-right'>{data.average}</p>
        </div>
      </div>
    </div>
  )
}

export default DataCard
