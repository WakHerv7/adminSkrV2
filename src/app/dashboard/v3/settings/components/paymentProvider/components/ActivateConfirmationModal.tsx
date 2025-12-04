"use client";

import Modal from "@/components/shared/Modal/Modal";
import { CheckCircle } from "lucide-react";
import React from "react";

interface ActivateConfirmationModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	isLoading: boolean;
	providerName: string;
}

const ActivateConfirmationModal: React.FC<ActivateConfirmationModalProps> = ({
	isOpen,
	onClose,
	onConfirm,
	isLoading,
	providerName,
}) => {
	const modalContent = (
		<div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
			<div className="flex flex-col items-center text-center">
				<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
					<CheckCircle className="h-6 w-6 text-green-600" />
				</div>

				<h3 className="text-lg font-semibold leading-6 text-gray-900 mb-2">
					Activer le Payment Provider
				</h3>

				<p className="text-sm text-gray-500 mb-6">
					Êtes-vous sûr de vouloir activer le provider "{providerName}
					" ?
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
						className="flex-1 px-4 py-2 bg-[#18BC7A] text-white rounded-lg text-sm hover:bg-[#16a56c] transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
						disabled={isLoading}
					>
						{isLoading ? "Activation..." : "Activer"}
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
			name="activate-payment-provider-confirmation"
		/>
	);
};

export default ActivateConfirmationModal;
