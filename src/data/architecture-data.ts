
import type { LucideIcon } from 'lucide-react';
import { Globe2, Network, ServerCog, Zap, Cpu, Database, Router as RouterIcon, Lightbulb, Layers, ShieldCheck, DollarSign, Settings2, Archive, Gauge, Rocket, Scaling, ShieldAlert, Gavel } from 'lucide-react';

export interface TypeDefinition {
  name: string;
  description: string;
}

export interface ArchitectureComponent {
  id: string;
  title: string;
  icon: LucideIcon;
  types: TypeDefinition[];
  useCases: string[];
  realWorldExamples: string[];
  eli5Summary: string;
  eli5Details: string;
  complexity: 'Beginner' | 'Intermediate' | 'Advanced';
  implementationGuidance?: string[];
}

export const architectureComponents: ArchitectureComponent[] = [
  {
    id: 'anycast-ip',
    title: 'Anycast IP',
    icon: Globe2,
    types: [
      { name: 'IPv4 Anycast (e.g. 203.0.113.0/24)', description: 'Uses older internet addresses, widely compatible for broad reach.' },
      { name: 'IPv6 Anycast (e.g. 2001:db8::/32)', description: 'Uses newer, larger pool of internet addresses for future-proofing.' },
      { name: 'Global Anycast (announced from POPs on multiple continents)', description: 'Directs users to the nearest server worldwide for lowest latency.' },
      { name: 'Regional Anycast (limited to a single continent or country)', description: 'Optimizes routing and content delivery within a specific geographic area.' },
    ],
    useCases: [
      'CDNs & DNS: serve static content or DNS lookups from the nearest edge.',
      'DDoS Mitigation: distribute attack traffic across many POPs.',
      'Global APIs: reduce latency by routing each user to their closest data center.',
    ],
    realWorldExamples: [
      'Google Public DNS (8.8.8.8 and 8.8.4.4) uses global IPv4 anycast so lookups come from the nearest Google POP.',
      'Cloudflare’s network serves website assets and DNS via anycast, giving fast responses worldwide.',
    ],
    eli5Summary: 'Detailed Explanation',
    eli5Details: 'Imagine you have the same toy in lots of playgrounds around the world. When your friend wants to play, they automatically go to the nearest playground and pick up the toy—so they don’t have to travel far and can play quickly. If one playground is closed, they just go to the next nearest one without even noticing.',
    complexity: 'Intermediate',
    implementationGuidance: [
      'Select a network provider offering Anycast services and Points of Presence (PoPs) in your target regions.',
      'Configure BGP (Border Gateway Protocol) to announce your IP prefix from all chosen PoPs.',
      'Implement robust health checks at each PoP to ensure traffic is only routed to healthy origin servers.',
      'Monitor routing and latency to verify traffic is distributed as expected.',
    ],
  },
  {
    id: 'load-balancers',
    title: 'Load Balancer(s)',
    icon: Network,
    types: [
      { name: 'Layer-4 (TCP/QUIC) LB', description: 'Handles raw connections (e.g. HAProxy in TCP mode, Envoy TCP proxy); distributes traffic based on network-level info (IP, port); fast & simple.' },
      { name: 'Layer-7 (HTTP/TLS) LB', description: 'Terminates TLS, inspects HTTP, applies routing rules (e.g. Envoy HTTP, NGINX, AWS ALB); smarter routing based on application data (URLs, headers).' },
      { name: 'Cloud-native LB', description: 'Managed services (Google Cloud TCP/UDP/SSL LB, AWS NLB) provided by cloud platforms, often with tight integration.' },
    ],
    useCases: [
      'TLS Termination: offload encryption so your app nodes stay fast.',
      'Connection Distribution: spread new connections evenly across healthy backends.',
      'Sticky Sessions: send the same client to the same backend when needed.',
    ],
    realWorldExamples: [
      'Netflix uses AWS NLB to distribute millions of video-stream connections.',
      'Shopify uses HAProxy and Envoy in front of their microservices to manage traffic surges.',
    ],
    eli5Summary: 'Detailed Explanation',
    eli5Details: 'Think of a teacher at the door who sends each new kid to an empty classroom. If one classroom is full or the teacher sees a problem inside, they send the next kid to a different room—so no room gets too crowded.',
    complexity: 'Intermediate',
    implementationGuidance: [
      'Choose a load balancer type (L4/L7, software/hardware/cloud) based on application needs.',
      'Configure backend server pools and health check mechanisms.',
      'Set up routing rules, session persistence (if needed), and TLS termination policies.',
      'Monitor load balancer metrics (request count, latency, error rates) and backend health.',
    ],
  },
  {
    id: 'api-gateway',
    title: 'API Gateway',
    icon: RouterIcon,
    types: [
        { name: 'Request Routing & Composition (Aggregator Pattern)', description: 'Directs API requests to backend services, potentially aggregating results from multiple services.' },
        { name: 'Authentication & Authorization', description: 'Verifies caller identity and permissions before allowing access to backend services.' },
        { name: 'Rate Limiting & Quotas', description: 'Protects backend services from overload by controlling the number of requests allowed.' },
        { name: 'Request/Response Transformation', description: 'Modifies request or response payloads to match backend service expectations or client needs.' },
        { name: 'API Versioning Support', description: 'Manages multiple versions of APIs simultaneously, allowing graceful upgrades.' },
    ],
    useCases: [
        'Providing a single, unified entry point for a microservices backend.',
        'Enforcing security policies like authentication and authorization consistently.',
        'Managing API traffic, quotas, and throttling to protect backend services.',
        'Simplifying client interaction by abstracting backend complexity and composing responses.'
    ],
    realWorldExamples: [
        'Amazon API Gateway for serverless and containerized backends.',
        'Kong Gateway as a popular open-source option.',
        'Apigee (Google Cloud) for enterprise API management.'
    ],
    eli5Summary: 'Detailed Explanation',
    eli5Details: "Imagine a very organized main reception desk for a huge office building with many different departments (your microservices). This desk takes all incoming calls (API requests), checks who is calling and if they're allowed (auth), directs them to the correct department, sometimes gathers info from a few departments before replying, and makes sure no single department gets too many calls at once.",
    complexity: 'Intermediate',
    implementationGuidance: [
        'Choose a managed cloud service (AWS API Gateway, Azure API Management, Google Apigee) or self-host (Kong, Tyk).',
        'Define clear API contracts (e.g., using OpenAPI/Swagger) for your backend services.',
        'Configure routing rules to map public API endpoints to internal microservices.',
        'Implement authentication (e.g., OAuth2, API Keys) and authorization policies.',
        'Set up rate limiting and usage quotas to prevent abuse and ensure fair usage.'
    ]
  },
  {
    id: 'rust-app-nodes',
    title: 'Rust App Nodes',
    icon: ServerCog,
    types: [
      { name: 'Single-binary service', description: 'One executable per node (e.g. your app_server); simple deployment, all logic in one file.' },
      { name: 'Containerized (Docker/Kubernetes)', description: 'Each node in its own container/pod; ensures consistent environments, simplifies scaling.' },
      { name: 'VM-based', description: 'Each node on a dedicated virtual machine; provides strong isolation but can be heavier.' },
    ],
    useCases: [
      'High-performance APIs: handling thousands of requests per second.',
      'Microservices: small, focused services talking over the network.',
      'Background Workers: heavy-CPU tasks offloaded from main app.',
    ],
    realWorldExamples: [
      'Discord uses Rust/Tokio for their voice service to handle millions of concurrent calls.',
      'Dropbox migrated parts of their sync engine to Rust for speed and safety.',
    ],
    eli5Summary: 'Detailed Explanation',
    eli5Details: 'Imagine each classroom has a super-smart robot teacher (Rust app). That robot can talk to lots and lots of kids all at once really fast and never gets tired or makes silly mistakes.',
    complexity: 'Advanced',
    implementationGuidance: [
      'Structure your application using a web framework like Actix, Axum, or Rocket.',
      'Utilize crates like Tokio for asynchronous operations and Serde for (de)serialization.',
      'Implement thorough error handling and logging (e.g., using `tracing` or `log` crates).',
      'Containerize your application (e.g., with Docker) for consistent deployment and scaling.',
      'Apply relevant software design patterns (e.g., Gang of Four patterns) to structure your application logic for maintainability and flexibility.',
    ],
  },
  {
    id: 'microservices-architecture',
    title: 'Microservices Architecture',
    icon: Layers,
    types: [
      { name: 'Independent Service Decomposition', description: 'Breaking down large applications into smaller, self-contained, and independently deployable services.' },
      { name: 'API-Driven Communication (e.g., REST, gRPC)', description: 'Services communicate via well-defined APIs, promoting loose coupling.' },
      { name: 'Decentralized Data Management', description: 'Each microservice typically owns its own database to ensure autonomy.' },
      { name: 'Containerization & Orchestration (e.g., Kubernetes)', description: 'Commonly used for deploying, scaling, and managing microservices.' },
      { name: "Database per Service Principle", description: "Each microservice owns and manages its own database schema and data, ensuring loose coupling and independent evolution." },
      { name: "Saga Pattern", description: "Manages data consistency across multiple services in distributed transactions using a sequence of local transactions and compensating actions." },
      { name: "Sidecar Pattern", description: "Deploys auxiliary components (e.g., proxies, logging agents) alongside a main application in a separate process or container." },
    ],
    useCases: [
      'Building large, complex applications that require high scalability and agility.',
      'Enabling independent development, deployment, and scaling of different application parts.',
      'Allowing different technology stacks for different services if needed.',
      'Improving fault isolation between different functionalities.'
    ],
    realWorldExamples: [
      'Netflix: A pioneer of microservices, using them to handle massive streaming and backend operations.',
      'Amazon: Their e-commerce platform is built with a vast number of microservices.',
      'Spotify: Music streaming service composed of many services (recommendations, playback, user accounts, etc.).',
    ],
    eli5Summary: 'Detailed Explanation',
    eli5Details: "Imagine instead of one giant robot doing everything in a toy factory, you have many smaller, specialized robots. One robot just puts wheels on cars, another paints them, and another puts them in boxes. Each robot works independently, and if one needs fixing or upgrading, it doesn't stop the whole factory. They talk to each other through simple messages.",
    complexity: 'Advanced',
    implementationGuidance: [
      'Carefully define service boundaries based on business capabilities (Domain-Driven Design can help).',
      'Establish robust inter-service communication mechanisms (synchronous like REST/gRPC, or asynchronous via message queues).',
      'Implement service discovery to allow services to find each other dynamically.',
      'Set up comprehensive monitoring, logging, and distributed tracing for observability across services.',
      'Invest in mature CI/CD pipelines for automated testing and independent deployment of services.',
      'Address challenges like data consistency across services (e.g., using Sagas) and managing distributed transactions if needed.'
    ],
  },
  {
    id: 'async-io',
    title: 'Async IO + Epoll + Tokio',
    icon: Zap,
    types: [
      { name: 'Epoll (Linux)', description: 'Efficiently monitors many file descriptors for I/O events on Linux systems.' },
      { name: 'Kqueue (macOS/BSD)', description: 'Similar to epoll, but for macOS and BSD-based operating systems.' },
      { name: 'IOCP (Windows)', description: 'Windows-specific mechanism for scalable asynchronous I/O operations.' },
      { name: 'Tokio Runtime (Rust)', description: 'A popular Rust framework for writing fast, reliable, and concurrent network applications.' },
    ],
    useCases: [
      'High-concurrency servers: serve many connections with few threads.',
      'Streaming & WebSockets: keep idle connections open without blocking.',
      'Real-time services: chat, gaming, live data feeds.',
    ],
    realWorldExamples: [
      'Nginx uses epoll under the hood for its event loop.',
      'Node.js uses libuv (which on Linux uses epoll) to handle thousands of simultaneous sockets.',
      'Tokio is the de-facto async runtime for high-performance Rust network services.',
    ],
    eli5Summary: 'Detailed Explanation',
    eli5Details: 'Picture a mail sorter who doesn’t deliver every letter one by one but instead watches lots of mailboxes at once and only goes to the ones that have new mail. That mail sorter never stands idle or gets stuck waiting.',
    complexity: 'Advanced',
    implementationGuidance: [
      'In Rust, use the Tokio runtime and its `async/await` features.',
      'Wrap blocking I/O operations in `tokio::task::spawn_blocking` to avoid blocking the async runtime.',
      'Utilize non-blocking libraries for database access, network requests, etc. (e.g., `reqwest`, `sqlx`).',
      'Be mindful of `Send` and `Sync` bounds when sharing data across async tasks.',
    ],
  },
  {
    id: 'per-core-socket',
    title: 'Per-core Socket Accept + Sharding',
    icon: Cpu,
    types: [
      { name: 'SO_REUSEPORT based sharding', description: 'Allows multiple sockets to bind to the same IP address and port, distributing connections kernel-side.' },
      { name: 'Thread-per-core model', description: 'Assigns dedicated threads to each CPU core to handle its own set of connections.' },
      { name: 'Connection handoff mechanisms', description: 'A central listener hands off accepted connections to worker threads/processes.' },
    ],
    useCases: [
      'Eliminate accept bottleneck: every CPU core can accept new connections.',
      'CPU locality: each core handles its own connections, reducing cross-core cache misses.',
      'Ultra-low latency applications.',
    ],
    realWorldExamples: [
      'Caddy web server uses SO_REUSEPORT for multi-core scalability.',
      'Envoy’s listener implementation can leverage per-core dispatch to maximize throughput.',
      'High-frequency trading systems often use per-core designs.',
    ],
    eli5Summary: 'Detailed Explanation',
    eli5Details: 'Imagine each robot teacher has its own door to the playground. When a new kid arrives, whichever robot’s door the kid walks up to is ready to let them in—so no single door gets a big line.',
    complexity: 'Advanced',
    implementationGuidance: [
      'For network servers in Rust, use a library like `socket2` to enable `SO_REUSEPORT` on your listening socket.',
      'Spawn a separate Tokio runtime or worker thread for each CPU core.',
      'Each thread/runtime creates its own listener socket, binds to the same address/port, and sets `SO_REUSEPORT`.',
      'Design your application to minimize shared mutable state between cores to maximize locality benefits.',
    ],
  },
  {
    id: 'database-strategies',
    title: 'Database Strategies',
    icon: Database,
    types: [
      { name: "Database Sharding (Horizontal Partitioning)", description: "Splits large databases into smaller, faster, more manageable pieces called shards." },
      { name: "Read Replicas for Read Scalability", description: "Creates copies of the database to handle read requests, reducing load on the primary." },
      { name: "NoSQL Databases (Key-Value, Document, Columnar)", description: "Flexible schema databases optimized for specific data models and scale needs." },
      { name: "Database Caching (e.g., Redis, Memcached)", description: "Stores frequently accessed data in fast memory to reduce database hits." },
      { name: "Connection Pooling", description: "Manages a pool of database connections to improve efficiency and performance." },
      { name: "Command Query Responsibility Segregation (CQRS)", description: "Separates read (queries) and write (commands) operations into different models/data stores." },
      { name: "Event Sourcing", description: "Persists entity state as a sequence of immutable state-changing events, providing a full audit log." },
    ],
    useCases: [
      "Scaling applications with large datasets and high transaction volumes.",
      "Improving read performance for data-intensive applications.",
      "Handling unstructured or semi-structured data at scale.",
      "Reducing database load and improving response times for frequently accessed data.",
      "Optimizing systems with different read/write patterns or needing strong auditability."
    ],
    realWorldExamples: [
      "Facebook shards its user database to manage billions of profiles.",
      "Wikipedia uses read replicas to serve high volumes of article views.",
      "Twitter (X) uses various NoSQL solutions like Manhattan for different data needs.",
      "Many e-commerce sites use Redis to cache product details and user sessions.",
      "Financial systems using Event Sourcing for auditable transaction histories."
    ],
    eli5Summary: "Detailed Explanation",
    eli5Details: "How we make sure our 'toy box' (database) can hold all the toys for 1 billion friends and find them quickly. We might have many toy boxes (sharding), copies of popular toy lists (read replicas), special super-fast toy boxes for certain toys (NoSQL), remember where recently used toys are (caching), or even have separate lists for 'toys we are playing with now' vs 'all toys we own' (CQRS/Event Sourcing).",
    complexity: "Advanced",
    implementationGuidance: [
      "Analyze data access patterns to choose the right sharding key or NoSQL model.",
      "Implement robust data replication and synchronization for read replicas.",
      "Evaluate consistency models (e.g., eventual, strong) for NoSQL databases.",
      "Develop a clear caching strategy, including cache invalidation mechanisms.",
      "For CQRS/Event Sourcing, carefully model commands, events, and queries, and consider the implications for data consistency and read model projections."
    ]
  },
  {
    id: 'network-infra-strategies',
    title: 'Network Infrastructure Strategies',
    icon: RouterIcon,
    types: [
      { name: "High-Bandwidth Global Connectivity", description: "Ensures fast data transfer worldwide through extensive fiber optic networks." },
      { name: "Strategic ISP Peering Agreements", description: "Optimizes traffic routes between networks, reducing latency and costs." },
      { name: "Sufficient Point of Presence (PoP) Capacity", description: "Ensures edge locations can handle large volumes of user traffic without congestion." },
      { name: "Content Delivery Network (CDN) Integration", description: "Distributes content closer to users globally for faster access." },
      { name: "Redundant Network Paths", description: "Provides alternative routes for data if a primary path fails, ensuring reliability." }
    ],
    useCases: [
      "Ensuring low-latency access for a global user base.",
      "Optimizing traffic routes and reducing transit costs.",
      "Handling massive ingress/egress traffic at edge locations.",
      "Minimizing network-related service disruptions."
    ],
    realWorldExamples: [
      "Major cloud providers (AWS, Google Cloud, Azure) invest heavily in their global backbone networks.",
      "Large CDNs (Akamai, Cloudflare) have extensive peering and PoP networks.",
      "Streaming services require robust network infrastructure to deliver video content globally."
    ],
    eli5Summary: "Detailed Explanation",
    eli5Details: "Making sure the roads to our playgrounds are super wide and fast, and that we have enough playgrounds in many places so friends don't get stuck in traffic. We also build backup roads in case one is closed.",
    complexity: "Advanced",
    implementationGuidance: [
      "Partner with multiple Tier-1 and Tier-2 network providers.",
      "Negotiate peering agreements to optimize traffic flow.",
      "Strategically locate PoPs close to user concentrations.",
      "Implement comprehensive network monitoring and traffic engineering."
    ]
  },
  {
    id: 'app-design-principles',
    title: 'Application Design Principles for Scale',
    icon: Lightbulb,
    types: [
      { name: "Optimized Algorithms & Data Structures", description: "Uses efficient code logic to minimize resource usage and processing time." },
      { name: "Efficient Data Access Patterns", description: "Optimizes how the application reads and writes data to reduce I/O bottlenecks." },
      { name: "Stateless Service Design", description: "Ensures services don't store session data locally, allowing easy scaling and failover." },
      { name: "Asynchronous Processing for Long Tasks", description: "Offloads time-consuming operations to background workers to keep the app responsive." },
    ],
    useCases: [
      "Minimizing CPU and memory footprint per request.",
      "Reducing I/O bottlenecks and database contention.",
      "Enabling easy horizontal scaling and fault isolation.",
      "Improving responsiveness by offloading background work."
    ],
    realWorldExamples: [
      "High-frequency trading systems rely on highly optimized algorithms.",
      "Search engines use efficient indexing and query processing.",
      "Many modern web applications are built as stateless microservices.",
      "E-commerce platforms use async processing for order fulfillment and notifications."
    ],
    eli5Summary: "Detailed Explanation",
    eli5Details: "Teaching our robot teachers (apps) to be super smart and fast in how they talk to kids and find information, and making sure they don't get confused if a kid talks to a different robot teacher next time. Also, if a task takes a long time, the robot does it in the background so the kid doesn't have to wait.",
    complexity: "Advanced",
    implementationGuidance: [
      "Profile applications to identify performance bottlenecks.",
      "Design database queries and data access layers carefully.",
      "Store session state externally (e.g., in Redis) for stateless services.",
      "Use message queues (e.g., Kafka, RabbitMQ) for asynchronous tasks.",
      "Apply established software design patterns (e.g., Gang of Four patterns) to structure internal application code for robustness and maintainability."
    ]
  },
  {
    id: 'caching-strategies',
    title: 'Caching Strategies',
    icon: Layers,
    types: [
      { name: "Content Delivery Network (CDN) Caching", description: "Stores static content (images, videos) on edge servers close to users." },
      { name: "Load Balancer Caching", description: "Some advanced load balancers can cache frequently requested content." },
      { name: "Distributed In-Memory Caching (e.g., Redis, Memcached)", description: "Shares a fast cache across multiple application servers." },
      { name: "Application-Level / Local In-Memory Caching", description: "Caches data within the application instance itself for quick access." },
      { name: "Database Query Caching", description: "Stores results of frequent database queries to avoid re-computation." },
      { name: "Browser Caching", description: "Instructs user browsers to store assets locally, reducing server requests." }
    ],
    useCases: [
      "Reducing latency for static and dynamic content delivery.",
      "Offloading origin servers and improving overall system performance.",
      "Speeding up access to frequently used data.",
      "Minimizing redundant computations or database queries."
    ],
    realWorldExamples: [
      "News websites use CDNs to cache articles and images.",
      "Social media platforms cache user profiles and timelines.",
      "APIs often cache responses from underlying services.",
      "Databases cache frequently executed query plans and results."
    ],
    eli5Summary: "Detailed Explanation",
    eli5Details: "Keeping copies of popular toys or information in many easy-to-reach places (like a shelf near the playground entrance, in the teacher's desk, or even in kids' backpacks) so they don't always have to go to the main toy box. Even the kid's browser can remember some things!",
    complexity: "Advanced",
    implementationGuidance: [
      "Identify cacheable data and appropriate TTLs (Time To Live).",
      "Choose the right cache topology (e.g., look-aside, write-through, write-behind).",
      "Implement effective cache invalidation or update strategies.",
      "Monitor cache hit rates and performance impact."
    ]
  },
  {
    id: 'operational-excellence',
    title: 'Operational Excellence Pillars',
    icon: ShieldCheck,
    types: [
      { name: "Comprehensive Monitoring & Observability", description: "Metrics, logs, traces to understand system health and behavior." },
      { name: "Automated Alerting & Incident Response", description: "Notifies teams of issues and helps manage responses automatically." },
      { name: "Automated Scaling (Horizontal & Vertical)", description: "Adjusts system capacity automatically based on demand." },
      { name: "Safe Deployment Strategies", description: "Blue/Green, Canary, Rolling releases for minimal risk software updates." },
      { name: "Infrastructure as Code (IaC) & Configuration Management", description: "Manages infrastructure and configurations via code for consistency." },
      { name: "Centralized Logging", description: "Collecting all logs from various services into a central system for analysis and troubleshooting." },
      { name: "Distributed Tracing", description: "Tracking requests as they flow through multiple services to identify bottlenecks and debug issues in distributed systems." }
    ],
    useCases: [
      "Proactively identifying and resolving issues before user impact.",
      "Maintaining system performance and availability under varying loads.",
      "Deploying new features and updates safely and efficiently.",
      "Ensuring consistent and reproducible environments across the board."
    ],
    realWorldExamples: [
      "Netflix's Simian Army (Chaos Monkey) tests system resilience proactively.",
      "Cloud providers (AWS, Azure, GCP) offer extensive monitoring and auto-scaling capabilities.",
      "Mature tech companies use sophisticated CI/CD pipelines with automated canary deployments.",
      "Tools like Terraform and Ansible are widely used for IaC and configuration management."
    ],
    eli5Summary: "Detailed Explanation",
    eli5Details: "Having really good playground monitors who watch everything (monitoring), can quickly add more play space if lots of kids show up (auto-scaling), have safe ways to introduce new toys (deployments), and make sure all playground rules are followed everywhere (config management). They also have a plan if something breaks (incident response), and can track where any kid has been all day (tracing).",
    complexity: "Advanced",
    implementationGuidance: [
      "Implement centralized logging (e.g., ELK stack, Loki) and metrics (e.g., Prometheus, Grafana).",
      "Utilize distributed tracing tools (e.g., Jaeger, OpenTelemetry).",
      "Define clear Service Level Objectives (SLOs) and set up alerts.",
      "Automate infrastructure provisioning and deployment processes.",
      "Regularly test failover and disaster recovery procedures."
    ]
  },
  {
    id: 'security-architecture-principles',
    title: 'Security Architecture Principles',
    icon: ShieldAlert,
    types: [
        { name: "Defense in Depth", description: "Applying multiple layers of security controls throughout the system." },
        { name: "Zero Trust Architecture", description: "Never trust, always verify; assumes breaches are inevitable and limits blast radius." },
        { name: "Data Encryption (In Transit & At Rest)", description: "Protecting sensitive data whether it's moving across networks or stored." },
        { name: "Identity & Access Management (IAM)", description: "Controlling who can access what resources, based on the principle of least privilege." },
        { name: "DDoS Protection & Web Application Firewall (WAF)", description: "Mitigating large-scale denial-of-service attacks and filtering malicious web traffic." }
    ],
    useCases: [
        "Protecting against unauthorized access and data breaches.",
        "Ensuring data privacy and confidentiality for users.",
        "Maintaining service availability and integrity, even under attack.",
        "Complying with security regulations and standards."
    ],
    realWorldExamples: [
        "Multi-factor authentication (MFA) for all administrative access.",
        "Using TLS/SSL for all network communication (data in transit).",
        "Encrypting databases and storage volumes (data at rest).",
        "Cloudflare or AWS Shield for DDoS mitigation."
    ],
    eli5Summary: 'Detailed Explanation',
    eli5Details: "Building a super-secure castle for our playground! This means having many layers of walls (defense in depth), always checking everyone's ID even if they're already inside (zero trust), using secret codes for all messages (encryption), and having strong guards at the main gate to stop bad guys or too many people rushing in at once (DDoS/WAF).",
    complexity: 'Advanced',
    implementationGuidance: [
        "Conduct regular security audits and penetration testing.",
        "Implement robust IAM policies and regularly review access rights.",
        "Use strong encryption for all sensitive data, both in transit and at rest.",
        "Deploy WAF and DDoS mitigation services at the network edge.",
        "Develop an incident response plan for security breaches."
    ]
  },
  {
    id: 'cost-management',
    title: 'Cost Management Strategies',
    icon: DollarSign,
    types: [
      { name: "Resource Optimization & Rightsizing", description: "Ensures resources (servers, databases) match actual needs to avoid overspending." },
      { name: "Utilizing Reserved Instances/Capacity or Savings Plans", description: "Commits to usage for discounted pricing from cloud providers." },
      { name: "Leveraging Usage-Based & Spot Instances/Services", description: "Pays only for what's used, or uses spare capacity at lower costs." },
      { name: "Comprehensive Cost Monitoring & Allocation (Tagging)", description: "Tracks spending and attributes costs to specific projects or teams." },
      { name: "FinOps Practices & Budgeting", description: "Implements financial operations principles for cloud cost management and planning." }
    ],
    useCases: [
      "Minimizing infrastructure spend without sacrificing performance or reliability.",
      "Predicting and controlling cloud costs effectively.",
      "Allocating costs to specific teams, projects, or features.",
      "Making data-driven decisions about resource usage."
    ],
    realWorldExamples: [
      "Companies analyze cloud bills to identify underutilized resources.",
      "Startups often rely on spot instances for batch processing to save costs.",
      "Enterprises implement sophisticated tagging strategies for cost allocation.",
      "Dedicated FinOps teams help organizations optimize cloud spending."
    ],
    eli5Summary: "Detailed Explanation",
    eli5Details: "Making sure building and running all our awesome playgrounds doesn't cost too much money, by using only what we need, getting good deals on play equipment, using cheaper options for non-urgent tasks, and keeping track of all spending.",
    complexity: "Intermediate",
    implementationGuidance: [
      "Regularly review resource utilization and identify optimization opportunities.",
      "Use cloud provider cost management tools and third-party solutions.",
      "Implement a consistent tagging strategy for all resources.",
      "Establish a FinOps culture and processes within the organization."
    ]
  },
  {
    id: 'service-discovery-control-plane',
    title: 'Service Discovery & Control Plane',
    icon: Settings2,
    types: [
        { name: "Kubernetes (etcd + API server + controllers)", description: "Cluster-native service discovery, configuration, and orchestration." },
        { name: "HashiCorp Consul", description: "DNS/API-based service registry, health checking, and KV store for configuration." },
        { name: "Envoy + xDS Control Plane", description: "Dynamic configuration API (xDS) for Envoy proxies, often part of a service mesh." },
        { name: "Service Mesh (e.g., Istio, Linkerd)", description: "Dedicated infrastructure layer for managing service-to-service communication, including discovery." }
    ],
    useCases: [
        "Dynamically locating microservices across a distributed system.",
        "Distributing configuration updates (e.g., feature flags, routing rules) to services.",
        "Monitoring service health and enabling intelligent load balancing.",
        "Orchestrating complex deployments and traffic shifting."
    ],
    realWorldExamples: [
        "Kubernetes: CoreDNS for service discovery, API server for configuration.",
        "Cloud providers often offer managed versions of Consul or Kubernetes.",
        "Many large-scale microservice deployments use Istio or Linkerd."
    ],
    eli5Summary: 'Detailed Explanation',
    eli5Details: "This layer helps keep track of which app-nodes exist, where they are, and push configuration or health updates to them. Imagine a school directory that tells everyone where each robot teacher is, and the principal's office that sends out new rules to all teachers.",
    complexity: 'Advanced',
    implementationGuidance: [
        "Choose a discovery mechanism based on your orchestration platform (e.g., Kubernetes-native, or standalone like Consul).",
        "Integrate service registration/deregistration into your application deployment lifecycle.",
        "Define how configuration updates are propagated (e.g., push via control plane, pull by services).",
        "Ensure the control plane itself is highly available and resilient, as it's critical infrastructure."
    ]
  },
  {
    id: 'shared-state-data-plane',
    title: 'Shared State & Data Plane',
    icon: Archive,
    types: [
        { name: "Distributed Caches (Redis, Memcached)", description: "Fast, shared memory stores for frequently accessed data to speed up applications." },
        { name: "Relational Databases (PostgreSQL, MySQL with replicas/sharding)", description: "Traditional databases for structured data, scaled with techniques like read replicas or sharding." },
        { name: "NoSQL Databases (MongoDB, Cassandra, DynamoDB)", description: "Flexible databases for various data models (document, key-value, columnar), often prioritizing horizontal scalability." },
        { name: "Message Queues (Kafka, RabbitMQ, Pulsar)", description: "Systems for enabling asynchronous communication and decoupling between different parts of an application." },
        { name: "Object Storage (S3, GCS, MinIO)", description: "Scalable storage for large, unstructured data like files, images, videos, and backups." }
    ],
    useCases: [
        "Storing and retrieving persistent application data.",
        "Caching frequently accessed information to reduce latency.",
        "Enabling asynchronous communication and event-driven architectures.",
        "Persisting large binary objects and static assets."
    ],
    realWorldExamples: [
        "Spotify uses Cassandra for user-playback history at scale, plus Kafka for event streaming.",
        "E-commerce sites use relational databases for orders and caches like Redis for sessions.",
        "Cloud storage services like AWS S3 or Google Cloud Storage for user uploads."
    ],
    eli5Summary: 'Detailed Explanation',
    eli5Details: "This represents where your application’s data lives and how it’s replicated. It includes caches, databases, and queues. Think of it as the school's main library, shared toy chests, and message boards – where all important information is kept and shared.",
    complexity: 'Advanced',
    implementationGuidance: [
        "Select appropriate data stores based on consistency, availability, partitioning tolerance (CAP theorem), and data model.",
        "Implement robust data replication, backup, and disaster recovery strategies.",
        "Optimize data access patterns, queries, and indexing for performance.",
        "Consider data partitioning (sharding) strategies for very large datasets in relational or NoSQL databases."
    ]
  },
  {
    id: 'observability-ops',
    title: 'Observability & Operations',
    icon: Gauge,
    types: [
        { name: "Metrics (Prometheus, Grafana, Datadog)", description: "Numerical data (e.g., request counts, latency, error rates) visualized in dashboards to track performance and health." },
        { name: "Logging (ELK Stack, Splunk, Loki)", description: "Collecting, searching, and analyzing text-based event logs from all parts of the system." },
        { name: "Distributed Tracing (Jaeger, Zipkin, OpenTelemetry)", description: "Following a single request's journey through multiple services to identify bottlenecks and debug issues." },
        { name: "Alerting (PagerDuty, OpsGenie, Alertmanager)", description: "Automatically notifying engineers when critical problems or predefined thresholds are detected." },
        { name: "Dashboards & Visualization", description: "Visual displays combining metrics, logs, and traces to give a comprehensive overview of system health and behavior." }
    ],
    useCases: [
        "Monitoring system health, performance, and availability in real-time.",
        "Diagnosing and troubleshooting issues quickly and effectively.",
        "Understanding system behavior under load and identifying scaling needs.",
        "Proactive incident detection and enabling efficient response."
    ],
    realWorldExamples: [
        "Uber uses Jaeger to visualize request paths across hundreds of microservices.",
        "Most modern cloud-native applications use Prometheus and Grafana for metrics and dashboarding.",
        "SaaS companies rely on PagerDuty or OpsGenie for on-call alerting."
    ],
    eli5Summary: 'Detailed Explanation',
    eli5Details: "This layer is about understanding your system's health through metrics, logs, tracing, dashboards, and alerting. Imagine the school has cameras (logs), thermometers (metrics), and ways to follow a kid from one room to another (tracing), with alarms if something is wrong.",
    complexity: 'Intermediate',
    implementationGuidance: [
        "Instrument applications and infrastructure to emit structured logs, metrics, and traces.",
        "Set up centralized collection, storage, and analysis tools for observability data.",
        "Define key performance indicators (KPIs) and Service Level Objectives (SLOs) for critical services.",
        "Configure actionable alerts for violations of SLOs or critical error conditions.",
        "Develop comprehensive dashboards for different teams and stakeholders."
    ]
  },
  {
    id: 'deployment-cicd',
    title: 'Deployment & CI/CD',
    icon: Rocket,
    types: [
        { name: "Continuous Integration (Jenkins, GitLab CI, GitHub Actions)", description: "Automatically building, testing, and merging code changes frequently." },
        { name: "Continuous Delivery/Deployment (ArgoCD, Flux, Spinnaker)", description: "Automating the release of software to staging or production environments with various strategies." },
        { name: "Infrastructure as Code (Terraform, CloudFormation, Pulumi)", description: "Managing and provisioning infrastructure using code and automation for consistency and repeatability." },
        { name: "Automated Testing (Unit, Integration, E2E, Performance)", description: "Running various tests automatically to ensure code quality, prevent regressions, and validate performance." }
    ],
    useCases: [
        "Automating the software build, test, and release lifecycle.",
        "Ensuring consistent, repeatable, and reliable deployments.",
        "Reducing manual effort and the risk of human error in deployment processes.",
        "Enabling faster iteration, quicker delivery of features, and rapid recovery from failures."
    ],
    realWorldExamples: [
        "Netflix uses Spinnaker for automated multi-region deployments with sophisticated traffic-shifting strategies like canary releases.",
        "Many companies use GitHub Actions or GitLab CI for building and testing code on every commit.",
        "Terraform is widely adopted for provisioning cloud infrastructure across AWS, Azure, and GCP."
    ],
    eli5Summary: 'Detailed Explanation',
    eli5Details: "This encompasses automated build, test, and deploy pipelines for safe and repeatable roll-outs. It's like having an efficient assembly line for making new toys or updating robot teachers, ensuring every change is automatically checked and delivered safely.",
    complexity: 'Intermediate',
    implementationGuidance: [
        "Set up version control (e.g., Git) for all application code and infrastructure configurations.",
        "Automate build and unit/integration testing processes in a CI server.",
        "Implement deployment pipelines with stages (e.g., development, staging, production) and automated gates.",
        "Use Infrastructure as Code tools for provisioning and managing all environments.",
        "Adopt deployment strategies like blue/green, canary, or rolling updates to minimize risk."
    ]
  },
  {
    id: 'autoscaling-resilience',
    title: 'Autoscaling & Resilience Patterns',
    icon: Scaling,
    types: [
        { name: "Horizontal Pod Autoscaler (Kubernetes HPA)", description: "Automatically adjusts the number of running application instances (pods) based on CPU/memory or custom metrics." },
        { name: "Cloud Provider Autoscaling Groups (e.g., AWS ASG)", description: "Managed services from cloud providers that adjust server/instance capacity based on defined policies." },
        { name: "Circuit Breakers", description: "Prevents an application from repeatedly trying an operation that's likely to fail, allowing the failing service time to recover." },
        { name: "Rate Limiting & Throttling", description: "Controls the amount of traffic sent or received to prevent overload and ensure fair usage." },
        { name: "Retry Mechanisms with Exponential Backoff", description: "Automatically re-attempts failed operations with increasing delays to handle transient errors." },
        { name: "Bulkheads", description: "Isolates elements of an application into pools so that if one fails, others continue to function without being affected." }
    ],
    useCases: [
        "Automatically adjusting system capacity to meet fluctuating demand, optimizing cost and performance.",
        "Preventing cascading failures and improving system stability during partial outages.",
        "Gracefully handling service degradation and ensuring a better user experience during failures.",
        "Protecting services from being overwhelmed by excessive traffic or misbehaving clients."
    ],
    realWorldExamples: [
        "AWS’s Application Auto Scaling adjusts EC2 instances, ECS tasks, or DynamoDB capacity based on CloudWatch alarms.",
        "Netflix's Hystrix library popularized the circuit breaker pattern.",
        "API gateways often implement rate limiting to protect backend services."
    ],
    eli5Summary: 'Detailed Explanation',
    eli5Details: "These are algorithms and controllers that decide when to scale up/down capacity, handle failures, perform canary deployments, etc. 'Autoscaling' is like magic: if lots of kids show up, more swings appear! 'Resilience' means if one swing breaks, the playground can handle problems without shutting down.",
    complexity: 'Advanced',
    implementationGuidance: [
        "Define clear scaling policies based on relevant performance metrics (e.g., CPU utilization, memory usage, request queue length, custom application metrics).",
        "Implement circuit breakers in inter-service communication to isolate failing services and prevent cascading failures.",
        "Use retries with exponential backoff and jitter for transient network errors or temporary service unavailability.",
        "Design services to be idempotent to safely handle retries without unintended side effects.",
        "Consider bulkhead patterns to limit the blast radius of failures within your application components."
    ]
  }
];
    
