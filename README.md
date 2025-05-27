
# Rustik - Hyperscale Architecture Explorer

Welcome to Rustik, an interactive web application designed to help you explore, understand, and conceptualize high-performance system architectures. Rustik leverages AI-powered analysis to provide insights into how different architectural components interact and scale.

## Key Features

*   **Component Library**: Browse a curated list of architectural components (e.g., Anycast IP, Load Balancers, Rust App Nodes, Database Strategies) with detailed explanations, use cases, and real-world examples.
*   **System Visualizer**: Interactively select architectural components and their specific types.
    *   Receive AI-powered analysis on potential interactions, benefits, and trade-offs of your selected configuration.
*   **Capacity Analyzer**: Get AI-driven conceptual insights into the scaling potential of your chosen components, exploring strengths and potential bottlenecks for handling large user loads.
*   **Master-Flow**: A comprehensive architectural analysis hub. Select components and trigger multiple AI evaluations in parallel, including:
    *   Interaction Analysis
    *   Conceptual Scaling Potential
    *   Suggested User Capacity Tier with detailed reasoning.
*   **Builder Insights**: A dedicated section discussing the challenges and considerations of building real-world, large-scale distributed systems, including scaling up to 1 billion and even 5 billion users.
*   **AI-Powered Analysis**: Utilizes Genkit and Google AI models (Gemini) to provide dynamic, context-aware architectural insights.
*   **Modern Tech Stack**: Built with Next.js (App Router), React, ShadCN UI components, Tailwind CSS, and TypeScript.

## How to Use Rustik

1.  **Explore Components**: Navigate to the **Components** tab (homepage) to learn about individual architectural building blocks.
2.  **Visualize Systems & Analyze Interactions**: Go to the **Visualizer** tab. Select components and their specific types, then click "Analyze Interactions" to get an AI-generated analysis.
3.  **Analyze Scaling Potential**: From the Visualizer, after selecting components, click "Analyze Scaling Potential". This will take you to a dedicated page showing an AI's conceptual take on how your selections might scale.
4.  **Comprehensive Architectural Profile**: Use the **Master-Flow** tab. Select your desired components and types, then click "Analyze Full Architectural Profile" to receive a multi-faceted report including interaction analysis, scaling potential, and a suggested capacity tier.
5.  **Learn About Scaling Challenges**: Visit the **Builder Insights** tab to understand the complexities of designing and operating systems at massive scale.

## ⚠️ Purpose & Disclaimer

> **Educational Tool** – Rustik is for conceptual learning only.
> **Not a Production Blueprint** – AI insights are suggestive, not definitive.
> Real-world system design demands detailed planning, performance testing, and domain expertise.

## Cloning and Running Locally

To clone and run Rustik on your local machine, follow these steps:

### Prerequisites

*   [Node.js](https://nodejs.org/) (v18 or later recommended)
*   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Setup Instructions

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/your-username/your-repository-name.git nextn
    cd nextn
    ```
    *(Replace `https://github.com/your-username/your-repository-name.git` with the actual repository URL if available, otherwise, this is a placeholder.)*

2.  **Install Dependencies**:
    ```bash
    npm install
    ```
    or
    ```bash
    yarn install
    ```

3.  **Set Up Environment Variables**:
    The application uses Genkit, which connects to Google AI models. You'll need a Google AI API key.
    *   Create a file named `.env` in the root of the project.
    *   Add your Google AI API key to this file:
        ```env
        GOOGLE_API_KEY=your_google_ai_api_key_here
        ```
    *   You can obtain a Google AI API key by visiting [Google AI Studio (formerly MakerSuite)](https://aistudio.google.com/).

4.  **Run the Development Servers**:
    Rustik requires two development servers to run concurrently: one for the Next.js frontend and one for the Genkit AI flows.

    *   **Start the Genkit Development Server**:
        Open a terminal window and run:
        ```bash
        npm run genkit:dev
        ```
        This will typically start the Genkit server (often on port 3400, but check your terminal output).

    *   **Start the Next.js Development Server**:
        Open a *second* terminal window and run:
        ```bash
        npm run dev
        ```
        This will start the Next.js application, usually on `http://localhost:9002`.

5.  **Access the Application**:
    Open your web browser and navigate to `http://localhost:9002` (or the port specified in your terminal output for the Next.js server).

## Future Enhancements (Potential Ideas)

*   Dynamic visual diagrams in the System Visualizer.
*   More detailed AI flows for cost estimation or security posture assessment.
*   User accounts to save and share architectural configurations.

We hope you
