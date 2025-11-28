"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import CButton from "@/components/shared/CButton";

import { HashLoader } from "react-spinners";
import classNames from "classnames";
import Modal from "@/components/shared/Modal/Modal";

// Schéma de validation Zod
const countrySchema = z.object({
	name: z
		.string()
		.min(2, "Le nom doit contenir au moins 2 caractères")
		.max(50, "Le nom ne peut pas dépasser 50 caractères"),
	phone_length: z
		.number()
		.min(1, "La longueur doit être au moins 1")
		.max(15, "La longueur ne peut pas dépasser 15")
		.or(z.literal("").transform(() => undefined)),
});

type CountryFormData = z.infer<typeof countrySchema>;

interface CreateCountryModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (countryData: CountryFormData) => void;
	isLoading: boolean;
}

const CreateCountryModal: React.FC<CreateCountryModalProps> = ({
	isOpen,
	onClose,
	onSubmit,
	isLoading,
}) => {
	const form = useForm<CountryFormData>({
		resolver: zodResolver(countrySchema),
		defaultValues: {
			name: "",
			phone_length: undefined,
		},
	});

	const handleFormSubmit = (data: CountryFormData) => {
		const submitData = {
			...data,
			phone_length: data.phone_length,
		};
		onSubmit(submitData);
		form.reset();
	};

	const handleClose = () => {
		form.reset();
		onClose();
	};

	const onError = (errors: any) => {
		console.error("Erreurs de validation:", errors);
	};

	const modalContent = (
		<div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
			<h3 className="text-lg font-semibold leading-6 text-gray-900 mb-6">
				Créer un nouveau pays
			</h3>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleFormSubmit, onError)}>
					<div className="space-y-6">
						{/* Champ Nom */}
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-gray-900 text-sm tracking-tight">
										Nom du pays *
									</FormLabel>
									<FormControl>
										<Input
											// className="px-4 w-full bg-gray-50 border-gray-300"
											placeholder="Ex: Cameroon"
											{...field}
										/>
									</FormControl>
									<FormMessage className="text-red-400 text-xs" />
								</FormItem>
							)}
						/>

						{/* Champ Longueur téléphone */}
						<FormField
							control={form.control}
							name="phone_length"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-gray-900 text-sm tracking-tight">
										Longueur du numéro de téléphone
									</FormLabel>
									<FormControl>
										<Input
											type="number"
											// className="px-4 w-full bg-gray-50 border-gray-300"
											placeholder="Ex: 9"
											min="1"
											max="15"
											{...field}
											onChange={(e) => {
												const value = e.target.value;
												field.onChange(
													value === ""
														? undefined
														: Number(value)
												);
											}}
											value={field.value || ""}
										/>
									</FormControl>
									<FormMessage className="text-red-400 text-xs" />
								</FormItem>
							)}
						/>
					</div>

					<div className="flex gap-3 justify-end mt-8">
						<button
							type="button"
							onClick={handleClose}
							className="px-6 py-2 border border-gray-500 text-gray-700 bg-transparent rounded-full text-sm hover:bg-gray-50 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
							disabled={isLoading}
						>
							Annuler
						</button>
						<button
							type="submit"
							className="px-6 py-2 bg-[#18BC7A] text-white rounded-full text-sm hover:bg-[#16a56c] transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
							disabled={isLoading}
						>
							{isLoading ? "Création..." : "Créer le pays"}
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
						<HashLoader
							className="shrink-0"
							size={40}
							color="#18BC7A"
						/>
					</div>
				</form>
			</Form>
		</div>
	);

	return (
		<Modal
			isOpen={isOpen}
			setIsOpen={handleClose}
			modalContent={modalContent}
			name="create-country"
		/>
	);
};

export default CreateCountryModal;
