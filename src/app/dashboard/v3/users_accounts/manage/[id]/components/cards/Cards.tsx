"use client";
import {
	handleGetAllCardsTransations,
	handleGetCards,
} from "@/api/handlers/cards.handler";
import CustomTable from "@/components/shared/CustomTable";
import LabelWithBadge from "@/components/shared/LabelWithBadge";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
import {
	CreditCard,
	DollarSign,
	Wallet,
	ArrowRightLeft,
	X,
	Calendar,
	Hash,
	FileText,
	User,
	Globe,
	CheckCircle,
	XCircle,
	Clock,
	RefreshCcw,
	Info,
} from "lucide-react";
import CButton from "@/components/shared/CButton";
import { FourDots } from "@/components/shared/icons";
import Modal from "@/components/shared/Modal/Modal";

interface Card {
	id: string;
	userId: string;
	customerId: string;
	cartevoCardId: string;
	status: string;
	balance: string;
	maskedNumber: string;
	currency: string;
	brand: string;
	expiryMonth: number | null;
	expiryYear: number | null;
	nameOnCard: string;
	isVirtual: boolean;
	createdAt: string;
	updatedAt: string;
	metadata: {
		cardType: string;
		createdVia: string;
	};
}

interface Transaction {
	id: string;
	userId: string;
	cardId: string;
	type: string;
	amount: number;
	amountUSD: number;
	currency: string;
	status: string;
	reference: string;
	externalReference: string;
	isCrossborder: boolean;
	fees: {
		feesPaid: boolean;
		totalFees: number;
		failureFee: number;
		successFee: number;
		feesPaidFrom: string;
		crossborderFee: number;
	};
	cardBalanceBefore: number;
	cardBalanceAfter: number;
	metadata: any;
	createdAt: string;
	completedAt: string;
}

// Composant pour afficher les détails de la transaction
const TransactionDetailsContent: React.FC<{ transaction: Transaction }> = ({
	transaction,
}) => {
	const getStatusBadge = (status: string) => {
		const statusConfig = {
			SUCCESS: {
				icon: CheckCircle,
				bg: "bg-green-100",
				text: "text-green-800",
				border: "border-green-200",
				label: "Réussi",
			},
			FAILED: {
				icon: XCircle,
				bg: "bg-red-100",
				text: "text-red-800",
				border: "border-red-200",
				label: "Échoué",
			},
			PENDING: {
				icon: Clock,
				bg: "bg-yellow-100",
				text: "text-yellow-800",
				border: "border-yellow-200",
				label: "En cours",
			},
			PROCESSING: {
				icon: RefreshCcw,
				bg: "bg-blue-100",
				text: "text-blue-800",
				border: "border-blue-200",
				label: "Traitement",
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

	const getTypeLabel = (type: string) => {
		const typeLabels: Record<string, string> = {
			PAYMENT: "Paiement",
			INITIAL_LOAD: "Chargement initial",
			PURCHASE: "Achat",
			REFUND: "Remboursement",
			TRANSFER: "Transfert",
			WITHDRAWAL: "Retrait",
		};
		return typeLabels[type] || type;
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("fr-FR", {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
		});
	};

	return (
		<div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4">
			{/* En-tête du modal */}
			<div className="flex items-center justify-between p-6 border-b border-gray-200">
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
						<CreditCard className="w-5 h-5 text-blue-600" />
					</div>
					<div>
						<h2 className="text-xl font-bold text-gray-900">
							Détails de la transaction
						</h2>
						<p className="text-sm text-gray-500">
							Référence : {transaction.reference}
						</p>
					</div>
				</div>
			</div>

			{/* Contenu du modal */}
			<div className="p-6 max-h-[70vh] overflow-y-auto">
				{/* Section principale */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
					{/* Informations de base */}
					<div className="space-y-4">
						<div>
							<h3 className="text-sm font-medium text-gray-500 mb-2">
								Statut
							</h3>
							{getStatusBadge(transaction.status)}
						</div>

						<div>
							<h3 className="text-sm font-medium text-gray-500 mb-2">
								Type
							</h3>
							<p className="text-lg font-semibold text-gray-900">
								{getTypeLabel(transaction.type)}
							</p>
						</div>

						<div>
							<h3 className="text-sm font-medium text-gray-500 mb-2">
								Montant
							</h3>
							<div className="flex items-center gap-2">
								<DollarSign className="w-5 h-5 text-gray-400" />
								<p className="text-2xl font-bold text-gray-900">
									{transaction.amount} {transaction.currency}
								</p>
							</div>
							{transaction.amountUSD !== undefined && (
								<p className="text-sm text-gray-500 mt-1">
									≈ {transaction.amountUSD} USD
								</p>
							)}
						</div>
					</div>

					{/* Dates */}
					<div className="space-y-4">
						<div>
							<h3 className="text-sm font-medium text-gray-500 mb-2">
								Date de création
							</h3>
							<div className="flex items-center gap-2">
								<Calendar className="w-4 h-4 text-gray-400" />
								<p className="text-gray-900">
									{formatDate(transaction.createdAt)}
								</p>
							</div>
						</div>

						{transaction.completedAt && (
							<div>
								<h3 className="text-sm font-medium text-gray-500 mb-2">
									Date de complétion
								</h3>
								<div className="flex items-center gap-2">
									<Calendar className="w-4 h-4 text-gray-400" />
									<p className="text-gray-900">
										{formatDate(transaction.completedAt)}
									</p>
								</div>
							</div>
						)}

						<div>
							<h3 className="text-sm font-medium text-gray-500 mb-2">
								Cross-border
							</h3>
							<div className="flex items-center gap-2">
								<Globe className="w-4 h-4 text-gray-400" />
								<p className="text-gray-900">
									{transaction.isCrossborder ? "Oui" : "Non"}
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Identifiants */}
				<div className="mb-8">
					<h3 className="text-sm font-medium text-gray-500 mb-3">
						Identifiants
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="p-3 bg-gray-50 rounded-lg">
							<p className="text-xs text-gray-500 mb-1">
								ID Transaction
							</p>
							<p className="text-sm font-medium text-gray-900 break-all">
								{transaction.id}
							</p>
						</div>
						<div className="p-3 bg-gray-50 rounded-lg">
							<p className="text-xs text-gray-500 mb-1">
								Référence externe
							</p>
							<p className="text-sm font-medium text-gray-900 break-all">
								{transaction.externalReference || "N/A"}
							</p>
						</div>
						<div className="p-3 bg-gray-50 rounded-lg">
							<p className="text-xs text-gray-500 mb-1">
								ID Carte
							</p>
							<p className="text-sm font-medium text-gray-900 break-all">
								{transaction.cardId}
							</p>
						</div>
						<div className="p-3 bg-gray-50 rounded-lg">
							<p className="text-xs text-gray-500 mb-1">
								ID Utilisateur
							</p>
							<p className="text-sm font-medium text-gray-900 break-all">
								{transaction.userId}
							</p>
						</div>
					</div>
				</div>

				{/* Solde carte */}
				<div className="mb-8">
					<h3 className="text-sm font-medium text-gray-500 mb-3">
						Solde de la carte
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div className="p-4 bg-blue-50 rounded-lg">
							<p className="text-xs text-blue-600 mb-1">
								Avant transaction
							</p>
							<p className="text-lg font-bold text-gray-900">
								{transaction.cardBalanceBefore}{" "}
								{transaction.currency}
							</p>
						</div>
						<div className="p-4 bg-green-50 rounded-lg">
							<p className="text-xs text-green-600 mb-1">
								Après transaction
							</p>
							<p className="text-lg font-bold text-gray-900">
								{transaction.cardBalanceAfter}{" "}
								{transaction.currency}
							</p>
						</div>
						<div className="p-4 bg-purple-50 rounded-lg">
							<p className="text-xs text-purple-600 mb-1">
								Différence
							</p>
							<p className="text-lg font-bold text-gray-900">
								{transaction.cardBalanceAfter -
									transaction.cardBalanceBefore}{" "}
								{transaction.currency}
							</p>
						</div>
					</div>
				</div>

				{/* Frais */}
				{transaction.fees && (
					<div className="mb-8">
						<h3 className="text-sm font-medium text-gray-500 mb-3">
							Frais
						</h3>
						<div className="bg-gray-50 rounded-lg p-4">
							<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
								<div>
									<p className="text-xs text-gray-500 mb-1">
										Total des frais
									</p>
									<p className="font-medium text-gray-900">
										{transaction.fees.totalFees}{" "}
										{transaction.currency}
									</p>
								</div>
								<div>
									<p className="text-xs text-gray-500 mb-1">
										Frais d'échec
									</p>
									<p className="font-medium text-gray-900">
										{transaction.fees.failureFee}{" "}
										{transaction.currency}
									</p>
								</div>
								<div>
									<p className="text-xs text-gray-500 mb-1">
										Frais de succès
									</p>
									<p className="font-medium text-gray-900">
										{transaction.fees.successFee}{" "}
										{transaction.currency}
									</p>
								</div>
								<div>
									<p className="text-xs text-gray-500 mb-1">
										Frais cross-border
									</p>
									<p className="font-medium text-gray-900">
										{transaction.fees.crossborderFee}{" "}
										{transaction.currency}
									</p>
								</div>
							</div>
							{transaction.fees.feesPaidFrom && (
								<div className="mt-3 pt-3 border-t border-gray-200">
									<p className="text-xs text-gray-500 mb-1">
										Frais payés depuis
									</p>
									<p className="font-medium text-gray-900 capitalize">
										{transaction.fees.feesPaidFrom}
									</p>
								</div>
							)}
						</div>
					</div>
				)}

				{/* Métadonnées */}
				{transaction.metadata && (
					<div>
						<h3 className="text-sm font-medium text-gray-500 mb-3">
							Métadonnées
						</h3>
						<div className="bg-gray-50 rounded-lg p-4">
							<pre className="text-sm text-gray-800 whitespace-pre-wrap break-words">
								{JSON.stringify(transaction.metadata, null, 2)}
							</pre>
						</div>
					</div>
				)}
			</div>

			{/* Pied du modal */}
			<div className="p-6 border-t border-gray-200 flex justify-end">
				<button
					onClick={() => {
						const event = new CustomEvent("closeModal");
						window.dispatchEvent(event);
					}}
					className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition"
				>
					Fermer
				</button>
			</div>
		</div>
	);
};

// Définir le header des transactions
const transactionsHeaderData = {
	serial: "#",
	reference: "Référence",
	type: "Type",
	formattedAmount: "Montant",
	status: "Statut",
	cardBalanceAfter: "Solde Final",
	date: "Date",
	actions: "Actions",
};

const Cards = () => {
	const params = useParams();
	const router = useRouter();
	const id = params.id;
	const [filterContent, setFilterContent] = useState();
	const [search, setSearch] = useState();

	// États pour le modal
	const [selectedTransaction, setSelectedTransaction] =
		useState<Transaction | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const getCardsQuery = useQuery({
		queryKey: ["cards", id],
		queryFn: handleGetCards,
		onError: (err: any) => {
			toast.error(err.message);
		},
	});

	const getAllCardsTransaction = useQuery({
		queryKey: ["allcardstransactions", id, filterContent],
		queryFn: handleGetAllCardsTransations,
		onError: (err: any) => {
			toast.error(err.message);
		},
	});

	const formatCardNumber = (maskedNumber: string) => {
		return maskedNumber || "**** **** **** ****";
	};

	const formatExpiry = (month: number | null, year: number | null) => {
		if (!month || !year) return "**/**";
		return `${String(month).padStart(2, "0")}/${String(year).slice(-2)}`;
	};

	const getCardGradient = (index: number) => {
		return "from-[#32d172] via-[#2ab862] to-[#229f52]";
	};

	const handleCardClick = (cardId: string) => {
		router.push(`/dashboard/v3/cards/${cardId}`);
	};

	// Fonction pour le badge de statut des transactions
	const getTransactionStatusBadge = (status: string) => {
		switch (status) {
			case "SUCCESS":
				return <LabelWithBadge label="Succès" badgeColor="#18BC7A" />;
			case "PENDING":
				return (
					<LabelWithBadge label="En Attente" badgeColor="#f39c12" />
				);
			case "FAILED":
				return <LabelWithBadge label="Échoué" badgeColor="#F85D4B" />;
			case "CANCELLED":
				return <LabelWithBadge label="Annulé" badgeColor="#95a5a6" />;
			default:
				return <LabelWithBadge label={status} badgeColor="#000" />;
		}
	};

	// Gérer l'ouverture du modal
	const handleViewDetails = (transaction: Transaction) => {
		setSelectedTransaction(transaction);
		setIsModalOpen(true);
	};

	// Gérer la fermeture du modal
	const handleCloseModal = () => {
		setIsModalOpen(false);
		setSelectedTransaction(null);
	};

	// Écouter l'événement de fermeture du modal
	React.useEffect(() => {
		const handleCloseModalEvent = () => {
			handleCloseModal();
		};

		window.addEventListener("closeModal", handleCloseModalEvent);

		return () => {
			window.removeEventListener("closeModal", handleCloseModalEvent);
		};
	}, []);

	const transactionTableData =
		getAllCardsTransaction.data?.data?.data?.map(
			(transaction: Transaction, index: number) => {
				return {
					serial: (index + 1).toString(),
					reference: transaction.reference || "N/A",
					type: transaction.type,
					formattedAmount: `${transaction.amount} ${transaction.currency}`,
					status: getTransactionStatusBadge(transaction.status),
					cardBalanceAfter: transaction.cardBalanceAfter.toString(),
					date: new Date(transaction.createdAt).toLocaleDateString(
						"fr-FR"
					),
					actions: (
						<CButton
							text="Details"
							btnStyle={"dark"}
							icon={<Info className="w-4 h-4" />}
							onClick={() => handleViewDetails(transaction)}
						/>
					),
				};
			}
		) || [];

	if (getCardsQuery.isLoading) {
		return (
			<div className="min-h-screen bg-white ">
				<div className="max-w-6xl mx-auto">
					<div className="animate-pulse space-y-6">
						<div className="h-8 bg-slate-200 rounded w-48"></div>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{[1, 2, 3].map((i) => (
								<div
									key={i}
									className="h-56 bg-slate-200 rounded-2xl"
								></div>
							))}
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (getCardsQuery.isError) {
		return (
			<div className="min-h-screen bg-white p-6 flex items-center justify-center">
				<div className="text-center">
					<div className="text-red-500 text-xl mb-2">⚠️</div>
					<p className="text-slate-600">
						{"Erreur lors du chargement des cartes"}
					</p>
				</div>
			</div>
		);
	}

	const cards = getCardsQuery.data?.data || [];

	return (
		<>
			<div className="min-h-screen bg-white ">
				<div className="  space-y-8">
					{/* Section Cartes */}
					<div>
						<div className="mb-8">
							<h1 className="text-2xl font-bold text-slate-800 mb-2">
								{"	Cards List"}
							</h1>
						</div>

						{cards.length === 0 ? (
							<div className="text-center py-16">
								<CreditCard className="w-16 h-16 text-slate-300 mx-auto mb-4" />
								<p className="text-slate-500 text-lg">
									{"	Aucune carte disponible"}
								</p>
							</div>
						) : (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{cards.map((card: Card, index: number) => (
									<button
										key={card.id}
										onClick={() => handleCardClick(card.id)}
										className="group perspective-1000 text-left w-full"
									>
										<div className="relative transform transition-all duration-300 hover:scale-105 hover:-translate-y-2">
											{/* Carte bancaire */}
											<div
												className={`relative w-full h-56 rounded-2xl bg-gradient-to-br ${getCardGradient(
													index
												)} p-6 text-white shadow-2xl overflow-hidden`}
											>
												{/* Motif de fond */}
												<div className="absolute inset-0 opacity-10">
													<div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32"></div>
													<div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-24 -translate-x-24"></div>
												</div>

												{/* Contenu de la carte */}
												<div className="relative h-full flex flex-col justify-between">
													{/* En-tête */}
													<div className="flex justify-between items-start">
														<div>
															<div className="text-xs font-semibold opacity-80 mb-1">
																{card.isVirtual
																	? "CARTE VIRTUELLE"
																	: "CARTE PHYSIQUE"}
															</div>
															<div
																className={`inline-block px-2 py-1 rounded text-xs font-medium ${
																	card.status ===
																	"ACTIVE"
																		? "bg-green-400 bg-opacity-30 text-green-100"
																		: "bg-red-400 bg-opacity-30 text-red-100"
																}`}
															>
																{card.status}
															</div>
														</div>
														<div className="text-2xl font-bold">
															{card.brand}
														</div>
													</div>

													{/* Puce */}
													<div className="w-12 h-10 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-lg opacity-90"></div>

													{/* Numéro de carte */}
													<div>
														<div className="text-xl font-mono tracking-wider mb-3">
															{formatCardNumber(
																card.maskedNumber
															)}
														</div>

														{/* Infos du bas */}
														<div className="flex justify-between items-end">
															<div>
																<div className="text-xs opacity-70 mb-1">
																	{
																		"	Titulaire"
																	}
																</div>
																<div className="text-sm font-semibold truncate max-w-[180px]">
																	{
																		card.nameOnCard
																	}
																</div>
															</div>
															<div className="text-right">
																<div className="text-xs opacity-70 mb-1">
																	Expire
																</div>
																<div className="text-sm font-semibold">
																	{formatExpiry(
																		card.expiryMonth,
																		card.expiryYear
																	)}
																</div>
															</div>
														</div>
													</div>
												</div>
											</div>

											{/* Panneau d'informations en dessous */}
											<div className="mt-4 bg-white rounded-xl p-4 shadow-lg">
												<div className="flex items-center justify-between">
													<div>
														<div className="text-xs text-slate-500 mb-1">
															{"Solde disponible"}
														</div>
														<div className="text-2xl font-bold text-slate-800">
															{parseFloat(
																card.balance
															).toFixed(2)}{" "}
															{card.currency}
														</div>
													</div>
													<div className="text-right">
														<div className="text-xs text-slate-500 mb-1">
															{"Créée le"}
														</div>
														<div className="text-sm font-medium text-slate-700">
															{new Date(
																card.createdAt
															).toLocaleDateString(
																"fr-FR",
																{
																	day: "2-digit",
																	month: "short",
																	year: "numeric",
																}
															)}
														</div>
													</div>
												</div>
											</div>
										</div>
									</button>
								))}
							</div>
						)}
					</div>

					{/* Section Transactions avec CustomTable */}

					<div className="mt-12">
						<div className="mb-6 flex items-center justify-between">
							<div>
								<h2 className="text-xl font-bold text-slate-800 mb-1">
									{"Historique des Transactions"}
								</h2>
								<p className="text-slate-600 text-sm">
									{getAllCardsTransaction.data?.data?.meta
										?.total || 0}{" "}
									{"transactions récentes"}
								</p>
							</div>
							<div className="flex items-center gap-2 text-slate-600">
								<ArrowRightLeft className="w-5 h-5" />
								<span className="text-sm font-medium">
									{"Transactions"}
								</span>
							</div>
						</div>

						<section>
							<CustomTable
								headerData={transactionsHeaderData}
								tableData={transactionTableData}
								isLoading={
									getAllCardsTransaction.isLoading ||
									getAllCardsTransaction.isFetching
								}
								filter
								filterType={"transactionsV3"}
								filterContent={filterContent}
								setFilterContent={setFilterContent}
								search={search}
								setSearch={setSearch}
							/>
						</section>
					</div>
				</div>
			</div>

			{/* Modal pour afficher les détails de la transaction */}
			<Modal
				isOpen={isModalOpen}
				setIsOpen={handleCloseModal}
				modalContent={
					selectedTransaction ? (
						<TransactionDetailsContent
							transaction={selectedTransaction}
						/>
					) : null
				}
			/>
		</>
	);
};

export default Cards;
