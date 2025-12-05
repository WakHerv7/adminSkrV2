// app/service_provider/components/EditSPModal.tsx
"use client";

import React, { useEffect } from "react";
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
import Modal from "@/components/shared/Modal/Modal";
import { ChevronDown, Check } from "lucide-react";
import classNames from "classnames";
import { HashLoader } from "react-spinners";

// Schéma de validation Zod pour Service Provider
const serviceProviderSchema = z.object({
	name: z
		.string()
		.min(2, "Le nom doit contenir au moins 2 caractères")
		.max(50, "Le nom ne peut pas dépasser 50 caractères"),
	description: z
		.string()
		.max(255, "La description ne peut pas dépasser 255 caractères")
		.optional(),
	paymentProviderId: z
		.string()
		.uuid("Veuillez sélectionner un payment provider valide")
		.nonempty("Le payment provider est requis"),
});

type ServiceProviderFormData = z.infer<typeof serviceProviderSchema>;

interface EditSPModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: ServiceProviderFormData) => void;
	isLoading: boolean;
	initialData: any;
	paymentProviders: Array<{ id: string; name: string }>;
}

// Composant CustomSelect pour le dropdown
interface CustomSelectProps {
	options: { value: string; label: string }[];
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	disabled?: boolean;
	error?: boolean;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
	options,
	value,
	onChange,
	placeholder = "Sélectionnez une option",
	disabled = false,
	error = false,
}) => {
	const [isOpen, setIsOpen] = React.useState(false);
	const containerRef = React.useRef<HTMLDivElement>(null);

	React.useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				containerRef.current &&
				!containerRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const selectedOption = options.find((opt) => opt.value === value);

	const handleSelect = (optionValue: string) => {
		onChange(optionValue);
		setIsOpen(false);
	};

	return (
		<div className="relative w-full" ref={containerRef}>
			<button
				type="button"
				onClick={() => !disabled && setIsOpen(!isOpen)}
				disabled={disabled}
				className={`flex h-11 w-full items-center justify-between rounded-lg bg-white px-4 py-2 text-sm shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:shadow-md hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 ${
					error ? "ring-2 ring-red-500/30 shadow-red-100" : ""
				}`}
			>
				<span
					className={
						selectedOption ? "text-gray-900" : "text-gray-500"
					}
				>
					{selectedOption ? selectedOption.label : placeholder}
				</span>
				<ChevronDown
					className={`h-4 w-4 text-gray-600 transition-transform duration-200 ${
						isOpen ? "rotate-180" : ""
					}`}
				/>
			</button>

			{isOpen && !disabled && (
				<div className="absolute z-[1000] w-full mt-2 rounded-xl bg-white shadow-lg border-0 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
					<div className="max-h-[300px] overflow-y-auto p-1">
						{options.length === 0 ? (
							<div className="px-4 py-3 text-sm text-gray-500 text-center">
								Aucune option disponible
							</div>
						) : (
							options.map((option) => (
								<button
									key={option.value}
									type="button"
									onClick={() => handleSelect(option.value)}
									className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-left rounded-lg transition-all duration-150 ${
										value === option.value
											? "bg-blue-50 text-blue-700 font-medium"
											: "text-gray-700 hover:bg-gray-50"
									}`}
								>
									<span>{option.label}</span>
									{value === option.value && (
										<Check className="h-4 w-4 text-blue-700" />
									)}
								</button>
							))
						)}
					</div>
				</div>
			)}
		</div>
	);
};

const EditSPModal: React.FC<EditSPModalProps> = ({
	isOpen,
	onClose,
	onSubmit,
	isLoading,
	initialData,
	paymentProviders,
}) => {
	const form = useForm<ServiceProviderFormData>({
		resolver: zodResolver(serviceProviderSchema),
		defaultValues: {
			name: "",
			description: "",
			paymentProviderId: "",
		},
	});

	// Formater les options pour le dropdown
	const paymentProviderOptions =
		paymentProviders?.map((pp) => ({
			value: pp.id,
			label: pp.name,
		})) || [];

	// Mettre à jour le formulaire quand initialData change
	useEffect(() => {
		if (initialData) {
			console.log("Préremplissage avec les données:", initialData);
			console.log(
				"Payment Provider ID:",
				initialData.paymentProviderId || initialData.paymentProvider?.id
			);

			const formattedData = {
				name: initialData.name || "",
				description: initialData.description || "",
				paymentProviderId:
					initialData.paymentProviderId ||
					initialData.paymentProvider?.id ||
					"",
			};

			console.log("Données formatées:", formattedData);
			console.log("Options disponibles:", paymentProviderOptions);

			form.reset(formattedData);
		}
	}, [initialData, form, paymentProviderOptions]);

	const handleFormSubmit = (data: ServiceProviderFormData) => {
		console.log("Données soumises:", data);

		// Nettoyer les données avant soumission
		const submitData = {
			name: data.name.trim(),
			description: data.description?.trim() || undefined,
			paymentProviderId: data.paymentProviderId,
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
				Modifier le Service Provider
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
										Nom du SP *
									</FormLabel>
									<FormControl>
										<Input
											placeholder="Ex: MTN"
											{...field}
											disabled={isLoading}
											className="rounded-lg border-gray-300 focus:border-[#18BC7A] focus:ring-[#18BC7A] transition-colors"
										/>
									</FormControl>
									<FormMessage className="text-red-400 text-xs" />
								</FormItem>
							)}
						/>

						{/* Champ Description */}
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-gray-900 text-sm tracking-tight">
										Description
									</FormLabel>
									<FormControl>
										<textarea
											placeholder="Ex: Service Cartevo MTN"
											{...field}
											disabled={isLoading}
											className="w-full min-h-[100px] p-3 rounded-lg border border-gray-300 focus:border-[#18BC7A] focus:ring-[#18BC7A] transition-colors resize-none"
											value={field.value || ""}
										/>
									</FormControl>
									<FormMessage className="text-red-400 text-xs" />
									<p className="text-xs text-gray-500 mt-1">
										Max. 255 caractères
									</p>
								</FormItem>
							)}
						/>

						{/* Champ Payment Provider */}
						<FormField
							control={form.control}
							name="paymentProviderId"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-gray-900 text-sm tracking-tight">
										Payment Provider *
									</FormLabel>
									<FormControl>
										<CustomSelect
											options={paymentProviderOptions}
											value={field.value}
											onChange={field.onChange}
											placeholder="Sélectionnez un payment provider"
											disabled={isLoading}
											error={
												!!form.formState.errors
													.paymentProviderId
											}
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
							{isLoading ? "Mise à jour..." : "Mettre à jour"}
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
			name="edit-service-provider"
		/>
	);
};

export default EditSPModal;
