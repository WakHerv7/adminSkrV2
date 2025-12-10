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
import { HashLoader } from "react-spinners";
import classNames from "classnames";
import Modal from "@/components/shared/Modal/Modal";

// Schéma de validation Zod pour Payment Provider
const paymentProviderSchema = z.object({
	name: z
		.string()
		.min(2, "Le nom doit contenir au moins 2 caractères")
		.max(100, "Le nom ne peut pas dépasser 100 caractères"),
	code: z
		.string()
		.min(2, "Le code doit contenir au moins 2 caractères")
		.max(50, "Le code ne peut pas dépasser 50 caractères"),

	isActive: z.boolean().default(true),
});

type PaymentProviderFormData = z.infer<typeof paymentProviderSchema>;

interface CreatePaymentProviderModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: PaymentProviderFormData) => void;
	isLoading: boolean;
	initialData?: any;
	isEdit?: boolean;
}

const CreatePaymentProviderModal: React.FC<CreatePaymentProviderModalProps> = ({
	isOpen,
	onClose,
	onSubmit,
	isLoading,
	initialData,
	isEdit = false,
}) => {
	const form = useForm<PaymentProviderFormData>({
		resolver: zodResolver(paymentProviderSchema),
		defaultValues: {
			name: "",
			code: "",

			isActive: true,
		},
	});

	// Mettre à jour le formulaire quand initialData change
	React.useEffect(() => {
		if (isEdit && initialData) {
			form.reset({
				name: initialData.name || "",
				code: initialData.code || "",
				isActive: initialData.isActive ?? true,
			});
		} else {
			form.reset({
				name: "",
				code: "",

				isActive: true,
			});
		}
	}, [isEdit, initialData, form]);

	const handleFormSubmit = (data: PaymentProviderFormData) => {
		console.log("Données soumises:", data);

		// Nettoyer les données avant soumission
		const submitData = {
			name: data.name.trim(),
			code: data.code.trim(),

			isActive: data.isActive,
		};

		onSubmit(submitData);
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
				{isEdit
					? "Modifier le Payment Provider"
					: "Créer un nouveau Payment Provider"}
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
										Nom du provider *
									</FormLabel>
									<FormControl>
										<Input
											placeholder="Ex: Orange Money"
											{...field}
											disabled={isLoading}
										/>
									</FormControl>
									<FormMessage className="text-red-400 text-xs" />
								</FormItem>
							)}
						/>

						{/* Champ Code */}
						<FormField
							control={form.control}
							name="code"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-gray-900 text-sm tracking-tight">
										Code du provider *
									</FormLabel>
									<FormControl>
										<Input
											placeholder="Ex: ORANGE_MONEY"
											{...field}
											disabled={isLoading}
										/>
									</FormControl>
									<FormMessage className="text-red-400 text-xs" />
								</FormItem>
							)}
						/>

						{/* Champ isActive */}
						<FormField
							control={form.control}
							name="isActive"
							render={({ field }) => (
								<FormItem className="flex items-center space-x-3">
									<FormControl>
										<input
											type="checkbox"
											className="w-4 h-4 text-[#18bc7a] border-gray-300 rounded focus:ring-[#18bc7a] accent-[#18bc7a]"
											checked={field.value}
											onChange={field.onChange}
											disabled={isLoading}
										/>
									</FormControl>
									<FormLabel className="text-gray-900 text-sm tracking-tight !mt-0">
										Provider actif
									</FormLabel>
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
							className="px-6 py-2 bg-[#18bc7a] text-white rounded-full text-sm hover:bg-[#16a56c] transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
							disabled={isLoading}
						>
							{isLoading
								? isEdit
									? "Mise à jour..."
									: "Création..."
								: isEdit
								? "Mettre à jour"
								: "Créer le provider"}
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
							color="#18bc7a"
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
			name="create-payment-provider"
		/>
	);
};

export default CreatePaymentProviderModal;
