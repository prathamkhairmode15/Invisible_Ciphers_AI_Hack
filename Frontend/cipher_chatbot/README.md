# AI Shield Frontend

A modern, production-ready React.js chatbot frontend for an AI security platform.

## Features
- **Secure AI Chat**: Interface for interacting with security-focused AI models.
- **Threat Detection UI**: Real-time visualization of malicious prompts and injection attempts.
- **Risk Scoring**: Visual indicators for message risk levels (0-100).
- **Safe Mode**: Toggle to enable/disable security filters.
- **Cybersecurity Aesthetics**: Sleek dark theme with premium animations and micro-interactions.

## Tech Stack
- React 18+ (Vite)
- Tailwind CSS
- Axios
- Lucide React (Icons)

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
1. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally
1. Start the development server:
   ```bash
   npm run dev
   ```
2. Open your browser to the local URL (usually `http://localhost:5173`).

## API Integration
The app is configured to call `POST /api/chat`. 
You can update the base URL in `src/api/chatService.js`.

Expected Request:
```json
{
  "message": "string",
  "apiKey": "string"
}
```

Expected Response:
```json
{
  "reply": "string",
  "risk_score": number,
  "is_malicious": boolean
}
```

## Project Structure
- `src/components/`: Reusable UI components.
- `src/api/`: Service layers for API calls.
- `src/App.jsx`: Main application logic and state.
- `tailwind.config.js`: Custom theme configuration.
