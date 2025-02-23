
# PersonAI - Your AI Mentor Platform

PersonAI is an innovative web application developed during a hackathon that combines CV analysis and AI mentorship to provide personalized career guidance and professional development support.

## 🎯 Project Goals

- Provide automated CV analysis with AI-powered insights
- Offer interactive mentorship through AI characters with different expertise
- Create a knowledge base for storing and managing career-related notes
- Enable voice-based conversations with AI mentors for natural interaction
- Track conversation history for continued guidance and reference

## 🚀 Features

- **CV Analysis**: Upload and analyze CVs with AI to get detailed insights and summaries
- **AI Mentors**: Choose from different mentor personalities tailored to various career paths
- **Voice Interaction**: Natural voice-based conversations with AI mentors
- **Knowledge Base**: Create and manage notes from mentorship sessions
- **Conversation History**: Track and review past interactions with mentors

## 🛠 Technologies Used

- **Frontend Framework**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Voice Integration**: ElevenLabs API
- **State Management**: React Query
- **Icons**: Lucide React

## 📦 Installation

Make sure you have Node.js installed on your system. Then follow these steps:

```bash
# Clone the repository
git clone <your-repo-url>

# Navigate to project directory
cd personai

# Install dependencies
npm install

# Start the development server
npm run dev
```

## 🔑 Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
ELEVEN_LABS_API_KEY=your_eleven_labs_key
```

## 📝 API Keys Required

To use all features of PersonAI, you'll need:

- ElevenLabs API key for voice interaction
- Backend API endpoint configuration (if applicable)

## 🌐 Development

The application will be available at `http://localhost:8080` after starting the development server.

## 🏗 Project Structure

```
personai/
├── public/
├── src/
│   ├── components/
│   ├── context/
│   ├── hooks/
│   ├── pages/
│   ├── services/
│   └── types/
└── package.json
```

## 🤝 Contributing

This project was developed during a hackathon, but we welcome contributions! Please feel free to submit issues and pull requests.

## 📄 License

This project is open source and available under the MIT license.
