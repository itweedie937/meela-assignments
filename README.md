# Meela onboarding form
A POC client intake form with partial submission and resume capabilities.

## Tech stack
- **Frontend** React + TypeScript + Material UI components
- **Backend** Python + FastAPI (Kept the Rust there as legacy code)
- **Database** SQLite

## Prerequisites
- Python 3.10+
- Node 20+

## Setup
### Backend
```bash
cd backend_python
pip install fastapi uvicorn pydantic
uvicorn main:app --reload
```
The backend will start on `http://127.0.0.1:8000`. A `meela.db` file will be created.

### Frontend
- Open a second terminal
```bash
cd frontend
npm install
npm run dev
```
The frontend will start on `http://localhost:5173`.

## Testing
1. Open the frontend in the browser
2. Fill in some fields across one or more steps. Progress saves 1.5 seconds after a change is detected.
3. Copy the URL (which includes a UUID in the parameters)
4. Close the tab and then open a new one
5. You should be back on the same step with the answers answered

## What I'd do with more time
- **A proper completion screen**: I ran out of time and didn't prioritise this over the other screens. It would be quite simple, just text to say that it has been submitted.
- **Visual confirmation when the progress has been saved**: Eg A loading symbol turning into a tick when upon save.
- **Better error handling**: There are a few instances of this but a lot could be added.
- **Validation**: I know this was deemed unnecessary, but if I was making this for real, this would be important.
- Nicer mobile layout and better responsiveness overall -- would be nice to have consistency across all three forms in terms of size.
- More colours!

## Screenshots
<img width="910" height="753" alt="Screenshot 2026-03-17 at 20 19 18" src="https://github.com/user-attachments/assets/c6336e07-e01f-4898-8892-0a725e446799" />
<img width="701" height="785" alt="Screenshot 2026-03-17 at 20 19 43" src="https://github.com/user-attachments/assets/01b889a2-552a-444e-a911-d12387451fdd" />
<img width="819" height="750" alt="Screenshot 2026-03-17 at 20 19 50" src="https://github.com/user-attachments/assets/b4516443-be2d-4cbe-aa2c-a48f41c78a1f" />




