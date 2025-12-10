"use client";

import React from "react";
import { Snowflake, Play, Trash2, AlertTriangle, X } from "lucide-react";

interface CardActionModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	actionType: "freeze" | "unfreeze" | "terminate";
	cardData: {
		id: string;
		maskedNumber: string;
		nameOnCard: string;
	};
	isLoading: boolean;
}

const CardActionModal: React.FC<CardActionModalProps> = ({
	isOpen,
	onClose,
	onConfirm,
	actionType,
	cardData,
	isLoading,
}) => {
	if (!isOpen) return null;

	const getActionConfig = () => {
		switch (actionType) {
			case "freeze":
				return {
					title: "Geler la carte",
					description:
						"Vous êtes sur le point de geler cette carte. Une fois gelée, la carte ne pourra plus être utilisée pour effectuer des transactions.",
					icon: <Snowflake className="w-12 h-12 text-blue-500" />,
					confirmText: "Geler la carte",
					confirmColor: "bg-blue-600 hover:bg-blue-700",
				};
			case "unfreeze":
				return {
					title: "Dégeler la carte",
					description:
						"Vous êtes sur le point de dégeler cette carte. Une fois dégelée, la carte pourra à nouveau être utilisée normalement.",
					icon: <Play className="w-12 h-12 text-green-500" />,
					confirmText: "Dégeler la carte",
					confirmColor: "bg-green-600 hover:bg-green-700",
				};
			case "terminate":
				return {
					title: "Terminer la carte",
					description:
						"Vous êtes sur le point de terminer définitivement cette carte. Cette action est irréversible et la carte ne pourra plus jamais être utilisée.",
					icon: <Trash2 className="w-12 h-12 text-red-500" />,
					confirmText: "Terminer la carte",
					confirmColor: "bg-red-600 hover:bg-red-700",
				};
		}
	};

	const config = getActionConfig();

	return (
		<div className="fixed inset-0 z-50 overflow-y-auto">
			<div className="flex min-h-full items-center justify-center p-4 text-center">
				{/* Backdrop */}
				<div
					className="fixed inset-0 bg-black/50 transition-opacity"
					aria-hidden="true"
					onClick={onClose}
				/>

				{/* Modal */}
				<div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all w-full max-w-md">
					{/* Header */}
					<div className="bg-white px-6 pt-6">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div className="p-2 bg-gray-100 rounded-lg">
									{config.icon}
								</div>
								<h3 className="text-xl font-bold text-gray-900">
									{config.title}
								</h3>
							</div>
							<button
								onClick={onClose}
								className="rounded-md p-1 text-gray-400 hover:text-gray-500 focus:outline-none"
							>
								<X className="w-6 h-6" />
							</button>
						</div>
					</div>

					{/* Content */}
					<div className="px-6 py-4">
						<div className="mb-6">
							<p className="text-gray-600 mb-4">
								{config.description}
							</p>

							<div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
								<div className="space-y-2">
									<div className="flex justify-between">
										<span className="text-sm text-gray-500">
											Carte:
										</span>
										<span className="text-sm font-medium text-gray-900">
											{cardData.maskedNumber}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-sm text-gray-500">
											Titulaire:
										</span>
										<span className="text-sm font-medium text-gray-900">
											{cardData.nameOnCard}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-sm text-gray-500">
											ID:
										</span>
										<span className="text-sm font-mono text-gray-900">
											{cardData.id.substring(0, 12)}...
										</span>
									</div>
								</div>
							</div>

							{actionType === "terminate" && (
								<div className="mt-4 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
									<AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
									<p className="text-sm text-red-700">
										<strong>Attention:</strong> Cette action
										est définitive et ne peut pas être
										annulée. Tous les fonds restants seront
										retournés au compte principal.
									</p>
								</div>
							)}
						</div>
					</div>

					{/* Footer */}
					<div className="bg-gray-50 px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3">
						<button
							type="button"
							onClick={onClose}
							disabled={isLoading}
							className="mt-3 sm:mt-0 inline-flex justify-center w-full sm:w-auto px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Annuler
						</button>
						<button
							type="button"
							onClick={onConfirm}
							disabled={isLoading}
							className={`inline-flex justify-center w-full sm:w-auto px-4 py-2.5 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 ${config.confirmColor} disabled:opacity-50 disabled:cursor-not-allowed`}
						>
							{isLoading ? (
								<>
									<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
									Traitement...
								</>
							) : (
								config.confirmText
							)}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CardActionModal;
