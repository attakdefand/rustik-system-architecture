
# Rustik - Hyperscale Architecture Explorer

Welcome to Rustik, an interactive web application designed to help you explore, understand, and conceptualize high-performance system architectures. Rustik leverages AI-powered analysis to provide insights into how different architectural components interact and scale.

## Key Features

*   **Component Library**: Browse a curated list of architectural components (e.g., Anycast IP, Load Balancers, API Design Styles, Microservices Architecture, Database Strategies) with detailed explanations of their types, use cases, real-world examples, and implementation guidance.
*   **System Visualizer**: Interactively select architectural components and their specific types.
    *   Receive AI-powered analysis on potential **interactions, benefits, and trade-offs** of your selected configuration.
    *   Get AI-driven **suggestions for potential microservices** based on your chosen infrastructure, if "Microservices Architecture" is selected.
    *   Obtain a conceptual **security posture analysis**, including strengths, potential vulnerabilities, and recommendations.
    *   Navigate to a dedicated page for a detailed **conceptual scaling potential analysis**.
*   **Capacity Analyzer**: Get AI-driven conceptual insights into the scaling potential of your chosen components, exploring strengths and potential bottlenecks for handling large user loads. This is launched from the System Visualizer.
*   **Master-Flow**: A comprehensive architectural analysis hub. Select components and their specific types, then trigger multiple AI evaluations in parallel, including:
    *   Interaction Analysis
    *   Conceptual Scaling Potential
    *   Suggested User Capacity Tier (with detailed reasoning)
    *   Conceptual Security Posture Analysis
*   **Builder Insights**: A dedicated section discussing the challenges and considerations of building real-world, large-scale distributed systems, including detailed discussions on scaling up to 1 billion and even 5 billion users.
*   **AI-Powered Analysis**: Utilizes Genkit and Google AI models (Gemini) to provide dynamic, context-aware architectural insights across various features.
*   **Modern Tech Stack**: Built with Next.js (App Router), React, ShadCN UI components, Tailwind CSS, and TypeScript.

## How to Use Rustik

1.  **Explore Components**: Navigate to the **Components** tab (homepage) to learn about individual architectural building blocks and their detailed characteristics.
2.  **Visualize Systems & Analyze Interactions**: Go to the **Visualizer** tab.
    *   Select various architectural components and their specific types using the checkboxes.
    *   Click "Analyze Interactions" to get an AI-generated analysis of how your chosen components might work together.
    *   If "Microservices Architecture" and other relevant infrastructure are selected, click "Suggest Potential Microservices" for AI-based service suggestions.
    *   Click "Analyze Conceptual Security Posture" for an AI-driven security overview of your selections.

    **System Visualizer Screenshot:**
    ![System Visualizer Screenshot](./docs/images/system-visualizer-screenshot.png)

3.  **Analyze Scaling Potential**: From the Visualizer, after selecting components, click "Analyze Scaling Potential". This will take you to the **Capacity Analyzer** page, showing an AI's conceptual take on how your selections might scale and handle large user loads.
4.  **Comprehensive Architectural Profile (Master-Flow)**: Use the **Master-Flow** tab.
    *   Select your desired architectural components and their specific types.
    *   Click "Analyze Full Architectural Profile" to receive a multi-faceted report including interaction analysis, scaling potential, a suggested capacity tier with reasoning, and a conceptual security posture analysis.
5.  **Learn About Scaling Challenges**: Visit the **Builder Insights** tab to understand the complexities of designing and operating systems at massive scale, including specific considerations for 1 billion and 5 billion user systems.

## ⚠️ Purpose & Disclaimer

> **Educational Tool** – Rustik is for conceptual learning only.
> **Not a Production Blueprint** – AI insights are suggestive, not definitive.
> Real-world system design demands detailed planning, performance testing, and domain expertise.

## Future Enhancements (Potential Ideas)

*   **AI-Driven Architectural Pattern Recommendation Engine**: Users describe a high-level problem or goal, and the AI suggests suitable architectural components and patterns.
*   **Conceptual Scalability Simulation / "What-if" Scenarios**: AI analyzes how a selected architecture might conceptually respond to different load levels or failure scenarios.
*   **Automated Conceptual Architectural Document Generation**: AI generates a high-level architectural design document (Markdown) based on user selections and analysis results.
*   **Conceptual Cost Estimation Flows**: AI-driven estimation of high-level cost factors associated with selected architectural components (e.g., "compute-intensive," "storage-heavy").
*   **User Accounts & Saved Configurations**: Allow users to create accounts, save their architectural explorations, and revisit them later. (Note: This would require significant backend changes).
*   **Interactive Diagram Rendering in Visualizer**: Dynamically generate a visual (graphical) diagram of selected components and their conceptual connections. (Note: Requires a client-side diagramming library).

## Cloning and Running Locally

To clone and run Rustik on your local machine, follow these steps:

### Prerequisites

*   [Node.js](https://nodejs.org/) (v18 or later recommended)
*   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Setup Instructions

1.  **Clone the Repository**:
    Open your terminal and run the following command to clone the project.
    ```bash
    git clone <YOUR_REPOSITORY_URL_HERE> rustik-app
    cd rustik-app
    ```
    Replace `<YOUR_REPOSITORY_URL_HERE>` with the actual URL of your Git repository.

2.  **Install Dependencies**:
    Install the project dependencies using either npm or yarn:
    ```bash
    npm install
    ```
    or
    ```bash
    yarn install
    ```

3.  **Set Up Environment Variables**:
    The application uses Genkit, which connects to Google AI models (like Gemini) for its AI-powered features. You'll need a Google AI API key.
    *   Create a new file named `.env` in the root directory of the project (i.e., inside the `rustik-app` folder).
    *   Add your Google AI API key to this `.env` file. The content should look like this:
        ```env
        GOOGLE_API_KEY=your_google_ai_api_key_here
        ```
        Replace `your_google_ai_api_key_here` with your actual API key.
    *   You can obtain a Google AI API key by visiting [Google AI Studio (formerly MakerSuite)](https://aistudio.google.com/). Create a new API key if you don't have one.

4.  **Run the Development Servers**:
    Rustik requires two development servers to run concurrently:
    *   One for the Next.js frontend application.
    *   One for the Genkit AI flows (which act as the backend for AI features).

    You will need to open **two separate terminal windows** or tabs for these commands.

    *   **Terminal 1: Start the Genkit Development Server**:
        In your first terminal window, navigate to the project directory (`rustik-app`) and run:
        ```bash
        npm run genkit:dev
        ```
        This command starts the Genkit development server. It will typically run on port `3400` (e.g., `http://localhost:3400`). This server handles the AI flow executions. It will also automatically recompile your flows if you make changes to them in the `src/ai/flows/` directory.

    *   **Terminal 2: Start the Next.js Development Server**:
        In your second terminal window, navigate to the project directory (`rustik-app`) and run:
        ```bash
        npm run dev
        ```
        This command starts the Next.js frontend application. It will typically run on port `9002` (e.g., `http://localhost:9002`).

5.  **Access the Application**:
    Once both servers are running:
    *   Open your web browser.
    *   Navigate to `http://localhost:9002` (or the port specified in your terminal output for the Next.js server).

    You should now be able to use the Rustik application, including its AI-powered analysis features.

## Automated Workflows with GitHub Actions

This project uses GitHub Actions to automate several quality checks:

*   **Linting and Type Checking**: Automatically checks your code for style issues (ESLint) and type errors (TypeScript) on every push or pull request. This helps catch common mistakes early. (See: `.github/workflows/lint-typecheck.yml`)
*   **Build Check**: Ensures your Next.js application successfully builds whenever changes are made. This prevents merging code that breaks the production build. (See: `.github/workflows/build-check.yml`)
    *   **Note on Build Check**: The build process might require a `GOOGLE_API_KEY`. For CI, you can set a dummy key as a GitHub repository secret named `DUMMY_GOOGLE_API_KEY_FOR_BUILD`. If the build doesn't require it, this can be omitted from the workflow file.
*   **(Future) Automated Testing**: If automated tests (unit, integration, end-to-end) are added to the project, GitHub Actions can be configured to run them automatically to verify the application's functionality.

We hope you find Rustik insightful for exploring the fascinating world of hyperscale system architecture!
