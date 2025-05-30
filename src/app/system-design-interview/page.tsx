
'use client';
import { useState, useRef } from 'react'; // Added useState, useRef
import { AppHeader } from '@/components/layout/app-header';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Brain, Lightbulb, Users, LinkIcon, Newspaper, Server as ServerIcon, Database as DatabaseIcon, Network, Scaling, Shield, Layers, HelpCircle, Car, TrendingUp,
  WorkflowIcon, ClipboardList, Gauge, Shuffle, DatabaseZap, ListChecks, Fingerprint, SearchCode, BellRing, MessageSquarePlus, Type,
  Youtube, FolderGit2, Puzzle, CloudCog, Info, Landmark, BarChart3, ChevronsUp, Beaker, ActivitySquare, LockKeyhole, CloudLightning, Binary, FunctionSquare, PackageSearch, KeyRound, ShieldCheck, Lock, GraduationCap, Bird, Cpu, FilePen
} from 'lucide-react';
import type React from 'react';

interface InterviewQuestion {
  id: string;
  title: string;
  icon: React.ElementType;
  problemStatement: string;
  requirements: string[];
  relevantRustikComponents: string[];
  conceptualSolutionOutline: string;
  discussionPoints: string[];
  rustikRelevanceNote?: string;
}

interface BasicInterviewQuestion {
  id: string;
  title: string;
  icon: React.ElementType;
  explanation?: string;
  purpose?: string;
  keyConcepts?: string[];
  learningStrategies?: string[];
  howItWorks?: string;
  keyStepsInHandshake?: string;
  benefits?: string[];
  challenges?: string[];
  commonLevels?: { name: string; description: string }[];
  tradeOffs?: string;
  examples?: Array<{ model: string; description: string; managedByCustomer: string[]; managedByProvider: string[]; examples: string[] }>;
  keyDifferences?: string[];
  keyDifferencesTable?: { header: string[]; rows: string[][] }; // For Process vs Thread
  whenToChoose?: string[];
  keyTrends?: string[];
  architecturalConsiderations?: string[];
  verificationProcess?: string;
  whyNotEncryption?: string;
  relevantRustikComponents: string[];
  rustikRelevanceNote?: string;
  // Fields from InterviewQuestion for moved items
  problemStatement?: string;
  requirements?: string[];
  conceptualSolutionOutline?: string;
  discussionPoints?: string[];
  // New fields for database guide
  decisionFactors?: string[];
  databaseTypeGuidance?: Array<{ category: string; description: string; considerations: string[]; rustikLink: string; examples: string; }>;
  // New fields for Twitter question
  keyCoreFunctionalities?: string[];
  keyArchitecturalChallenges?: string[];
}

const systemDesignFramework = {
  title: "A Framework for System Design Interviews",
  icon: ClipboardList,
  hoverHint: "Get a structured approach to tackle interview questions effectively.",
  introduction: "Approaching a system design interview with a structured framework can help you cover all essential aspects and articulate your thoughts clearly. Here’s a general guide:",
  steps: [
    "**1. Understand Requirements & Scope (5-10 mins):**",
    "  - Actively listen and ask clarifying questions. Don't assume!",
    "  - Identify core use cases and features (Functional Requirements).",
    "  - Discuss scale: users (DAU/MAU), requests per second (QPS), data volume.",
    "  - Clarify constraints: latency, consistency, availability (Non-Functional Requirements - NFRs).",
    "  - Define what's out of scope.",
    "**2. High-Level Design / API Design (10-15 mins):**",
    "  - Sketch the major components and their interactions (e.g., client, API gateway, services, database, cache).",
    "  - Define the primary APIs (e.g., REST endpoints, gRPC service definitions) between components.",
    "  - Estimate system load based on requirements (e.g., read/write QPS, storage needs).",
    "**3. Deep Dive into Components (15-20 mins):**",
    "  - Detail the design of critical components. For example:",
    "    - Database choice and schema design.",
    "    - Caching strategies.",
    "    - Load balancing mechanisms.",
    "    - Service logic if designing microservices.",
    "  - Justify your choices.",
    "**4. Data Model / Database Design:**",
    "  - Discuss your data model (e.g., relational schema, NoSQL document structure).",
    "  - Explain data storage choices and why they fit the requirements (e.g., SQL for transactions, NoSQL for scale/flexibility).",
    "  - Consider data partitioning, sharding, and replication if scale demands it.",
    "**5. Identify Bottlenecks & Scale (5-10 mins):**",
    "  - Proactively identify potential bottlenecks in your design (e.g., single points of failure, database contention, service hotspots).",
    "  - Discuss how to scale the system (horizontal vs. vertical scaling for different components).",
    "  - Explain how your design addresses the initial scale requirements and beyond.",
    "**6. Security, Reliability & Other NFRs:**",
    "  - Briefly touch upon security considerations (authentication, authorization, data encryption).",
    "  - Discuss fault tolerance, redundancy, and monitoring.",
    "  - Mention other relevant NFRs like maintainability, cost-effectiveness.",
    "**7. Summarize & Discuss Trade-offs (5 mins):**",
    "  - Briefly summarize your design.",
    "  - Acknowledge any trade-offs made (e.g., consistency vs. availability, cost vs. performance).",
    "  - Mention potential future improvements or areas for further investigation if time permitted."
  ],
  conclusion: "Throughout the interview, communicate your thought process, draw diagrams, and be open to feedback or changing requirements. The interviewer is often more interested in how you think than in a single 'correct' answer."
};

const scalingJourneyPhases = [
  {
    icon: ServerIcon,
    title: "Phase 1: The Monolith / Single Server (0 - 1,000s of Users)",
    description: "Initial development often starts with a monolithic application and a single database, frequently on one server or a simple cloud setup. This phase prioritizes rapid development and getting a product to market.",
    characteristics: [
      "Single application codebase.",
      "Single database instance.",
      "Often deployed on one or few servers (vertical scaling primary).",
    ],
    pros: [
      "Simple to develop and understand.",
      "Easy to deploy and debug initially.",
      "Fast time-to-market for MVPs.",
    ],
    challenges: [
      "Vertical scaling has limits (CPU, RAM, I/O).",
      "Single point of failure (if server or database goes down).",
      "Deployment downtime can impact all users.",
    ],
    rustikRelevance: ["Rust App Nodes (Single-binary)", "Database Strategies (Simple Relational DB)", "API Design Styles (REST API)"]
  },
  {
    icon: Layers,
    title: "Phase 2: Scaling Out / Adding Layers (1,000s - 100,000s of Users)",
    description: "As user load increases, the first bottlenecks appear, typically around the database and application server capacity. The focus shifts to horizontal scaling and introducing specialized layers.",
    actions: [
      "Separate database server from application server.",
      "Introduce Load Balancers to distribute traffic across multiple application server instances.",
      "Horizontally scale the application layer (more app servers running the same monolith).",
      "Implement basic Caching (e.g., in-memory, Redis) for frequently accessed data.",
      "Start using a Content Delivery Network (CDN) for static assets (images, JS, CSS).",
    ],
    pros: [
      "Handles increased traffic.",
      "Improved availability (no longer single server for app).",
      "Reduced database load via caching and read replicas (if implemented).",
    ],
    challenges: [
      "The monolith can still become a deployment and development bottleneck.",
      "Database contention can become significant.",
      "Managing state across multiple application instances if not stateless.",
    ],
    rustikRelevance: ["Load Balancer(s)", "Rust App Nodes (Multiple instances)", "Database Strategies (Read Replicas, Connection Pooling)", "Caching Strategies", "Network Infrastructure Strategies (CDN Integration)"]
  },
  {
    icon: WorkflowIcon,
    title: "Phase 3: Service Decomposition & Specialization (100,000s - Millions+ Users)",
    description: "At this scale, the monolithic application becomes unwieldy. The system needs to be broken down into smaller, independent services that can be scaled and managed separately. Advanced operational practices become essential.",
    actions: [
      "Break down the monolith into Microservices, focusing on high-load or complex business domains first.",
      "Introduce an API Gateway to manage and route requests to microservices.",
      "Utilize Message Queues (e.g., Kafka, RabbitMQ) for asynchronous processing and inter-service communication.",
      "Adopt more advanced Database Strategies (e.g., NoSQL for specific use cases like user sessions or product catalogs, potential database sharding if relational DBs hit limits).",
      "Implement robust Observability: comprehensive metrics, distributed tracing, and centralized logging.",
      "Automate deployments with CI/CD pipelines for reliable and frequent releases.",
      "Strengthen Security Architecture with dedicated security components and practices.",
      "Implement Autoscaling for various layers (app servers, microservices, database capacity).",
    ],
    pros: [
      "Independent scaling of services based on demand.",
      "Improved fault isolation – failure in one service is less likely to affect others.",
      "Technology diversity: different services can use different tech stacks if beneficial.",
      "Smaller, more focused teams can manage individual services.",
    ],
    challenges: [
      "Increased complexity of a distributed system (network latency, inter-service communication).",
      "Higher operational overhead (managing many services).",
      "Requires mature DevOps practices.",
      "Data consistency across services can be complex (eventual consistency, sagas).",
    ],
    rustikRelevance: ["Microservices Architecture", "API Gateway", "Shared State & Data Plane (Message Queues)", "Database Strategies (NoSQL, Sharding)", "Observability & Ops", "Deployment & CI/CD", "Autoscaling & Resilience Patterns", "Security Architecture Principles"]
  }
];

const basicDesignQuestions: BasicInterviewQuestion[] = [
   {
    id: "unique-id-generator",
    title: "Design a Unique ID Generator in Distributed Systems",
    icon: Fingerprint,
    problemStatement: "Design a service that generates unique, ideally sortable (e.g., by time), IDs at high throughput and low latency, suitable for use across a distributed system. These IDs are crucial for uniquely identifying entities like posts, users, or transactions.",
    requirements: [
      "Functional Requirements:",
      "  - Generate globally unique IDs.",
      "Non-Functional Requirements:",
      "  - Uniqueness: IDs must be unique across all services and instances.",
      "  - High Availability: The ID generation service must be highly available.",
      "  - Low Latency: ID generation should be very fast.",
      "  - Scalability: Capable of generating a high volume of IDs per second.",
      "  - Fault Tolerance: System should continue generating IDs even if some nodes fail.",
      "  - (Optional but desirable) Roughly Time-Sortable: IDs generated around the same time should be numerically close. This helps with DB indexing and ordering."
    ],
    relevantRustikComponents: [
      "Rust App Nodes (To build the ID generation service).",
      "Service Discovery & Control Plane (If the ID generator is a centralized service that other services discover).",
      "Database Strategies (If using database sequences or for coordination in some ID generation schemes).",
      "Async IO + Epoll + Tokio (For high-performance network communication if it's a service).",
      "Autoscaling & Resilience Patterns (To ensure the ID generation service is itself scalable and resilient)."
    ],
    conceptualSolutionOutline: `
Several approaches exist, each with trade-offs:

1.  **UUIDs (Universally Unique Identifiers):**
    *   **UUID v1 (Time-based):** Combines timestamp, clock sequence, and MAC address. Roughly sortable by time. Potential MAC address privacy concerns (though often randomized).
    *   **UUID v4 (Random):** 122 bits of randomness. Extremely low collision probability. Not sortable by time.
    *   Pros: Simple to generate in a decentralized way (no coordination needed).
    *   Cons: Can be long (128 bits / 36 chars with hyphens). V4 not sortable.

2.  **Twitter Snowflake-like Approach:**
    *   Combines:
        *   Timestamp (e.g., milliseconds since a custom epoch) - 41 bits.
        *   Worker/Machine ID (datacenter ID + worker ID) - 10 bits.
        *   Sequence Number (per worker, per millisecond, resets every ms) - 12 bits.
    *   Pros: Globally unique, roughly time-sortable. Compact (64-bit integer). High throughput.
    *   Cons: Requires careful management of worker IDs. Sensitive to clock skew between machines (NTP synchronization is critical).

3.  **Database Auto-Increment (with care):**
    *   Use a database's auto-increment feature.
    *   **Single DB:** Becomes a single point of failure and write bottleneck.
    *   **Multiple DBs (sharded):** Can use different offsets/increments per shard (e.g., server 1 generates 1, 3, 5...; server 2 generates 2, 4, 6...). More complex to manage.
    *   Pros: Simple for single DB. IDs are sortable.
    *   Cons: Scalability and availability challenges in distributed setups.

4.  **Centralized ID Service with Batching (e.g., using ZooKeeper/etcd/Redis):**
    *   A central service manages sequence blocks.
    *   Application instances request a batch of IDs (e.g., 1000 IDs) from this service.
    *   App instances then use IDs from their allocated batch locally.
    *   Pros: Can be highly available if the central service is robust.
    *   Cons: Latency to fetch batches. Central service can be a bottleneck if not designed well.
`,
    discussionPoints: [
      "Uniqueness guarantees vs. collision probability.",
      "Sortability needs: Is it critical? If so, how strictly sorted?",
      "Scalability and throughput requirements (IDs per second).",
      "Fault tolerance and availability of the ID generation scheme.",
      "Latency of ID generation.",
      "Impact of clock synchronization (for timestamp-based methods like Snowflake).",
      "Complexity of implementation and operation.",
      "ID size and storage implications (e.g., UUIDs are larger than 64-bit integers).",
      "Decentralized vs. centralized approaches and their trade-offs.",
      "How to assign and manage worker IDs in Snowflake-like systems."
    ],
    rustikRelevanceNote: "This foundational problem is often a precursor to designing any system that needs to create unique entities, which is virtually all systems Rustik helps conceptualize. Understanding these trade-offs is key before applying more complex Rustik components."
  },
  {
    id: "db-isolation-levels",
    title: "What are database isolation levels? What are they used for?",
    icon: DatabaseIcon,
    explanation: "Database isolation levels define the degree to which one transaction must be isolated from the effects of other concurrent transactions and data modifications made by them. They control the visibility of uncommitted changes made by one transaction to other transactions.",
    purpose: `Their primary purpose is to prevent concurrency phenomena and ensure data integrity when multiple transactions are executing simultaneously. These phenomena include:
  - Dirty Reads: A transaction reads data written by another concurrent transaction that has not yet been committed. If the other transaction rolls back, the first transaction has read 'dirty' or invalid data.
  - Non-Repeatable Reads: A transaction re-reads data it has previously read and finds that another committed transaction has modified or deleted the data. The original read cannot be repeated.
  - Phantom Reads: A transaction re-executes a query returning a set of rows that satisfy a search condition and finds that another committed transaction has inserted new rows that satisfy the condition. These new rows are 'phantoms'.`,
    commonLevels: [
      { name: "Read Uncommitted", description: "Lowest level. Allows dirty reads, non-repeatable reads, and phantom reads. Offers maximum concurrency but minimal consistency." },
      { name: "Read Committed", description: "Prevents dirty reads. Data read is always committed. However, non-repeatable reads and phantom reads can still occur. Default for many databases like PostgreSQL and SQL Server." },
      { name: "Repeatable Read", description: "Prevents dirty reads and non-repeatable reads. Ensures that if a row is read multiple times within the same transaction, the result is the same. Phantom reads can still occur. Default for MySQL (InnoDB)." },
      { name: "Serializable", description: "Highest level. Prevents dirty reads, non-repeatable reads, and phantom reads. Transactions appear to run serially (one after another), ensuring complete isolation. Offers maximum consistency but can significantly reduce concurrency and performance." },
    ],
    tradeOffs: "There is a fundamental trade-off: higher isolation levels provide stronger data consistency and prevent more concurrency issues, but they typically reduce concurrency and can negatively impact performance due to increased locking or versioning overhead.",
    relevantRustikComponents: ["Database Strategies"],
    rustikRelevanceNote: "Understanding database isolation levels is crucial when selecting or configuring any of Rustik's 'Database Strategies'. For example, choosing a 'Relational (SQL) Databases' type implies needing to decide on an appropriate isolation level which directly impacts data consistency and performance. Similarly, when using 'Read Replicas for Read Scalability', the primary's isolation level and replication mechanism influence the data seen by replicas. Even with NoSQL options, understanding isolation principles helps evaluate their different consistency models.",
    discussionPoints: [
      "Why are isolation levels important in concurrent systems?",
      "Explain each standard isolation level and the phenomena it prevents.",
      "What are the performance implications of choosing a higher isolation level?",
      "How do different databases (e.g., PostgreSQL vs. MySQL) implement isolation levels or handle defaults?",
      "When might you choose a lower isolation level despite the risks?",
      "How do isolation levels relate to database locking mechanisms?",
      "Optimistic vs. Pessimistic concurrency control and their relation to isolation."
    ]
  },
  {
    id: "cloud-service-models",
    title: "What are Cloud Service Models: IaaS, PaaS, SaaS?",
    icon: CloudCog,
    explanation: `Cloud service models describe how cloud computing resources are offered to users. The three main models are:
  - IaaS (Infrastructure as a Service): Provides fundamental building blocks for cloud IT. This includes access to computing resources (virtual machines, storage, networks) on demand. You manage the OS, middleware, applications, and data.
  - PaaS (Platform as a Service): Provides a platform for developing, running, and managing applications without the complexity of building and maintaining the infrastructure typically associated with it. The provider manages the OS, middleware, and runtime. You manage your applications and data.
  - SaaS (Software as a Service): Provides ready-to-use software applications delivered over the internet, typically on a subscription basis. The provider manages all aspects of the software service (infrastructure, platform, application software, maintenance). You just use the software.`,
    examples: [
      {
        model: "IaaS (Infrastructure as a Service)",
        description: "You get raw compute, storage, and networking. Like leasing land to build your own house.",
        managedByCustomer: ["Applications", "Data", "Runtime", "Middleware", "Operating System"],
        managedByProvider: ["Virtualization", "Servers", "Storage", "Networking"],
        examples: ["Amazon Web Services (AWS EC2, S3)", "Microsoft Azure (Virtual Machines, Blob Storage)", "Google Cloud Platform (Compute Engine, Cloud Storage)", "DigitalOcean Droplets"]
      },
      {
        model: "PaaS (Platform as a Service)",
        description: "You get a platform to build and deploy applications, without managing the underlying infrastructure. Like renting a pre-built house frame and foundation where you can customize the interior.",
        managedByCustomer: ["Applications", "Data"],
        managedByProvider: ["Runtime", "Middleware", "Operating System", "Virtualization", "Servers", "Storage", "Networking"],
        examples: ["AWS Elastic Beanstalk", "Heroku", "Google App Engine", "Azure App Service", "OpenShift"]
      },
      {
        model: "SaaS (Software as a Service)",
        description: "You get ready-to-use software. Like renting a fully furnished and maintained apartment.",
        managedByCustomer: [],
        managedByProvider: ["Applications", "Data", "Runtime", "Middleware", "Operating System", "Virtualization", "Servers", "Storage", "Networking"],
        examples: ["Google Workspace (Gmail, Google Drive)", "Microsoft 365 (Outlook, OneDrive)", "Salesforce", "Dropbox", "Zoom"]
      }
    ],
    keyDifferences: [
      "Level of Abstraction: IaaS offers the most control over infrastructure, while SaaS offers the least (but most convenience).",
      "Management Responsibility: The customer's management responsibility decreases from IaaS to PaaS to SaaS.",
      "Flexibility vs. Ease of Use: IaaS provides maximum flexibility, while SaaS is easiest to use out-of-the-box."
    ],
    relevantRustikComponents: [
      "Rust App Nodes (Deployment Model: Self-managed on IaaS VMs/containers, or deployed to PaaS)",
      "Load Balancer(s) (Self-managed on IaaS, or provider-managed PaaS LBs)",
      "Database Strategies (Self-hosted on IaaS, or managed DB services which are PaaS)",
      "Deployment & CI/CD (Workflow differs based on IaaS/PaaS target)",
      "Autoscaling & Resilience Patterns (Provider-managed features in PaaS vs. self-configured in IaaS)"
    ],
    rustikRelevanceNote: "Understanding IaaS, PaaS, and SaaS is fundamental because your choice of cloud service model significantly impacts how you'd implement, deploy, and manage many of Rustik's architectural components. For instance, 'Rust App Nodes (Containerized)' can be deployed on IaaS (e.g., running Kubernetes on your own VMs) or on a PaaS (e.g., Google Kubernetes Engine, AWS ECS/EKS). Similarly, 'Database Strategies' might involve self-hosting a database on IaaS or using a managed PaaS database service. This choice affects operational overhead, scalability control, cost, and development speed.",
    discussionPoints: [
      "Define IaaS, PaaS, SaaS and give examples of each.",
      "Explain the shared responsibility model for each (who manages what).",
      "What are the pros and cons of each model?",
      "When would you choose IaaS over PaaS, or PaaS over SaaS?",
      "How do these models impact development speed, operational overhead, and cost?",
      "Discuss vendor lock-in concerns with each model.",
      "How does scalability differ across these models?",
      "Can a company use a mix of these models? (Hybrid cloud, multi-cloud)"
    ]
  },
  {
    id: "future-online-payments",
    title: "The Future of Online Payments: Trends & Architectural Implications",
    icon: Landmark,
    explanation: "The online payment landscape is rapidly evolving beyond traditional card processing. Understanding future trends is key for designing robust and adaptable payment systems.",
    keyTrends: [
      "Cryptocurrencies & Blockchain: For decentralized, peer-to-peer transactions, and smart contracts.",
      "Central Bank Digital Currencies (CBDCs): Government-backed digital currencies aiming for efficiency and stability.",
      "Real-Time Payments (RTP): Instantaneous fund transfers, 24/7.",
      "Buy Now, Pay Later (BNPL): Offering consumers installment payment options at checkout.",
      "Embedded Finance: Integrating payment functionalities seamlessly into non-financial platforms (e.g., ride-sharing apps, social media).",
      "AI in Fraud Detection & Personalization: Advanced algorithms for real-time fraud prevention and personalized payment experiences.",
      "Biometric Authentication: Using fingerprints, facial recognition for enhanced security.",
    ],
    architecturalConsiderations: [
      "Scalability & Performance: 'Rust App Nodes' and 'Async IO + Epoll + Tokio' for high transaction volumes. 'Load Balancers' for distribution.",
      "Security: 'Security Architecture Principles' are paramount. 'API Gateway' for secure API exposure.",
      "Modularity & Extensibility: 'Microservices Architecture' to easily integrate new payment methods.",
      "Data Management: 'Database Strategies' for robust transaction logs. 'Observability & Ops' for monitoring.",
      "Interoperability: 'API Design Styles & Protocols' for communication with diverse payment networks.",
      "Resilience: 'Autoscaling & Resilience Patterns' for high availability."
    ],
    relevantRustikComponents: ["API Design Styles & Protocols", "Microservices Architecture", "Security Architecture Principles", "Database Strategies", "Async IO + Epoll + Tokio", "Observability & Ops", "Autoscaling & Resilience Patterns"],
    rustikRelevanceNote: `Building systems for the future of payments requires leveraging several Rustik architectural concepts to address the demands of new technologies like crypto, CBDCs, and RTP, while ensuring security, scalability, and interoperability. For example, the high throughput and low latency needed for RTP can be supported by 'Rust App Nodes' using 'Async IO', while 'Microservices Architecture' allows for flexible integration of new payment methods.`,
    discussionPoints: [
      "The impact of evolving regulations on new payment technologies (e.g., crypto, CBDCs).",
      "Security and privacy challenges associated with digital currencies and real-time payment data.",
      "Scalability requirements to support global, instantaneous payment networks.",
      "The role of AI/ML in real-time fraud prevention, credit scoring for BNPL, and personalized financial offerings.",
      "Interoperability challenges between traditional financial systems and new digital payment rails.",
      "Factors driving user adoption and trust in emerging payment methods.",
      "Data sovereignty and cross-border payment complexities."
    ]
  },
  {
    id: "sso",
    title: "What is SSO (Single Sign-On)?",
    icon: KeyRound,
    explanation: "Single Sign-On (SSO) is an authentication scheme that allows a user to log in with a single set of credentials to multiple independent software systems or applications. Its primary goal is to simplify user access and improve security by centralizing authentication.",
    howItWorks: `Simplified Flow:
1.  **User Accesses Service Provider (SP)**: The user tries to access an application (the SP).
2.  **SP Redirects to Identity Provider (IdP)**: If the user isn't logged in, the SP redirects the user's browser to a central Identity Provider (IdP).
3.  **User Authenticates with IdP**: The user enters their credentials (e.g., username/password, MFA) at the IdP.
4.  **IdP Issues Assertion/Token**: If authentication is successful, the IdP creates a secure token or assertion (e.g., a SAML assertion or an OIDC ID token) containing information about the user's identity and authentication status.
5.  **IdP Redirects Back to SP**: The IdP sends the user's browser back to the SP, along with the token/assertion.
6.  **SP Validates Token & Grants Access**: The SP validates the token/assertion (often by checking its signature against the IdP's public key). If valid, the SP creates a local session for the user and grants access.
Common Protocols: SAML 2.0, OAuth 2.0 (often with OpenID Connect - OIDC layer for identity).`,
    benefits: [
      "Improved User Experience: Users only need to remember one set of credentials and log in once to access multiple applications.",
      "Enhanced Security: Centralizes authentication, making it easier to enforce strong password policies, multi-factor authentication (MFA), and monitor login activity. Reduces password fatigue.",
      "Simplified Administration: Central user account management. Easier to provision/deprovision user access across multiple applications.",
      "Reduced Helpdesk Calls: Fewer password reset requests."
    ],
    challenges: [
      "IdP as a Single Point of Failure: If the IdP is unavailable, users may not be able to log in to any integrated applications.",
      "IdP as a High-Value Target: A compromised IdP can grant attackers access to multiple systems.",
      "Complexity of Setup: Integrating applications with an SSO system can be complex.",
      "Reliance on IdP Security: The security of all connected applications heavily depends on the security of the IdP.",
      "Session Management: Ensuring secure logout across all applications (single log-out) can be tricky."
    ],
    relevantRustikComponents: ["Security Architecture Principles", "API Gateway", "Microservices Architecture"],
    rustikRelevanceNote: `Understanding SSO is vital. 'Security Architecture Principles' include robust IAM, where SSO is a core pattern. An 'API Gateway' often acts as the enforcement point, integrating with an IdP. In a 'Microservices Architecture', SSO provides consistent authentication across services, typically via the gateway or a dedicated auth service. 'Rust App Nodes' would either be configured as SPs or be protected by a gateway handling SSO.`,
    discussionPoints: [
      "Key differences between SAML, OAuth 2.0, and OpenID Connect (OIDC) in the context of SSO.",
      "IdP-initiated vs. SP-initiated SSO flows.",
      "Security implications and best practices for implementing or integrating with SSO.",
      "Common SSO providers (e.g., Okta, Auth0, Azure AD, Keycloak).",
      "How does MFA fit into an SSO strategy?",
      "Session management challenges in SSO (e.g., single log-out).",
      "Just-In-Time (JIT) provisioning of user accounts in SPs based on IdP assertions."
    ]
  },
  {
    id: "password-storage",
    title: "How to Store Passwords Safely in a Database?",
    icon: ShieldCheck,
    explanation: "Storing passwords directly in plaintext in a database is a severe security vulnerability. If the database is compromised, all user passwords become exposed. The standard best practice is to store password hashes, not the passwords themselves.",
    keyConcepts: [
      "**Hashing**: A one-way cryptographic function that transforms input data (password) into a fixed-size string of characters (the hash). It's computationally infeasible to reverse the hash to get the original password.",
      "**Strong Hashing Algorithms**: Use modern, robust algorithms designed for password hashing, such as Argon2 (current recommendation), scrypt, bcrypt, or PBKDF2. Avoid outdated algorithms like MD5 or SHA-1.",
      "**Salting**: A unique, randomly generated string (the salt) is added to each user's password *before* hashing. This salt is then stored alongside the hashed password. Salting prevents attackers from using pre-computed rainbow tables for common passwords.",
      "**Iterative Hashing (Work Factor / Cost Factor)**: The hashing algorithm should be run multiple times (iterations) or configured with a work/cost factor to make it computationally expensive and slow. This significantly hinders brute-force and dictionary attacks.",
      "**Peppering (Optional)**: A system-wide secret (the pepper) can be added to the password (or hash) before final storage. The pepper is not stored with user data but kept secure in application configuration or a secret manager."
    ],
    verificationProcess: `During login:
1.  User submits their password.
2.  Retrieve the user's stored salt from the database.
3.  Combine the submitted password with the retrieved salt.
4.  Hash the combined password+salt using the same hashing algorithm and work factor as when the password was originally stored.
5.  Compare the newly generated hash with the hash stored in the database.
6.  If they match, the password is correct. If not, it's incorrect.`,
    whyNotEncryption: "Encryption is a two-way process; encrypted data can be decrypted back to its original form using the correct key. If an attacker gains access to the encryption key, they can decrypt all passwords. Hashing is one-way, making it impossible to recover the original password from the hash, which is much safer for password storage.",
    relevantRustikComponents: ["Security Architecture Principles", "Database Strategies"],
    rustikRelevanceNote: "Secure password storage is a fundamental aspect of 'Security Architecture Principles'. Any system built with Rustik components that handles user accounts (e.g., within a 'Microservices Architecture' or on 'Rust App Nodes') must implement these best practices. The chosen 'Database Strategies' will store these hashed passwords and salts.",
    discussionPoints: [
      "Which hashing algorithms are currently considered secure and why?",
      "How should salts be generated and stored?",
      "How to determine and update the work factor/cost factor for hashing over time?",
      "The role of password policies (complexity, length, expiry) in conjunction with secure storage.",
      "Why is Multi-Factor Authentication (MFA) still important even with secure password storage?",
      "Pros and cons of using a pepper.",
      "How to handle password resets securely.",
      "Defenses against credential stuffing and password spraying attacks."
    ]
  },
  {
    id: "httpsso-how-it-works",
    title: "How does HTTPS work?",
    icon: Lock,
    explanation: "HTTPS (Hypertext Transfer Protocol Secure) is the secure version of HTTP. It means all communications between your browser and the website are encrypted. HTTPS protects the privacy and integrity of exchanged data.",
    purpose: `The primary goals of HTTPS are:
  - **Encryption**: To ensure that the data exchanged between the client and the server is unreadable to anyone who might intercept it (confidentiality).
  - **Authentication**: To verify that the client is communicating with the legitimate server it intends to connect to (preventing impersonation).
  - **Integrity**: To ensure that the data has not been tampered with during transit.`,
    keyStepsInHandshake: `The security is provided by SSL/TLS (Secure Sockets Layer/Transport Layer Security) protocols. Simplified TLS handshake:
  1.  **Client Hello**: Client sends supported TLS versions, cipher suites, and a "client random" string.
  2.  **Server Hello**: Server responds with chosen TLS version, cipher suite, its digital certificate (containing its public key, signed by a trusted Certificate Authority - CA), and a "server random" string.
  3.  **Client Verification & Key Exchange**: Client verifies server's certificate. Generates a "pre-master secret", encrypts it with the server's public key, and sends it to the server.
  4.  **Server Decryption & Session Key Generation**: Server uses its private key to decrypt the pre-master secret. Both client and server now independently generate the same symmetric "session keys" using the client random, server random, and pre-master secret.
  5.  **Secure Communication Established**: Client and server send "Finished" messages, encrypted with the session key. All subsequent HTTP data is encrypted using these session keys.`,
    relevantRustikComponents: ["Security Architecture Principles", "API Gateway", "Load Balancer(s)", "Rust App Nodes"],
    rustikRelevanceNote: "HTTPS is fundamental to 'Security Architecture Principles'. 'API Gateway' and 'Load Balancers' (especially Layer-7) often handle TLS termination, managing certificates and offloading encryption from backend 'Rust App Nodes'. Any Rustik component involved in web communication should enforce or operate behind HTTPS.",
    discussionPoints: [
      "Difference between HTTP and HTTPS.",
      "Role of SSL/TLS.",
      "Digital certificates and Certificate Authorities (CAs). How certificate validation works.",
      "Main steps of the TLS handshake.",
      "Symmetric vs. Asymmetric encryption and their roles in HTTPS.",
      "What are cipher suites?",
      "Performance implications of HTTPS (generally minimal with modern hardware).",
      "How HTTPS helps prevent Man-in-the-Middle (MITM) attacks.",
      "HTTP Strict Transport Security (HSTS).",
      "TLS versions (e.g., TLS 1.2, TLS 1.3) and their improvements."
    ]
  },
  {
    id: "how-to-learn-design-patterns",
    title: "How to Learn Design Patterns (e.g., GoF, Architectural Patterns)?",
    icon: GraduationCap,
    explanation: `Design patterns are general, reusable solutions to commonly occurring problems within a given context. It's crucial to distinguish between:
- **Software Design Patterns (e.g., Gang of Four - GoF)**: These address specific problems in the design of software at the class and object level (e.g., Factory, Singleton, Observer).
- **Architectural Patterns**: These are higher-level patterns that describe fundamental structural organization schemas for software systems (e.g., Microservices, Event-Driven Architecture).`,
    learningStrategies: [
      "**Books & Resources**: Start with foundational texts like 'Design Patterns: Elements of Reusable Object-Oriented Software' (GoF). Explore resources on cloud patterns, microservices for architectural patterns.",
      "**Understand the Problem First**: Focus on the problem each pattern solves and its context.",
      "**Practical Application**: Implement simple examples in a programming language you know.",
      "**Study Real Code**: Look for patterns in open-source projects or production codebases.",
      "**Relate to Your Experience**: Think about past problems and if a pattern could have helped.",
      "**Discuss and Teach**: Explaining patterns solidifies your understanding.",
      "**Start Simple**: Begin with common patterns before tackling complex ones.",
      "**Context is Key**: Patterns are not silver bullets; consider trade-offs and avoid over-engineering."
    ],
    relevantRustikComponents: ["Application Design Principles for Scale", "Microservices Architecture", "API Design Styles & Protocols", "All other architectural components"],
    rustikRelevanceNote: `Rustik is excellent for learning about **architectural patterns** (e.g., 'Microservices Architecture,' 'Load Balancers'). The 'Application Design Principles for Scale' component in Rustik also highlights the importance of using **software design patterns** (like GoF) for the internal logic of services. The System Design Interview Prep page further shows how these patterns combine. Effective system design requires a grasp of both.`,
    discussionPoints: [
      "Difference between architectural and software design patterns?",
      "Describe a software design pattern you've used. What problem did it solve?",
      "Describe an architectural pattern and its trade-offs.",
      "When might applying a design pattern be a bad idea (over-engineering)?",
      "How do design patterns contribute to code quality (maintainability, reusability)?",
      "Helpful resources for learning design patterns?",
      "How do you decide which pattern to apply?"
    ]
  },
  {
    id: "db-guide",
    title: "Choosing the Right Database: A Conceptual Guide",
    icon: DatabaseIcon, // Changed from DatabaseSearch
    explanation: "Selecting the appropriate database is a critical architectural decision. Different database types are optimized for different data models, query patterns, and scalability requirements. This guide provides a high-level overview.",
    decisionFactors: [
      "**Data Model**: How is your data structured (relational, document, key-value, graph, time-series)?",
      "**Consistency Needs (CAP Theorem)**: Do you need strong consistency (all reads see the latest write) or is eventual consistency acceptable?",
      "**Scalability Requirements**: Will your data grow significantly? Do you need to scale reads, writes, or both? Horizontal vs. Vertical scaling.",
      "**Query Patterns**: How will you query the data? Simple key lookups, complex joins, analytical queries, graph traversals, full-text search?",
      "**Latency Requirements**: How fast do operations need to be?",
      "**Durability & Availability**: How critical is data loss prevention? What level of uptime is required?",
      "**Development & Operational Complexity**: Team familiarity, ease of use, managed vs. self-hosted.",
      "**Cost**: Licensing, infrastructure, operational overhead."
    ],
    databaseTypeGuidance: [
      {
        category: "Relational (SQL) Databases",
        description: "Store data in tables with predefined schemas, rows, and columns. Excel at enforcing relationships and ensuring strong consistency (ACID).",
        considerations: ["Complex transactions and relationships", "Data integrity is paramount", "Structured data", "Well-understood query language (SQL)"],
        rustikLink: "Relational (SQL) Databases",
        examples: "PostgreSQL, MySQL, SQL Server, Oracle"
      },
      {
        category: "Document Databases (NoSQL)",
        description: "Store data in flexible, JSON-like documents (e.g., BSON). Schemas are dynamic and can vary per document.",
        considerations: ["Flexible or evolving schema", "Semi-structured or hierarchical data", "Rapid development", "Horizontal scalability for reads/writes"],
        rustikLink: "Document Databases (NoSQL)",
        examples: "MongoDB, Firestore, Couchbase, ArangoDB"
      },
      {
        category: "Key-Value Stores (NoSQL)",
        description: "Store data as simple key-value pairs. Optimized for extremely fast reads and writes based on a unique key.",
        considerations: ["Simple lookups by key", "Caching frequently accessed data", "Session management", "High throughput, low latency access"],
        rustikLink: "Key-Value Stores (NoSQL)",
        examples: "Redis, Memcached, Amazon DynamoDB (in KV mode), RocksDB"
      },
      {
        category: "Wide-Column Stores (NoSQL)",
        description: "Store data in tables, rows, and dynamic columns. Optimized for querying large datasets by column families.",
        considerations: ["Very high write throughput", "Massive datasets (Big Data)", "Queries on specific columns over many rows", "Time-series data (sometimes)"],
        rustikLink: "Wide-Column Stores (NoSQL)",
        examples: "Apache Cassandra, HBase, ScyllaDB"
      },
      {
        category: "Graph Databases (NoSQL)",
        description: "Store data as nodes and relationships (edges). Optimized for traversing and querying complex relationships.",
        considerations: ["Highly interconnected data", "Social networks", "Recommendation engines", "Fraud detection", "Knowledge graphs"],
        rustikLink: "Graph Databases (NoSQL)",
        examples: "Neo4j, Amazon Neptune, JanusGraph"
      },
      {
        category: "Time-Series Databases (NoSQL)",
        description: "Optimized for handling time-stamped or time-series data, like metrics, sensor data, or events.",
        considerations: ["Monitoring and IoT data", "Financial trading data", "Real-time analytics on events over time", "High ingest rates of time-ordered data"],
        rustikLink: "Time-Series Databases (NoSQL)",
        examples: "InfluxDB, Prometheus (metrics backend), TimescaleDB"
      },
    ],
    relevantRustikComponents: ["Database Strategies"],
    rustikRelevanceNote: "This guide helps you contextualize the various options available under Rustik's 'Database Strategies' component. When you select a type like 'Relational (SQL) Databases' or 'Key-Value Stores (NoSQL)' in Rustik, this framework helps you understand the 'why' behind that choice based on common decision factors and use cases.",
    discussionPoints: [
      "Explain the CAP Theorem and its implications for database choice.",
      "When would you choose a relational database over a NoSQL database, and vice-versa?",
      "Discuss different consistency models (strong, eventual, causal).",
      "How do various databases handle scalability (read scaling, write scaling, sharding)?",
      "Trade-offs between managed database services (PaaS) vs. self-hosting (IaaS).",
      "Specific features of certain databases that make them suitable for particular tasks (e.g., Redis for caching, Elasticsearch for search, Neo4j for graphs).",
      "Polyglot persistence: using multiple database types in one system."
    ]
  },
  {
    id: "twitter-how-it-works",
    title: "How does Twitter (X) work? (High-Level Overview)",
    icon: Bird,
    explanation: "Twitter (X) is a real-time, public microblogging and social networking service where users post and interact with short messages known as 'tweets'. It's characterized by its fast-paced information flow and broad reach.",
    keyCoreFunctionalities: [
      "**Tweet Posting (Ingestion)**: Users can post short text messages, optionally with media (images, videos). These tweets are ingested and processed.",
      "**Timeline Generation**: Users see a 'Home Timeline' (tweets from people they follow, plus recommendations) and can view specific 'User Timelines' (tweets from a particular user). This involves a complex 'fan-out' mechanism to distribute tweets to followers' timelines.",
      "**Social Graph**: Users can follow and be followed by others, forming a social network. This graph is crucial for timeline generation.",
      "**Search & Discovery**: Users can search for tweets, users, and topics. Trending topics are also highlighted.",
      "**Media Handling**: Storage, processing (e.g., transcoding), and delivery of images and videos attached to tweets.",
      "**Notifications**: Real-time alerts for mentions, likes, retweets, new followers, etc."
    ],
    keyArchitecturalChallenges: [
      "**Massive Scale**: Handling millions of active users, billions of tweets, and extremely high read (timeline views) and write (tweet posts) loads.",
      "**Real-Time Delivery**: Tweets need to appear in followers' timelines very quickly.",
      "**Feed Aggregation & Ranking**: Efficiently collecting tweets from potentially thousands of followed users and ranking them (chronologically or algorithmically) for each user's home timeline.",
      "**Data Storage**: Diverse data types (tweets, user profiles, social graph, media, analytics) require different storage solutions optimized for specific access patterns.",
      "**High Availability & Fault Tolerance**: The service needs to be highly resilient to failures.",
      "**Dealing with the 'Celebrity Problem'**: Efficiently fanning out tweets from users with millions of followers to all their followers' timelines."
    ],
    relevantRustikComponents: [
      "Microservices Architecture",
      "Database Strategies (e.g., NoSQL like Cassandra/Manhattan for tweets; Graph DB for social graph; In-memory/KV store like Redis for timelines)",
      "Caching Strategies (Timelines, user profiles, hot tweets, media metadata)",
      "Shared State & Data Plane (Message Queues like Kafka for tweet processing and fan-out)",
      "API Design Styles & Protocols (For client communication and internal services)",
      "Observability & Ops",
      "Network Infrastructure Strategies (CDNs for media)"
    ],
    rustikRelevanceNote: "Rustik's architectural components provide the conceptual building blocks for a system like Twitter. 'Microservices Architecture' allows breaking down the platform into manageable services (tweets, users, timelines, search). Various 'Database Strategies' are employed. 'Caching Strategies' are vital. 'Shared State & Data Plane' (using message queues) is crucial for asynchronous tweet processing and fan-out. While Rustik outlines these, the specific choice of database technologies and extreme scale handling involve deep engineering.",
    discussionPoints: [
      "Fan-out on write vs. fan-out on read strategies for timeline generation.",
      "Database choices for tweets, user data, social graph, and timelines. Pros and cons.",
      "Caching strategies: What to cache, where, and for how long?",
      "How to ensure real-time delivery of tweets?",
      "Architecture of the search and trending topics features.",
      "Handling media uploads, storage, and delivery (CDNs).",
      "Rate limiting and preventing abuse (spam, bots).",
      "Consistency models (e.g., eventual consistency for timelines).",
      "Key metrics to monitor for a system like Twitter."
    ]
  },
  {
    id: "process-vs-thread",
    title: "What is the difference between Process and Thread?",
    icon: Cpu,
    explanation: `A **Process** is an instance of a computer program that is being executed. It contains the program code and its current activity. Each process has its own independent memory space (address space), system resources (like file handles), and execution state.

A **Thread** is the smallest unit of execution within a process. A process can have multiple threads, all sharing the same memory space and resources of the parent process. Threads allow a process to perform multiple tasks concurrently.`,
    keyDifferencesTable: {
      header: ["Feature", "Process", "Thread"],
      rows: [
        ["Memory Space", "Independent, isolated memory space for each process.", "Shares the memory space of its parent process with other threads."],
        ["Creation Overhead", "Relatively high (requires OS to allocate new memory space, resources).", "Relatively low (lighter weight, shares existing process resources)."],
        ["Communication", "Inter-Process Communication (IPC) is more complex (e.g., pipes, sockets, shared memory segments managed by OS).", "Inter-thread communication is simpler (can use shared variables), but requires careful synchronization (e.g., mutexes, semaphores) to avoid race conditions."],
        ["Fault Isolation", "A crash in one process generally does not affect other processes.", "If one thread crashes, it can bring down the entire process (all threads within it)."],
        ["Resource Usage", "Consumes more system resources (memory, OS structures) per instance.", "Consumes fewer resources per instance as they share process resources."],
        ["Context Switching", "Context switching between processes is generally slower.", "Context switching between threads of the same process is generally faster."]
      ]
    },
    relevantRustikComponents: [
      "Rust App Nodes",
      "Async IO + Epoll + Tokio",
      "Per-core Socket Accept + Sharding",
      "Microservices Architecture"
    ],
    rustikRelevanceNote: `Understanding process and thread models is fundamental for designing efficient Rust applications.
- **Rust App Nodes**: A Rust application node runs as a process. Within this process, especially when using libraries like Tokio for asynchronous programming, multiple threads (or a thread pool managed by Tokio) are used to handle concurrent operations efficiently.
- **Async IO + Epoll + Tokio**: Tokio's runtime leverages a multi-threaded scheduler to execute asynchronous tasks.
- **Per-core Socket Accept + Sharding**: This pattern can be implemented using multiple processes or a single process with multiple threads.
- **Microservices Architecture**: Each microservice is typically deployed as an independent OS process.`,
    discussionPoints: [
      "Advantages and disadvantages of multi-processing versus multi-threading.",
      "What is context switching, and how does its overhead compare?",
      "Define concurrency and parallelism. How do processes/threads relate?",
      "What are race conditions and deadlocks in multi-threaded environments? How can they be prevented?",
      "Common use cases for multi-processing and multi-threading.",
      "How do operating systems manage and schedule processes and threads?",
      "User-level threads vs. kernel-level threads."
    ]
  },
  {
    id: "google-docs-design",
    title: "Design Google Docs (A Real-time Collaborative Editor)",
    icon: FilePen,
    problemStatement: "Design a system that allows multiple users to edit a document concurrently in real-time, with changes visible to all collaborators almost instantly. The system should support rich text formatting, version history, and sharing capabilities.",
    requirements: [
      "Functional Requirements:",
      "  - Real-time collaborative editing by multiple users.",
      "  - Rich text formatting (bold, italics, lists, headings, etc.).",
      "  - Document saving and loading.",
      "  - Version history and ability to restore previous versions.",
      "  - Sharing documents with other users with different permission levels (view, comment, edit).",
      "  - (Optional) Real-time cursors and selection highlighting for collaborators.",
      "  - (Optional) Commenting functionality.",
      "Non-Functional Requirements:",
      "  - Low Latency: Edits should appear for other collaborators almost instantaneously.",
      "  - High Availability: The service must be reliably available.",
      "  - Scalability: Support a large number of concurrent users per document and a large number of documents.",
      "  - Data Consistency: All users must see a consistent view of the document, even with concurrent edits (eventual consistency might be acceptable for short periods, but strong consistency is desired for conflict resolution).",
      "  - Durability: Documents and their history must be durably stored and not lost."
    ],
    relevantRustikComponents: [
      "Microservices Architecture (e.g., Document Service, Collaboration/Sync Service, User Service, Storage Service)",
      "API Design Styles & Protocols (WebSockets for real-time collaboration; REST/GraphQL for document management, sharing, user auth)",
      "Database Strategies (NoSQL like Document DBs for flexible document content and operational logs; Relational DBs for user accounts, permissions, document metadata)",
      "Async IO + Epoll + Tokio (Essential for the real-time collaboration server managing many persistent WebSocket connections)",
      "Caching Strategies (For frequently accessed documents, user session data, or operational transformation states)",
      "Autoscaling & Resilience Patterns (For collaboration servers and backend services)"
    ],
    rustikRelevanceNote: "Rustik's components (like 'Microservices Architecture', 'API Design Styles', 'Database Strategies', 'Async IO') provide the foundational scalable backend infrastructure. The core challenge in designing a Google Docs-like system lies in the real-time synchronization algorithms (e.g., Operational Transformation (OT) or Conflict-free Replicated Data Types (CRDTs)) and managing concurrent user edit sessions. These specialized algorithms are built *on top of* the architectural components Rustik helps conceptualize.",
    conceptualSolutionOutline: `
1.  **Client-Side Architecture:**
    *   Local Document Model: Represents the document structure and content in the browser.
    *   Operation Generation: User actions (typing, formatting) are translated into 'operations' (e.g., insert character 'A' at position 5; apply bold from position 10 to 15).
    *   Sends operations to the server via WebSockets.
    *   Receives operations from other clients (broadcast by the server) and applies them to its local document model, potentially transforming them based on local unacknowledged operations (if using OT).

2.  **Server-Side Architecture (Collaboration Engine):**
    *   **WebSocket Manager**: Manages persistent WebSocket connections from all active clients for a document.
    *   **Operation Handler/Transformation Engine**:
        *   Receives operations from clients.
        *   Implements a concurrency control algorithm:
            *   **Operational Transformation (OT)**: Transforms incoming operations against previously acknowledged operations to ensure all clients converge to the same state despite concurrent edits. Requires a central server or a well-defined order of operations.
            *   **Conflict-free Replicated Data Types (CRDTs)**: Data structures designed to inherently resolve conflicts and merge concurrently, often leading to simpler server logic but potentially more complex client-side data structures.
        *   Validates and sequences operations.
    *   **Broadcaster**: Sends validated/transformed operations to all other connected clients for that specific document.
    *   **Document Persistence Service**:
        *   Periodically snapshots the document state or stores a log of operations to a durable database (e.g., NoSQL for document structure, potentially a separate log store for operations).
        *   Handles loading documents and their version history.

3.  **Supporting Services (Microservices):**
    *   **User Service**: Manages user authentication, profiles.
    *   **Document Metadata Service**: Manages document names, ownership, sharing permissions (likely in a Relational DB).
    *   **Storage Service**: Interacts with blob storage for images or other large media embedded in documents.
`,
    discussionPoints: [
      "Deep dive into Operational Transformation (OT) vs. Conflict-free Replicated Data Types (CRDTs): pros, cons, complexity.",
      "How to handle concurrent edits and ensure eventual consistency (or strong consistency for critical operations).",
      "Data model for representing the document and the operations.",
      "Scalability of the real-time collaboration engine (e.g., how to handle thousands of concurrent editors on a single document, or millions of documents). Sharding strategies for collaboration servers.",
      "Persistence strategy: Storing snapshots vs. an operation log. Implications for version history and storage costs.",
      "Presence features: Real-time cursors, list of active collaborators.",
      "Undo/redo functionality in a collaborative environment.",
      "Security and access control: Who can edit, view, comment? How are permissions enforced?",
      "Offline editing support and subsequent synchronization.",
      "Handling network latency and disconnections gracefully."
    ]
  },
];


const systemDesignQuestions: InterviewQuestion[] = [
  {
    id: "url-shortener",
    title: "Design a URL Shortener (e.g., TinyURL, bit.ly)",
    icon: LinkIcon,
    problemStatement: "Design a highly scalable service that takes a long URL and generates a unique, significantly shorter alias. When users access the short alias, they should be redirected to the original long URL with minimal latency. The service should also track basic click analytics for each short URL.",
    requirements: [
      "Functional Requirements:",
      "  - Shorten a given long URL to a unique short URL.",
      "  - Redirect a short URL to its original long URL.",
      "  - Track the number of clicks for each short URL.",
      "  - Allow users to optionally suggest a custom short URL (if available).",
      "Non-Functional Requirements:",
      "  - High Availability: The service must be operational virtually all the time.",
      "  - Low Latency: Redirections must be extremely fast (e.g., < 50-100ms).",
      "  - Scalability: Handle millions of URL shortenings and billions of redirections per month.",
      "  - Durability: Shortened URLs should persist indefinitely (or until explicitly deleted).",
      "  - Uniqueness: Short URLs must be unique.",
      "  - Predictability (optional but good): Short URLs should ideally not be easily guessable sequentially."
    ],
    relevantRustikComponents: [
      "API Design Styles & Protocols (REST API for shortening/stats; lightweight redirector not needing full API stack)",
      "Load Balancer(s) (Layer-7 for API, potentially Layer-4 for high-volume redirection)",
      "Rust App Nodes (For API logic, short code generation, redirection handling)",
      "Database Strategies (Highly scalable Key-Value store like Redis/DynamoDB for [short_code -> long_URL]; Relational DB for user accounts/custom URLs & analytics aggregation)",
      "Caching Strategies (Aggressively cache popular short_code -> long_URL mappings at CDN, edge, in-memory on redirectors)",
      "Observability & Ops (Metrics for request rates, redirection latency, error rates, click counts)",
      "Async IO + Epoll + Tokio (Crucial for redirector nodes to handle massive concurrent connections)"
    ],
    conceptualSolutionOutline: `
1.  **Shortening Process:**
    *   User submits long URL via REST API (\`POST /shorten\`).
    *   App Node generates a unique short code (e.g., 6-8 alphanumeric chars via Base62 encoding of a distributed counter, or hashing).
    *   Store \`{short_code: long_URL}\` mapping in a Key-Value DB (e.g., Redis, DynamoDB).
    *   Optionally handle custom aliases, check availability.
    *   Return short URL (e.g., \`https://your.domain/short_code\`).

2.  **Redirection Process:**
    *   User accesses \`https://your.domain/short_code\`.
    *   Request hits Load Balancers, routed to redirector services (optimized Rust App Nodes).
    *   Redirector checks in-memory cache (LRU) -> distributed cache (Redis) -> primary Key-Value DB for \`long_URL\`.
    *   Issues HTTP 301 (Permanent) or 302 (Temporary) redirect.
    *   Cache \`long_URL\` at various levels.

3.  **Analytics Tracking:**
    *   Asynchronously log click events (e.g., \`short_code\`, \`timestamp\`) for each redirection to a message queue (e.g., Kafka, SQS).
    *   Separate analytics service consumes events, aggregates counts, stores in a data warehouse or relational DB.
    *   API endpoint (\`GET /stats/{short_code}\`) provides click counts.
`,
    discussionPoints: [
      "Algorithm for unique short code generation: collisions, predictability, length.",
      "Database choice for URL mappings: Scalability (Key-Value store).",
      "Minimizing redirection latency: Caching strategies, lightweight redirector.",
      "Handling custom/vanity URLs: Storage, uniqueness checks.",
      "Rate limiting API requests (shortening, stats).",
      "Analytics processing: Real-time vs. batch. Storage for analytics data.",
      "Database sharding for primary mapping store if extremely large.",
      "URL expiration policy (if any).",
      "Security: Preventing malicious URL submissions, open redirect vulnerabilities.",
      "Handling non-existent short codes (404 error).",
      "CDN integration for caching redirects."
    ]
  },
  {
    id: "news-feed",
    title: "Design a News Feed System (e.g., Facebook, X/Twitter)",
    icon: Newspaper,
    problemStatement: "Design a system that allows users to post updates (text, images, videos) and see a news feed consisting of updates from people they follow, ranked by relevance or recency. Users should also be able to interact with posts (e.g., like, comment).",
    requirements: [
      "Functional Requirements:",
      "  - Users can create posts (text, images, videos).",
      "  - Users can follow/unfollow other users.",
      "  - Generate a personalized news feed for each user displaying posts from followed entities.",
      "  - Feed should be sortable (e.g., by recency, relevance/ranking).",
      "  - Users can like/react to posts.",
      "  - Users can comment on posts.",
      "  - (Optional) Real-time feed updates.",
      "  - (Optional) Media uploads (images, videos).",
      "Non-Functional Requirements:",
      "  - High Availability: Feed must be accessible with minimal downtime.",
      "  - Low Latency: Feed generation should be fast (e.g., <200-500ms).",
      "  - Scalability: Handle millions of active users, billions of posts. High read-to-write ratio for feeds.",
      "  - Durability: User posts and interactions must be durably stored.",
      "  - Eventual Consistency: Acceptable for feed updates; strong consistency for follow actions/post creation."
    ],
    relevantRustikComponents: [
      "Microservices Architecture (User Service, Post Service, Follow Service, Feed Generation Service, Media Service, Notification Service, Interaction Service)",
      "API Design Styles & Protocols (REST/GraphQL for client fetches; WebSockets for real-time updates; gRPC for internal service communication)",
      "Database Strategies:",
      "  - User/Follow Data: Relational DB (PostgreSQL) or Graph DB (Neo4j) for profiles and social graph.",
      "  - Posts/Content: NoSQL (Cassandra, DynamoDB) for high write throughput and scalability.",
      "  - Feed/Timeline Data: In-memory Key-Value store (Redis Sorted Sets/Lists) for pre-computed feeds (fan-out on write).",
      "Caching Strategies (Aggressively cache generated feeds, user profiles, hot posts, media metadata. CDNs for static media assets).",
      "Shared State & Data Plane (Message Queues like Kafka/RabbitMQ for async tasks: post processing, fan-out, notifications, like/comment aggregation).",
      "Async IO + Epoll + Tokio (Essential for real-time components like WebSockets and high-concurrency API services).",
      "Observability & Ops (Critical for monitoring health, performance, and interactions of numerous distributed services).",
      "Load Balancer(s) & API Gateway (To manage traffic to various microservices and provide a unified client entry point)."
    ],
    conceptualSolutionOutline: `
Core Idea: Decouple post creation from feed generation. Hybrid push (fan-out-on-write) and pull (fan-out-on-load) models.

1.  **Services (Microservices Architecture):**
    *   **User Service:** Manages user accounts, profiles, auth. (Relational DB or Graph DB)
    *   **Post Service:** Handles post creation, storage (e.g., NoSQL like Cassandra), retrieval. Publishes new post events to Message Queue (e.g., Kafka).
    *   **Follow Service:** Manages user follow relationships. (Graph DB or Relational DB)
    *   **Feed Generation Service (or Worker Pool):**
        *   **Fan-out on Write (Push):** Consumes new post events. For each post, retrieves author's followers. Injects post (or reference) into each follower's feed/timeline (e.g., Redis Sorted Set keyed by user ID). Good for active users.
        *   **Fan-out on Load (Pull):** For less active users or cold starts, service queries Post Service for recent posts from followed users, aggregates, ranks, and returns.
    *   **Media Service:** Handles image/video uploads (to Object Storage like S3), processing (thumbnails, transcoding), and provides CDN URLs.
    *   **Interaction Service:** Handles likes, comments. Updates counts (e.g., in Redis, then flushed to persistent DB). Publishes events for notifications.
    *   **Notification Service:** Generates notifications for likes, comments, new posts.

2.  **Feed Generation & Delivery:**
    *   **Writing a Post:** Client -> API Gateway -> Post Service. Post stored, event published to Kafka.
    *   **Reading Feed:** Client -> API Gateway -> Feed Service (or directly to Redis cache).
        *   If pre-computed (fan-out-on-write): Retrieve user's timeline from Redis.
        *   If on-demand (fan-out-on-load): Aggregate posts from followed users.
    *   **Ranking:** Algorithm (chronological, engagement, ML-personalized) sorts posts. Can happen during pre-computation or on-demand.
    *   **Caching:** User timelines, post content, user profiles heavily cached. CDNs serve media.

3.  **Real-time Updates (Optional):**
    *   WebSocket connections from clients to a Real-time Service. New posts/interactions pushed to update client view.
`,
    discussionPoints: [
      "Fan-out on Write vs. Fan-out on Load: Trade-offs, handling 'celebrity problem' (users with millions of followers), hybrid approaches.",
      "Feed Ranking and Personalization: Algorithms, data needed, real-time vs. batch.",
      "Database Choices: Rationale for different DBs for posts, user data, follow graphs, feed timelines. Scalability of each.",
      "Caching Strategies: What to cache, where (client, CDN, edge, server-side distributed cache), TTLs, cache invalidation.",
      "Media Handling: Upload, storage (Object Storage), processing (transcoding, thumbnails), CDN delivery.",
      "Real-time Updates: WebSockets vs. long polling vs. SSE. Connection management.",
      "Consistency Models: Eventual consistency for feed visibility. Stronger consistency for user actions.",
      "API Design: REST vs. GraphQL. Pagination for feeds. Rate limiting.",
      "Scalability of individual components (post ingestion, feed generation, notifications).",
      "Handling Edits/Deletions: Propagating changes to cached feeds/timelines.",
      "Counter Services: Managing likes/comments/shares counts efficiently.",
      "Monitoring and Observability in a distributed system."
    ]
  },
  {
    id: "ride-sharing",
    title: "Design a Ride-Sharing App (e.g., Uber, Lyft)",
    icon: Car,
    problemStatement: "Design a service that connects riders looking for a trip with available drivers nearby. The system must handle real-time location tracking of drivers, allow riders to request rides, match riders with suitable drivers, estimate ETAs and pricing, facilitate in-app communication, and process payments.",
    requirements: [
      "Functional Requirements:",
      "  - Riders can request rides from their current location to a destination.",
      "  - Drivers can set their availability (online/offline) and accept/reject ride requests.",
      "  - System must match available, nearby drivers to riders.",
      "  - Real-time location tracking of drivers visible to riders (and vice-versa post-match).",
      "  - Display estimated pickup time (ETA) and ride cost before booking.",
      "  - In-app communication between rider and driver (optional).",
      "  - Payment processing for rides and driver payouts.",
      "  - Ride history and rating system (for riders and drivers).",
      "Non-Functional Requirements:",
      "  - High Availability: Service must be reliably available, especially driver location and ride requests.",
      "  - Low Latency: Driver location updates, matching, and ETA calculations must be fast.",
      "  - Scalability: Handle thousands of concurrent drivers and riders in multiple cities.",
      "  - Accuracy: Location tracking and ETAs should be reasonably accurate.",
      "  - Durability: Ride records, user accounts, and payment information must be durably stored."
    ],
    relevantRustikComponents: [
      "Microservices Architecture (e.g., Rider Service, Driver Service, Matching Service, Location Service, Trip Service, Payment Service, Notification Service)",
      "API Design Styles & Protocols (REST/GraphQL for mobile client interactions; WebSockets/gRPC for real-time location updates and notifications)",
      "Database Strategies:",
      "  - User/Driver/Ride Data: Relational DB (PostgreSQL) for structured data like profiles, ride details, payment info.",
      "  - Driver Location/Availability: Geospatial DB/indexes (PostGIS extension for PostgreSQL) or specialized Key-Value stores with geo-capabilities (e.g., Redis Geo Sets) for efficient querying of nearby drivers.",
      "Async IO + Epoll + Tokio & Shared State & Data Plane (Message Queues like Kafka/RabbitMQ for handling concurrent ride requests, location updates, dispatching notifications, and decoupling services like payment processing).",
      "Caching Strategies (Cache driver locations in specific regions, geofences for surge pricing, popular routes).",
      "Service Discovery & Control Plane (For managing and discovering various microservices).",
      "Observability & Ops (Critical for real-time monitoring of driver locations, ride matching success rates, latency, and system health).",
      "Load Balancer(s) & API Gateway (To manage traffic to microservices and client requests)."
    ],
    conceptualSolutionOutline: `
1.  **Services (Microservices Architecture):**
    *   **Rider Service:** Manages rider profiles, ride requests, payment methods.
    *   **Driver Service:** Manages driver profiles, availability status, vehicle details, payouts.
    *   **Location Service:** Ingests and processes real-time location updates from drivers (e.g., via WebSockets or frequent HTTP posts). Stores current locations in a geo-indexed database (e.g., Redis Geo or PostGIS). Provides querying capabilities for nearby drivers.
    *   **Matching Service:** Receives ride requests. Queries Location Service for nearby available drivers. Applies matching algorithms (considering proximity, driver rating, vehicle type, etc.). Notifies selected driver(s).
    *   **Trip Service:** Manages the lifecycle of a ride (requested, accepted, ongoing, completed, canceled). Stores ride history.
    *   **Payment Service:** Integrates with payment gateways to process ride payments and driver payouts.
    *   **Notification Service:** Sends real-time push notifications to riders/drivers (e.g., ride accepted, driver arriving, new ride request).

2.  **Core Flows:**
    *   **Driver Availability & Location Update:** Drivers' apps periodically send location updates and availability status to the Location Service.
    *   **Rider Requests Ride:** Rider app sends pickup/dropoff locations to Rider Service, which forwards to Matching Service.
    *   **Driver Matching:** Matching Service queries Location Service for nearby drivers. Algorithm selects best match(es). Request sent to driver(s) via Notification Service.
    *   **Ride Accepted:** Driver accepts. Trip Service updates ride status. Rider and Driver are connected for location sharing/communication.
    *   **During Ride:** Location Service tracks both. ETAs updated.
    *   **Ride Completion & Payment:** Trip Service marks ride complete. Payment Service processes payment. Ratings collected.

3.  **Data Storage:**
    *   Relational DB for user profiles, ride history, payment transactions.
    *   Geo-indexed DB/cache (Redis Geo, PostGIS) for real-time driver locations and availability.

4.  **Communication:**
    *   Mobile clients (Rider/Driver apps) communicate with backend via API Gateway (REST/GraphQL).
    *   Real-time location updates/notifications use WebSockets or efficient polling.
    *   Internal services communicate via gRPC or asynchronous messages (Kafka).
`,
    discussionPoints: [
      "Driver-rider matching algorithm: Efficiency (e.g., using Quadtrees, Geohashes), fairness, minimizing wait times, handling concurrent requests.",
      "Scalability of location tracking: How to handle thousands of drivers updating locations frequently? Data partitioning for geo-queries.",
      "Database choice for geospatial data: Pros/cons of Redis Geo, PostGIS, Elasticsearch with geo capabilities.",
      "Dynamic pricing (surge pricing): How is it calculated? Geofencing. Communicating to users.",
      "Payment processing integration: Security, reliability, fraud detection.",
      "ETA calculation: Factors involved (traffic, distance, time of day), accuracy.",
      "Ensuring safety and trust: Driver verification, SOS features, ride tracking by trusted contacts.",
      "Communication channels: In-app chat (WebSockets), push notifications.",
      "Handling network partitions or offline scenarios for drivers/riders.",
      "Load balancing strategies for different services (e.g., location updates vs. ride requests).",
      "Concurrency control and consistency for ride state and driver availability."
    ]
  },
  {
    id: "rate-limiter",
    title: "Design a Rate Limiter",
    icon: Gauge,
    problemStatement: "Design a system that can limit the number of requests an entity (e.g., user, IP address, API key) can make to an API or service within a specified time window. This is crucial for preventing abuse, ensuring fair usage, and protecting backend services from overload.",
    requirements: [
      "Functional Requirements:",
      "  - Limit the number of requests per client identifier (IP, user ID, API key) within a defined time window (e.g., 100 requests/minute).",
      "  - Support different rate limits for different APIs, users, or tiers.",
      "  - Accurately track request counts.",
      "  - Reject requests exceeding the limit, typically with an HTTP 429 (Too Many Requests) status code.",
      "Non-Functional Requirements:",
      "  - Low Latency: Checking and updating rate limits should add minimal overhead to requests.",
      "  - High Availability: The rate limiter itself must be highly available.",
      "  - Scalability: Handle a large number of requests and track limits for many clients across a distributed system.",
      "  - Accuracy: The rate limiting should be reasonably accurate.",
      "  - Fault Tolerance: Failure of one rate limiter instance should not cripple the system.",
      "  - Configurability: Easy to configure and update rate limit rules."
    ],
    relevantRustikComponents: [
      "API Gateway (Often the ideal place to enforce rate limits centrally).",
      "Caching Strategies (Distributed in-memory caches like Redis are essential for storing and rapidly incrementing/checking counters).",
      "Rust App Nodes (If building custom rate limiting logic or a dedicated rate limiting service).",
      "Load Balancer(s) (To distribute traffic to rate limiting services if it's a separate component).",
      "Observability & Ops (To monitor rate limit effectiveness, rejections, and performance)."
    ],
    conceptualSolutionOutline: `
1.  **Core Logic (Algorithms):**
    *   **Token Bucket:** Each client has a bucket of tokens that refills at a fixed rate. Each request consumes a token. If no tokens, request is rejected.
    *   **Leaky Bucket:** Requests are added to a queue (bucket). If the queue is full, requests are rejected. Requests leak out of the bucket at a constant rate.
    *   **Fixed Window Counter:** Count requests within a fixed time window (e.g., last minute). Reset count at the end of window. Prone to burst traffic at window edges.
    *   **Sliding Window Log:** Store timestamps of requests in a sorted set/list. Count requests within the current sliding window. More accurate, higher storage/computation.
    *   **Sliding Window Counter:** Hybrid approach. Combines fixed window efficiency with sliding window accuracy using weighted counts from current and previous windows.

2.  **Storage for Counters/State:**
    *   **Distributed Cache (Redis):** Highly suitable due to its speed, atomic increment operations (INCR, INCRBY), and features like sorted sets (for sliding window log) or Lua scripting for complex logic. Keys could be \`rate_limit:{client_id}:{api_endpoint}\`.
    *   **In-memory (with care):** For very localized rate limiting if distribution isn't a concern (rare for scalable systems).

3.  **Implementation Strategy:**
    *   **Middleware:** Implement as middleware in your application framework or API gateway.
    *   **Dedicated Service:** A separate rate limiting microservice that other services query.
    *   **API Gateway Integration:** Many modern API Gateways (e.g., Kong, Apigee, AWS API Gateway) have built-in rate limiting capabilities.

4.  **Enforcement:**
    *   Before processing a request, check the rate limit for the client.
    *   If limit exceeded, return HTTP 429 with headers like \`Retry-After\`, \`X-RateLimit-Limit\`, \`X-RateLimit-Remaining\`, \`X-RateLimit-Reset\`.
    *   If within limits, process the request and update the counter.

5.  **Distributed Systems:**
    *   Counters must be shared and synchronized across all instances handling requests for a client. This is why Redis (or similar) is crucial.
    *   Race conditions can occur; atomic operations are key. Eventual consistency might be acceptable for some less strict scenarios.
`,
    discussionPoints: [
      "Choice of rate limiting algorithm and its trade-offs (accuracy, performance, complexity, memory usage).",
      "Where to implement the rate limiter (client-side, server-side middleware, API Gateway, dedicated service).",
      "Handling distributed systems: ensuring consistent rate limiting across multiple servers/instances. Centralized vs. decentralized approaches.",
      "Granularity of rate limits (per IP, user, API key, global, per endpoint).",
      "What to do when a limit is exceeded (reject, queue, log). Importance of HTTP 429 and informative headers.",
      "Configuration and dynamic updates of rate limit rules without service restarts.",
      "Performance impact of the rate limiter itself. How to keep it low-latency.",
      "Accuracy vs. eventual consistency trade-offs in a distributed environment.",
      "Monitoring and alerting for rate limiting activity (e.g., high rejection rates).",
      "Handling bursty traffic vs. sustained load.",
      "Strategies for different types of clients (e.g., more lenient limits for authenticated users vs. anonymous IPs)."
    ]
  },
  {
    id: "consistent-hashing",
    title: "Design Consistent Hashing",
    icon: Shuffle,
    problemStatement: "Explain the concept of consistent hashing and how it's used to distribute data or requests across a cluster of servers (e.g., for caching, distributed databases, or load balancing). Discuss its advantages over simple modulo hashing, especially when servers are added or removed.",
    requirements: [
      "Key Concepts to Explain:",
      "  - Problem with simple hashing (e.g., `hash(key) % N` servers) when N changes.",
      "  - Concept of a hash ring or circle.",
      "  - Mapping keys and servers to points on the ring.",
      "  - Assigning keys to the next server on the ring.",
      "  - Minimizing remapping of keys when nodes are added/removed.",
      "  - Concept of virtual nodes (replicas) for better load distribution and to handle hotspots."
    ],
    relevantRustikComponents: [
      "Database Strategies (Sharding often uses consistent hashing for key distribution).",
      "Caching Strategies (Distributed caches like Redis Cluster, Memcached use consistent hashing).",
      "Load Balancer(s) (Some advanced LBs might use forms of consistent hashing for session stickiness or backend selection).",
      "Rust App Nodes (If implementing a distributed system where nodes need to manage partitioned data)."
    ],
    conceptualSolutionOutline: `
1.  **Motivation:** Start by explaining the problem with naive hashing (modulo N) – massive key remapping when the number of servers (N) changes.
2.  **The Hash Ring:** Introduce the concept of a fixed-range hash space (e.g., 0 to 2^32 - 1) visualized as a circle.
3.  **Mapping Servers:** Each server is assigned one or more positions on this ring by hashing its identifier (e.g., IP address or name).
4.  **Mapping Keys:** To store or retrieve a key, hash the key to get a position on the ring.
5.  **Assigning Keys to Servers:** The key is assigned to the first server found by moving clockwise (or counter-clockwise, consistently) on the ring from the key's position.
6.  **Adding a Server:** When a new server is added, it's hashed to a position on the ring. Only the keys that fall between the new server and its clockwise successor need to be remapped.
7.  **Removing a Server:** When a server is removed, its keys are remapped to its clockwise successor. Again, only a fraction of keys are affected.
8.  **Virtual Nodes (Replicas):** Explain how each physical server can be mapped to multiple virtual nodes on the ring. This improves load distribution (making it more uniform) and reduces the impact of a single node failure/addition, as keys are distributed more granularly.
`,
    discussionPoints: [
      "Advantages over modulo hashing (minimal remapping).",
      "How virtual nodes improve load balance and fault tolerance.",
      "Trade-offs: complexity of implementation, potential for non-uniform distribution without enough virtual nodes.",
      "Use cases: Distributed caches (Memcached, Redis Cluster), distributed databases (Cassandra, DynamoDB), request routing.",
      "Handling hotspots or popular keys.",
      "Data replication strategies in conjunction with consistent hashing.",
      "Choice of hash function and its impact."
    ]
  },
  {
    id: "key-value-store",
    title: "Design a Key-Value Store (e.g., Redis, DynamoDB)",
    icon: DatabaseZap,
    problemStatement: "Design a highly scalable, available, and performant distributed key-value store. Users should be able to store, retrieve, and delete data based on a unique key.",
    requirements: [
      "Functional Requirements:",
      "  - `Put(key, value)`: Store a value associated with a key.",
      "  - `Get(key)`: Retrieve the value associated with a key.",
      "  - `Delete(key)`: Remove a key and its associated value.",
      "Non-Functional Requirements:",
      "  - High Availability: The store should remain operational even if some nodes fail.",
      "  - Low Latency: Get/Put/Delete operations should be very fast.",
      "  - Scalability: Handle a large number of keys, large total data size, and high request throughput (reads and writes).",
      "  - Durability: Data once written should not be lost.",
      "  - (Optional) Tunable Consistency: Offer different levels of consistency (e.g., eventual vs. strong)."
    ],
    relevantRustikComponents: [
      "Database Strategies (as this is a type of database)",
      "Caching Strategies (can be employed within the K-V store or as a layer in front)",
      "Async IO + Epoll + Tokio (for building the high-performance network layer of K-V store nodes)",
      "Per-core Socket Accept + Sharding (for scaling the request handling layer of K-V store nodes)",
      "Service Discovery & Control Plane (for nodes in a distributed K-V store to find each other)",
      "Autoscaling & Resilience Patterns (for managing node health, data replication, and cluster scaling)"
    ],
    conceptualSolutionOutline: `
1.  **Data Partitioning (Sharding):**
    *   Use Consistent Hashing to distribute keys across multiple nodes. This minimizes data movement when nodes are added/removed.
2.  **Replication:**
    *   Replicate each data partition across multiple (e.g., 3) nodes for durability and availability.
    *   Choose a replication strategy (e.g., leader-follower, leaderless/quorum-based like Dynamo).
3.  **Request Handling:**
    *   Client sends request to any node or a coordinator/gateway node.
    *   The node (or coordinator) uses consistent hashing to determine which node(s) own the key.
    *   Request is routed to the responsible node(s).
4.  **Data Storage on Nodes:**
    *   **In-memory:** For extreme speed (e.g., Redis-like). Data might be periodically snapshotted to disk or use Write-Ahead Logging (WAL) for durability.
    *   **Disk-based:** For larger datasets. Often use Log-Structured Merge-Trees (LSM Trees) for efficient writes and good read performance (e.g., Cassandra, RocksDB).
5.  **Write-Ahead Logging (WAL):**
    *   For durable writes, append operations to a WAL before applying them to the in-memory structure or main data files. Helps in recovery after a crash.
6.  **Consistency Models:**
    *   **Eventual Consistency:** Writes propagate to replicas asynchronously. Reads might get stale data but offers high availability and low latency.
    *   **Strong Consistency:** Writes are acknowledged only after being replicated to a quorum of replicas. Reads always get the latest data but can have higher latency.
    *   Often configurable (e.g., read/write quorums: R+W > N).
7.  **Node Failure Detection & Handling:**
    *   Use a gossip protocol or a central leader/master to detect failed nodes.
    *   Promote replicas or re-replicate data to maintain redundancy.
    *   Leader election mechanism if using leader-based replication.
8.  **API Design:**
    *   Simple Get(key), Put(key, value), Delete(key) operations.
    *   Consider TTLs for keys, conditional puts, batch operations.
`,
    discussionPoints: [
      "Data partitioning strategy: Consistent hashing vs. range partitioning. Impact of key distribution.",
      "Replication strategy: Leader-follower vs. leaderless. Synchronous vs. asynchronous replication.",
      "Consistency models: CAP theorem. Strong vs. eventual consistency. Quorums (N, W, R).",
      "Data storage on nodes: In-memory vs. disk-based. LSM-trees vs. B-trees. Compaction.",
      "Failure detection and handling: Gossip protocols, leader election (Paxos, Raft).",
      "Concurrency control and conflict resolution (e.g., vector clocks, last-write-wins).",
      "Client interaction model: Smart client (knows data distribution) vs. dumb client (talks to coordinator).",
      "Caching strategies within the K-V store or in front of it.",
      "Metrics for monitoring performance and availability.",
      "Specific use cases: Caching, session store, user profiles, metadata store."
    ]
  },
  {
    id: "web-crawler",
    title: "Design a Web Crawler",
    icon: SearchCode,
    problemStatement: "Design a scalable web crawler that can discover new web pages starting from a set of seed URLs, fetch their content, extract new links, and potentially store the content for later processing (e.g., by a search engine indexer).",
    requirements: [
      "Functional Requirements:",
      "  - Start with a list of seed URLs.",
      "  - Fetch web pages corresponding to URLs.",
      "  - Parse HTML content to extract new URLs.",
      "  - Store discovered URLs for future crawling.",
      "  - Respect \`robots.txt\` exclusion rules and crawl-delay directives.",
      "  - Handle various content types (HTML, PDF, images - focus on HTML for link extraction).",
      "  - (Optional) Store fetched page content.",
      "Non-Functional Requirements:",
      "  - Scalability: Ability to crawl a significant portion of the web (billions of pages).",
      "  - Politeness: Avoid overloading web servers (rate limiting per domain, obey \`robots.txt\`).",
      "  - Robustness: Handle network errors, server errors, malformed HTML, and crawl traps gracefully.",
      "  - Extensibility: Allow easy addition of new modules for content processing (e.g., indexing, data extraction).",
      "  - Freshness: Ability to re-crawl pages to detect updates (not primary focus for initial design).",
      "  - Efficiency: Minimize resource usage (bandwidth, CPU, storage)."
    ],
    relevantRustikComponents: [
      "Rust App Nodes (For crawler worker processes/threads).",
      "Async IO + Epoll + Tokio (Essential for handling thousands of concurrent HTTP requests efficiently).",
      "Shared State & Data Plane:",
      "  - Message Queues (e.g., Kafka, RabbitMQ) for the URL Frontier (queue of URLs to visit).",
      "  - Databases for storing visited URLs, \`robots.txt\` rules, page metadata.",
      "Database Strategies:",
      "  - Key-Value Store (e.g., Redis, RocksDB) for managing seen URLs (bloom filter + persistent store).",
      "  - Document Store or Object Storage for storing crawled page content.",
      "Autoscaling & Resilience Patterns (For scaling crawler workers and handling failures).",
      "Service Discovery & Control Plane (If crawler workers are distributed across many machines)."
    ],
    conceptualSolutionOutline: `
1.  **URL Frontier:**
    *   Manages URLs to be crawled. Prioritized queues can be used (e.g., based on page rank, recency).
    *   Typically implemented using Message Queues (Kafka, SQS) or a distributed database.

2.  **Crawler Workers (Fetchers):**
    *   Multiple distributed workers take URLs from the Frontier.
    *   Perform DNS resolution.
    *   Fetch \\\`robots.txt\\\` for the domain and respect its rules (once per domain, cached).
    *   Make HTTP GET requests to download page content.
    *   Handle politeness (e.g., delay between requests to the same server).

3.  **HTML Parser & Link Extractor:**
    *   Parses HTML content of downloaded pages.
    *   Extracts all hyperlinks (\`<a>\` tags).
    *   Normalizes and canonicalizes extracted URLs.

4.  **URL Deduplication & Filtering:**
    *   Check if extracted URLs have already been seen/crawled (using a Bloom filter and/or a database of seen URLs).
    *   Filter out URLs based on scope, type, or other criteria.
    *   Add new, unique URLs to the URL Frontier.

5.  **Content Storage (Optional):**
    *   Store downloaded page content (HTML, text, metadata) in a scalable storage system (e.g., Object Storage like S3, or a NoSQL database like Cassandra/HBase).

6.  **Scheduler & Politeness Module:**
    *   Coordinates workers, manages crawl rates per domain/IP address.
    *   Ensures adherence to \\\`robots.txt\\\` and \\\`Crawl-delay\\\` directives.

7.  **DNS Resolver:**
    *   Resolves domain names to IP addresses. Needs to be scalable and potentially have its own cache.
`,
    discussionPoints: [
      "Scalability: How to distribute crawl load? How to manage a massive URL frontier?",
      "Politeness: \`robots.txt\` parsing and adherence, crawl-delay, adaptive rate limiting per server.",
      "Crawl Traps: Detecting and avoiding spider traps (e.g., calendar links, infinitely deep paths).",
      "URL Normalization and Canonicalization: Handling relative URLs, different schemes, etc.",
      "Duplicate Content Detection: Identifying and handling identical or very similar pages.",
      "Data Storage: Choosing appropriate stores for URL frontier, seen URLs, \`robots.txt\` cache, page content.",
      "Fault Tolerance: How to handle worker failures, network errors, unresponsive servers.",
      "Freshness: Strategies for re-crawling pages to keep content updated.",
      "Managing different content types beyond HTML.",
      "DNS resolution at scale: Bottlenecks, caching.",
      "Security considerations for the crawler (e.g., not getting hacked, not participating in DDoS)."
    ]
  },
  {
    id: "notification-system",
    title: "Design a Notification System",
    icon: BellRing,
    problemStatement: "Design a scalable system that can send various types of notifications (e.g., push notifications, email, SMS) to users based on different events or triggers within an application ecosystem.",
    requirements: [
      "Functional Requirements:",
      "  - Support multiple notification channels (e.g., Mobile Push, Web Push, Email, SMS).",
      "  - Allow other services to trigger notifications based on events (e.g., new order, friend request, system alert).",
      "  - Manage user notification preferences (e.g., opt-in/out for specific notification types/channels).",
      "  - Support templating for notification messages.",
      "  - Track notification delivery status (sent, failed, delivered, read - where possible).",
      "  - (Optional) Support for scheduled or recurring notifications.",
      "Non-Functional Requirements:",
      "  - High Availability: The system must reliably send notifications.",
      "  - Scalability: Handle a large volume of notifications per second/minute.",
      "  - Low Latency (for real-time notifications): Critical alerts or messages should be delivered quickly.",
      "  - Reliability/Durability: Minimize notification loss. Ensure important notifications are eventually delivered.",
      "  - Fault Tolerance: System should withstand failures in individual components or third-party gateways.",
      "  - Cost-Effectiveness: Especially for SMS and potentially email at scale."
    ],
    relevantRustikComponents: [
      "Microservices Architecture (e.g., Notification Service, Event Ingestion Service, User Preference Service, Template Service, Dispatcher Services per channel)",
      "API Design Styles & Protocols (Internal APIs for event submission, e.g., gRPC or REST)",
      "Shared State & Data Plane:",
      "  - Message Queues (Kafka, RabbitMQ, SQS): Essential for decoupling event producers from the notification service and for buffering/retrying messages.",
      "  - Databases (Relational for user preferences/templates; NoSQL for high-volume status tracking if needed).",
      "Async IO + Epoll + Tokio (For building high-throughput notification dispatchers and event consumers).",
      "Autoscaling & Resilience Patterns (For scaling notification workers and handling failures in third-party gateways).",
      "Observability & Ops (Monitoring notification queues, delivery rates, error rates, latencies)."
    ],
    conceptualSolutionOutline: `
1.  **Event Ingestion:**
    *   Services publish events (e.g., \`order_created\`, \`new_message\`) to a Message Queue (e.g., Kafka).
    *   Alternatively, an API endpoint on the Notification Service can receive direct requests to send notifications.

2.  **Notification Service (Core Logic):**
    *   Consumes events/requests from the queue/API.
    *   Determines recipients and checks user preferences (from User Preference Service/DB).
    *   Fetches notification templates (from Template Service/DB).
    *   Composes the notification content (personalized, localized).
    *   Decides on the appropriate channel(s) based on event type and user preferences.
    *   Puts the formatted notification message onto specific channel queues (e.g., push_queue, email_queue, sms_queue).

3.  **Dispatcher Services (Per Channel):**
    *   Dedicated worker pools for each channel (Push, Email, SMS).
    *   Consume messages from their respective channel queues.
    *   Integrate with third-party gateways/providers (e.g., APNS/FCM for push, SendGrid/SES for email, Twilio/Vonage for SMS).
    *   Handle API interactions, rate limits, and error responses from these gateways.

4.  **Status Tracking & Retries:**
    *   Log the status of each notification (attempted, sent, failed).
    *   Implement retry mechanisms (with backoff) for transient failures from third-party gateways.
    *   Store final delivery status if provided by the gateway (e.g., for email bounces, SMS delivery receipts).

5.  **Data Storage:**
    *   Relational DB for user notification preferences, templates.
    *   Potentially a NoSQL or time-series DB for high-volume tracking of notification statuses.
`,
    discussionPoints: [
      "Scalability of event ingestion and notification dispatch.",
      "Reliability: At-least-once vs. at-most-once delivery semantics. Handling failures.",
      "Idempotency: Ensuring a notification isn't sent multiple times if an event is reprocessed.",
      "User Preferences & Unsubscribes: Managing opt-outs effectively and quickly.",
      "Templating and Personalization: How to manage and render dynamic content in notifications.",
      "Batching vs. Real-time: When to batch notifications versus sending immediately.",
      "Rate Limiting: Both internally and when interacting with third-party gateways.",
      "Monitoring: Key metrics (queue lengths, delivery success/failure rates, latency per channel).",
      "Security: Protecting user data, preventing spam, secure API keys for third-party services.",
      "Cost optimization for different channels (especially SMS).",
      "Internationalization and localization of notification content.",
      "Handling feedback loops (e.g., email bounces, push notification uninstalls)."
    ]
  },
  {
    id: "chat-system",
    title: "Design a Chat System (e.g., WhatsApp, Slack)",
    icon: MessageSquarePlus,
    problemStatement: "Design a scalable real-time chat system that allows users to have one-on-one and group conversations. The system should support message history and display user online/offline presence.",
    requirements: [
      "Functional Requirements:",
      "  - Users can send and receive text messages in real-time.",
      "  - Support for one-on-one (private) chats.",
      "  - Support for group chats with multiple members.",
      "  - Persistent storage and retrieval of message history.",
      "  - Display user online/offline/typing status (presence).",
      "  - (Optional) Support for media messages (images, videos).",
      "  - (Optional) Read receipts.",
      "Non-Functional Requirements:",
      "  - Low Latency: Messages should be delivered with minimal delay.",
      "  - High Availability: Chat service should be highly reliable.",
      "  - Scalability: Handle a large number of concurrent users and high message throughput.",
      "  - Reliability: Minimize message loss.",
      "  - Durability: Message history should be durably stored.",
      "  - Security: (Optional for initial discussion, but important) Message encryption."
    ],
    relevantRustikComponents: [
      "Microservices Architecture (e.g., User Service, Connection/WebSocket Service, Chat Service, Presence Service, Message History Service)",
      "API Design Styles & Protocols (WebSockets for real-time messaging; REST/GraphQL for user management, chat metadata, history retrieval)",
      "Database Strategies:",
      "  - Messages: NoSQL (Cassandra, ScyllaDB, DynamoDB) optimized for high write throughput and time-series data.",
      "  - User/Chat Metadata: Relational DB (PostgreSQL) or Document DB for user accounts, chat room details, member lists.",
      "  - Presence/Session: In-memory Key-Value store (Redis) for fast updates and lookups of online status and WebSocket connections.",
      "Caching Strategies (User sessions, recent messages in active chats, frequently accessed group metadata).",
      "Shared State & Data Plane (Message Queues like Kafka/RabbitMQ for fanning out group messages, handling offline notifications, or asynchronous tasks).",
      "Async IO + Epoll + Tokio (Crucial for WebSocket servers handling thousands/millions of persistent connections).",
      "Load Balancer(s) (For distributing connections to WebSocket servers; L4 often preferred for WebSockets, sometimes L7 for initial handshake).",
      "Observability & Ops (Monitoring connection counts, message rates, latency, error rates)."
    ],
    conceptualSolutionOutline: `
1.  **Connection Management:**
    *   WebSocket servers manage persistent connections from clients (mobile, web).
    *   Connection Manager service keeps track of active connections per user (e.g., maps user ID to WebSocket server/connection ID, possibly using Redis).

2.  **Message Handling:**
    *   **Client Sends Message:** Sends via WebSocket to its connected server.
    *   **Chat Service Receives:**
        *   Persists message to a scalable NoSQL database (e.g., Cassandra, keyed by chat ID and timestamp).
        *   For 1:1 chat: Looks up recipient's WebSocket connection (from Connection Manager). If online, delivers message. If offline, stores for later or sends push notification.
        *   For group chat: Retrieves group members. Fans out message to all active members' WebSocket connections (can use a message queue like Kafka for reliable fan-out to multiple WebSocket servers).

3.  **Presence Service:**
    *   Clients send heartbeats or connect/disconnect events to Presence Service via WebSockets or dedicated endpoints.
    *   Stores user online/offline/typing status in a fast Key-Value store (Redis).
    *   Subscribers (other users in chats) receive presence updates.

4.  **Message History Service:**
    *   Provides API (e.g., REST/GraphQL) for clients to fetch historical messages, supporting pagination. Queries the NoSQL message store.

5.  **Group Management Service:**
    *   Handles creation of groups, adding/removing members, managing group metadata (stored in Relational/Document DB).

6.  **Offline Handling & Push Notifications:**
    *   If recipient is offline, store message and send a push notification (via Notification System) to prompt them to open the app.
`,
    discussionPoints: [
      "Choice of real-time communication protocol (WebSockets usually preferred over Long Polling/SSE for chat).",
      "Scalability of WebSocket connection management (horizontal scaling of WebSocket servers, sticky sessions if needed, connection multiplexing).",
      "Database choice for messages: Optimizing for high write throughput and efficient retrieval of recent messages. Partitioning/sharding strategies.",
      "Fan-out mechanism for group messages: Direct dispatch vs. using a message broker (Kafka, RabbitMQ).",
      "Presence system: Accuracy, update frequency, scalability. How to handle flaky connections?",
      "Message delivery guarantees: At-least-once, at-most-once. Handling message ordering.",
      "Storage and retrieval of chat history: Pagination, indexing.",
      "Security: End-to-end encryption (complex to implement correctly) vs. transport-level encryption. User authentication.",
      "Handling media attachments: Storage, CDN delivery.",
      "Read receipts and typing indicators: Scalability and real-time updates for these features.",
      "Integration with a general Notification System for offline users.",
      "Rate limiting and anti-spam measures."
    ]
  },
  {
    id: "search-autocomplete",
    title: "Design a Search Autocomplete System (Typeahead)",
    icon: Type,
    problemStatement: "Design a system that provides real-time search suggestions as a user types into a search box. Suggestions should be relevant and appear with very low latency.",
    requirements: [
      "Functional Requirements:",
      "  - Provide a list of relevant search suggestions based on the user's input prefix.",
      "  - Suggestions should be ranked (e.g., by popularity, relevance, or personalization).",
      "  - System should update suggestions as the user types more characters.",
      "Non-Functional Requirements:",
      "  - Very Low Latency: Suggestions should appear almost instantaneously (e.g., < 50-100ms).",
      "  - High Availability: The autocomplete service must be highly available.",
      "  - Scalability: Handle a high volume of concurrent users and queries.",
      "  - Accuracy: Suggestions should be relevant to the user's query.",
      "  - Freshness (Optional): Suggestions should reflect recent trends or new terms if possible."
    ],
    relevantRustikComponents: [
      "Rust App Nodes (For building the high-performance suggestion generation service).",
      "Caching Strategies (Aggressively cache results for common prefixes at multiple levels: client-side, edge (CDN), server-side).",
      "Database Strategies (To store the dictionary of terms and their frequencies/scores. Specialized data structures like Tries stored in memory (possibly backed by persistent storage like Redis or a NoSQL DB) are common).",
      "Load Balancer(s) (To distribute query load across suggestion service instances).",
      "Async IO + Epoll + Tokio (For efficient handling of high-concurrency suggestion requests)."
    ],
    conceptualSolutionOutline: `
1.  **Data Structure for Suggestions:**
    *   **Trie (Prefix Tree):** A common and efficient data structure. Each node represents a character. Paths from the root to a node represent prefixes. Nodes can store metadata (e.g., if it's a complete word, its frequency/score).
    *   Store the Trie in memory on suggestion service nodes for fast lookups. It can be periodically rebuilt from a master data source.

2.  **Building/Updating the Data:**
    *   Collect search queries or terms from a corpus (e.g., historical user searches, product catalogs).
    *   Process and clean this data.
    *   Build the Trie (or other index) and distribute it to suggestion service instances. Updates can be batch or incremental.

3.  **Querying for Suggestions:**
    *   As the user types, the client sends the current prefix to the autocomplete service.
    *   The service traverses the Trie based on the prefix.
    *   Collect all words/phrases that start with this prefix from the descendant nodes.
    *   Limit the number of suggestions (e.g., top 10).

4.  **Ranking Suggestions:**
    *   Rank suggestions based on factors like:
        *   Frequency of the search term.
        *   Recency or trending score.
        *   Personalization (user's past search history).
        *   Business rules (e.g., promote certain products).
    *   Scores can be pre-computed and stored in the Trie nodes or applied at query time.

5.  **System Architecture:**
    *   Load Balancers distribute requests to a fleet of stateless Autocomplete Service instances.
    *   Each service instance has a copy of the Trie/index in memory (or part of it if sharded).
    *   Aggressive caching at CDN, edge, and service levels for popular prefixes.

6.  **Scalability & Distribution:**
    *   For very large datasets, the Trie/index can be sharded (e.g., by the first letter of the prefix, or using consistent hashing).
    *   Requests are routed to the appropriate shard.
`,
    discussionPoints: [
      "Choice of data structure (Trie vs. other indexing methods like inverted indexes or specialized search engines like Elasticsearch for more complex scenarios).",
      "How to update the suggestion data: Batch processing vs. near real-time updates. Impact on freshness.",
      "Ranking algorithms for suggestions: Complexity, data required, personalization.",
      "Caching strategies: What to cache, where, cache eviction policies. TTLs for cached suggestions.",
      "Handling typos and misspellings (e.g., using fuzzy matching, phonetic algorithms).",
      "Personalization of suggestions based on user history or context.",
      "Scalability of the suggestion index/Trie: Sharding strategies, replication for availability.",
      "Latency optimization techniques (e.g., pre-computing top suggestions for short prefixes, client-side optimizations).",
      "Metrics for evaluating suggestion quality and system performance (e.g., suggestion relevance, click-through rate, query latency)."
    ]
  },
  {
    id: "youtube-design",
    title: "Design YouTube (or a Video Streaming Platform)",
    icon: Youtube,
    problemStatement: "Design a highly scalable platform for users to upload, share, browse, search, and stream video content.",
    requirements: [
      "Functional Requirements:",
      "  - Video upload, processing (transcoding to multiple formats/resolutions), and storage.",
      "  - Video playback with adaptive bitrate streaming (different quality options).",
      "  - Search functionality for videos (by title, description, tags, channel).",
      "  - User channels and subscriptions.",
      "  - User interactions: likes/dislikes, comments.",
      "  - Recommendations for videos and channels.",
      "  - (Optional for initial design) Live streaming capabilities.",
      "Non-Functional Requirements:",
      "  - High Availability: Platform should be accessible with minimal downtime.",
      "  - Low Latency: Fast video start times and smooth streaming experience.",
      "  - Scalability: Handle petabytes of video storage and millions of concurrent viewers.",
      "  - Durability: Video content must be durably stored and not lost.",
      "  - Reliability: Consistent video playback and reliable uploads.",
      "  - High Throughput: For both video uploads and streaming requests."
    ],
    relevantRustikComponents: [
      "Microservices Architecture (e.g., Upload Service, Video Processing Service, Metadata Service, User Service, Search Service, Recommendation Service, Streaming Service, Comment Service, Notification Service).",
      "API Design Styles & Protocols (REST/GraphQL for client interactions; streaming protocols like HLS/DASH for video delivery).",
      "Database Strategies:",
      "  - Relational DB (e.g., PostgreSQL) for user profiles, channel information, video metadata (titles, descriptions).",
      "  - NoSQL DB (e.g., Cassandra, DynamoDB) for high-volume, scalable data like view counts, likes, comments, user activity logs.",
      "  - Search-optimized DB (e.g., Elasticsearch) for indexing and querying video metadata for search functionality.",
      "Shared State & Data Plane:",
      "  - Object Storage (e.g., AWS S3, Google Cloud Storage) for storing raw and transcoded video files (petabytes of data).",
      "  - Message Queues (e.g., Kafka, RabbitMQ) for managing the video processing pipeline (upload -> transcode -> publish).",
      "Caching Strategies:",
      "  - Content Delivery Network (CDN) is paramount for caching video segments globally, close to users.",
      "  - Caching for hot video metadata, search results, user recommendations, user sessions.",
      "Async IO + Epoll + Tokio (For high-concurrency services like video upload ingestion, notification systems, or parts of the real-time interaction services).",
      "Network Infrastructure Strategies (Essential for global content delivery, CDN peering, and managing massive bandwidth requirements).",
      "Autoscaling & Resilience Patterns (For all services, especially video processing workers and streaming servers).",
      "Observability & Ops (Critical for monitoring upload success, processing times, streaming quality, and overall platform health)."
    ],
    conceptualSolutionOutline: `
1.  **Video Upload & Processing Pipeline:**
    *   Client uploads raw video file via API to an Upload Service.
    *   Upload Service stores the raw file in temporary Object Storage and publishes an event (e.g., to Kafka).
    *   Video Processing Service (worker pool) consumes the event.
        *   Transcodes the video into multiple formats and resolutions (e.g., H.264, VP9; 1080p, 720p, 480p).
        *   Generates thumbnails.
        *   Extracts metadata.
    *   Stores processed video segments and thumbnails in persistent Object Storage.
    *   Updates the Metadata Service with video details and storage locations/CDN URLs.

2.  **Video Playback & Streaming:**
    *   Client requests a video.
    *   Application fetches video metadata (including URLs for different quality streams, often pointing to CDN) from Metadata Service.
    *   Video player on the client uses Adaptive Bitrate Streaming (e.g., HLS or DASH) to request video segments from the CDN.
    *   CDN serves segments from its edge cache or fetches from origin (Object Storage) if not cached.

3.  **Metadata Management:**
    *   User Service: Manages user accounts, channels, subscriptions (Relational DB).
    *   Video Metadata Service: Stores video titles, descriptions, tags, processing status, view counts, likes/dislikes (Mix of Relational for core info, NoSQL for counters).
    *   Comment Service: Manages comments (NoSQL DB).

4.  **Search Functionality:**
    *   Search Service uses a search engine like Elasticsearch.
    *   Video metadata is indexed.
    *   Provides ranked search results based on relevance, popularity, recency.

5.  **Recommendation System:**
    *   Recommendation Engine analyzes user watch history, likes, subscriptions, and other signals.
    *   Uses machine learning models to generate personalized video recommendations.
    *   Feeds recommendations to user homepages and 'Up Next' suggestions.

6.  **Content Delivery Network (CDN):**
    *   Crucial for distributing video segments globally to reduce latency and server load.
`,
    discussionPoints: [
      "Video encoding/transcoding pipeline: Choice of codecs, resolutions, formats. Scalability of processing workers.",
      "Storage solution for petabytes of video data: Object Storage (S3, GCS) cost, durability, tiering.",
      "CDN strategy: Multi-CDN, cache hit ratio, cache invalidation, geo-distribution, cost.",
      "Database schema and choices for different types of data (video metadata, user data, interaction data like views/likes).",
      "Adaptive Bitrate Streaming (HLS/DASH): How it works, benefits.",
      "Search indexing and query performance at scale.",
      "Recommendation engine design: Collaborative filtering, content-based filtering, hybrid models. Data sources.",
      "Scaling different components: Video ingestion, processing farm, streaming servers, metadata APIs.",
      "Copyright infringement detection and Digital Rights Management (DRM).",
      "Handling user interactions: Comments (moderation, ranking), likes/dislikes, subscriptions. Real-time updates.",
      "Monetization strategies: Advertisements, subscriptions, channel memberships.",
      "Data analytics for content creators and platform improvement.",
      "Live streaming architecture (if discussed as an extension)."
    ]
  },
  {
    id: "google-drive-design",
    title: "Design Google Drive (or a Cloud File Storage & Sync Service)",
    icon: FolderGit2,
    problemStatement: "Design a service that allows users to store various types of files in the cloud, synchronize them across multiple devices (desktop, mobile, web), and share them with other users with different permission levels.",
    requirements: [
      "Functional Requirements:",
      "  - Users can upload and download files and folders.",
      "  - Files/folders should be synchronized across all a user's devices.",
      "  - Support for creating, deleting, renaming, and moving files/folders.",
      "  - File version history and ability to restore previous versions.",
      "  - Sharing files/folders with other users with different permission levels (e.g., view, edit).",
      "  - Search functionality for files/folders based on name and potentially content.",
      "  - (Optional) Real-time collaborative editing for certain file types (e.g., documents).",
      "  - (Optional) Offline access to a subset of files.",
      "Non-Functional Requirements:",
      "  - High Durability: User data must not be lost.",
      "  - High Availability: Service should be accessible most of the time.",
      "  - Scalability: Support petabytes of storage, billions of files, and millions of users.",
      "  - Low Latency: Fast uploads, downloads, and synchronization.",
      "  - Consistency: Strong consistency for file metadata operations. Eventual consistency for file content propagation across devices can be acceptable in some sync scenarios, but metadata changes should be atomic.",
      "  - Security: File privacy, encryption (at rest and in transit), robust access control."
    ],
    relevantRustikComponents: [
      "Microservices Architecture (e.g., File Service, Metadata Service, Sync Service, User Service, Sharing Service, Search Service, Notification Service, Versioning Service).",
      "API Design Styles & Protocols (REST/GraphQL for client interactions; potentially custom binary protocols or gRPC for efficient sync clients).",
      "Database Strategies:",
      "  - Metadata: Relational DB (e.g., PostgreSQL) for file/folder hierarchy, versions, user ownership, sharing permissions. Requires strong consistency.",
      "  - File Block/Chunk Metadata: Potentially a scalable NoSQL DB if files are heavily chunked and deduplicated.",
      "Shared State & Data Plane:",
      "  - Object Storage (e.g., AWS S3, Google Cloud Storage): For storing the actual file content (often as chunks/blocks for large files and efficient diffs).",
      "  - Message Queues (e.g., Kafka, RabbitMQ): For asynchronous tasks like file processing, sync notifications, indexing.",
      "Caching Strategies (Frequently accessed file metadata, hot file chunks/blocks, user session data).",
      "Async IO + Epoll + Tokio (For building high-concurrency sync servers, file transfer services).",
      "Autoscaling & Resilience Patterns (Crucial for all backend services, especially storage and sync components).",
      "Observability & Ops (Monitoring sync status, storage usage, API latencies, error rates).",
      "Security Architecture Principles (Encryption, access control, audit trails are paramount)."
    ],
    conceptualSolutionOutline: `
1.  **Client Applications (Desktop, Mobile, Web):**
    *   Monitor local file system changes (for desktop clients).
    *   Communicate with backend services for upload, download, sync, and metadata operations.
    *   Manage local cache for offline access and faster performance.

2.  **Core Backend Services:**
    *   **Authentication Service:** Handles user login and session management.
    *   **Metadata Service:** Manages all metadata about files and folders: names, hierarchy, ownership, sharing permissions, version information, pointers to actual file data in Object Storage. Typically uses a relational database for strong consistency.
    *   **File Service (or Block Store Service):** Handles the actual upload/download of file data. Chunks large files for efficient transfer and storage. Interacts with Object Storage.
    *   **Synchronization Service:** The heart of the system. Detects changes on clients and server. Manages conflict resolution. Uses an efficient protocol to transfer only deltas/diffs when possible. May use long polling, WebSockets, or push notifications to inform clients of changes.
    *   **Sharing Service:** Manages sharing links, permissions, and collaboration invites.
    *   **Notification Service:** Informs clients about changes to shared files/folders or other relevant events.
    *   **Search Service:** Indexes file metadata (and potentially content) for fast searching.

3.  **Data Storage:**
    *   **Object Storage (e.g., S3, GCS):** Stores the actual file content, often broken into chunks. This provides durability and scalability.
    *   **Relational Database (e.g., PostgreSQL):** Stores metadata, user information, folder structures, sharing permissions.
    *   **Caching Layer (e.g., Redis):** Caches frequently accessed metadata or hot file chunks.

4.  **Key Operations:**
    *   **File Upload:** Client splits file into chunks (if large). Chunks uploaded to File Service, then to Object Storage. Metadata Service updated. Sync Service notifies other clients.
    *   **File Download:** Client requests file. Metadata Service provides locations of chunks. Client downloads chunks from File Service/Object Storage.
    *   **Synchronization:** Clients report local changes. Sync Service reconciles changes with server state, resolves conflicts, and propagates updates to other clients.
`,
    discussionPoints: [
      "Synchronization algorithm: How to efficiently detect and transfer changes (deltas/diffs)? Handling concurrent updates and conflict resolution strategies.",
      "Large file handling: Chunking, resumable uploads/downloads, bandwidth optimization.",
      "Metadata scalability: How to manage billions of files and their metadata? Database sharding for metadata DB.",
      "Data consistency model: Strong consistency for metadata operations is critical. Eventual consistency for file content propagation to remote clients might be acceptable.",
      "File versioning: How are versions stored (diffs vs. full copies)? Storage cost implications.",
      "Security: Encryption at rest and in transit, robust access control mechanisms, secure sharing links, audit trails for file access.",
      "Offline access: How do clients cache files locally? How are offline changes synced when back online?",
      "Real-time updates vs. polling for changes.",
      "Storage efficiency: Deduplication of identical file chunks/blocks across users.",
      "Search functionality: Indexing metadata vs. full-text search of content. Scalability of search.",
      "API design for client applications."
    ]
  },
];


export default function SystemDesignInterviewPage() {
  const [hoverMessage, setHoverMessage] = useState<string | null>(null);
  const hoverMessageTimerRef = useRef<NodeJS.Timeout | null>(null);

  const triggerHoverMessage = (message: string) => {
    if (hoverMessageTimerRef.current) {
      clearTimeout(hoverMessageTimerRef.current);
    }
    setHoverMessage(message);
    hoverMessageTimerRef.current = setTimeout(() => {
      setHoverMessage(null);
    }, 5000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 py-10 sm:py-16">
        <div 
          className="text-center mb-12 sm:mb-16 group"
          onMouseEnter={() => triggerHoverMessage("System Design Interview Prep: Your guide to acing technical interviews.")}
        >
          <Brain className="h-24 w-24 text-primary mb-8 mx-auto group-hover:text-accent transition-colors" />
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 text-gray-800 dark:text-gray-100 group-hover:text-accent transition-colors">
            System Design Interview Prep with Rustik
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Leverage Rustik's architectural components and insights to confidently tackle common system design interview questions. Explore example problems and see how fundamental building blocks come together to create scalable and robust solutions.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full max-w-5xl mx-auto space-y-6">
          <AccordionItem value="basic-piece-system-design-section" className="border border-border/70 rounded-xl shadow-lg overflow-hidden bg-card">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <AccordionTrigger 
                    className="px-6 py-4 text-2xl font-semibold hover:no-underline bg-muted/30 hover:bg-muted/50 data-[state=open]:border-b data-[state=open]:border-border/70 group"
                    onMouseEnter={() => triggerHoverMessage("Understand fundamental concepts crucial for any system architect.")}
                  >
                    <div className="flex items-center gap-3 group-hover:text-accent transition-colors">
                      <Puzzle className="h-8 w-8 text-primary" />
                      <span className="text-gray-700 dark:text-gray-200 text-left">Basic-Piece System Design</span>
                    </div>
                  </AccordionTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Grasp fundamental concepts and building blocks essential for any system architect.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <AccordionContent className="p-6 space-y-8">
              <Accordion type="multiple" className="w-full space-y-4">
                {basicDesignQuestions.map((question) => (
                  <AccordionItem value={question.id} key={question.id} className="border border-border/70 rounded-xl shadow-md overflow-hidden bg-card hover:shadow-lg transition-shadow">
                    <AccordionTrigger 
                      className="px-6 py-4 text-lg font-semibold hover:no-underline bg-muted/20 hover:bg-muted/40 data-[state=open]:border-b data-[state=open]:border-border/50 group"
                      onMouseEnter={() => triggerHoverMessage(`Learn about: ${question.title}`)}
                    >
                      <div className="flex items-center gap-3 text-left group-hover:text-accent transition-colors">
                        <question.icon className="h-6 w-6 text-primary flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-200">{question.title}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-6 space-y-5">
                      {question.problemStatement && (
                        <div>
                          <h5 className="text-md font-semibold text-accent mb-1.5">Problem Statement:</h5>
                          <p className="text-sm text-foreground/80 whitespace-pre-line">{question.problemStatement}</p>
                        </div>
                      )}
                      {question.explanation && (
                        <div>
                          <h5 className="text-md font-semibold text-accent mb-1.5">Explanation:</h5>
                          <p className="text-sm text-foreground/80 whitespace-pre-line">{question.explanation}</p>
                        </div>
                      )}
                       {question.requirements && question.requirements.length > 0 && (
                        <div>
                          <h5 className="text-md font-semibold text-accent mb-1.5">Key Requirements & Considerations:</h5>
                          <ul className="list-disc list-inside space-y-1 text-xs text-foreground/75 pl-4 whitespace-pre-line">
                            {question.requirements.map((req, index) => <li key={`req-${question.id}-${index}`}>{req}</li>)}
                          </ul>
                        </div>
                      )}
                       {question.purpose && (
                        <div>
                          <h5 className="text-md font-semibold text-accent mb-1.5">Purpose:</h5>
                          <p className="text-sm text-foreground/80 whitespace-pre-line">{question.purpose}</p>
                        </div>
                      )}
                       {question.keyCoreFunctionalities && question.keyCoreFunctionalities.length > 0 && (
                        <div>
                          <h5 className="text-md font-semibold text-accent mb-1.5">Key Core Components/Functionalities:</h5>
                          <ul className="list-disc list-inside space-y-1 text-sm text-foreground/80 pl-4">
                            {question.keyCoreFunctionalities.map((func, index) => (
                              <li key={`func-${question.id}-${index}`} dangerouslySetInnerHTML={{ __html: func.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground/90">$1</strong>') }} />
                            ))}
                          </ul>
                        </div>
                      )}
                      {question.keyArchitecturalChallenges && question.keyArchitecturalChallenges.length > 0 && (
                        <div>
                          <h5 className="text-md font-semibold text-accent mb-1.5 mt-3">Key Architectural Challenges:</h5>
                          <ul className="list-disc list-inside space-y-1 text-sm text-foreground/80 pl-4">
                            {question.keyArchitecturalChallenges.map((chall, index) => (
                             <li key={`chall-${question.id}-${index}`} dangerouslySetInnerHTML={{ __html: chall.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground/90">$1</strong>') }} />
                            ))}
                          </ul>
                        </div>
                      )}
                      {question.keyConcepts && question.keyConcepts.length > 0 && (
                        <div>
                          <h5 className="text-md font-semibold text-accent mb-1.5">Key Concepts / Best Practices:</h5>
                           <ul className="list-disc list-inside space-y-1 text-sm text-foreground/80 pl-4">
                            {question.keyConcepts.map((concept, index) => (
                              <li key={`concept-${question.id}-${index}`} dangerouslySetInnerHTML={{ __html: concept.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground/90">$1</strong>') }} />
                            ))}
                          </ul>
                        </div>
                      )}
                       {question.learningStrategies && question.learningStrategies.length > 0 && (
                        <div>
                          <h5 className="text-md font-semibold text-accent mb-1.5">Strategies for Learning:</h5>
                          <ul className="list-disc list-inside space-y-1 text-sm text-foreground/80 pl-4">
                            {question.learningStrategies.map((strategy, index) => (
                              <li key={`strategy-${question.id}-${index}`} dangerouslySetInnerHTML={{ __html: strategy.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground/90">$1</strong>') }} />
                            ))}
                          </ul>
                        </div>
                      )}
                      {question.howItWorks && (
                        <div>
                          <h5 className="text-md font-semibold text-accent mb-1.5">How it Works (Simplified):</h5>
                          <p className="text-sm text-foreground/80 whitespace-pre-line bg-muted/20 p-3 rounded-md border border-border/40">{question.howItWorks}</p>
                        </div>
                      )}
                      {question.keyStepsInHandshake && (
                        <div>
                            <h5 className="text-md font-semibold text-accent mb-1.5">Key Steps in Handshake (Simplified):</h5>
                            <p className="text-sm text-foreground/80 whitespace-pre-line bg-muted/20 p-3 rounded-md border border-border/40">{question.keyStepsInHandshake}</p>
                        </div>
                      )}
                       {question.verificationProcess && (
                        <div>
                          <h5 className="text-md font-semibold text-accent mb-1.5">Verification Process:</h5>
                          <p className="text-sm text-foreground/80 whitespace-pre-line bg-muted/20 p-3 rounded-md border border-border/40">{question.verificationProcess}</p>
                        </div>
                      )}
                      {question.whyNotEncryption && (
                        <div>
                          <h5 className="text-md font-semibold text-accent mb-1.5">Why Not Just Encryption?</h5>
                          <p className="text-sm text-foreground/80 whitespace-pre-line">{question.whyNotEncryption}</p>
                        </div>
                      )}
                      {question.commonLevels && question.commonLevels.length > 0 && (
                        <div>
                          <h5 className="text-md font-semibold text-accent mb-1.5">Common Isolation Levels:</h5>
                          <ul className="space-y-2 text-sm text-foreground/75 pl-2">
                            {question.commonLevels.map((level, index) => (
                              <li key={`level-${question.id}-${index}`}>
                                <strong className="text-foreground/90">{level.name}:</strong> {level.description}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {question.tradeOffs && (
                         <div>
                          <h5 className="text-md font-semibold text-accent mb-1.5">Trade-offs:</h5>
                          <p className="text-sm text-foreground/80 whitespace-pre-line">{question.tradeOffs}</p>
                        </div>
                      )}
                       {question.decisionFactors && question.decisionFactors.length > 0 && (
                        <div>
                          <h5 className="text-md font-semibold text-accent mb-1.5">Key Decision Factors:</h5>
                          <ul className="list-disc list-inside space-y-1 text-sm text-foreground/80 pl-4">
                            {question.decisionFactors.map((factor, index) => (
                              <li key={`factor-${question.id}-${index}`} dangerouslySetInnerHTML={{ __html: factor.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground/90">$1</strong>') }} />
                            ))}
                          </ul>
                        </div>
                      )}
                       {question.databaseTypeGuidance && question.databaseTypeGuidance.length > 0 && (
                        <div>
                          <h5 className="text-md font-semibold text-accent mb-2.5 mt-3">Database Type Guidance:</h5>
                          <div className="space-y-3">
                            {question.databaseTypeGuidance.map((dbType, index) => (
                              <Card key={`db-type-${question.id}-${index}`} className="bg-muted/30 p-3 border-border/50 shadow-sm">
                                <CardHeader className="p-0 pb-1.5">
                                  <CardTitle className="text-sm font-semibold text-primary">{dbType.category}</CardTitle>
                                  <CardDescription className="text-xs">{dbType.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="p-0 text-xs space-y-1">
                                  <div>
                                    <strong className="text-foreground/80">Considerations/Use Cases:</strong>
                                    <ul className="list-disc list-inside pl-3 space-y-0.5 text-foreground/70">
                                      {dbType.considerations.map((con, cIdx) => <li key={`con-${question.id}-${index}-${cIdx}`}>{con}</li>)}
                                    </ul>
                                  </div>
                                  <p><strong className="text-foreground/80">Rustik Component Link:</strong> <span className="italic">{dbType.rustikLink}</span></p>
                                  <p><strong className="text-foreground/80">Examples:</strong> {dbType.examples}</p>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      )}
                      {question.examples && question.examples.length > 0 && (
                        <div>
                          <h5 className="text-md font-semibold text-accent mb-2">Examples & Responsibility Model:</h5>
                          <div className="space-y-4">
                            {question.examples.map((example, index) => (
                              <Card key={`ex-${question.id}-${index}`} className="bg-muted/30 p-3 border-border/50">
                                <CardHeader className="p-0 pb-1.5">
                                  <CardTitle className="text-sm font-semibold text-primary">{example.model}</CardTitle>
                                  <CardDescription className="text-xs">{example.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="p-0 text-xs space-y-1">
                                  <p><strong className="text-foreground/80">Customer Manages:</strong> {example.managedByCustomer.join(', ') || 'None'}</p>
                                  <p><strong className="text-foreground/80">Provider Manages:</strong> {example.managedByProvider.join(', ')}</p>
                                  <p><strong className="text-foreground/80">Examples:</strong> {example.examples.join(', ')}</p>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      )}
                       {question.keyDifferences && question.keyDifferences.length > 0 && (
                        <div>
                          <h5 className="text-md font-semibold text-accent mb-1.5">Key Differences:</h5>
                          <ul className="list-disc list-inside space-y-1 text-sm text-foreground/80 pl-4">
                            {question.keyDifferences.map((diff, index) => <li key={`diff-${question.id}-${index}`}>{diff}</li>)}
                          </ul>
                        </div>
                      )}
                      {question.keyDifferencesTable && (
                        <div>
                          <h5 className="text-md font-semibold text-accent mb-1.5">Key Differences:</h5>
                          <div className="overflow-x-auto">
                            <table className="min-w-full text-sm border border-border/50">
                              <thead className="bg-muted/30">
                                <tr>
                                  {question.keyDifferencesTable.header.map((header, hIdx) => (
                                    <th key={`h-${question.id}-${hIdx}`} className="p-2 border-b border-r border-border/50 text-left font-medium text-foreground/90">{header}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {question.keyDifferencesTable.rows.map((row, rIdx) => (
                                  <tr key={`r-${question.id}-${rIdx}`} className="border-b border-border/50">
                                    {row.map((cell, cIdx) => (
                                      <td key={`c-${question.id}-${rIdx}-${cIdx}`} className="p-2 border-r border-border/50 text-foreground/80">{cell}</td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                       {question.benefits && question.benefits.length > 0 && (
                        <div>
                          <h5 className="text-md font-semibold text-accent mb-1.5">Benefits:</h5>
                          <ul className="list-disc list-inside space-y-1 text-sm text-foreground/80 pl-4">
                            {question.benefits.map((benefit, index) => <li key={`benefit-${question.id}-${index}`}>{benefit}</li>)}
                          </ul>
                        </div>
                      )}
                      {question.challenges && question.challenges.length > 0 && (
                        <div>
                          <h5 className="text-md font-semibold text-accent mb-1.5">Challenges/Considerations:</h5>
                          <ul className="list-disc list-inside space-y-1 text-sm text-foreground/80 pl-4">
                            {question.challenges.map((challenge, index) => <li key={`challenge-${question.id}-${index}`}>{challenge}</li>)}
                          </ul>
                        </div>
                      )}
                       {question.keyTrends && question.keyTrends.length > 0 && (
                        <div>
                          <h5 className="text-md font-semibold text-accent mb-1.5">Key Trends:</h5>
                          <ul className="list-disc list-inside space-y-1 text-sm text-foreground/80 pl-4">
                            {question.keyTrends.map((trend, index) => <li key={`trend-${question.id}-${index}`}>{trend}</li>)}
                          </ul>
                        </div>
                      )}
                      {question.architecturalConsiderations && question.architecturalConsiderations.length > 0 && (
                        <div>
                          <h5 className="text-md font-semibold text-accent mb-1.5">Architectural Considerations with Rustik Components:</h5>
                           <ul className="list-disc list-inside space-y-1 text-sm text-foreground/80 pl-4">
                            {question.architecturalConsiderations.map((item, index) => (
                              <li key={`arch-cons-${question.id}-${index}`} dangerouslySetInnerHTML={{ __html: item.replace(/'([^']*)'/g, '<code class="text-xs bg-muted p-0.5 rounded-sm font-mono">\'$1\'</code>') }} />
                            ))}
                          </ul>
                        </div>
                      )}
                      {question.conceptualSolutionOutline && (
                        <div>
                          <h5 className="text-md font-semibold text-accent mb-1.5">Conceptual Solution Outline:</h5>
                          <div className="text-xs text-foreground/75 prose prose-xs dark:prose-invert max-w-none whitespace-pre-line bg-muted/20 p-3 rounded-md border border-border/40">{question.conceptualSolutionOutline}</div>
                        </div>
                      )}
                      {question.relevantRustikComponents && question.relevantRustikComponents.length > 0 && (
                        <div>
                          <h5 className="text-md font-semibold text-accent mb-1.5">Relevant Rustik Components:</h5>
                          <div className="flex flex-wrap gap-1.5">
                            {question.relevantRustikComponents.map((compName, index) => (
                              <span key={`comp-${question.id}-${index}`} className="px-2 py-0.5 text-[10px] font-medium bg-primary/10 text-primary rounded-full border border-primary/30">
                                {compName}
                              </span>
                            ))}
                          </div>
                          {question.rustikRelevanceNote && (
                            <p className="text-xs text-muted-foreground mt-2 italic whitespace-pre-line">{question.rustikRelevanceNote}</p>
                          )}
                        </div>
                      )}
                      {question.discussionPoints && question.discussionPoints.length > 0 && (
                        <div>
                          <h5 className="text-md font-semibold text-accent mb-1.5">Discussion Points for an Interview:</h5>
                          <ul className="list-disc list-inside space-y-1 text-xs text-foreground/75 pl-4">
                            {question.discussionPoints.map((point, index) => <li key={`disc-${question.id}-${index}`}>{point}</li>)}
                          </ul>
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </AccordionContent>
          </AccordionItem>

          {/* Master-Piece System Design Section */}
          <AccordionItem value="master-piece-system-design" className="border border-border/70 rounded-xl shadow-lg overflow-hidden bg-card">
             <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <AccordionTrigger 
                          className="px-6 py-4 text-2xl font-semibold hover:no-underline bg-muted/30 hover:bg-muted/50 data-[state=open]:border-b data-[state=open]:border-border/70 group"
                          onMouseEnter={() => triggerHoverMessage("Explore complex, large-scale system design problems and strategies.")}
                        >
                            <div className="flex items-center gap-3 group-hover:text-accent transition-colors">
                                <Brain className="h-8 w-8 text-primary" />
                                <span className="text-gray-700 dark:text-gray-200 text-left">Master-Piece System Design</span>
                            </div>
                        </AccordionTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Unlock strategies to solve complex, large-scale system design problems effectively.</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <AccordionContent className="p-6 space-y-8">
              <Accordion type="multiple" className="w-full space-y-4">
                <AccordionItem value="scaling-journey-item" className="border-none p-0">
                  <AccordionTrigger 
                    className="text-xl font-semibold text-primary hover:no-underline p-0 mb-3 data-[state=open]:pb-2 data-[state=open]:border-b data-[state=open]:border-primary/20 group"
                    onMouseEnter={() => triggerHoverMessage("Learn how systems evolve from zero to millions of users.")}
                  >
                      <div className="flex items-center gap-3 group-hover:text-accent transition-colors">
                      <TrendingUp className="h-7 w-7" />
                      Understanding the Scaling Journey: 0 to Millions of Users
                      </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-0 pl-1 pr-1">
                      <Card className="shadow-md rounded-lg border-none bg-transparent">
                      <CardHeader className="pb-2 pt-0 px-0">
                          <CardDescription className="text-sm text-muted-foreground pt-1">
                          Scaling a system is an iterative journey. This section outlines common phases and architectural shifts.
                          </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-4 space-y-4 px-0">
                          {scalingJourneyPhases.map((phase, index) => (
                          <Card key={`scaling-phase-${index}`} className="shadow-sm rounded-lg border border-border/50 bg-card">
                              <CardHeader className="flex flex-row items-start gap-3 pb-2 pt-3 px-4 bg-muted/20">
                              <phase.icon className="h-6 w-6 text-accent mt-0.5 flex-shrink-0" />
                              <div className="flex-grow">
                                  <CardTitle className="text-md font-semibold text-accent">{phase.title}</CardTitle>
                                  <p className="text-xs text-muted-foreground pt-0.5">{phase.description}</p>
                              </div>
                              </CardHeader>
                              <CardContent className="p-4 text-xs space-y-2">
                              {phase.characteristics && (
                                  <div>
                                  <h5 className="font-medium text-foreground/90 mb-1">Key Characteristics:</h5>
                                  <ul className="list-disc list-inside space-y-0.5 text-foreground/70">
                                      {phase.characteristics.map((char, i) => <li key={`char-${index}-${i}`}>{char}</li>)}
                                  </ul>
                                  </div>
                              )}
                              {phase.actions && (
                                  <div className="mt-2">
                                  <h5 className="font-medium text-foreground/90 mb-1">Common Actions & Strategies:</h5>
                                  <ul className="list-disc list-inside space-y-0.5 text-foreground/70">
                                      {phase.actions.map((action, i) => <li key={`action-${index}-${i}`}>{action}</li>)}
                                  </ul>
                                  </div>
                              )}
                              {phase.pros && (
                                  <div className="mt-2">
                                  <h5 className="font-medium text-foreground/90 mb-1">Pros at this stage:</h5>
                                  <ul className="list-disc list-inside space-y-0.5 text-foreground/70">
                                      {phase.pros.map((pro, i) => <li key={`pro-${index}-${i}`}>{pro}</li>)}
                                  </ul>
                                  </div>
                              )}
                              {phase.challenges && (
                                  <div className="mt-2">
                                  <h5 className="font-medium text-foreground/90 mb-1">Common Challenges:</h5>
                                  <ul className="list-disc list-inside space-y-0.5 text-foreground/70">
                                      {phase.challenges.map((challengeText, i) => <li key={`chall-${index}-${i}`}>{challengeText}</li>)}
                                  </ul>
                                  </div>
                              )}
                              {phase.rustikRelevance && phase.rustikRelevance.length > 0 && (
                                  <div className="mt-2 pt-2 border-t border-border/30">
                                  <h5 className="font-medium text-foreground/90 mb-1">Relevant Rustik Components:</h5>
                                  <div className="flex flex-wrap gap-1">
                                      {phase.rustikRelevance.map((compName, i) => (
                                      <span key={`rel-${index}-${i}`} className="px-1.5 py-0.5 text-[10px] font-medium bg-muted text-muted-foreground rounded-full border border-border/50">
                                          {compName}
                                      </span>
                                      ))}
                                  </div>
                                  </div>
                              )}
                              </CardContent>
                          </Card>
                          ))}
                      </CardContent>
                      </Card>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="framework-item" className="border-none p-0">
                  <AccordionTrigger 
                    className="text-xl font-semibold text-primary hover:no-underline p-0 mb-3 data-[state=open]:pb-2 data-[state=open]:border-b data-[state=open]:border-primary/20 group"
                    onMouseEnter={() => triggerHoverMessage(systemDesignFramework.hoverHint)}
                  >
                      <div className="flex items-center gap-3 group-hover:text-accent transition-colors">
                          <systemDesignFramework.icon className="h-7 w-7" />
                          {systemDesignFramework.title}
                      </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-0 pl-1 pr-1">
                      <Card className="shadow-md rounded-lg border-none bg-transparent">
                      <CardHeader className="pb-2 pt-0 px-0">
                          <CardDescription className="text-sm text-muted-foreground pt-1 whitespace-pre-line">
                          {systemDesignFramework.introduction}
                          </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-4 space-y-3 px-0">
                          <ul className="list-none space-y-3 text-sm text-foreground/80 pl-2 whitespace-pre-line">
                          {systemDesignFramework.steps.map((step, index) => (
                              <li key={`framework-step-${index}`} className="leading-relaxed"
                                  dangerouslySetInnerHTML={{ __html: step.replace(/\*\*(.*?)\*\*/g, '<strong class="text-accent/90">$1</strong>') }}
                              />
                          ))}
                          </ul>
                          <p className="text-sm text-muted-foreground italic pt-2">{systemDesignFramework.conclusion}</p>
                      </CardContent>
                      </Card>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="common-questions-item" className="border-none p-0">
                  <AccordionTrigger 
                    className="text-xl font-semibold text-primary hover:no-underline p-0 mb-3 data-[state=open]:pb-2 data-[state=open]:border-b data-[state=open]:border-primary/20 group"
                    onMouseEnter={() => triggerHoverMessage("Practice with common system design interview questions.")}
                  >
                      <div className="flex items-center gap-3 group-hover:text-accent transition-colors">
                          <HelpCircle className="h-7 w-7" />
                          Common System Design Questions
                      </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-0 pl-1 pr-1">
                      <Accordion type="multiple" className="w-full space-y-4">
                      {systemDesignQuestions.map((question) => (
                          <AccordionItem value={question.id} key={question.id} className="border border-border/70 rounded-xl shadow-md overflow-hidden bg-card hover:shadow-lg transition-shadow">
                          <AccordionTrigger 
                            className="px-6 py-4 text-lg font-semibold hover:no-underline bg-muted/20 hover:bg-muted/40 data-[state=open]:border-b data-[state=open]:border-border/50 group"
                            onMouseEnter={() => triggerHoverMessage(`Learn about: ${question.title}`)}
                          >
                              <div className="flex items-center gap-3 text-left group-hover:text-accent transition-colors">
                              <question.icon className="h-6 w-6 text-primary flex-shrink-0" />
                              <span className="text-gray-700 dark:text-gray-200">{question.title}</span>
                              </div>
                          </AccordionTrigger>
                          <AccordionContent className="p-6 space-y-5">
                              <div>
                              <h5 className="text-md font-semibold text-accent mb-1.5">Problem Statement:</h5>
                              <p className="text-sm text-foreground/80 whitespace-pre-line">{question.problemStatement}</p>
                              </div>
                              <div>
                              <h5 className="text-md font-semibold text-accent mb-1.5">Key Requirements & Considerations:</h5>
                              <ul className="list-disc list-inside space-y-1 text-xs text-foreground/75 pl-4 whitespace-pre-line">
                                  {question.requirements.map((req, index) => <li key={`req-${question.id}-${index}`}>{req}</li>)}
                              </ul>
                              </div>
                              <div>
                              <h5 className="text-md font-semibold text-accent mb-1.5">Relevant Rustik Components:</h5>
                              <div className="flex flex-wrap gap-1.5">
                                  {question.relevantRustikComponents.map((compName, index) => (
                                  <span key={`comp-${question.id}-${index}`} className="px-2 py-0.5 text-[10px] font-medium bg-primary/10 text-primary rounded-full border border-primary/30">
                                      {compName}
                                  </span>
                                  ))}
                              </div>
                              {question.rustikRelevanceNote && (
                                  <p className="text-xs text-muted-foreground mt-2 italic whitespace-pre-line">{question.rustikRelevanceNote}</p>
                              )}
                              </div>
                              <div>
                              <h5 className="text-md font-semibold text-accent mb-1.5">Conceptual Solution Outline:</h5>
                              <div className="text-xs text-foreground/75 prose prose-xs dark:prose-invert max-w-none whitespace-pre-line bg-muted/20 p-3 rounded-md border border-border/40">{question.conceptualSolutionOutline}</div>
                              </div>
                              <div>
                              <h5 className="text-md font-semibold text-accent mb-1.5">Discussion Points for an Interview:</h5>
                              <ul className="list-disc list-inside space-y-1 text-xs text-foreground/75 pl-4">
                                  {question.discussionPoints.map((point, index) => <li key={`disc-${question.id}-${index}`}>{point}</li>)}
                              </ul>
                              </div>
                          </AccordionContent>
                          </AccordionItem>
                      ))}
                      </Accordion>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </main>
      {hoverMessage && (
        <div
          key={Date.now()} 
          className="fixed bottom-5 right-5 p-4 bg-accent text-accent-foreground rounded-lg shadow-2xl z-[100] w-auto max-w-md animate-fade-in-out-message border-2 border-primary/50"
        >
          <div className="flex items-center">
            <div className="flex space-x-1.5 mr-3">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400 animate-ping opacity-80" style={{animationDuration: '1.5s'}}></span>
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-300 animate-ping opacity-80" style={{animationDelay: '0.25s', animationDuration: '1.5s'}}></span>
              <span className="h-2.5 w-2.5 rounded-full bg-green-400 animate-ping opacity-80" style={{animationDelay: '0.5s', animationDuration: '1.5s'}}></span>
            </div>
            <p className="text-sm">{hoverMessage}</p>
          </div>
        </div>
      )}
      <footer className="py-8 text-center text-muted-foreground border-t border-border/50 mt-16">
        <p>&copy; {new Date().getFullYear()} Rustik. Ace your System Design Interview!</p>
      </footer>
    </div>
  );
}

    