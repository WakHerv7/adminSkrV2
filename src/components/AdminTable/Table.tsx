import { BsUiRadiosGrid } from 'react-icons/bs';
import { Button } from '../ui/button'
import { FourDots } from '../shared/icons';
import Link from 'next/link';
import ButtonOutlined from '../shared/ButtonOutlined';


export interface IGenericRow {
  [key: string]: any; //string | number | boolean | React.ReactNode; // Adjust according to your data types
}

type Props = {
  data: IGenericRow[];
  headerData: string[];
};

const AdminTable: React.FC<Props> = ({ data, headerData }) => {
  if (!data ||!headerData) return null;

  return (
    <table className="w-full">
      <thead className="bg-gray-800 py-6">
        <tr className="h-10 rounded-md">
          {headerData?.length ? headerData.map((item, index) => (
            <th key={index} className='px-2 text-start text-white font-semibold text-sm'>{item}</th>
          )): <></>}
        </tr>
      </thead>
      <tbody>
        {data.length !== 0 ? data.map((row, rowIndex) => (
          <tr key={rowIndex} className="h-[50px] border-b border-gray-100 hover:bg-gray-50">
            {Object.keys(row).map((key, cellIndex) => (
              <td key={`${rowIndex}-${cellIndex}`} className="px-2 text-sm">
                {/* Render the cell content based on the key */}
                {row[key]}
              </td>
            ))}
          </tr>
        )) : null}
      </tbody>
      <tfoot>
        {/* Footer content can be dynamic as well */}
      </tfoot>
    </table>
  );
};

export default AdminTable;


