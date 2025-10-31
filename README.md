# AI-Powered Apps

A personal project exploring AI integration in web applications through chatbots and text summarization.

## 📋 Overview

This repository contains two main applications I built to experiment with large language models: an AI chatbot and a product review summarizer. The project demonstrates how to integrate different AI providers and run models both in the cloud and locally.

## 🚀 Features

- **AI Chatbot**: Interactive chatbot with conversation memory
- **Product Review Summarizer**: Tool to summarize product reviews
- **Multiple AI Providers**: Works with OpenAI, Hugging Face, and Ollama
- **Local Model Support**: Run AI models on your own machine using Ollama

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express
- **AI Integration**: 
  - OpenAI API
  - Hugging Face Transformers
  - Ollama (local models)
- **Development Tools**: Vite, ESLint, Prettier

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/BishanathTarafder/AIPoweredApp.git

# Navigate to the project directory
cd AIPoweredApp

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env
# Add your API keys and configuration
```

## ⚙️ Configuration

Create a `.env` file in the root directory:

```env
OPENAI_API_KEY=your_openai_api_key
HUGGINGFACE_API_KEY=your_huggingface_api_key
```

## 🚦 Usage

```bash
# Run the application
bun start

# Run in development mode
bun run dev

# Run tests
bun test
```

## 📖 Resources

- [OpenAI Documentation](https://platform.openai.com/docs)
- [Hugging Face Hub](https://huggingface.co/)
- [Ollama Documentation](https://ollama.ai/)

---

**Note**: Make sure you have valid API keys from OpenAI and Hugging Face to run this application.
