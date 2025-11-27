"use client";

import { KYCServiceV3 } from "@/api/services/v3/kyc";
import Layout from "@/components/shared/Layout";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useMutation, useQuery } from "react-query";
import {
	User,
	FileText,
	Calendar,
	MapPin,
	Phone,
	Mail,
	CheckCircle,
	XCircle,
	Clock,
	ChevronRight,
	Plus,
	Trash2,
} from "lucide-react";
import { KYCRaisonRejectServiceV3 } from "@/api/services/v3/kycRaisonReject";

const handleGetKyc = async ({ queryKey }: any) => {
	const [_key, userId] = queryKey;
	const response = await KYCServiceV3.getKycDetailsByUserId(userId);
	const responseJson = await response.json();

	if (!response.ok) {
		throw new Error(
			responseJson.message ||
				"Erreur lors de la récupération des détails KYC"
		);
	}

	return responseJson.data;
};

const handleUpdateKyc = async (kycId: string, data: any) => {
	const response = await KYCServiceV3.updateKyc(kycId, data);
	const responseJson = await response.json();
	if (!response.ok) {
		throw new Error(
			responseJson.message || "Erreur lors de la mise à jour du KYC"
		);
	}

	return responseJson.data;
};

const handleGetReasonRejects = async () => {
	const response = await KYCRaisonRejectServiceV3.getRaisonRejects();
	const responseJson = await response.json();
	if (!response.ok) {
		throw new Error(
			responseJson.message ||
				"Erreur lors de la récupération des raisons de rejet"
		);
	}
	return responseJson.data;
};

const ManageKyc = () => {
	const params = useParams();
	const userId = params.id;
	const [selectedImage, setSelectedImage] = useState<string | null>(null);
	const [showRejectModal, setShowRejectModal] = useState(false);
	const [showApproveModal, setShowApproveModal] = useState(false);
	const [rejectReasons, setRejectReasons] = useState<string[]>([""]);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const kycQuery = useQuery({
		queryKey: ["kyc-details", userId],
		queryFn: handleGetKyc,
		onError: (err: any) => {
			toast.error(`Erreur: ${err.message}`);
		},
	});

	const updateKyc = useMutation({
		mutationFn: ({ kycId, data }: { kycId: string; data: any }) =>
			handleUpdateKyc(kycId, data),
		onMutate: () => {
			setIsSubmitting(true);
		},
		onSuccess: (res: any) => {
			console.log("KYC mis à jour avec succès :", res);
			toast.success("KYC mis à jour avec succès");
			refetch();
			setShowApproveModal(false);
			setShowRejectModal(false);
			setRejectReasons([""]);
		},
		onError: (error: any) => {
			console.error(
				"Erreur lors de la mise à jour du KYC :",
				error.message
			);
			toast.error(`Erreur: ${error.message}`);
		},
		onSettled: () => {
			setIsSubmitting(false);
		},
	});

	const getReasonRejectQuery = useQuery({
		queryKey: ["kyc-reason-rejects"],
		queryFn: handleGetReasonRejects,
		onError: (err: any) => {
			toast.error(`Erreur: ${err.message}`);
		},
	});

	const { data: kycData, isLoading, isError, refetch } = kycQuery;

	// Fonctions pour gérer les raisons de rejet
	const addRejectReason = () => {
		setRejectReasons([...rejectReasons, ""]);
	};

	const removeRejectReason = (index: number) => {
		if (rejectReasons.length > 1) {
			const newReasons = rejectReasons.filter((_, i) => i !== index);
			setRejectReasons(newReasons);
		}
	};

	const updateRejectReason = (index: number, value: string) => {
		const newReasons = [...rejectReasons];
		newReasons[index] = value;
		setRejectReasons(newReasons);
	};

	const getStatusBadge = (status: string) => {
		const statusConfig = {
			Approved: {
				icon: CheckCircle,
				bg: "bg-green-50",
				text: "text-[#18bc7a]",
				border: "border-[#18bc7a]",
				label: "Approuvé",
			},
			Pending: {
				icon: Clock,
				bg: "bg-yellow-50",
				text: "text-yellow-700",
				border: "border-yellow-300",
				label: "En attente",
			},
			Declined: {
				icon: XCircle,
				bg: "bg-red-50",
				text: "text-red-700",
				border: "border-red-300",
				label: "Rejeté",
			},
		};

		const config =
			statusConfig[status as keyof typeof statusConfig] ||
			statusConfig.Pending;
		const Icon = config.icon;

		return (
			<span
				className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${config.bg} ${config.text} ${config.border} border font-medium`}
			>
				<Icon className="w-4 h-4" />
				{config.label}
			</span>
		);
	};

	const handleAction = async (action: string) => {
		switch (action) {
			case "approve":
				setShowApproveModal(true);
				break;
			case "reject":
				setShowRejectModal(true);
				break;
			case "view-history":
				toast.success("Fonctionnalité d'historique à venir...");
				break;
			case "download-docs":
				toast.success("Téléchargement des documents...");
				break;
			case "contact-user":
				toast.success("Ouverture de la messagerie...");
				break;
			default:
				toast.success(`Action "${action}" en cours...`);
		}
	};

	if (isLoading) {
		return (
			<Layout title="Manage KYC">
				<div className="flex items-center justify-center h-64">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#18bc7a]"></div>
				</div>
			</Layout>
		);
	}

	if (isError || !kycData) {
		return (
			<Layout title="Manage KYC">
				<div className="flex items-center justify-center h-64">
					<div className="text-center">
						<XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
						<p className="text-gray-600">
							Impossible de charger les détails KYC
						</p>
					</div>
				</div>
			</Layout>
		);
	}

	return (
		<Layout title="Manage KYC">
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Section principale - Détails KYC */}
				<div className="lg:col-span-2 space-y-6">
					{/* En-tête utilisateur */}
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
						<div className="flex items-start justify-between mb-6">
							<div className="flex items-center gap-4">
								<div className="w-16 h-16 bg-[#18bc7a] rounded-full flex items-center justify-center shadow-lg">
									<User className="w-8 h-8 text-white" />
								</div>
								<div>
									<h2 className="text-2xl font-bold text-gray-900">
										{kycData.user.fullName ||
											kycData.user.firstName ||
											"Utilisateur"}
									</h2>
									<p className="text-gray-500 text-sm">
										ID: {kycData.user.userId}
									</p>
								</div>
							</div>
							{getStatusBadge(kycData.status)}
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="flex items-center gap-3 text-gray-700">
								<Phone className="w-5 h-5 text-[#18bc7a]" />
								<div>
									<p className="text-xs text-gray-500">
										Téléphone
									</p>
									<p className="font-medium">
										{kycData.user.phoneNumber ||
											"Non renseigné"}
									</p>
								</div>
							</div>
							<div className="flex items-center gap-3 text-gray-700">
								<Mail className="w-5 h-5 text-[#18bc7a]" />
								<div>
									<p className="text-xs text-gray-500">
										Email
									</p>
									<p className="font-medium">
										{kycData.user.email || "Non renseigné"}
									</p>
								</div>
							</div>
							<div className="flex items-center gap-3 text-gray-700">
								<MapPin className="w-5 h-5 text-[#18bc7a]" />
								<div>
									<p className="text-xs text-gray-500">
										Ville
									</p>
									<p className="font-medium">
										{kycData.user.city || "Non renseigné"}
									</p>
								</div>
							</div>
							<div className="flex items-center gap-3 text-gray-700">
								<MapPin className="w-5 h-5 text-[#18bc7a]" />
								<div>
									<p className="text-xs text-gray-500">
										État/Région
									</p>
									<p className="font-medium">
										{kycData.user.state || "Non renseigné"}
									</p>
								</div>
							</div>
							<div className="flex items-center gap-3 text-gray-700">
								<Calendar className="w-5 h-5 text-[#18bc7a]" />
								<div>
									<p className="text-xs text-gray-500">
										Date de naissance
									</p>
									<p className="font-medium">
										{kycData.user.dateOfBirth
											? new Date(
													kycData.user.dateOfBirth
											  ).toLocaleDateString()
											: "Non renseigné"}
									</p>
								</div>
							</div>
							<div className="flex items-center gap-3 text-gray-700">
								<User className="w-5 h-5 text-[#18bc7a]" />
								<div>
									<p className="text-xs text-gray-500">
										Genre
									</p>
									<p className="font-medium">
										{kycData.user.gender || "Non renseigné"}
									</p>
								</div>
							</div>
							<div className="flex items-center gap-3 text-gray-700">
								<MapPin className="w-5 h-5 text-[#18bc7a]" />
								<div>
									<p className="text-xs text-gray-500">
										Adresse
									</p>
									<p className="font-medium">
										{kycData.user.address ||
											"Non renseigné"}
									</p>
								</div>
							</div>
						</div>

						{/* Statut du compte */}
						<div className="mt-6 pt-6 border-t border-gray-200">
							<h4 className="text-sm font-semibold text-gray-700 mb-3">
								Statut du compte
							</h4>
							<div className="flex items-center gap-4">
								<div className="flex items-center gap-2">
									<div
										className={`w-3 h-3 rounded-full ${
											kycData.user.isActive
												? "bg-[#18bc7a]"
												: "bg-gray-300"
										}`}
									></div>
									<span className="text-sm text-gray-600">
										{kycData.user.isActive
											? "Actif"
											: "Inactif"}
									</span>
								</div>
								<div className="flex items-center gap-2">
									<div
										className={`w-3 h-3 rounded-full ${
											!kycData.user.isDeleted
												? "bg-[#18bc7a]"
												: "bg-red-500"
										}`}
									></div>
									<span className="text-sm text-gray-600">
										{!kycData.user.isDeleted
											? "Non supprimé"
											: "Supprimé"}
									</span>
								</div>
							</div>
							<div className="mt-3 text-xs text-gray-500">
								<p>
									Compte créé le:{" "}
									{new Date(
										kycData.user.created_at
									).toLocaleDateString("fr-FR", {
										year: "numeric",
										month: "long",
										day: "numeric",
									})}
								</p>
								<p>
									Dernière mise à jour:{" "}
									{new Date(
										kycData.user.updated_at
									).toLocaleDateString("fr-FR", {
										year: "numeric",
										month: "long",
										day: "numeric",
									})}
								</p>
							</div>
						</div>
					</div>

					{/* Informations du document */}
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
						<h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
							<FileText className="w-5 h-5 text-[#18bc7a]" />
							Informations du Document
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<p className="text-sm text-gray-500 mb-1">
									Type de document
								</p>
								<p className="font-medium text-gray-900">
									{kycData.documentType || "Non spécifié"}
								</p>
							</div>
							<div>
								<p className="text-sm text-gray-500 mb-1">
									Numéro de document
								</p>
								<p className="font-medium text-gray-900">
									{kycData.documentNumber || "Non renseigné"}
								</p>
							</div>
							<div>
								<p className="text-sm text-gray-500 mb-1">
									Date d'émission
								</p>
								<p className="font-medium text-gray-900">
									{kycData.documentIssueDate
										? new Date(
												kycData.documentIssueDate
										  ).toLocaleDateString()
										: "Non renseignée"}
								</p>
							</div>
							<div>
								<p className="text-sm text-gray-500 mb-1">
									Date d'expiration
								</p>
								<p className="font-medium text-gray-900">
									{kycData.documentDueDate
										? new Date(
												kycData.documentDueDate
										  ).toLocaleDateString()
										: "Non renseignée"}
								</p>
							</div>
							<div>
								<p className="text-sm text-gray-500 mb-1">
									Pays d'émission
								</p>
								<p className="font-medium text-gray-900">
									{kycData.documentIssuingCountry ||
										"Non renseigné"}
								</p>
							</div>
							<div>
								<p className="text-sm text-gray-500 mb-1">
									Créé le
								</p>
								<p className="font-medium text-gray-900">
									{new Date(
										kycData.created_at
									).toLocaleDateString()}
								</p>
							</div>
						</div>
					</div>

					{/* Images des documents */}
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
						<h3 className="text-lg font-semibold text-gray-900 mb-4">
							Documents
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
							{kycData.documentFrontImage && (
								<div className="space-y-2">
									<p className="text-sm font-medium text-gray-700">
										Document (Recto)
									</p>
									<img
										src={kycData.documentFrontImage}
										alt="Document recto"
										className="w-full h-48 object-cover rounded-lg border-2 border-gray-200 cursor-pointer hover:border-[#18bc7a] transition"
										onClick={() =>
											setSelectedImage(
												kycData.documentFrontImage
											)
										}
									/>
								</div>
							)}
							{kycData.documentBackImage && (
								<div className="space-y-2">
									<p className="text-sm font-medium text-gray-700">
										Document (Verso)
									</p>
									<img
										src={kycData.documentBackImage}
										alt="Document verso"
										className="w-full h-48 object-cover rounded-lg border-2 border-gray-200 cursor-pointer hover:border-[#18bc7a] transition"
										onClick={() =>
											setSelectedImage(
												kycData.documentBackImage
											)
										}
									/>
								</div>
							)}
							{kycData.selfieImage && (
								<div className="space-y-2">
									<p className="text-sm font-medium text-gray-700">
										Selfie
									</p>
									<img
										src={kycData.selfieImage}
										alt="Selfie"
										className="w-full h-48 object-cover rounded-lg border-2 border-gray-200 cursor-pointer hover:border-[#18bc7a] transition"
										onClick={() =>
											setSelectedImage(
												kycData.selfieImage
											)
										}
									/>
								</div>
							)}
							{kycData.userPortraitImage && (
								<div className="space-y-2">
									<p className="text-sm font-medium text-gray-700">
										Portrait utilisateur
									</p>
									<img
										src={kycData.userPortraitImage}
										alt="Portrait utilisateur"
										className="w-full h-48 object-cover rounded-lg border-2 border-gray-200 cursor-pointer hover:border-[#18bc7a] transition"
										onClick={() =>
											setSelectedImage(
												kycData.userPortraitImage
											)
										}
									/>
								</div>
							)}
						</div>
						{!kycData.documentFrontImage &&
							!kycData.documentBackImage &&
							!kycData.selfieImage &&
							!kycData.userPortraitImage && (
								<p className="text-gray-500 text-center py-8">
									Aucun document disponible
								</p>
							)}
					</div>
				</div>

				{/* Section Actions */}
				<div className="lg:col-span-1">
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
						<h3 className="text-lg font-semibold text-gray-900 mb-4">
							Actions
						</h3>
						<div className="space-y-3">
							{kycData.status !== "Pending" && (
								<>
									<button
										onClick={() => handleAction("approve")}
										className="w-full flex items-center justify-between px-4 py-3 bg-[#18bc7a] hover:bg-[#15a669] text-white rounded-lg transition font-medium"
									>
										<span className="flex items-center gap-2">
											<CheckCircle className="w-5 h-5" />
											Approuver
										</span>
										<ChevronRight className="w-5 h-5" />
									</button>
									<button
										onClick={() => handleAction("reject")}
										className="w-full flex items-center justify-between px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition font-medium"
									>
										<span className="flex items-center gap-2">
											<XCircle className="w-5 h-5" />
											Rejeter
										</span>
										<ChevronRight className="w-5 h-5" />
									</button>
								</>
							)}
						</div>

						{kycData.raisonsRejectCodes &&
							kycData.raisonsRejectCodes.length > 0 && (
								<div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
									<p className="text-sm font-medium text-red-800 mb-2">
										Raisons du rejet:
									</p>
									<ul className="text-sm text-red-700 space-y-1">
										{kycData.raisonsRejectCodes.map(
											(reason: string, index: number) => (
												<li key={index}>• {reason}</li>
											)
										)}
									</ul>
								</div>
							)}
					</div>
				</div>
			</div>

			{/* Modal pour agrandir les images */}
			{selectedImage && (
				<div
					className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
					onClick={() => setSelectedImage(null)}
				>
					<div className="relative max-w-4xl max-h-full">
						<img
							src={selectedImage}
							alt="Document agrandi"
							className="max-w-full max-h-[90vh] object-contain rounded-lg"
						/>
						<button
							onClick={() => setSelectedImage(null)}
							className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100 transition"
						>
							<XCircle className="w-6 h-6 text-gray-700" />
						</button>
					</div>
				</div>
			)}

			{/* Modal de chargement pendant la mutation */}
			{updateKyc.isLoading && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
					<div className="bg-white rounded-lg shadow-xl p-8 flex flex-col items-center">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#18bc7a] mb-4"></div>
						<p className="text-gray-700 font-medium">
							Traitement en cours...
						</p>
					</div>
				</div>
			)}

			{/* Modal de confirmation d'approbation */}
			{showApproveModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000] p-4">
					<div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
						<div className="flex items-center gap-3 mb-4">
							<div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
								<CheckCircle className="w-6 h-6 text-[#18bc7a]" />
							</div>
							<h3 className="text-xl font-bold text-gray-900">
								Approuver le KYC
							</h3>
						</div>
						<p className="text-gray-600 mb-6">
							Êtes-vous sûr de vouloir approuver le KYC de cet
							utilisateur ? Cette action validera son identité.
						</p>
						<div className="flex gap-3">
							<button
								onClick={() => setShowApproveModal(false)}
								disabled={updateKyc.isLoading}
								className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
							>
								Annuler
							</button>
							<button
								onClick={() =>
									updateKyc.mutate({
										kycId: kycData.id,
										data: { status: "Approved" },
									})
								}
								disabled={updateKyc.isLoading}
								className="flex-1 px-4 py-2 bg-[#18bc7a] hover:bg-[#15a669] text-white rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
							>
								{updateKyc.isLoading ? (
									<>
										<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
										Traitement...
									</>
								) : (
									"Confirmer"
								)}
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Modal de rejet avec plusieurs raisons */}
			{showRejectModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000] p-4">
					<div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
						<div className="flex items-center gap-3 mb-4">
							<div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
								<XCircle className="w-6 h-6 text-red-600" />
							</div>
							<h3 className="text-xl font-bold text-gray-900">
								Rejeter le KYC
							</h3>
						</div>
						<p className="text-gray-600 mb-4">
							Veuillez indiquer les raisons du rejet de ce KYC :
						</p>

						{/* Liste des champs de raisons */}
						<div className="space-y-3 mb-4">
							{rejectReasons.map((reason, index) => (
								<div key={index} className="flex gap-2">
									<textarea
										value={reason}
										onChange={(e) =>
											updateRejectReason(
												index,
												e.target.value
											)
										}
										placeholder={`Raison ${
											index + 1
										}: Ex: Document illisible, informations incohérentes...`}
										className="flex-1 h-24 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#18bc7a] focus:border-transparent resize-none"
										disabled={updateKyc.isLoading}
									/>
									{rejectReasons.length > 1 && (
										<button
											onClick={() =>
												removeRejectReason(index)
											}
											disabled={updateKyc.isLoading}
											className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
											title="Supprimer cette raison"
										>
											<Trash2 className="w-5 h-5" />
										</button>
									)}
								</div>
							))}
						</div>

						{/* Bouton pour ajouter une nouvelle raison */}
						<button
							onClick={addRejectReason}
							disabled={updateKyc.isLoading}
							className="w-full px-4 py-2 mb-4 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-[#18bc7a] hover:text-[#18bc7a] transition disabled:opacity-50 flex items-center justify-center gap-2"
						>
							<Plus className="w-5 h-5" />
							Ajouter une raison supplémentaire
						</button>

						{/* Boutons d'action */}
						<div className="flex gap-3">
							<button
								onClick={() => {
									setShowRejectModal(false);
									setRejectReasons([""]);
								}}
								disabled={updateKyc.isLoading}
								className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
							>
								Annuler
							</button>
							<button
								onClick={() => {
									// Filtrer les raisons vides avant de soumettre
									const validReasons = rejectReasons
										.map((r) => r.trim())
										.filter((r) => r !== "");

									if (validReasons.length === 0) {
										toast.error(
											"Veuillez ajouter au moins une raison"
										);
										return;
									}

									updateKyc.mutate({
										kycId: kycData.id,
										data: {
											status: "Declined",
											raisonsRejectCodes: validReasons,
										},
									});
								}}
								disabled={
									updateKyc.isLoading ||
									!rejectReasons.some((r) => r.trim() !== "")
								}
								className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
							>
								{updateKyc.isLoading ? (
									<>
										<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
										Traitement...
									</>
								) : (
									"Rejeter"
								)}
							</button>
						</div>
					</div>
				</div>
			)}
		</Layout>
	);
};

export default ManageKyc;
