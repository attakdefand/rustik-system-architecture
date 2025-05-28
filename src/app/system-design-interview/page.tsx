
import { AppHeader } from '@/components/layout/app-header';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Brain, Lightbulb, Users, LinkIcon, Newspaper, MessageSquare, Server, Database, Network, Scaling, Shield, Layers, HelpCircle, Car, MapPin, TrendingUp, Workflow } from 'lucide-react';

interface InterviewQuestion {
  id: string;
  title: string;
  icon: React.ElementType;
  problemStatement: string;
  requirements: string[];
  relevantRustikComponents: string[];
  conceptualSolutionOutline: string;
  discussionPoints: string[];
}

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
    id: "social-feed",
    title: "Design a Social Media News Feed (e.g., Facebook, X/Twitter)",
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
      "Non-Functional Requirements:",
      "  - High Availability: Feed must be accessible with minimal downtime.",
      "  - Low Latency: Feed generation should be fast (e.g., <200-500ms).",
      "  - Scalability: Handle millions of active users, billions of posts. High read-to-write ratio.",
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
  }
];


const scalingJourneyPhases = [
  {
    icon: Server,
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
    rustikRelevance: ["Load Balancer(s)", "Rust App Nodes (Multiple instances)", "Database Strategies (Read Replicas, Connection Pooling)", "Caching Strategies", "Network Infra Strategies (CDN Integration)"]
  },
  {
    icon: Workflow,
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


export default function SystemDesignInterviewPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 py-10 sm:py-16">
        <div className="text-center mb-12 sm:mb-16">
          <Brain className="h-24 w-24 text-primary mb-8 mx-auto" />
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 text-gray-800 dark:text-gray-100">
            System Design Interview Prep with Rustik
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Leverage Rustik's architectural components and insights to confidently tackle common system design interview questions. Explore example problems and see how fundamental building blocks come together to create scalable and robust solutions.
          </p>
        </div>

        <Card className="w-full max-w-5xl mx-auto shadow-xl rounded-xl mb-12 bg-card">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-primary flex items-center">
              <Lightbulb className="h-7 w-7 mr-3" />
              How Rustik Helps You Prepare
            </CardTitle>
          </CardHeader>
          <CardContent className="text-md text-foreground/80 space-y-3">
            <p>Understanding system design is crucial for modern software engineering roles. Rustik helps by:</p>
            <ul className="list-disc list-inside space-y-1.5 pl-4">
              <li><strong>Demystifying Core Components:</strong> Learn about Anycast IP, Load Balancers, Databases, Caching, Microservices, and more in one place.</li>
              <li><strong>Visualizing Interactions:</strong> The System Visualizer and Master-Flow help you see how components conceptually connect and interact.</li>
              <li><strong>Considering Trade-offs:</strong> AI analyses highlight benefits and challenges of different architectural choices.</li>
              <li><strong>Focusing on Scalability & Resilience:</strong> Many components and insights are geared towards building high-performance, fault-tolerant systems.</li>
            </ul>
            <p>Use the examples below as a starting point. For each, think about how you would use the components discussed in Rustik to build your solution.</p>
          </CardContent>
        </Card>

        <h3 className="text-3xl font-bold tracking-tight text-center mb-10 text-gray-800 dark:text-gray-100">
          Example System Design Problems & Concepts
        </h3>

        <Accordion type="multiple" className="w-full max-w-5xl mx-auto space-y-6">
          <AccordionItem value="scaling-journey" className="border border-border/70 rounded-xl shadow-lg overflow-hidden bg-card">
            <AccordionTrigger className="px-6 py-4 text-xl font-semibold hover:no-underline bg-muted/30 hover:bg-muted/50 data-[state=open]:border-b data-[state=open]:border-border/70">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-7 w-7 text-primary" />
                Understanding the Scaling Journey: 0 to Millions of Users
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-6">
              <p className="text-md text-muted-foreground mb-6">
                Scaling a system is an iterative journey, not a one-time setup. Systems evolve significantly as they grow from serving a few users to millions. This section outlines common phases and architectural shifts.
              </p>
              <div className="space-y-8">
                {scalingJourneyPhases.map((phase, index) => (
                  <Card key={`scaling-phase-${index}`} className="shadow-md hover:shadow-lg transition-shadow duration-300 rounded-lg">
                    <CardHeader className="flex flex-row items-start gap-4 pb-3 bg-primary/5">
                      <phase.icon className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
                      <div className="flex-grow">
                        <CardTitle className="text-lg font-semibold text-primary">{phase.title}</CardTitle>
                        <p className="text-xs text-muted-foreground pt-1">{phase.description}</p>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-3">
                      {phase.characteristics && (
                        <div>
                          <h4 className="text-sm font-semibold text-accent mb-1.5">Key Characteristics:</h4>
                          <ul className="list-disc list-inside space-y-1 text-xs text-foreground/80">
                            {phase.characteristics.map((char, i) => <li key={`char-${i}`}>{char}</li>)}
                          </ul>
                        </div>
                      )}
                       {phase.actions && (
                        <div>
                          <h4 className="text-sm font-semibold text-accent mb-1.5">Common Actions & Strategies:</h4>
                          <ul className="list-disc list-inside space-y-1 text-xs text-foreground/80">
                            {phase.actions.map((action, i) => <li key={`action-${i}`}>{action}</li>)}
                          </ul>
                        </div>
                      )}
                      {phase.pros && (
                        <div>
                          <h4 className="text-sm font-semibold text-accent mb-1.5">Pros at this stage:</h4>
                          <ul className="list-disc list-inside space-y-1 text-xs text-foreground/80">
                            {phase.pros.map((pro, i) => <li key={`pro-${i}`}>{pro}</li>)}
                          </ul>
                        </div>
                      )}
                      {phase.challenges && (
                        <div>
                          <h4 className="text-sm font-semibold text-accent mb-1.5">Common Challenges:</h4>
                          <ul className="list-disc list-inside space-y-1 text-xs text-foreground/80">
                            {phase.challenges.map((challenge, i) => <li key={`chall-${i}`}>{challenge}</li>)}
                          </ul>
                        </div>
                      )}
                       {phase.rustikRelevance && phase.rustikRelevance.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-border/30">
                          <h4 className="text-sm font-semibold text-muted-foreground mb-1.5">Relevant Rustik Components:</h4>
                          <div className="flex flex-wrap gap-1.5">
                            {phase.rustikRelevance.map((compName, i) => (
                              <span key={`rel-${i}`} className="px-2 py-0.5 text-xs font-medium bg-muted text-muted-foreground rounded-full border border-border/50">
                                {compName}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
               <p className="text-sm text-muted-foreground mt-8">
                This is a generalized path. The specific timing and choice of when to implement these changes depend heavily on the application's unique workload, business goals, and available resources.
              </p>
            </AccordionContent>
          </AccordionItem>

          {systemDesignQuestions.map((question) => (
            <AccordionItem value={question.id} key={question.id} className="border border-border/70 rounded-xl shadow-lg overflow-hidden bg-card">
              <AccordionTrigger className="px-6 py-4 text-xl font-semibold hover:no-underline bg-muted/30 hover:bg-muted/50 data-[state=open]:border-b data-[state=open]:border-border/70">
                <div className="flex items-center gap-3 text-left">
                  <question.icon className="h-7 w-7 text-primary flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-200">{question.title}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-6 space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-accent mb-2">Problem Statement:</h4>
                  <p className="text-md text-foreground/80">{question.problemStatement}</p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-accent mb-2">Key Requirements & Considerations:</h4>
                  <ul className="list-disc list-inside space-y-1 text-md text-foreground/80 pl-4 whitespace-pre-line">
                    {question.requirements.map((req, index) => <li key={index}>{req}</li>)}
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-accent mb-2">Relevant Rustik Components:</h4>
                   <div className="flex flex-wrap gap-2">
                    {question.relevantRustikComponents.map((compName, index) => (
                      <span key={index} className="px-2.5 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full border border-primary/30">
                        {compName}
                      </span>
                    ))}
                  </div>
                </div>
                 <div>
                  <h4 className="text-lg font-semibold text-accent mb-2">Conceptual Solution Outline:</h4>
                  <div className="text-md text-foreground/80 prose prose-sm dark:prose-invert max-w-none whitespace-pre-line">{question.conceptualSolutionOutline}</div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-accent mb-2">Discussion Points for an Interview:</h4>
                  <ul className="list-disc list-inside space-y-1 text-md text-foreground/80 pl-4">
                    {question.discussionPoints.map((point, index) => <li key={index}>{point}</li>)}
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

      </main>
      <footer className="py-8 text-center text-muted-foreground border-t border-border/50 mt-16">
        <p>&copy; {new Date().getFullYear()} Rustik. Ace your System Design Interview!</p>
      </footer>
    </div>
  );
}
