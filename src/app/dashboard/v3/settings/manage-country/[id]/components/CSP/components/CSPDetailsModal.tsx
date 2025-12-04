"use client";

import Modal from "@/components/shared/Modal/Modal";
import React from "react";
import {
	X,
	Calendar,
	DollarSign,
	Hash,
	CheckCircle,
	XCircle,
} from "lucide-react";

interface CSPDetailsProps {
	data: {
		id: string;
		feesRate: string;
		fees: string;
		operator: string;
		configuration: {
			minAmount: string;
			maxAmount: string;
			currency: string;
		};
		serviceProvided: {
			id: string;
			provider: {
				id: string;
				name: string;
				description: string;
				logo: string | null;
				paymentProviderId: string;
				createdAt: string;
				updatedAt: string;
			};
			service: {
				id: string;
				name: string;
				sens: string;
				description: string;
				createdAt: string;
				updatedAt: string;
			};
		};
		regex: string | null;
		initialNumberFormat: string[];
		createdAt: string;
		updatedAt: string;
		isActive: boolean;
	};
	isOpen: boolean;
	onClose: () => void;
}

const CSPDetails: React.FC<CSPDetailsProps> = ({ data, isOpen, onClose }) => {
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("fr-FR", {
			day: "2-digit",
			month: "long",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const InfoCard = ({
		children,
		className = "",
	}: {
		children: React.ReactNode;
		className?: string;
	}) => (
		<div
			className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 ${className}`}
		>
			{children}
		</div>
	);

	const InfoRow = ({
		label,
		value,
		icon,
	}: {
		label: string;
		value: string | React.ReactNode;
		icon?: React.ReactNode;
	}) => (
		<div className="flex items-start gap-3">
			{icon && <div className="text-gray-400 mt-1">{icon}</div>}
			<div className="flex-1">
				<p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
					{label}
				</p>
				<p className="text-base text-gray-900 font-medium">{value}</p>
			</div>
		</div>
	);

	const modalContent = (
		<div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl w-full max-w-5xl mx-4 max-h-[95vh] overflow-hidden flex flex-col shadow-2xl">
			{/* Header simplifié */}
			<div className="flex items-center justify-between px-8 py-6 border-b border-gray-200 bg-white">
				<div className="flex items-center gap-4">
					<div className="flex items-center gap-3">
						{data.isActive ? (
							<CheckCircle className="w-6 h-6 text-green-500" />
						) : (
							<XCircle className="w-6 h-6 text-red-500" />
						)}
						<div>
							<h2 className="text-2xl font-bold text-gray-900">
								{data.serviceProvided.service.name}
							</h2>
							<p className="text-sm text-gray-500 mt-0.5">
								{data.operator.toUpperCase()} •{" "}
								{data.serviceProvided.service.sens === "IN"
									? "Dépôt"
									: "Retrait"}
							</p>
						</div>
					</div>
				</div>
				<button
					onClick={onClose}
					className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
				>
					<X className="w-5 h-5 text-gray-500" />
				</button>
			</div>

			{/* Content avec scroll */}
			<div className="flex-1 overflow-y-auto px-8 py-6">
				<div className="space-y-6">
					{/* Frais et Configuration - En haut */}
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
						<InfoCard>
							<div className="flex items-center gap-3 mb-4">
								<div className="p-2 bg-blue-50 rounded-lg">
									<DollarSign className="w-5 h-5 text-blue-600" />
								</div>
								<h3 className="font-semibold text-gray-900">
									Taux de frais
								</h3>
							</div>
							<p className="text-3xl font-bold text-blue-600">
								{data.feesRate}%
							</p>
						</InfoCard>

						<InfoCard>
							<div className="flex items-center gap-3 mb-4">
								<div className="p-2 bg-green-50 rounded-lg">
									<DollarSign className="w-5 h-5 text-green-600" />
								</div>
								<h3 className="font-semibold text-gray-900">
									Frais fixes
								</h3>
							</div>
							<p className="text-3xl font-bold text-green-600">
								{data.fees}{" "}
								<span className="text-lg text-gray-500">
									{data.configuration.currency}
								</span>
							</p>
						</InfoCard>

						<InfoCard>
							<div className="flex items-center gap-3 mb-4">
								<div className="p-2 bg-purple-50 rounded-lg">
									<Hash className="w-5 h-5 text-purple-600" />
								</div>
								<h3 className="font-semibold text-gray-900">
									Préfixes
								</h3>
							</div>
							<p className="text-3xl font-bold text-purple-600">
								{data.initialNumberFormat.length}
							</p>
						</InfoCard>
					</div>

					{/* Limites de montant */}
					<InfoCard>
						<h3 className="font-semibold text-gray-900 mb-6 text-lg">
							Limites de transaction
						</h3>
						<div className="grid grid-cols-2 gap-6">
							<div>
								<p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
									Montant minimum
								</p>
								<p className="text-2xl font-bold text-gray-900">
									{Number(
										data.configuration.minAmount
									).toLocaleString()}
									<span className="text-base text-gray-500 ml-2">
										{data.configuration.currency}
									</span>
								</p>
							</div>
							<div>
								<p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
									Montant maximum
								</p>
								<p className="text-2xl font-bold text-gray-900">
									{Number(
										data.configuration.maxAmount
									).toLocaleString()}
									<span className="text-base text-gray-500 ml-2">
										{data.configuration.currency}
									</span>
								</p>
							</div>
						</div>
					</InfoCard>

					{/* Fournisseur */}
					<InfoCard>
						<h3 className="font-semibold text-gray-900 mb-6 text-lg">
							Fournisseur de paiement
						</h3>
						<div className="space-y-4">
							<div>
								<p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
									Nom
								</p>
								<p className="text-xl font-bold text-gray-900">
									{data.serviceProvided.provider.name}
								</p>
							</div>
							{data.serviceProvided.provider.description && (
								<div>
									<p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
										Description
									</p>
									<p className="text-sm text-gray-600">
										{
											data.serviceProvided.provider
												.description
										}
									</p>
								</div>
							)}
						</div>
					</InfoCard>

					{/* Formats de numéro */}
					<InfoCard>
						<h3 className="font-semibold text-gray-900 mb-6 text-lg">
							Préfixes supportés (
							{data.initialNumberFormat.length})
						</h3>
						<div className="flex flex-wrap gap-2">
							{data.initialNumberFormat.map(
								(prefix: string, index: number) => (
									<span
										key={index}
										className="px-4 py-2 bg-gray-50 text-gray-900 rounded-lg text-sm font-mono font-medium border border-gray-200 hover:bg-gray-100 transition-colors"
									>
										{prefix}
									</span>
								)
							)}
						</div>
					</InfoCard>

					{/* Regex si existe */}
					{data.regex && (
						<InfoCard>
							<h3 className="font-semibold text-gray-900 mb-6 text-lg">
								Expression régulière
							</h3>
							<div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto border border-gray-700">
								{data.regex}
							</div>
						</InfoCard>
					)}

					{/* Métadonnées */}
					<InfoCard>
						<h3 className="font-semibold text-gray-900 mb-6 text-lg">
							Informations système
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<InfoRow
								label="Identifiant"
								value={
									<span className="font-mono text-xs break-all">
										{data.id}
									</span>
								}
							/>
							<InfoRow
								label="Statut"
								value={
									<span
										className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
											data.isActive
												? "bg-green-50 text-green-700"
												: "bg-red-50 text-red-700"
										}`}
									>
										{data.isActive ? (
											<CheckCircle className="w-3.5 h-3.5" />
										) : (
											<XCircle className="w-3.5 h-3.5" />
										)}
										{data.isActive ? "Actif" : "Inactif"}
									</span>
								}
							/>
							<InfoRow
								label="Date de création"
								value={formatDate(data.createdAt)}
								icon={<Calendar className="w-4 h-4" />}
							/>
							<InfoRow
								label="Dernière modification"
								value={formatDate(data.updatedAt)}
								icon={<Calendar className="w-4 h-4" />}
							/>
						</div>
					</InfoCard>
				</div>
			</div>

			{/* Footer simplifié */}
			<div className="flex justify-end px-8 py-4 border-t border-gray-200 bg-white">
				<button
					onClick={onClose}
					className="px-6 py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors shadow-sm"
				>
					Fermer
				</button>
			</div>
		</div>
	);

	return (
		<Modal
			name="csp-details"
			isOpen={isOpen}
			setIsOpen={onClose}
			modalContent={modalContent}
		/>
	);
};

export default CSPDetails;
