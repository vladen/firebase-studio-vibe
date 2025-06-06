
# Project Sentinel

Project Sentinel is a modern Next.js SPA designed for realtime log monitoring, project roadmap planning, and AI-assisted task management. It leverages GenAI capabilities to streamline development workflows, including idea refinement into GitHub issues and task grooming post-code-review.

## Core Features

1.  **Realtime Monitoring Dashboard**:
    *   Displays a unified feed of logs from both client-side activities and server-side operations.
    *   Logs are categorized with semantic emojis for quick visual identification.
    *   Client-side logs capture user interactions and application events.
    *   Server-side logs (initially stored in-memory) are served to connected clients.

2.  **Project Roadmap Planning**:
    *   Visual timeline of project tasks, allowing users to scroll to the current date and view planned activities.
    *   Tasks are organized under milestones, with tabs to show/hide tasks for specific milestones.
    *   Integrates with AI-refined GitHub issues for task data.

3.  **Idea Submission & Backlog**:
    *   A simple form for users to submit new ideas, feature requests, or bug reports.
    *   Submitted ideas are processed by an AI workflow to refine them into structured issue proposals.

4.  **AI-Enhanced Issue Creation**:
    *   Utilizes a custom GenAI workflow (`refine-idea-workflow`) to transform raw user ideas into well-defined GitHub issue formats.
    *   The AI suggests issue titles, detailed descriptions, relevant labels (e.g., 'feature', 'bug', 'enhancement'), and assigns them to appropriate milestones.
    *   This feature is designed to integrate with a GitHub repository via environment variables (setup required).

5.  **AI Task Grooming**:
    *   After simulated code reviews (input via UI), an AI workflow (`suggest-task-grooming`) provides suggestions for task grooming.
    *   Suggestions include relevant labels, comments, and a re-prioritized task order.
    *   The UI allows users to review and apply these AI-driven recommendations.

## Tech Stack

*   **Frontend**: Next.js (App Router), React, TypeScript, Tailwind CSS, ShadCN UI components
*   **AI Integration**: Genkit with Google AI (Gemini models)
*   **Icons**: Lucide React, Semantic Emojis
*   **Styling**: Tailwind CSS with CSS variables for theming.

## Guiding Principles

*   **YAGNI (You Ain't Gonna Need It)**: Implement features only when necessary.
*   **DRY (Don't Repeat Yourself)**: Maximize code reuse and avoid redundancy.
*   **KISS (Keep It Simple, Stupid)**: Strive for simplicity in design and implementation.
*   **Clean AI-Oriented Architecture**: Design for easy integration and extension of AI capabilities.

## Project Structure

```
src/
├── ai/                  # GenAI flows and configurations
│   ├── flows/
│   │   ├── refine-idea-workflow.ts
│   │   └── suggest-task-grooming.ts
│   ├── dev.ts
│   └── genkit.ts
├── app/                 # Next.js App Router
│   ├── (main)/          # Main application group with shared layout
│   │   ├── dashboard/
│   │   │   └── page.tsx   # Realtime Monitoring
│   │   ├── ideas/
│   │   │   └── page.tsx   # Idea Submission & Backlog
│   │   ├── roadmap/
│   │   │   └── page.tsx   # Project Roadmap
│   │   ├── grooming/
│   │   │   └── page.tsx   # AI Task Grooming
│   │   └── layout.tsx     # Main layout with sidebar
│   ├── api/             # API routes
│   │   └── logs/
│   │       └── route.ts # API for server-side logs
│   ├── globals.css      # Global styles and Tailwind theme
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Entry page (redirects or initial setup)
├── components/          # Reusable UI components
│   ├── ui/              # ShadCN UI components
│   ├── layout/          # Layout specific components (Sidebar, Header)
│   ├── monitoring/      # Components for log monitoring
│   ├── roadmap/         # Components for project roadmap
│   ├── ideas/           # Components for idea management
│   └── grooming/        # Components for task grooming
├── lib/                 # Utility functions and types
│   ├── logger.ts        # Client-side logging utility
│   ├── utils.ts         # General utility functions (e.g., cn)
│   └── types.ts         # TypeScript type definitions
├── hooks/               # Custom React hooks
│   └── use-toast.ts
│   └── use-mobile.tsx
├── public/              # Static assets
├── .env.local.example   # Example environment variables
├── next.config.ts       # Next.js configuration
├── tailwind.config.ts   # Tailwind CSS configuration
└── tsconfig.json        # TypeScript configuration
```

## Getting Started

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd project-sentinel
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Set up environment variables**:
    Create a `.env.local` file by copying `.env.local.example`.
    Fill in the required API keys and GitHub repository details:
    ```env
    # Example:
    # GOOGLE_API_KEY=your_google_api_key_here
    # GITHUB_TOKEN=your_github_personal_access_token
    # GITHUB_REPO_OWNER=your_github_username
    # GITHUB_REPO_NAME=project-sentinel
    ```

4.  **Run the development server**:
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:9002`.

5.  **Run Genkit development server (optional, for AI flow testing)**:
    ```bash
    npm run genkit:dev
    ```

## Future Enhancements (Postponed)

*   User Authentication
*   Persistent storage for logs, ideas, and tasks (e.g., Firebase Firestore).
*   Real-time server log streaming using WebSockets or Server-Sent Events.
*   Direct GitHub API integration for creating issues and managing project data.
