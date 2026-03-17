import { useState, useEffect } from "react";
import {
	Stepper, Step, StepLabel, Button, Box, Typography, Container, Paper
} from "@mui/material";

import AboutMe from "./components/AboutMe";
import LookingFor from "./components/LookingFor";
import TherapistPreferences from "./components/TherapistPreferences"

const STEPS = ["About me", "What you're looking for", "Your therapist"]

const API = "http://127.0.0.1:8000"

export default function MainMenu() {
	const [currentStep, setCurrentStep] = useState(0);
	const [formData, setFormData] = useState({});
	const [submissionId, setSubmissionId] = useState<string | null>(null);
	const [isRestored, setIsRestored] = useState(false)

	// check URL for existing session or create a new one
	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const existingId = params.get("session");

		if (existingId && existingId !== "undefined") {
			fetch(`${API}/submissions/${existingId}`)
				.then(res => res.json())
				.then(result => {
					if (result.error) {
						// Session not found, create a new one
						return fetch(`${API}/submissions`, { method: "POST" })
							.then(res => res.json())
							.then(newResult => {
								setSubmissionId(newResult.id);
								const newUrl = `${window.location.pathname}?session=${newResult.id}`;
								window.history.replaceState({}, "", newUrl);
								setIsRestored(true);
							});
					}
					setSubmissionId(existingId);
					setFormData(result.data?.formData || {});
					setCurrentStep(result.data?.currentStep || 0);
					setIsRestored(true);
				});
		} else {
			fetch(`${API}/submissions`, { method: "POST" })
				.then(res => res.json())
				.then(result => {
					setSubmissionId(result.id);
					const newUrl = `${window.location.pathname}?session=${result.id}`;
					window.history.replaceState({}, "", newUrl);
					setIsRestored(true);
				})
		}
	}, []);

	// auto-save 1.5s after formData or currentStep changes
	useEffect(() => {
		if (!submissionId || !isRestored) return;
		const timer = setTimeout(() => {
			fetch(`${API}/submissions/${submissionId}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ formData, currentStep }),
			});
		}, 1500);
		return () => clearTimeout(timer)
	}, [formData, currentStep, submissionId, isRestored])

	const updateFormData = (section: string, data: object) => {
		setFormData(previous => ({ ...previous, [section]: data }));
	};

	const handleNext = () => setCurrentStep(previous => previous + 1)
	const handleBack = () => setCurrentStep(previous => previous - 1)

	const renderStep = () => {
		switch (currentStep) {
			case 0: return <AboutMe key={submissionId} data={formData} onChange={(data: object) => updateFormData("aboutMe", data)} />;
			case 1: return <LookingFor key={submissionId} data={formData} onChange={(data: object) => updateFormData("lookingFor", data)} />;
			case 2: return <TherapistPreferences key={submissionId} data={formData} onChange={(data: object) => updateFormData("therapistPreferences", data)} />;
			default: return null;
		}
	};

	return (
		<Container maxWidth="md">
			<Paper elevation={3} sx={{ p: 4, mt: 4 }}>
				<Typography variant="h5" gutterBottom>About you</Typography>

				<Stepper activeStep={currentStep} sx={{ mb: 4 }}>
					{STEPS.map(label => (
						<Step key={label}>
							<StepLabel>{label}</StepLabel>
						</Step>
					))}
				</Stepper>

				{submissionId && (
					<Typography variant="caption" color="text.secondary" display="block" mb={2}>
						Your progress is saved.
					</Typography>
				)}

				{renderStep()}

				<Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
					<Button disabled={currentStep == 0} onClick={handleBack}>Back</Button>
					<Button
						variant="contained"
						onClick={handleNext}
					>
						{currentStep == STEPS.length - 1 ? "Submit!" : "Next"}
					</Button>
				</Box>

			</Paper>
		</Container>
	)
}