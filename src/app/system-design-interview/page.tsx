
import { AppHeader } from '@/components/layout/app-header';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Brain, Lightbulb, Users, LinkIcon, Newspaper, MessageSquare, Server, Database, Network, Scaling, Shield, Layers } from 'lucide-react';

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
      "API Design Styles & Protocols (REST API for shortening, stats; potentially a lightweight redirector not needing full API stack)",
      "Load Balancer(s) (Layer-7 for API, potentially Layer-4 for high-volume redirection endpoints)",
      "Rust App Nodes (For API logic, short code generation, and redirection handling)",
      "Database Strategies (Highly scalable Key-Value store like Redis/DynamoDB for [short_code -> long_URL] mapping; possibly a Relational DB for user accounts/custom URLs if needed, and for analytics aggregation if batch processed)",
      "Caching Strategies (Aggressively cache popular short_code -> long_URL mappings at various levels: CDN, edge servers, in-memory cache on redirector nodes)",
      "Observability & Ops (Metrics for request rates, redirection latency, error rates, click counts)",
      "Async IO + Epoll + Tokio (Crucial for redirector nodes to handle massive concurrent connections with low overhead)"
    ],
    conceptualSolutionOutline: `
1.  **Shortening Process:**
    *   User submits a long URL via a REST API (e.g., \`POST /shorten\`).
    *   The application/Rust App Node generates a unique short code (e.g., 6-8 alphanumeric characters).
        *   Strategy 1: Base62 encode a globally unique counter (requires a distributed counter service like ZooKeeper/etcd or a dedicated DB sequence).
        *   Strategy 2: Hash the long URL + salt, take a portion, check for collision. If collision, retry with a different salt or append a small counter.
        *   Strategy 3: Pre-generate a large pool of unique short codes and store them in a database; pick one when needed.
    *   Store the mapping \`{short_code: long_URL}\` in a highly scalable, low-latency Key-Value database (e.g., Redis, DynamoDB).
    *   Optionally, if a custom alias is provided, check its availability and store it.
    *   Return the short URL (e.g., \`https://your.domain/short_code\`) to the user.

2.  **Redirection Process:**
    *   User accesses \`https://your.domain/short_code\`.
    *   Requests hit Load Balancers, routed to a fleet of lightweight redirector services (Rust App Nodes optimized for speed).
    *   The redirector service first checks an in-memory cache (e.g., LRU cache) for the \`short_code\`.
    *   If not in local cache, it queries a distributed cache layer (e.g., Redis cluster).
    *   If not in distributed cache, it queries the primary Key-Value database for the \`long_URL\` associated with the \`short_code\`.
    *   Once the \`long_URL\` is found, the service issues an HTTP 301 (Permanent Redirect) or 302 (Found/Temporary Redirect) to the client's browser. 301 is good for SEO if permanence is desired.
    *   The \`long_URL\` is cached at various levels to speed up future requests.

3.  **Analytics Tracking:**
    *   For each successful redirection, the redirector service logs the click event.
    *   This can be done asynchronously to avoid impacting redirection latency.
    *   Logged events (e.g., \`short_code\`, \`timestamp\`, \`user_agent\`) can be sent to a message queue (e.g., Kafka, SQS).
    *   A separate analytics processing service consumes these events, aggregates click counts, and stores them (e.g., in a data warehouse or a relational database).
    *   An API endpoint (e.g., \`GET /stats/{short_code}\`) can provide click counts.
`,
    discussionPoints: [
      "Algorithm for generating unique short codes: collisions, predictability, length.",
      "Scalability and choice of database for storing URL mappings (Key-Value store is common).",
      "Minimizing latency for redirections (caching, lightweight redirector service).",
      "Handling custom short URLs / vanity URLs: storage and uniqueness checks.",
      "Rate limiting for API requests (shortening and stats) to prevent abuse.",
      "Analytics processing: real-time vs. batch, data storage for analytics.",
      "Database sharding strategy if the primary mapping store grows extremely large.",
      "Data TTL / URL expiration policy (if any).",
      "Security considerations: preventing malicious URL submissions, open redirect vulnerabilities.",
      "How to handle non-existent short codes (404 error).",
      "CDN integration for caching redirects at the edge."
    ]
  },
  {
    id: "social-feed",
    title: "Design a Social Media News Feed (e.g., Facebook, X/Twitter)",
    icon: Newspaper,
    problemStatement: "Design a system that allows users to post updates and see a news feed consisting of updates from people they follow, ranked by relevance or recency.",
    requirements: [
      "Users can post updates (text, images, videos).",
      "Users can follow other users.",
      "Generate a personalized news feed for each user.",
      "High read-to-write ratio (many more feed views than posts).",
      "Low latency for feed generation.",
      "Scalability to millions of users and posts.",
      "Real-time or near real-time updates to the feed (optional)."
    ],
    relevantRustikComponents: [
      "Microservices Architecture (User service, Post service, Follow service, Feed generation service)",
      "API Design Styles & Protocols (REST/GraphQL for client interactions, gRPC for internal services)",
      "Database Strategies (Graph DB for follow relationships; NoSQL for posts; Relational for users. Consider fan-out on write or fan-out on load for feeds)",
      "Caching Strategies (Cache generated feeds, user profiles, hot posts)",
      "Shared State & Data Plane (Message Queues for asynchronous post processing, feed updates, notifications)",
      "Async IO + Epoll + Tokio (for real-time components if using WebSockets)",
      "Observability & Ops (for monitoring service health and performance)"
    ],
    conceptualSolutionOutline: "When a user posts, the update is stored. If using fan-out on write, the post is pushed to the feeds of all followers. If fan-out on load, the feed is generated when the user requests it by querying posts from followed users. A combination (hybrid) is common. Feeds are often pre-computed and cached. Ranking algorithms determine post order.",
    discussionPoints: [
      "Fan-out on write vs. Fan-out on load trade-offs for feed generation.",
      "Feed ranking algorithms (recency, engagement, personalization).",
      "Scalability of feed storage and generation (e.g., Redis for timeline, Cassandra for posts).",
      "Handling 'hot' users (celebrities with many followers).",
      "Real-time updates vs. polling for new feed items.",
      "Media storage (images, videos) and CDN integration.",
      "Consistency models for posts and follower lists."
    ]
  },
  {
    id: "ride-sharing",
    title: "Design a Ride-Sharing App (e.g., Uber, Lyft)",
    icon: Users, // Could also be Car or MapPin
    problemStatement: "Design a service that connects riders looking for a trip with available drivers nearby. The service should handle ride requests, driver location tracking, pricing, and payments.",
    requirements: [
      "Riders can request rides from their location to a destination.",
      "Drivers can indicate availability and see nearby ride requests.",
      "Match riders with nearby available drivers.",
      "Real-time location tracking for riders and drivers.",
      "Dynamic pricing based on demand and supply.",
      "Handle payments and driver payouts.",
      "High availability and reliability."
    ],
    relevantRustikComponents: [
      "Microservices Architecture (Rider service, Driver service, Matching service, Location service, Payment service)",
      "API Design Styles & Protocols (REST/GraphQL for mobile clients, WebSockets/gRPC for real-time location updates)",
      "Database Strategies (Relational DB for users/rides; Geospatial DB/indexes for location data; NoSQL for driver availability like Redis Sets/Geo Sets)",
      "Async IO + Epoll + Tokio & Shared State & Data Plane (Message Queues for handling concurrent ride requests, location updates, and notifications)",
      "Caching Strategies (Cache driver locations, geofences for pricing)",
      "Service Discovery & Control Plane (for managing microservices)",
      "Observability & Ops (critical for real-time monitoring)"
    ],
    conceptualSolutionOutline: "Drivers periodically update their location and availability (e.g., via WebSockets or frequent HTTP posts). This data is often stored in a system optimized for geospatial queries (like Redis with Geo commands or PostGIS). Riders request rides, providing pickup/dropoff locations. A matching service queries for nearby available drivers based on location and other criteria (e.g., car type). Once a match is found, both rider and driver are notified, and real-time location updates are exchanged. Pricing is calculated dynamically based on distance, estimated time, current demand/supply in the area (surge pricing). Payments are processed via an integrated payment gateway.",
    discussionPoints: [
      "Driver-rider matching algorithm (efficiency, fairness, minimizing wait times).",
      "Scalability of location tracking and updates (handling many drivers moving simultaneously).",
      "Handling concurrent ride requests and ensuring consistency in driver availability.",
      "Dynamic pricing model details and implementation (geofencing, surge calculation).",
      "Payment processing, security, and fraud detection.",
      "Ensuring safety and trust (driver verification, SOS features).",
      "Communication channels (in-app chat, push notifications).",
      "Database choice for handling geospatial data efficiently."
    ]
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
          Example System Design Problems
        </h3>

        <Accordion type="multiple" className="w-full max-w-5xl mx-auto space-y-6">
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
