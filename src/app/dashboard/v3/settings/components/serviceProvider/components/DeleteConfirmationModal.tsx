// app/service_provider/components/DeleteConfirmationModal.tsx
"use client";

import Modal from "@/components/shared/Modal/Modal";
import { AlertTriangle } from "lucide-react";
import React from "react";

interface DeleteConfirmationModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	isLoading: boolean;
	itemName: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
	isOpen,
	onClose,
	onConfirm,
	isLoading,
	itemName,
}) => {
	const modalContent = (
		<div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
			<div className="flex flex-col items-center text-center">
				<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
					<AlertTriangle className="h-6 w-6 text-red-600" />
				</div>

				<h3 className="text-lg font-semibold leading-6 text-gray-900 mb-2">
					Supprimer le Service Provider
				</h3>

				<p className="text-sm text-gray-500 mb-6">
					Êtes-vous sûr de vouloir supprimer "{itemName}" ? Cette
				</p>

				<div className="flex gap-3 w-full">
					<button
						type="button"
						onClick={onClose}
						className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 bg-transparent rounded-lg text-sm hover:bg-gray-50 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
						disabled={isLoading}
					>
						Annuler
					</button>

					<button
						type="button"
						onClick={onConfirm}
						className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
						disabled={isLoading}
					>
						{isLoading ? "Suppression..." : "Supprimer"}
					</button>
				</div>
			</div>
		</div>
	);

	return (
		<Modal
			isOpen={isOpen}
			setIsOpen={onClose}
			modalContent={modalContent}
			name="delete-service-provider-confirmation"
		/>
	);
};

export default DeleteConfirmationModal;
