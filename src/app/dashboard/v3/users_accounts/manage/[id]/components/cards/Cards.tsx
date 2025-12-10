"use client";
import {
	handleGetAllCardsTransations,
	handleGetCards,
} from "@/api/handlers/cards.handler";
import CustomTable from "@/components/shared/CustomTable";
import LabelWithBadge from "@/components/shared/LabelWithBadge";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
import { CreditCard, DollarSign, Wallet, ArrowRightLeft } from "lucide-react";

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

	const getCardsQuery = useQuery({
		queryKey: ["cards", id],
		queryFn: handleGetCards,
		onError: (err: any) => {
			toast.error(err.message);
		},
	});

	const getAllCardsTransaction = useQuery({
		queryKey: ["allcardstransactions", id],
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
		router.push(`/manage/${cardId}`);
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

	const transactionTableData =
		getAllCardsTransaction.data?.data?.data?.map(
			(transaction: Transaction, index: number) => {
				return {
					serial: (index + 1).toString(),
					reference: transaction.reference || "N/A",
					type: transaction.type,
					formattedAmount: `${transaction.amount} ${transaction.currency}`,
					status: <span>{transaction.status}</span>,
					cardBalanceAfter: transaction.cardBalanceAfter.toString(),
					date: new Date(transaction.createdAt).toLocaleDateString(
						"fr-FR"
					),
					// actions: <span>Détails</span>, // Version simple
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
						Erreur lors du chargement des cartes
					</p>
				</div>
			</div>
		);
	}

	const cards = getCardsQuery.data?.data || [];

	return (
		<div className="min-h-screen bg-white ">
			<div className="  space-y-8">
				{/* Section Cartes */}
				<div>
					<div className="mb-8">
						<h1 className="text-2xl font-bold text-slate-800 mb-2">
							Cards List
						</h1>
					</div>

					{cards.length === 0 ? (
						<div className="text-center py-16">
							<CreditCard className="w-16 h-16 text-slate-300 mx-auto mb-4" />
							<p className="text-slate-500 text-lg">
								Aucune carte disponible
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
																Titulaire
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
														Solde disponible
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
														Créée le
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
								Historique des Transactions
							</h2>
							<p className="text-slate-600 text-sm">
								{getAllCardsTransaction.data?.data?.meta
									?.total || 0}{" "}
								transactions récentes
							</p>
						</div>
						<div className="flex items-center gap-2 text-slate-600">
							<ArrowRightLeft className="w-5 h-5" />
							<span className="text-sm font-medium">
								Transactions
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
						/>
					</section>
				</div>
			</div>
		</div>
	);
};

export default Cards;
