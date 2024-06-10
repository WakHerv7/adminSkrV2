import React from 'react'
import Title from '@/components/shared/Title'
import NotificationForm from '../NotificationForm'
import NotificationsDropdown from '../NotificationsDropdown'
import CustomTable from '@/components/shared/CustomTable'
import ActiveYesNo from '@/components/shared/ActiveYesNo'
import CButton from '@/components/shared/CButton'
import { FourDots } from '@/components/shared/icons'
import { IGenericRow, ITableHeader } from '@/components/AdminTable/Table'

const headerData: ITableHeader =
{
	"serial": "S/N",
	"name": "Nom",
	"email": "Email",
	"status": "Statut",
	"access": "Accès",
	"date": "Date de création",
	"edit": "",
}

const tableData: IGenericRow[] = [
  {
    name: 'John Doe',
    email: 'abc123@xyz.com',
    status: true,
    access: 'Admin',
    date: '12/03/2024',
    edit: '/administration/edit/1',
  },
  {
    name: 'John Doe',
    email: 'abc123@xyz.com',
    status: false,
    access: 'Manager',
    date: '12/03/2024',
    edit: '/administration/edit/2',
  },
  {
    name: 'John Doe',
    email: 'abc123@xyz.com',
    status: true,
    access: 'Visitor',
    date: '12/03/2024',
    edit: '/administration/edit/3',
  },
];

const Notification = () => {
  const rearrangedTableData = tableData.map((item, index) => {
		const rearrangedItem = {
			serial: index+1,
			name: item.name,			
			email: item.email,
			status: <ActiveYesNo isActive={item.status}/>,
			access: item.access,
			date: item.date,
			actions: <>
			<div className='flex gap-5'>
			  <CButton 
			  text={'Editer'}
			  href={item.edit}
			  btnStyle={'outlineGreen'}
			  icon={<FourDots />} 
			  />
			  <CButton 
			  text={'Supprimer'} 
			  btnStyle={'outlineDark'}
			  icon={<FourDots />} 
			  />
			  </div>
			</>
		};
		item = rearrangedItem;
		return item;
	});

  return (
    <div className='w-full'>
      <div className='grid grid-cols-12 items-start gap-4 mt-4'>
        <div className='col-span-9'>
          <Title title='Creer une campagne' subtitle='liste en temps réel des dernieres transactions effectuées avec les cartes' />
          <NotificationForm />
        </div>
        <div className='col-span-3'>
        <NotificationsDropdown />
        </div>
      </div>
      <div className='mt-7'>
        <Title title='Dernieres campagnes' subtitle='liste en temps réel des dernieres transactions effectuées avec les cartes' />
        <div className='mt-4'>
          <CustomTable
            headerData={headerData}
            tableData={rearrangedTableData}
            btn={<CButton
              text={'Ajouter un Admin'}
              btnStyle={'green'}
              href={'/administration/create'}
              />}
          />
        </div>
      </div>
    </div>
  )
}

export default Notification
