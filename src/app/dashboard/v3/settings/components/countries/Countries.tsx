"use client";

import CButton from "@/components/shared/CButton";
import CustomTable from "@/components/shared/CustomTable";
import { headerCountriesDataV3 } from "@/constants/v3/KYCDataV3";
import React, { useState } from "react";
import { useQuery, useMutation } from "react-query";
import toast from "react-hot-toast";
import { CountriesServiceV3 } from "@/api/services/v3/countries";
import CreateCountryModal from "./components/CreateCountryModal";
import EditCountryModal from "./components/EditCountryModal";
import DeleteConfirmationModal from "./components/DeleteConfirmationModal";

type Props = {
	isLoading?: boolean;
	search?: string;
	setSearch?: (data?: any) => void;
};

// Service pour créer un pays
const handleCreateCountry = async (countryData: any) => {
	const response = await CountriesServiceV3.createCountry(countryData);
	const responseJson = await response.json();
	if (!response.ok) {
		throw new Error(
			responseJson.message || "Erreur lors de la création du pays"
		);
	}
	return responseJson;
};

// Service pour récupérer les pays
const handleGetCountries = async () => {
	const response = await CountriesServiceV3.getCountries();
	const responseJson = await response.json();
	if (!response.ok) {
		throw new Error(
			responseJson.message || "Erreur lors de la récupération des pays"
		);
	}
	return responseJson.data;
};

// Service pour modifier un pays
const handleUpdateCountry = async ({ id, data }: { id: string; data: any }) => {
	const response = await CountriesServiceV3.updateCountry(id, data);
	const responseJson = await response.json();
	if (!response.ok) {
		throw new Error(
			responseJson.message || "Erreur lors de la modification du pays"
		);
	}
	return responseJson;
};

// Service pour supprimer un pays
const handleDeleteCountry = async (id: string) => {
	const response = await CountriesServiceV3.deleteCountry(id);
	const responseJson = await response.json();
	if (!response.ok) {
		throw new Error(
			responseJson.message || "Erreur lors de la suppression du pays"
		);
	}
	return responseJson;
};

const Countries = ({ isLoading, search, setSearch }: Props) => {
	// États pour les modales
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [selectedCountry, setSelectedCountry] = useState<any>(null);

	// Query pour récupérer les pays
	const countriesQuery = useQuery({
		queryKey: ["countries"],
		queryFn: handleGetCountries,
		onError: (err: any) => {
			toast.error(`Erreur lors du chargement des pays: ${err.message}`);
		},
	});

	// Mutation pour créer un pays
	const createMutation = useMutation({
		mutationFn: handleCreateCountry,
		onError: (err: any) => {
			toast.error(`Erreur: ${err.message}`);
		},
		onSuccess: (data) => {
			toast.success("Pays créé avec succès !");
			setIsCreateModalOpen(false);
			countriesQuery.refetch();
		},
	});

	// Mutation pour modifier un pays
	const updateMutation = useMutation({
		mutationFn: handleUpdateCountry,
		onError: (err: any) => {
			toast.error(`Erreur: ${err.message}`);
		},
		onSuccess: (data) => {
			toast.success("Pays modifié avec succès !");
			setIsEditModalOpen(false);
			setSelectedCountry(null);
			countriesQuery.refetch();
		},
	});

	// Mutation pour supprimer un pays
	const deleteMutation = useMutation({
		mutationFn: handleDeleteCountry,
		onError: (err: any) => {
			toast.error(`Erreur: ${err.message}`);
		},
		onSuccess: (data) => {
			toast.success("Pays supprimé avec succès !");
			setIsDeleteModalOpen(false);
			setSelectedCountry(null);
			countriesQuery.refetch();
		},
	});

	// --------------------------------
	// Handler pour créer un nouveau pays
	// --------------------------------
	const CreateCountry = async (countryData: any) => {
		createMutation.mutate(countryData);
	};

	// --------------------------------
	// Handler pour éditer un pays
	// --------------------------------
	const handleEditCountry = async (countryData: any) => {
		updateMutation.mutate({
			id: selectedCountry.id,
			data: countryData,
		});
	};

	// --------------------------------
	// Handler pour supprimer un pays
	// --------------------------------
	const DeleteCountry = async () => {
		deleteMutation.mutate(selectedCountry.id);
	};

	// --------------------------------
	// Ouvrir modale d'édition
	// --------------------------------
	const openEditModal = (country: any) => {
		setSelectedCountry(country);
		setIsEditModalOpen(true);
	};

	// --------------------------------
	// Ouvrir modale de suppression
	// --------------------------------
	const openDeleteModal = (country: any) => {
		setSelectedCountry(country);
		setIsDeleteModalOpen(true);
	};

	// --------------------------------
	//  Tableau des pays avec actions
	// --------------------------------
	const countriesTableData = countriesQuery.data?.map(
		(country: any, index: number) => ({
			serial: index + 1,
			name: country.name,
			flag: (
				<img
					src={country.flag}
					alt={country.name}
					className="w-8 h-6 object-cover rounded"
				/>
			),
			currency: country.currency,
			dialCode: country.dialCode,
			code: country.code,
			codeIso3: country.codeIso3,
			phoneLength: country.phoneLength,
			actions: (
				<div className="flex gap-2">
					{/* Bouton Éditer */}
					<button
						onClick={() => openEditModal(country)}
						className="px-3 py-1 bg-[#ffd231] text-black rounded-full text-sm hover:bg-[#e6bd2d] transition font-medium"
						disabled={
							updateMutation.isLoading || deleteMutation.isLoading
						}
					>
						Éditer
					</button>

					{/* Bouton Supprimer */}
					<button
						onClick={() => openDeleteModal(country)}
						className="px-3 py-1 bg-red-600 text-white rounded-full text-sm hover:bg-red-700 transition font-medium"
						disabled={
							updateMutation.isLoading || deleteMutation.isLoading
						}
					>
						Supprimer
					</button>
				</div>
			),
		})
	);

	return (
		<section>
			{/* Bouton pour créer un nouveau pays */}
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-2xl font-bold">Gestion des Pays</h2>
				<CButton
					text="Créer un nouveau pays"
					btnStyle="green"
					onClick={() => setIsCreateModalOpen(true)}
					height="40px"
					disabled={createMutation.isLoading}
				/>
			</div>

			<div className="mt-8">
				<h3 className="text-lg font-semibold mb-4">
					Liste des pays disponibles
				</h3>
				<CustomTable
					headerData={{
						...headerCountriesDataV3,
						actions: "Actions",
					}}
					tableData={countriesTableData || []}
					isLoading={countriesQuery.isLoading}
					search={search}
					setSearch={setSearch}
					threeButtons={true}
				/>
			</div>

			{/* Modale de création de pays */}
			<CreateCountryModal
				isOpen={isCreateModalOpen}
				onClose={() => setIsCreateModalOpen(false)}
				onSubmit={CreateCountry}
				isLoading={createMutation.isLoading}
			/>

			{/* Modale d'édition de pays */}
			<EditCountryModal
				isOpen={isEditModalOpen}
				onClose={() => {
					setIsEditModalOpen(false);
					setSelectedCountry(null);
				}}
				onSubmit={handleEditCountry}
				isLoading={updateMutation.isLoading}
				country={selectedCountry}
			/>

			{/* Modale de confirmation de suppression */}
			<DeleteConfirmationModal
				isOpen={isDeleteModalOpen}
				onClose={() => {
					setIsDeleteModalOpen(false);
					setSelectedCountry(null);
				}}
				onConfirm={DeleteCountry}
				isLoading={deleteMutation.isLoading}
				countryName={selectedCountry?.name}
			/>
		</section>
	);
};

export default Countries;
