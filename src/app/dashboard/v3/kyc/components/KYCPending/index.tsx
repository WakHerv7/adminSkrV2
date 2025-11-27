import CButton from "@/components/shared/CButton";
import CustomTable from "@/components/shared/CustomTable";
import { FourDots } from "@/components/shared/icons";
import LabelWithBadge from "@/components/shared/LabelWithBadge";
import URLConfigV3 from "@/config/urls_v3";
import { headerKYCDataV3 } from "@/constants/v3/KYCDataV3";
import { selectKYCPending } from "@/redux/slices_v2/kyc";
import { getFormattedDateTime } from "@/utils/DateFormat";
import React, { useState } from "react";
import { useSelector } from "react-redux";

type Props = {
	isLoading?: boolean;
	search?: string;
	setSearch?: (data?: any) => void;
};

const KycPendingV3 = ({ isLoading, search, setSearch }: Props) => {
	const kycPending = useSelector(selectKYCPending);

	// Stocke la ligne en mode édition + les données modifiées
	const [editRowId, setEditRowId] = useState<string | null>(null);
	const [formData, setFormData] = useState<any>({});

	// --------------------------------
	//  Handler mise à jour input
	// --------------------------------
	const handleInputChange = (field: string, value: any) => {
		setFormData((prev: any) => ({
			...prev,
			[field]: value,
		}));
	};

	// --------------------------------
	// Handler Enregistrer les modifications
	// --------------------------------
	const handleSave = (id: string) => {
		console.log("Données envoyées :", formData);

		// Ici tu appelles ta mutation updateKyc.mutate({ kycId:id, data: formData })

		setEditRowId(null);
		setFormData({});
	};

	// --------------------------------
	//  Handler Annuler l'édition
	// --------------------------------
	const handleCancel = () => {
		setEditRowId(null);
		setFormData({});
	};

	// --------------------------------
	//  Remplissage tableau
	// --------------------------------
	const rearrangedTableData = kycPending?.map((item: any, index: number) => {
		const isEditing = editRowId === item.id;

		return {
			serial: index + 1,

			name: isEditing ? (
				<div className="flex gap-2">
					<input
						className="border px-2 py-1 rounded-md w-32"
						defaultValue={item.firstName}
						onChange={(e) =>
							handleInputChange("firstName", e.target.value)
						}
					/>
					<input
						className="border px-2 py-1 rounded-md w-32"
						defaultValue={item.lastName}
						onChange={(e) =>
							handleInputChange("lastName", e.target.value)
						}
					/>
				</div>
			) : (
				`${item.firstName} ${item.lastName}`
			),

			email: isEditing ? (
				<input
					className="border px-2 py-1 rounded-md w-48"
					defaultValue={item.email}
					onChange={(e) => handleInputChange("email", e.target.value)}
				/>
			) : (
				item.email
			),

			phone: isEditing ? (
				<input
					className="border px-2 py-1 rounded-md w-40"
					defaultValue={item.phoneNumber}
					onChange={(e) =>
						handleInputChange("phoneNumber", e.target.value)
					}
				/>
			) : (
				item.phoneNumber
			),

			status:
				item.kycStatus === "APPROVED" ? (
					<LabelWithBadge label="Approuvé" badgeColor="#18BC7A" />
				) : item.kycStatus === "DECLINED" ? (
					<LabelWithBadge label="Refusé" badgeColor="#F85D4B" />
				) : item.kycStatus === "PENDING" ? (
					<LabelWithBadge label="En cours" badgeColor="#999" />
				) : (
					<LabelWithBadge label="Aucun" badgeColor="#000" />
				),

			created: getFormattedDateTime(item.createdAt),

			actions: (
				<div className="flex gap-2 items-center">
					<CButton
						text={"Manager"}
						href={`${URLConfigV3.kyc.manage}/${item.id}`}
						btnStyle={"dark"}
						icon={<FourDots />}
					/>

					{/* BOUTONS ÉDITER / SAUVEGARDER / ANNULER */}
					{isEditing ? (
						<div className="flex gap-2">
							<button
								onClick={() => handleSave(item.id)}
								className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition"
							>
								Sauvegarder
							</button>
							<button
								onClick={handleCancel}
								className="px-3 py-1 bg-gray-500 text-white rounded-md text-sm hover:bg-gray-600 transition"
							>
								Annuler
							</button>
						</div>
					) : (
						<button
							onClick={() => {
								setEditRowId(item.id);
								setFormData({
									firstName: item.firstName,
									lastName: item.lastName,
									email: item.email,
									phoneNumber: item.phoneNumber,
								});
							}}
							className="px-4 py-1 bg-[#ffd231] text-black rounded-full text-sm hover:bg-[#e6bd2d] transition"
						>
							Éditer
						</button>
					)}
				</div>
			),
		};
	});

	return (
		<section>
			<CustomTable
				headerData={headerKYCDataV3}
				tableData={rearrangedTableData}
				filter
				threeButtons
				isLoading={isLoading && !kycPending}
				search={search}
				setSearch={setSearch}
			/>
		</section>
	);
};

export default KycPendingV3;
