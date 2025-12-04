"use client";

import React from "react";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { HiFilter } from "react-icons/hi";

import { ChevronDown, Check } from "lucide-react";
import CButton from "../../CButton";

// Schéma de validation pour le filtre
const paymentProviderFilterSchema = z.object({
	isActive: z.enum(["true", "false", "all"], {
		required_error: "Sélectionnez un statut",
	}),
});

type PaymentProviderFilterFormData = z.infer<
	typeof paymentProviderFilterSchema
>;

interface PaymentProviderFilterFormProps {
	filterContent?: any;
	setFilterContent?: (data?: any) => void;
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

const PaymentProviderFilterForm: React.FC<PaymentProviderFilterFormProps> = ({
	filterContent,
	setFilterContent,
}) => {
	const form = useForm<PaymentProviderFilterFormData>({
		resolver: zodResolver(paymentProviderFilterSchema),
		defaultValues: {
			isActive: "true", // Valeur par défaut : Actif
		},
	});

	const onSubmit = (data: PaymentProviderFilterFormData) => {
		console.log("Filtres soumis:", data);

		// Convertir la valeur string en boolean/null pour l'API
		const filterData = {
			active:
				data.isActive === "all"
					? null
					: data.isActive === "true"
					? true
					: false,
		};

		if (setFilterContent) {
			console.log("data soumises");
			setFilterContent(filterData);
		}
	};

	const onError = (errors: any) => {
		console.error("Erreurs de validation:", errors);
	};

	// Options pour le statut isActive
	const statusOptions = [
		{ value: "true", label: "Actif" },
		{ value: "false", label: "Inactif" },
		{ value: "all", label: "Tous" },
	];

	return (
		<div className="w-full">
			<div className="flex gap-2 items-center font-bold text-md mb-4">
				<HiFilter /> Filtres
			</div>

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit, onError)}
					className="w-full flex flex-col gap-6"
				>
					<div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
						{/* Filtre par statut */}
						<FormField
							control={form.control}
							name="isActive"
							render={({ field }) => (
								<FormItem className="w-full md:w-[250px]">
									<FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">
										Statut du Provider
									</FormLabel>
									<FormControl>
										<CustomSelect
											options={statusOptions}
											value={field.value}
											onChange={field.onChange}
											placeholder="Sélectionnez un statut"
											error={
												!!form.formState.errors.isActive
											}
										/>
									</FormControl>
									<FormMessage className="text-red-400 text-xs" />
								</FormItem>
							)}
						/>

						{/* Bouton de validation */}
						<div className="flex items-end h-full pt-2">
							<CButton
								text="Valider"
								btnStyle={"green"}
								height="40px"
								type="submit"
							/>
						</div>

						{/* Bouton pour réinitialiser les filtres */}
						<div className="flex items-end h-full pt-2">
							<button
								type="button"
								onClick={() => {
									form.reset({ isActive: "true" });
									if (setFilterContent) {
										setFilterContent({ isActive: true });
									}
								}}
								className="px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-lg text-sm hover:bg-gray-50 transition font-medium"
							>
								Réinitialiser
							</button>
						</div>
					</div>
				</form>
			</Form>
		</div>
	);
};

export default PaymentProviderFilterForm;
