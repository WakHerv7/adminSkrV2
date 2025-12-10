export const FlagIcon = ({ countryCode }: { countryCode: string }) => {
	const code = countryCode?.toLowerCase();
	return (
		<img
			src={`https://flagcdn.com/24x18/${code}.png`}
			alt={countryCode}
			className="w-6 h-4 rounded-sm object-cover"
		/>
	);
};
