"use client";

import { handleGetUsersDetails } from "@/api/handlers/user.handler";
import Layout from "@/components/shared/Layout";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { useQuery } from "react-query";
import {
	Phone,
	Mail,
	Calendar,
	MapPin,
	Flag,
	Building,
	Home,
	Tag,
	CheckCircle,
	XCircle,
	Clock,
	Hash,
	Target,
	User as UserIcon,
	Save,
	Edit,
	X,
	CreditCard,
	UserCheck,
	Shield,
	Activity,
	Globe,
	Key,
	CalendarDays,
	RefreshCw,
	LogIn,
	Eye,
	EyeOff,
	ToggleLeft,
	ToggleRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";

const Details = () => {
	const params = useParams();
	const id = params.id;
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState<any>({});

	const getUserDetails = useQuery({
		queryKey: ["user-details", id],
		queryFn: handleGetUsersDetails,
		onSuccess: (data) => {
			if (data?.data) {
				setFormData(data.data);
			}
		},
	});

	const { data: userData, isLoading, isError } = getUserDetails;

	const handleInputChange = (field: string, value: any) => {
		setFormData((prev: any) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleSave = () => {
		console.log("Données à sauvegarder:", formData);
		setIsEditing(false);
		// Ajoutez votre mutation API ici
	};

	const handleCancel = () => {
		if (userData?.data) {
			setFormData(userData.data);
		}
		setIsEditing(false);
	};

	const getStatusBadge = (status: string) => {
		const statusConfig = {
			COMPLETED: {
				icon: CheckCircle,
				bg: "bg-green-50",
				text: "text-green-700",
				border: "border-green-200",
				label: "Completé",
			},
			PENDING: {
				icon: Clock,
				bg: "bg-yellow-50",
				text: "text-yellow-700",
				border: "border-yellow-200",
				label: "En attente",
			},
			REJECTED: {
				icon: XCircle,
				bg: "bg-red-50",
				text: "text-red-700",
				border: "border-red-200",
				label: "Rejeté",
			},
		};

		const config =
			statusConfig[status as keyof typeof statusConfig] ||
			statusConfig.PENDING;
		const Icon = config.icon;

		return (
			<span
				className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${config.bg} ${config.text} ${config.border} border text-sm font-medium`}
			>
				<Icon className="w-4 h-4" />
				{config.label}
			</span>
		);
	};

	const getTransactionStatusBadge = (status: string) => {
		const statusConfig = {
			ENABLED: {
				bg: "bg-green-50",
				text: "text-green-700",
				border: "border-green-200",
				label: "Activé",
				icon: ToggleRight,
			},
			DISABLED: {
				bg: "bg-red-50",
				text: "text-red-700",
				border: "border-red-200",
				label: "Désactivé",
				icon: ToggleLeft,
			},
		};

		const config =
			statusConfig[status as keyof typeof statusConfig] ||
			statusConfig.DISABLED;
		const Icon = config.icon;

		return (
			<span
				className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${config.bg} ${config.text} ${config.border} border text-sm font-medium`}
			>
				<Icon className="w-4 h-4" />
				{config.label}
			</span>
		);
	};

	if (isLoading) {
		return (
			<Layout title="Gérer le compte utilisateur">
				<div className="flex items-center justify-center h-screen">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#18bc7a]"></div>
				</div>
			</Layout>
		);
	}

	if (isError || !userData?.data) {
		return (
			<div className="flex items-center justify-center h-screen">
				<div className="text-center">
					<p className="text-gray-600">
						{`Impossible de charger les données de l'utilisateur`}
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 p-4">
			<div className="flex flex-col lg:flex-row gap-6">
				{/* Colonne gauche - Informations détaillées */}
				<div className="lg:w-2/3 space-y-6">
					{/* Section Informations personnelles */}
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
						<h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
							{`Informations personnelles`}
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
									<UserIcon className="w-4 h-4 text-[#18bc7a]" />
									{`Prénom`}
								</label>
								{isEditing ? (
									<Input
										value={formData.firstName || ""}
										onChange={(e) =>
											handleInputChange(
												"firstName",
												e.target.value
											)
										}
										className="w-full"
									/>
								) : (
									<div className="text-base font-medium text-gray-900 bg-gray-50 p-3 rounded border border-gray-200">
										{formData.firstName || "Non renseigné"}
									</div>
								)}
							</div>
							<div>
								<label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
									<UserIcon className="w-4 h-4 text-[#18bc7a]" />
									{`Nom`}
								</label>
								{isEditing ? (
									<Input
										value={formData.lastName || ""}
										onChange={(e) =>
											handleInputChange(
												"lastName",
												e.target.value
											)
										}
										className="w-full"
									/>
								) : (
									<div className="text-base font-medium text-gray-900 bg-gray-50 p-3 rounded border border-gray-200">
										{formData.lastName || "Non renseigné"}
									</div>
								)}
							</div>
						</div>
					</div>

					{/* Section Contact */}
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
						<h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
							{`Informations de contact`}
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
									<Phone className="w-4 h-4 text-[#18bc7a]" />
									{`Téléphone`}
								</label>
								{isEditing ? (
									<Input
										value={formData.phoneNumber || ""}
										onChange={(e) =>
											handleInputChange(
												"phoneNumber",
												e.target.value
											)
										}
										className="w-full"
									/>
								) : (
									<div className="text-base font-medium text-gray-900 bg-gray-50 p-3 rounded border border-gray-200">
										{formData.phoneNumber ||
											"Non renseigné"}
									</div>
								)}
							</div>
							<div>
								<label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
									<Mail className="w-4 h-4 text-[#18bc7a]" />
									{`Email`}
								</label>
								{isEditing ? (
									<Input
										value={formData.email || ""}
										onChange={(e) =>
											handleInputChange(
												"email",
												e.target.value
											)
										}
										className="w-full"
									/>
								) : (
									<div className="text-base font-medium text-gray-900 bg-gray-50 p-3 rounded border border-gray-200">
										{formData.email || "Non renseigné"}
									</div>
								)}
							</div>
						</div>
					</div>

					{/* Section Localisation */}
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
						<h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
							{`Localisation`}
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
									<Flag className="w-4 h-4 text-[#18bc7a]" />
									{`Pays`}
								</label>
								{isEditing ? (
									<Input
										value={formData.countryName || ""}
										onChange={(e) =>
											handleInputChange(
												"countryName",
												e.target.value
											)
										}
										className="w-full"
									/>
								) : (
									<div className="text-base font-medium text-gray-900 bg-gray-50 p-3 rounded border border-gray-200">
										{formData.countryName ||
											"Non renseigné"}
									</div>
								)}
							</div>
							<div>
								<label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
									<MapPin className="w-4 h-4 text-[#18bc7a]" />
									{`Ville`}
								</label>
								{isEditing ? (
									<Input
										value={formData.city || ""}
										onChange={(e) =>
											handleInputChange(
												"city",
												e.target.value
											)
										}
										className="w-full"
									/>
								) : (
									<div className="text-base font-medium text-gray-900 bg-gray-50 p-3 rounded border border-gray-200">
										{formData.city || "Non renseigné"}
									</div>
								)}
							</div>
						</div>
					</div>
				</div>

				{/* Colonne droite - Informations importantes */}
				<div className="lg:w-1/3 space-y-6">
					{/* Carte d'information rapide */}
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
						<h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200 flex items-center gap-2">
							<Activity className="w-5 h-5 text-[#18bc7a]" />
							{`Statut du compte`}
						</h2>
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
										<CalendarDays className="w-5 h-5 text-blue-600" />
									</div>
									<div>
										<p className="text-sm font-medium text-gray-700">
											Date de création
										</p>
										<p className="text-sm text-gray-500">
											{formData.createdAt
												? new Date(
														formData.createdAt
												  ).toLocaleDateString("fr-FR")
												: "Non disponible"}
										</p>
									</div>
								</div>
							</div>

							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
										<UserCheck className="w-5 h-5 text-green-600" />
									</div>
									<div>
										<p className="text-sm font-medium text-gray-700">
											Statut KYC
										</p>
										<div className="mt-1">
											{getStatusBadge(formData.kycStatus)}
										</div>
									</div>
								</div>
							</div>

							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
										<CreditCard className="w-5 h-5 text-purple-600" />
									</div>
									<div>
										<p className="text-sm font-medium text-gray-700">
											Transactions
										</p>
										<div className="mt-1">
											{getTransactionStatusBadge(
												formData.transactionEnableStatus
											)}
										</div>
									</div>
								</div>
							</div>

							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
										<Shield className="w-5 h-5 text-amber-600" />
									</div>
									<div>
										<p className="text-sm font-medium text-gray-700">
											Statut compte
										</p>
										<div className="mt-1">
											<span
												className={`inline-flex px-3 py-1.5 rounded-full text-sm font-medium ${
													formData.isActive
														? "bg-green-50 text-green-700 border border-green-200"
														: "bg-red-50 text-red-700 border border-red-200"
												}`}
											>
												{formData.isActive
													? "Actif"
													: "Inactif"}
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Informations système */}
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
						<h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200 flex items-center gap-2">
							<Globe className="w-5 h-5 text-[#18bc7a]" />
							{`Informations système`}
						</h2>
						<div className="space-y-4">
							<div className="space-y-2">
								<label className="text-sm font-medium text-gray-700 flex items-center gap-2">
									<Key className="w-4 h-4 text-gray-400" />
									{`Code utilisateur`}
								</label>
								<div className="text-sm font-mono font-medium text-gray-900 bg-gray-50 p-3 rounded border border-gray-200">
									{formData.userReferenceCode ||
										"Non renseigné"}
								</div>
							</div>

							<div className="space-y-2">
								<label className="text-sm font-medium text-gray-700 flex items-center gap-2">
									<UserCheck className="w-4 h-4 text-gray-400" />
									{`Rôle`}
								</label>
								<div className="text-sm font-medium text-gray-900 bg-gray-50 p-3 rounded border border-gray-200">
									{formData.roles?.join(", ") || "CUSTOMER"}
								</div>
							</div>

							<div className="space-y-2">
								<label className="text-sm font-medium text-gray-700 flex items-center gap-2">
									<RefreshCw className="w-4 h-4 text-gray-400" />
									{`Dernière mise à jour`}
								</label>
								<div className="text-sm font-medium text-gray-900 bg-gray-50 p-3 rounded border border-gray-200">
									{formData.updatedAt
										? new Date(
												formData.updatedAt
										  ).toLocaleDateString("fr-FR", {
												year: "numeric",
												month: "short",
												day: "numeric",
												hour: "2-digit",
												minute: "2-digit",
										  })
										: "Non renseigné"}
								</div>
							</div>

							<div className="space-y-2">
								<label className="text-sm font-medium text-gray-700 flex items-center gap-2">
									<LogIn className="w-4 h-4 text-gray-400" />
									{`Première connexion`}
								</label>
								<div className="text-sm font-medium text-gray-900 bg-gray-50 p-3 rounded border border-gray-200">
									{formData.firstLoginAt
										? new Date(
												formData.firstLoginAt
										  ).toLocaleDateString("fr-FR", {
												year: "numeric",
												month: "short",
												day: "numeric",
										  })
										: "Jamais connecté"}
								</div>
							</div>

							<div className="space-y-2">
								<label className="text-sm font-medium text-gray-700 flex items-center gap-2">
									<Hash className="w-4 h-4 text-gray-400" />
									{`Code de parrainage`}
								</label>
								<div className="text-sm font-mono font-medium text-gray-900 bg-gray-50 p-3 rounded border border-gray-200">
									{formData.referralCode || "Aucun"}
								</div>
							</div>
						</div>
					</div>

					{/* Actions rapides */}
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
						<h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
							{`Actions rapides`}
						</h2>
						<div className="space-y-3">
							<button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#18bc7a] text-white rounded-lg hover:bg-[#15a669] transition">
								<Mail className="w-4 h-4" />
								{`Envoyer un email`}
							</button>
							<button className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-[#18bc7a] text-[#18bc7a] rounded-lg hover:bg-[#18bc7a] hover:text-white transition">
								<Phone className="w-4 h-4" />
								{`Appeler l'utilisateur`}
							</button>
							<button className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
								{formData.isActive ? (
									<>
										<EyeOff className="w-4 h-4" />
										{`Désactiver le compte`}
									</>
								) : (
									<>
										<Eye className="w-4 h-4" />
										{`Activer le compte`}
									</>
								)}
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Details;
