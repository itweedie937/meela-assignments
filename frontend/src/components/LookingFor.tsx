import { useState, useEffect } from "react";
import { Box, Checkbox, FormControlLabel, FormGroup, Typography } from "@mui/material";

interface Props {
	data: Record<string, any>;
	onChange: (data: object) => void;
}

const TOPIC_OPTIONS = [
	"Anxiety", "Depression", "ADHD", "BPD", "Trauma & PTSD", "Stress", "Grief & Loss", "Relationships"
]

const THERAPY_TYPES = [
	"CBT", "Somatic therapy", "Person centred", "Mindfulness", "No preference/Don't know"
]


export default function LookingFor({ data, onChange }: Props) {
	const existing = data?.lookingFor || {};

	const [selectedTopics, setSelectedTopics] = useState<string[]>(existing.selectedTopics || []);
	const [selectedTypes, setSelectedTypes] = useState<string[]>(existing.selectedTypes || []);

	useEffect(() => {
		onChange({ selectedTopics, selectedTypes });
	}, [selectedTopics, selectedTypes]);

	const handleToggle = (list: string[], setList: (v: string[]) => void, value: string) => {
		setList(list.includes(value)
			? list.filter(i => i !== value)
			: [...list, value]
		);
	};

	return (
		<Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
			<Typography variant="h6">What you're looking for</Typography>

			<Box>
				<Typography variant="subtitle1" gutterBottom>What would you like support with?</Typography>
				<FormGroup>
					{TOPIC_OPTIONS.map(option => (
						<FormControlLabel
							key={option}
							label={option}
							control={
								<Checkbox
									checked={selectedTopics.includes(option)}
									onChange={() => handleToggle(selectedTopics, setSelectedTopics, option)}
								/>
							}
						/>
					))}
				</FormGroup>
			</Box>

			<Box>
				<Typography variant="subtitle1" gutterBottom>What's your preferred therapy style?</Typography>
				<FormGroup>
					{THERAPY_TYPES.map(option => (
						<FormControlLabel
							key={option}
							label={option}
							control={
								<Checkbox
									checked={selectedTypes.includes(option)}
									onChange={() => handleToggle(selectedTypes, setSelectedTypes, option)}
								/>
							}
						/>
					))}
				</FormGroup>
			</Box>
		</Box>
	);
}