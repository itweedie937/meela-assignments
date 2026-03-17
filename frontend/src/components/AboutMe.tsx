import { useState, useEffect } from "react";
import { Box, TextField, Typography, ToggleButton, ToggleButtonGroup } from "@mui/material";

interface Props {
	data: Record<string, any>;
	onChange: (data: object) => void;
}

const AGE_RANGES = ["Under 18", "18-24", "25-34", "35-44", "45-54", "50+"];

export default function AboutMe({ data, onChange }: Props) {
	const existing = data?.aboutMe || {};

	const [name, setName] = useState(existing.name || "");
	const [email, setEmail] = useState(existing.email || "");
	const [phone, setPhone] = useState(existing.phone || "");
	const [pronouns, setPronouns] = useState(existing.pronouns || "");
	const [age, setAge] = useState(existing.age || null);

	useEffect(() => {
		onChange({ name, pronouns, email, phone, age});
	}, [name, pronouns, email, phone, age]);

	return (
		<Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
			<Typography variant="h6">About me</Typography>

			<TextField
				label="Full name"
				value={name}
				onChange={e => setName(e.target.value)}
				fullWidth
			/>

			<TextField
				label="Pronouns"
				value={pronouns}
				onChange={e => setPronouns(e.target.value)}
				fullWidth
			/>

			<TextField
				label="Email"
				value={email}
				onChange={e => setEmail(e.target.value)}
				fullWidth
			/>

			<TextField
				label="Phone"
				value={phone}
				onChange={e => setPhone(e.target.value)}
				fullWidth
			/>

			<Box>
				<Typography variant="body2" color="text.secondary" mb={1}>Age range</Typography>

				<ToggleButtonGroup
					value={age}
					exclusive
					onChange={(_, val) => setAge(val)}
				>
					{AGE_RANGES.map(range => (
						<ToggleButton key={range} value={range}>{range}</ToggleButton>
					))}
				</ToggleButtonGroup>
			</Box>
		</Box>
	)
}