import { useState, useEffect } from "react";
import { Box, Checkbox, FormControlLabel, FormGroup, Typography } from "@mui/material";

interface Props {
	data: Record<string, any>;
	onChange: (data: object) => void;
}

const EXPERIENCE_OPTIONS = [
	"LGBT+", "Minority stress", "Neurodivergence", "Polyamourous relationships", "None of these"
]

const THERAPIST_GENDER = [
	"Woman", "Man", "Non-binary", "No preference"
]


export default function TherapistPreferences({ data, onChange }: Props) {
	const existing = data?.therapistPreferences || {};

	const [selectedExperience, setSelectedExperience] = useState<string[]>(existing.selectedExperience || []);
	const [selectedGenders, setSelectedGenders] = useState<string[]>(existing.selectedGenders || []);

	useEffect(() => {
		onChange({ selectedExperience, selectedGenders });
	}, [selectedExperience, selectedGenders]);

	const handleToggle = (list: string[], setList: (v: string[]) => void, value: string) => {
		setList(list.includes(value)
			? list.filter(i => i !== value)
			: [...list, value]
		);
	};

	return (
		<Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
			<Typography variant="h6">Your therapist</Typography>

			<Box>
				<Typography variant="subtitle1" gutterBottom>Would you like a therapist that specialises in a certain topic?</Typography>
				<FormGroup>
					{EXPERIENCE_OPTIONS.map(option => (
						<FormControlLabel
							key={option}
							label={option}
							control={
								<Checkbox
									checked={selectedExperience.includes(option)}
									onChange={() => handleToggle(selectedExperience, setSelectedExperience, option)}
								/>
							}
						/>
					))}
				</FormGroup>
			</Box>

			<Box>
				<Typography variant="subtitle1" gutterBottom>Do you have a preference for your therapist's gender?</Typography>
				<FormGroup>
					{THERAPIST_GENDER.map(option => (
						<FormControlLabel
							key={option}
							label={option}
							control={
								<Checkbox
									checked={selectedGenders.includes(option)}
									onChange={() => handleToggle(selectedGenders, setSelectedGenders, option)}
								/>
							}
						/>
					))}
				</FormGroup>
			</Box>
		</Box>
	);
}