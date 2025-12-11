"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "react-query";
import {
	handleGetUserDefaultWallet,
	handleGetUserTransactions,
	handleGetTransactionDetails,
} from "@/api/handlers/transactions.handler";
import {
	Wallet,
	TrendingUp,
	TrendingDown,
	ArrowUpRight,
	ArrowDownLeft,
	RefreshCw,
	CheckCircle,
	XCircle,
	Clock,
	Eye,
	ChevronLeft,
	ChevronRight,
	Filter,
	Calendar,
	CreditCard,
	Banknote,
	ArrowRightLeft,
} from "lucide-react";
import LabelWithBadge from "@/components/shared/LabelWithBadge";
import { getFormattedDateTime } from "@/utils/DateFormat";
import CButton from "@/components/shared/CButton";
import { FourDots } from "@/components/shared/icons";

// Types
interface WalletData {
	id: string;
	userId: string;
	currency: string;
	accountType: string;
	status: string;
	isDefault: boolean;
	balance: number;
	formattedBalance: string;
	availableBalance: number;
	totalHolds: number;
}

interface TransactionStats {
	totalCount: number;
	totalSuccessCount: number;
	totalPendingCount: number;
	totalFailedCount: number;
	totalSuccessAmount: number;
	totalDeposits: number;
	totalWithdrawals: number;
	totalTransfersSent: number;
	totalTransfersReceived: number;
}

interface Transaction {
	id: string;
	userId: string;
	type: string;
	status: string;
	category: string;
	currency: string;
	amount: number;
	netAmount: number;
	feeAmount: number;
	reference: string;
	formattedAmount: string;
	createdAt: string;
	metadata?: Record<string, any>;
}

interface TransactionFilters {
	page: number;
	limit: number;
	type?: string;
	status?: string;
	category?: string;
	startDate?: string;
	endDate?: string;
}

const Transactions = () => {
	const params = useParams();
	const userId = params.id as string;

	// State
	const [filters, setFilters] = useState<TransactionFilters>({
		page: 1,
		limit: 10,
	});
	const [showFilters, setShowFilters] = useState(false);
	const [selectedTransaction, setSelectedTransaction] = useState<string | null>(
		null
	);

	// Fetch default wallet
	const walletQuery = useQuery({
		queryKey: ["user-default-wallet", userId],
		queryFn: handleGetUserDefaultWallet,
		enabled: !!userId,
	});

	// Fetch transactions
	const transactionsQuery = useQuery({
		queryKey: ["user-transactions", userId, filters],
		queryFn: handleGetUserTransactions,
		enabled: !!userId,
	});

	// Fetch transaction details
	const transactionDetailsQuery = useQuery({
		queryKey: ["transaction-details", selectedTransaction],
		queryFn: handleGetTransactionDetails,
		enabled: !!selectedTransaction,
	});

	const wallet: WalletData | null = walletQuery.data;
	const transactionsData = transactionsQuery.data;
	const transactions: Transaction[] = transactionsData?.data || [];
	const stats: TransactionStats = transactionsData?.stats || {
		totalCount: 0,
		totalSuccessCount: 0,
		totalPendingCount: 0,
		totalFailedCount: 0,
		totalSuccessAmount: 0,
		totalDeposits: 0,
		totalWithdrawals: 0,
		totalTransfersSent: 0,
		totalTransfersReceived: 0,
	};
	const totalPages = transactionsData?.totalPages || 1;

	// Handlers
	const handleFilterChange = (key: keyof TransactionFilters, value: any) => {
		setFilters((prev) => ({
			...prev,
			[key]: value,
			page: key !== "page" ? 1 : value, // Reset page when filter changes
		}));
	};

	const handlePageChange = (newPage: number) => {
		if (newPage >= 1 && newPage <= totalPages) {
			handleFilterChange("page", newPage);
		}
	};

	const clearFilters = () => {
		setFilters({ page: 1, limit: 10 });
	};

	// Status badge renderer
	const getStatusBadge = (status: string) => {
		switch (status) {
			case "SUCCESS":
				return (
					<LabelWithBadge
						label="Réussi"
						badgeColor="#18BC7A"
						textColor="#444"
					/>
				);
			case "PENDING":
				return (
					<LabelWithBadge
						label="En cours"
						badgeColor="#f39c12"
						textColor="#444"
					/>
				);
			case "FAILED":
				return (
					<LabelWithBadge
						label="Échoué"
						badgeColor="#F85D4B"
						textColor="#444"
					/>
				);
			case "CANCELLED":
			case "CANCELED":
				return (
					<LabelWithBadge
						label="Annulé"
						badgeColor="#6c757d"
						textColor="#444"
					/>
				);
			case "EXPIRED":
				return (
					<LabelWithBadge
						label="Expiré"
						badgeColor="#95a5a6"
						textColor="#444"
					/>
				);
			default:
				return (
					<LabelWithBadge
						label={status}
						badgeColor="#95a5a6"
						textColor="#444"
					/>
				);
		}
	};

	// Type badge renderer
	const getTypeBadge = (type: string, category: string) => {
		const isCard = category === "CARD";
		const prefix = isCard ? "Carte - " : "";

		switch (type) {
			case "DEPOSIT":
				return (
					<div className="flex items-center gap-2">
						<div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
							<ArrowDownLeft className="w-4 h-4 text-green-600" />
						</div>
						<span className="text-sm font-medium">
							{prefix}Dépôt
						</span>
					</div>
				);
			case "WITHDRAWAL":
				return (
					<div className="flex items-center gap-2">
						<div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
							<ArrowUpRight className="w-4 h-4 text-red-600" />
						</div>
						<span className="text-sm font-medium">
							{prefix}Retrait
						</span>
					</div>
				);
			case "TRANSFER":
				return (
					<div className="flex items-center gap-2">
						<div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
							<ArrowRightLeft className="w-4 h-4 text-blue-600" />
						</div>
						<span className="text-sm font-medium">Transfert</span>
					</div>
				);
			case "EXCHANGE":
				return (
					<div className="flex items-center gap-2">
						<div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
							<RefreshCw className="w-4 h-4 text-purple-600" />
						</div>
						<span className="text-sm font-medium">Change</span>
					</div>
				);
			default:
				return (
					<div className="flex items-center gap-2">
						<div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
							<Banknote className="w-4 h-4 text-gray-600" />
						</div>
						<span className="text-sm font-medium">{type}</span>
					</div>
				);
		}
	};

	const formatCurrency = (amount: number, currency: string) => {
		return new Intl.NumberFormat("fr-FR", {
			minimumFractionDigits: 0,
			maximumFractionDigits: 2,
		}).format(amount);
	};

	return (
		<div className="min-h-screen bg-gray-50 p-4">
			<div className="flex flex-col lg:flex-row gap-6">
				{/* Main Content - Left side */}
				<div className="lg:w-2/3 space-y-6">
					{/* Statistics Section */}
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
						<h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
							Statistiques des transactions
						</h2>
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
							<div className="bg-gray-50 rounded-lg p-4">
								<div className="flex items-center gap-2 mb-2">
									<div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
										<Banknote className="w-4 h-4 text-blue-600" />
									</div>
									<span className="text-sm text-gray-600">
										Total
									</span>
								</div>
								<p className="text-2xl font-bold text-gray-900">
									{stats.totalCount}
								</p>
							</div>

							<div className="bg-gray-50 rounded-lg p-4">
								<div className="flex items-center gap-2 mb-2">
									<div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
										<CheckCircle className="w-4 h-4 text-green-600" />
									</div>
									<span className="text-sm text-gray-600">
										Réussies
									</span>
								</div>
								<p className="text-2xl font-bold text-green-600">
									{stats.totalSuccessCount}
								</p>
							</div>

							<div className="bg-gray-50 rounded-lg p-4">
								<div className="flex items-center gap-2 mb-2">
									<div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
										<Clock className="w-4 h-4 text-yellow-600" />
									</div>
									<span className="text-sm text-gray-600">
										En cours
									</span>
								</div>
								<p className="text-2xl font-bold text-yellow-600">
									{stats.totalPendingCount}
								</p>
							</div>

							<div className="bg-gray-50 rounded-lg p-4">
								<div className="flex items-center gap-2 mb-2">
									<div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
										<XCircle className="w-4 h-4 text-red-600" />
									</div>
									<span className="text-sm text-gray-600">
										Échouées
									</span>
								</div>
								<p className="text-2xl font-bold text-red-600">
									{stats.totalFailedCount}
								</p>
							</div>
						</div>

						{/* Amount Stats */}
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-100">
							<div className="text-center">
								<p className="text-sm text-gray-600">
									Total succès
								</p>
								<p className="text-lg font-bold text-[#18bc7a]">
									{formatCurrency(
										stats.totalSuccessAmount,
										wallet?.currency || "XAF"
									)}{" "}
									<span className="text-xs text-gray-500">
										{wallet?.currency || "XAF"}
									</span>
								</p>
							</div>
							<div className="text-center">
								<p className="text-sm text-gray-600">Dépôts</p>
								<p className="text-lg font-bold text-green-600">
									{formatCurrency(
										stats.totalDeposits,
										wallet?.currency || "XAF"
									)}{" "}
									<span className="text-xs text-gray-500">
										{wallet?.currency || "XAF"}
									</span>
								</p>
							</div>
							<div className="text-center">
								<p className="text-sm text-gray-600">Retraits</p>
								<p className="text-lg font-bold text-red-600">
									{formatCurrency(
										stats.totalWithdrawals,
										wallet?.currency || "XAF"
									)}{" "}
									<span className="text-xs text-gray-500">
										{wallet?.currency || "XAF"}
									</span>
								</p>
							</div>
							<div className="text-center">
								<p className="text-sm text-gray-600">
									Transferts envoyés
								</p>
								<p className="text-lg font-bold text-blue-600">
									{formatCurrency(
										stats.totalTransfersSent,
										wallet?.currency || "XAF"
									)}{" "}
									<span className="text-xs text-gray-500">
										{wallet?.currency || "XAF"}
									</span>
								</p>
							</div>
						</div>
					</div>

					{/* Filters Section */}
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
						<div className="flex flex-wrap items-center justify-between gap-4">
							<h3 className="text-md font-semibold text-gray-900">
								Liste des transactions
							</h3>
							<div className="flex items-center gap-2">
								<button
									onClick={() => setShowFilters(!showFilters)}
									className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition ${
										showFilters
											? "bg-[#18bc7a] text-white border-[#18bc7a]"
											: "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
									}`}
								>
									<Filter className="w-4 h-4" />
									Filtres
								</button>
								{(filters.type ||
									filters.status ||
									filters.category ||
									filters.startDate ||
									filters.endDate) && (
									<button
										onClick={clearFilters}
										className="text-sm text-[#18bc7a] hover:underline"
									>
										Effacer
									</button>
								)}
							</div>
						</div>

						{showFilters && (
							<div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 md:grid-cols-5 gap-4">
								<select
									value={filters.type || ""}
									onChange={(e) =>
										handleFilterChange(
											"type",
											e.target.value || undefined
										)
									}
									className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#18bc7a]"
								>
									<option value="">Tous les types</option>
									<option value="DEPOSIT">Dépôt</option>
									<option value="WITHDRAWAL">Retrait</option>
									<option value="TRANSFER">Transfert</option>
									<option value="EXCHANGE">Change</option>
								</select>

								<select
									value={filters.status || ""}
									onChange={(e) =>
										handleFilterChange(
											"status",
											e.target.value || undefined
										)
									}
									className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#18bc7a]"
								>
									<option value="">Tous les statuts</option>
									<option value="SUCCESS">Réussi</option>
									<option value="PENDING">En cours</option>
									<option value="FAILED">Échoué</option>
									<option value="CANCELLED">Annulé</option>
								</select>

								<select
									value={filters.category || ""}
									onChange={(e) =>
										handleFilterChange(
											"category",
											e.target.value || undefined
										)
									}
									className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#18bc7a]"
								>
									<option value="">Toutes catégories</option>
									<option value="WALLET">Wallet</option>
									<option value="CARD">Carte</option>
								</select>

								<input
									type="date"
									value={filters.startDate || ""}
									onChange={(e) =>
										handleFilterChange(
											"startDate",
											e.target.value || undefined
										)
									}
									className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#18bc7a]"
									placeholder="Date début"
								/>

								<input
									type="date"
									value={filters.endDate || ""}
									onChange={(e) =>
										handleFilterChange(
											"endDate",
											e.target.value || undefined
										)
									}
									className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#18bc7a]"
									placeholder="Date fin"
								/>
							</div>
						)}
					</div>

					{/* Transactions List */}
					<div className="bg-white rounded-lg shadow-sm border border-gray-200">
						{transactionsQuery.isLoading ? (
							<div className="flex items-center justify-center py-12">
								<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#18bc7a]"></div>
							</div>
						) : transactions.length === 0 ? (
							<div className="flex flex-col items-center justify-center py-12">
								<Banknote className="w-12 h-12 text-gray-300 mb-4" />
								<p className="text-gray-500">
									Aucune transaction trouvée
								</p>
							</div>
						) : (
							<>
								<div className="overflow-x-auto">
									<table className="w-full">
										<thead className="bg-gray-50 border-b border-gray-200">
											<tr>
												<th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
													Type
												</th>
												<th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
													Montant
												</th>
												<th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
													Frais
												</th>
												<th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
													Statut
												</th>
												<th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
													Date
												</th>
												<th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
													Référence
												</th>
												<th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
													Actions
												</th>
											</tr>
										</thead>
										<tbody className="divide-y divide-gray-200">
											{transactions.map((tx) => (
												<tr
													key={tx.id}
													className="hover:bg-gray-50 transition"
												>
													<td className="px-4 py-4">
														{getTypeBadge(
															tx.type,
															tx.category
														)}
													</td>
													<td className="px-4 py-4">
														<div className="flex flex-col">
															<span
																className={`font-semibold ${
																	tx.type ===
																		"DEPOSIT" ||
																	tx.type ===
																		"TRANSFER_IN"
																		? "text-green-600"
																		: tx.type ===
																			  "WITHDRAWAL" ||
																			  tx.type ===
																					"TRANSFER"
																			? "text-red-600"
																			: "text-gray-900"
																}`}
															>
																{tx.type ===
																	"DEPOSIT" ||
																tx.type ===
																	"TRANSFER_IN"
																	? "+"
																	: tx.type ===
																			  "WITHDRAWAL" ||
																		  tx.type ===
																				"TRANSFER"
																		? "-"
																		: ""}
																{formatCurrency(
																	tx.amount,
																	tx.currency
																)}{" "}
																{tx.currency}
															</span>
															{tx.netAmount !==
																tx.amount && (
																<span className="text-xs text-gray-500">
																	Net:{" "}
																	{formatCurrency(
																		tx.netAmount,
																		tx.currency
																	)}{" "}
																	{tx.currency}
																</span>
															)}
														</div>
													</td>
													<td className="px-4 py-4">
														<span className="text-sm text-gray-600">
															{formatCurrency(
																tx.feeAmount,
																tx.currency
															)}{" "}
															{tx.currency}
														</span>
													</td>
													<td className="px-4 py-4">
														{getStatusBadge(
															tx.status
														)}
													</td>
													<td className="px-4 py-4">
														<span className="text-sm text-gray-600">
															{getFormattedDateTime(
																tx.createdAt
															)}
														</span>
													</td>
													<td className="px-4 py-4">
														<span className="text-xs font-mono text-gray-500">
															{tx.reference.slice(
																0,
																12
															)}
															...
														</span>
													</td>
													<td className="px-4 py-4 text-center">
														<button
															onClick={() =>
																setSelectedTransaction(
																	selectedTransaction ===
																		tx.id
																		? null
																		: tx.id
																)
															}
															className="p-2 hover:bg-gray-100 rounded-lg transition"
															title="Voir les détails"
														>
															<Eye className="w-4 h-4 text-gray-600" />
														</button>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>

								{/* Pagination */}
								<div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
									<div className="text-sm text-gray-600">
										Page {filters.page} sur {totalPages} (
										{transactionsData?.total || 0}{" "}
										transactions)
									</div>
									<div className="flex items-center gap-2">
										<button
											onClick={() =>
												handlePageChange(
													filters.page - 1
												)
											}
											disabled={filters.page <= 1}
											className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
										>
											<ChevronLeft className="w-4 h-4" />
										</button>
										<span className="px-4 py-2 text-sm">
											{filters.page}
										</span>
										<button
											onClick={() =>
												handlePageChange(
													filters.page + 1
												)
											}
											disabled={
												filters.page >= totalPages
											}
											className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
										>
											<ChevronRight className="w-4 h-4" />
										</button>
									</div>
								</div>
							</>
						)}
					</div>
				</div>

				{/* Right Side - Wallet Balance Card */}
				<div className="lg:w-1/3 space-y-6">
					{/* Wallet Balance Card */}
					<div className="bg-gradient-to-br from-[#18bc7a] to-emerald-600 rounded-2xl shadow-lg p-6 text-white">
						<div className="flex items-center justify-between mb-6">
							<div className="flex items-center gap-3">
								<div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
									<Wallet className="w-6 h-6 text-white" />
								</div>
								<div>
									<p className="text-sm text-white/80">
										Wallet par défaut
									</p>
									<p className="text-xs text-white/60">
										{wallet?.accountType || "USER"}
									</p>
								</div>
							</div>
							{wallet?.isDefault && (
								<span className="px-2 py-1 bg-white/20 rounded-full text-xs">
									Par défaut
								</span>
							)}
						</div>

						{walletQuery.isLoading ? (
							<div className="flex items-center justify-center py-4">
								<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
							</div>
						) : walletQuery.isError ? (
							<div className="text-center py-4">
								<p className="text-white/80">
									Erreur de chargement
								</p>
							</div>
						) : wallet ? (
							<>
								<div className="mb-6">
									<p className="text-sm text-white/70 mb-1">
										Solde disponible
									</p>
									<div className="flex items-baseline gap-2">
										<span className="text-4xl font-bold">
											{formatCurrency(
												wallet.availableBalance,
												wallet.currency
											)}
										</span>
										<span className="text-xl text-white/80">
											{wallet.currency}
										</span>
									</div>
								</div>

								<div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
									<div>
										<p className="text-xs text-white/60 mb-1">
											Solde total
										</p>
										<p className="text-lg font-semibold">
											{formatCurrency(
												wallet.balance,
												wallet.currency
											)}{" "}
											<span className="text-xs text-white/70">
												{wallet.currency}
											</span>
										</p>
									</div>
									<div>
										<p className="text-xs text-white/60 mb-1">
											En attente
										</p>
										<p className="text-lg font-semibold">
											{formatCurrency(
												wallet.totalHolds,
												wallet.currency
											)}{" "}
											<span className="text-xs text-white/70">
												{wallet.currency}
											</span>
										</p>
									</div>
								</div>
							</>
						) : (
							<div className="text-center py-4">
								<p className="text-white/80">
									Aucun wallet par défaut
								</p>
							</div>
						)}
					</div>

					{/* Quick Stats Card */}
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
						<h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
							Activité récente
						</h3>
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
										<TrendingUp className="w-5 h-5 text-green-600" />
									</div>
									<div>
										<p className="text-sm font-medium text-gray-700">
											Entrées
										</p>
										<p className="text-xs text-gray-500">
											Dépôts + Reçus
										</p>
									</div>
								</div>
								<p className="text-lg font-bold text-green-600">
									+
									{formatCurrency(
										stats.totalDeposits +
											stats.totalTransfersReceived,
										wallet?.currency || "XAF"
									)}
								</p>
							</div>

							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
										<TrendingDown className="w-5 h-5 text-red-600" />
									</div>
									<div>
										<p className="text-sm font-medium text-gray-700">
											Sorties
										</p>
										<p className="text-xs text-gray-500">
											Retraits + Envoyés
										</p>
									</div>
								</div>
								<p className="text-lg font-bold text-red-600">
									-
									{formatCurrency(
										stats.totalWithdrawals +
											stats.totalTransfersSent,
										wallet?.currency || "XAF"
									)}
								</p>
							</div>
						</div>
					</div>

					{/* Transaction Details Modal */}
					{selectedTransaction && transactionDetailsQuery.data && (
						<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
							<div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
								<h3 className="text-lg font-semibold text-gray-900">
									Détails transaction
								</h3>
								<button
									onClick={() =>
										setSelectedTransaction(null)
									}
									className="text-gray-400 hover:text-gray-600"
								>
									<XCircle className="w-5 h-5" />
								</button>
							</div>

							{transactionDetailsQuery.isLoading ? (
								<div className="flex items-center justify-center py-8">
									<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#18bc7a]"></div>
								</div>
							) : (
								<div className="space-y-3">
									<div>
										<p className="text-xs text-gray-500">
											ID
										</p>
										<p className="text-sm font-mono">
											{
												transactionDetailsQuery.data
													.id
											}
										</p>
									</div>
									<div>
										<p className="text-xs text-gray-500">
											Référence
										</p>
										<p className="text-sm font-mono break-all">
											{
												transactionDetailsQuery.data
													.reference
											}
										</p>
									</div>
									<div className="grid grid-cols-2 gap-4">
										<div>
											<p className="text-xs text-gray-500">
												Type
											</p>
											<p className="text-sm font-medium">
												{
													transactionDetailsQuery
														.data.type
												}
											</p>
										</div>
										<div>
											<p className="text-xs text-gray-500">
												Catégorie
											</p>
											<p className="text-sm font-medium">
												{
													transactionDetailsQuery
														.data.category
												}
											</p>
										</div>
									</div>
									<div className="grid grid-cols-2 gap-4">
										<div>
											<p className="text-xs text-gray-500">
												Montant
											</p>
											<p className="text-sm font-semibold">
												{formatCurrency(
													transactionDetailsQuery
														.data.amount,
													transactionDetailsQuery
														.data.currency
												)}{" "}
												{
													transactionDetailsQuery
														.data.currency
												}
											</p>
										</div>
										<div>
											<p className="text-xs text-gray-500">
												Frais
											</p>
											<p className="text-sm font-medium text-gray-600">
												{formatCurrency(
													transactionDetailsQuery
														.data.feeAmount,
													transactionDetailsQuery
														.data.currency
												)}{" "}
												{
													transactionDetailsQuery
														.data.currency
												}
											</p>
										</div>
									</div>
									<div>
										<p className="text-xs text-gray-500">
											Statut
										</p>
										<div className="mt-1">
											{getStatusBadge(
												transactionDetailsQuery.data
													.status
											)}
										</div>
									</div>
									<div>
										<p className="text-xs text-gray-500">
											Date
										</p>
										<p className="text-sm">
											{getFormattedDateTime(
												transactionDetailsQuery.data
													.createdAt
											)}
										</p>
									</div>

									{/* Ledger Entries */}
									{transactionDetailsQuery.data
										.ledgerEntries &&
										transactionDetailsQuery.data
											.ledgerEntries.length > 0 && (
											<div className="mt-4 pt-4 border-t border-gray-200">
												<p className="text-xs text-gray-500 mb-2">
													Écritures comptables
												</p>
												<div className="space-y-2">
													{transactionDetailsQuery.data.ledgerEntries.map(
														(
															entry: any,
															idx: number
														) => (
															<div
																key={idx}
																className="flex items-center justify-between text-xs bg-gray-50 p-2 rounded"
															>
																<span
																	className={`font-medium ${
																		entry.entryType ===
																		"CREDIT"
																			? "text-green-600"
																			: "text-red-600"
																	}`}
																>
																	{
																		entry.entryType
																	}
																</span>
																<span>
																	{formatCurrency(
																		entry.amount,
																		entry.currency
																	)}{" "}
																	{
																		entry.currency
																	}
																</span>
															</div>
														)
													)}
												</div>
											</div>
										)}
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Transactions;
