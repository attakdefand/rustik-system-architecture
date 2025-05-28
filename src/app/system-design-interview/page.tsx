
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
  conceptualSolutionOutline: string; // Placeholder for more detailed steps or AI generation
  discussionPoints: string[];
}

const systemDesignQuestions: InterviewQuestion[] = [
  {
    id: "url-shortener",
    title: "Design a URL Shortener (e.g., TinyURL, bit.ly)",
    icon: LinkIcon,
    problemStatement: "Design a service that takes a long URL and generates a unique, short alias. When users access the short alias, they should be redirected to the original long URL. The service should also track click analytics.",
    requirements: [
      "Generate short, unique URLs.",
      "Redirect short URLs to original long URLs with low latency.",
      "Handle high read traffic (redirections) and moderate write traffic (new URL shortening).",
      "Track basic analytics (number of clicks per short URL).",
      "High availability and fault tolerance.",
      "Short URLs should not be guessable easily (optional but good to consider)."
    ],
    relevantRustikComponents: [
      "API Design Styles & Protocols (REST API for shortening and stats)",
      "Load Balancer(s) (Layer-7 for API, Layer-4 for redirection if very high scale)",
      "Rust App Nodes (for API logic and redirection handling)",
      "Database Strategies (Key-Value store like Redis or DynamoDB for mapping short to long URLs; Relational DB for user accounts/analytics if needed)",
      "Caching Strategies (Cache popular short URLs at edge/CDN or in-memory for faster redirection)",
      "Observability & Ops (Metrics for request rates, latency, errors)"
    ],
    conceptualSolutionOutline: "Users submit long URLs via an API. The application generates a unique short code (e.g., using a base62 encoding of a counter or a hash). This mapping is stored in a highly scalable key-value database. When a short URL is accessed, a lightweight redirection service looks up the original URL from the database and issues an HTTP redirect. Analytics are typically updated asynchronously.",
    discussionPoints: [
      "Algorithm for generating unique short codes (and handling collisions).",
      "Scalability of the database for reads and writes.",
      "Latency of redirection.",
      "Custom short URLs / vanity URLs.",
      "Rate limiting API requests.",
      "Analytics processing (real-time vs. batch)."
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
      "Message Queues (for asynchronous post processing, feed updates, notifications)",
      "Async IO + Epoll + Tokio (for real-time components if using WebSockets)",
      "Observability & Ops (for monitoring service health and performance)"
    ],
    conceptualSolutionOutline: "When a user posts, the update is stored. If using fan-out on write, the post is pushed to the feeds of all followers. If fan-out on load, the feed is generated when the user requests it by querying posts from followed users. A combination (hybrid) is common. Feeds are often pre-computed and cached. Ranking algorithms determine post order.",
    discussionPoints: [
      "Fan-out on write vs. Fan-out on load trade-offs.",
      "Feed ranking algorithms (recency, engagement, personalization).",
      "Scalability of feed storage and generation.",
      "Handling 'hot' users (celebrities with many followers).",
      "Real-time updates vs. polling.",
      "Media storage and CDN integration."
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
      "Database Strategies (Relational DB for users/rides; Geospatial DB/indexes for location data; NoSQL for driver availability)",
      "Async IO + Epoll + Tokio & Message Queues (for handling concurrent ride requests, location updates, and notifications)",
      "Caching Strategies (Cache driver locations, geofences for pricing)",
      "Service Discovery & Control Plane (for managing microservices)",
      "Observability & Ops (critical for real-time monitoring)"
    ],
    conceptualSolutionOutline: "Drivers periodically update their location and availability. Riders request rides, providing pickup/dropoff. A matching service uses geospatial queries to find nearby available drivers. Once matched, real-time location updates are exchanged. Pricing is calculated based on distance, time, and demand. Payments are processed via a payment gateway.",
    discussionPoints: [
      "Driver-rider matching algorithm (efficiency, fairness).",
      "Scalability of location tracking and updates.",
      "Handling concurrent ride requests.",
      "Dynamic pricing model details.",
      "Payment processing and fraud detection.",
      "Ensuring safety and trust.",
      "Surge pricing implementation and user experience."
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

        <Card className="w-full max-w-5xl mx-auto shadow-xl rounded-xl mb-12">
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
                  <ul className="list-disc list-inside space-y-1 text-md text-foreground/80 pl-4">
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
                  <p className="text-md text-foreground/80 prose prose-sm dark:prose-invert max-w-none">{question.conceptualSolutionOutline}</p>
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

    