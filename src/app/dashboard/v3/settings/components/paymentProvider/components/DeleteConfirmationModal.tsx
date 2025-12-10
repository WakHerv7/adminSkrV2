"use client";
import React from "react";
import Modal from "@/components/shared/Modal/Modal";
import { HashLoader } from "react-spinners";
import classNames from "classnames";

interface DeleteConfirmationModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	isLoading: boolean;
	itemName: string;
	title?: string;
	message?: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
	isOpen,
	onClose,
	onConfirm,
	isLoading,
	itemName,
	title = "Confirmer la suppression",
	message = "Êtes-vous sûr de vouloir supprimer",
}) => {
	const modalContent = (
		<div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 relative">
			<h3 className="text-lg font-semibold leading-6 text-gray-900 mb-4">
				{title}
			</h3>

			<p className="text-gray-600 mb-6">
				{message}{" "}
				<span className="font-semibold text-gray-900">
					{`"${itemName}"`}
				</span>{" "}
				?
			</p>

			<div className="flex gap-3 justify-end">
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

			{/* Loader */}
			<div
				className={classNames(
					"transition-all invisible z-20 bg-blue-900/30 opacity-0 absolute top-0 left-0 h-full w-full flex items-center justify-center rounded-lg",
					{
						"!opacity-100 !visible z-20": isLoading,
					}
				)}
			>
				<HashLoader className="shrink-0" size={40} color="#ef4444" />
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
