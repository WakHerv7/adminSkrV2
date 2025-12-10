// components/DeleteConfirmationModal.tsx
"use client";
import React from "react";
import CButton from "@/components/shared/CButton";

import { HashLoader } from "react-spinners";
import classNames from "classnames";
import Modal from "@/components/shared/Modal/Modal";

interface DeleteConfirmationModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	isLoading: boolean;
	countryName?: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
	isOpen,
	onClose,
	onConfirm,
	isLoading,
	countryName,
}) => {
	const modalContent = (
		<div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
			<div className="text-center">
				{/* Icône d'alerte */}
				<div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
					<svg
						className="h-6 w-6 text-red-600"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
						/>
					</svg>
				</div>

				<h3 className="text-lg font-semibold leading-6 text-gray-900 mb-2">
					Confirmer la suppression
				</h3>

				<p className="text-sm text-gray-500 mb-6">
					Êtes-vous sûr de vouloir supprimer le pays{" "}
					<strong>{`"${countryName}"`}</strong> ? Cette action est
					irréversible.
				</p>

				<div className="flex gap-3 justify-center">
					<button
						type="button"
						onClick={onClose}
						className="px-6 py-2 border border-gray-500 text-gray-700 bg-transparent rounded-full text-sm hover:bg-gray-50 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
						disabled={isLoading}
					>
						Annuler
					</button>
					<button
						type="button"
						onClick={onConfirm}
						className="px-6 py-2 bg-red-600 text-white rounded-full text-sm hover:bg-red-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
						disabled={isLoading}
					>
						{isLoading ? "Suppression..." : "Supprimer"}
					</button>
				</div>
				<div
					className={classNames(
						"transition-all invisible z-20 bg-blue-900/30 opacity-0 absolute top-0 left-0 h-full w-full flex items-center justify-center rounded-lg",
						{
							"!opacity-100 !visible z-20": isLoading,
						}
					)}
				>
					<HashLoader
						className="shrink-0"
						size={40}
						color="#dc2626"
					/>
				</div>
			</div>
		</div>
	);

	return (
		<Modal
			isOpen={isOpen}
			setIsOpen={onClose}
			modalContent={modalContent}
			name="delete-confirmation"
		/>
	);
};

export default DeleteConfirmationModal;
