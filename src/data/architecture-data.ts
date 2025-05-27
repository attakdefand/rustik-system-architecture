
import type { LucideIcon } from 'lucide-react';
import { Globe2, Network, ServerCog, Zap, Cpu, Database, RouterIcon, Lightbulb, Layers, ShieldCheck, DollarSign, Settings2, Archive, Gauge, Rocket, Scaling } from 'lucide-react';

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
      { name: 'Layer-4 (TCP/QUIC) LB: handles raw connections (e.g. HAProxy in TCP mode, Envoy TCP proxy).', description: 'Distributes traffic based on network-level info (IP, port); fast & simple.' },
      { name: 'Layer-7 (HTTP/TLS) LB: terminates TLS, inspects HTTP, applies routing rules (e.g. Envoy HTTP, NGINX, AWS ALB).', description: 'Smarter routing based on application data (URLs, headers); enables advanced features.' },
      { name: 'Cloud-native LB: Google Cloud TCP/UDP/SSL LB, AWS Network Load Balancer (NLB).', description: 'Managed load balancing services provided by cloud platforms, often with tight integration.' },
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
    id: 'rust-app-nodes',
    title: 'Rust App Nodes',
    icon: ServerCog,
    types: [
      { name: 'Single-binary service: one executable per node (e.g. your app_server).', description: 'Simple deployment; all application logic in one compiled file.' },
      { name: 'Containerized: each node runs in its own Docker container or Kubernetes pod.', description: 'Ensures consistent environments and simplifies scaling with orchestration tools.' },
      { name: 'VM-based: each node on a dedicated virtual machine.', description: 'Provides strong isolation but can be heavier than containers.' },
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
      { name: "Connection Pooling", description: "Manages a pool of database connections to improve efficiency and performance." }
    ],
    useCases: [
      "Scaling applications with large datasets and high transaction volumes.",
      "Improving read performance for data-intensive applications.",
      "Handling unstructured or semi-structured data at scale.",
      "Reducing database load and improving response times for frequently accessed data."
    ],
    realWorldExamples: [
      "Facebook shards its user database to manage billions of profiles.",
      "Wikipedia uses read replicas to serve high volumes of article views.",
      "Twitter (X) uses various NoSQL solutions like Manhattan for different data needs.",
      "Many e-commerce sites use Redis to cache product details and user sessions."
    ],
    eli5Summary: "Detailed Explanation",
    eli5Details: "How we make sure our 'toy box' (database) can hold all the toys for 1 billion friends and find them quickly. We might have many toy boxes (sharding), copies of popular toy lists (read replicas), special super-fast toy boxes for certain toys (NoSQL), or remember where recently used toys are (caching).",
    complexity: "Advanced",
    implementationGuidance: [
      "Analyze data access patterns to choose the right sharding key or NoSQL model.",
      "Implement robust data replication and synchronization for read replicas.",
      "Evaluate consistency models (e.g., eventual, strong) for NoSQL databases.",
      "Develop a clear caching strategy, including cache invalidation mechanisms."
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
      { name: "Microservices Architecture", description: "Breaks down large applications into smaller, independent, and scalable services." }
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
      "Use message queues (e.g., Kafka, RabbitMQ) for asynchronous tasks."
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
      { name: "Comprehensive Monitoring & Observability (Metrics, Logs, Traces)", description: "Gathers detailed data to understand system health and behavior." },
      { name: "Automated Alerting & Incident Response", description: "Automatically notifies teams of issues and helps manage responses." },
      { name: "Automated Scaling (Horizontal & Vertical)", description: "Adjusts system capacity automatically based on demand." },
      { name: "Safe Deployment Strategies (Blue/Green, Canary, Rolling)", description: "Enables releasing new software versions with minimal risk." },
      { name: "Infrastructure as Code (IaC) & Configuration Management", description: "Manages infrastructure and configurations through code for consistency." }
    ],
    useCases: [
      "Proactively identifying and resolving issues before they impact users.",
      "Maintaining system performance and availability under varying loads.",
      "Deploying new features and updates safely and efficiently.",
      "Ensuring consistent and reproducible environments."
    ],
    realWorldExamples: [
      "Netflix's Simian Army (Chaos Monkey) tests system resilience.",
      "Cloud providers offer extensive monitoring and auto-scaling capabilities.",
      "Mature tech companies have sophisticated CI/CD pipelines with automated canary deployments.",
      "Tools like Terraform and Ansible are widely used for IaC."
    ],
    eli5Summary: "Detailed Explanation",
    eli5Details: "Having really good playground monitors who watch everything (monitoring), can quickly add more play space if lots of kids show up (auto-scaling), have safe ways to introduce new toys (deployments), and make sure all playground rules are followed everywhere (config management). They also have a plan if something breaks (incident response).",
    complexity: "Advanced",
    implementationGuidance: [
      "Implement a centralized logging and metrics platform (e.g., ELK stack, Prometheus, Grafana).",
      "Define clear Service Level Objectives (SLOs) and set up alerts based on them.",
      "Automate infrastructure provisioning and deployment processes.",
      "Regularly test failover and disaster recovery procedures."
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
        { name: "Consul / etcd / ZooKeeper", description: "Dedicated tools that help services find and communicate with each other." },
        { name: "Kubernetes Services", description: "Built-in mechanism in Kubernetes for service discovery and load balancing." },
        { name: "Istio / Linkerd (Service Mesh)", description: "Advanced control planes providing traffic management, security, and observability for microservices." },
        { name: "Custom Control Plane", description: "A bespoke system built to manage service discovery and configuration for specific needs." }
    ],
    useCases: ["Locating microservices", "Distributing configuration updates", "Managing service health and routing policies", "Orchestrating complex deployments"],
    realWorldExamples: ["Netflix Eureka for service discovery", "Kubernetes for container orchestration and service exposure", "Envoy/Istio for managing microservice traffic"],
    eli5Summary: "Detailed Explanation",
    eli5Details: "This layer helps keep track of which app-nodes exist, where they are, and pushes configuration or health updates to them. Imagine a school directory that tells everyone where each robot teacher is, and the principal's office that sends out new rules to all teachers.",
    complexity: 'Advanced',
    implementationGuidance: [
        "Choose a discovery mechanism (e.g., DNS-based, dedicated tool like Consul).",
        "Integrate service registration/deregistration into your application lifecycle.",
        "Define how configuration updates are propagated (e.g., push vs. pull).",
        "Ensure the control plane itself is highly available and resilient."
    ]
  },
  {
    id: 'shared-state-data-plane',
    title: 'Shared State & Data Plane',
    icon: Archive,
    types: [
        { name: "Distributed Caches (Redis, Memcached)", description: "Fast, shared memory stores for frequently accessed data to speed up applications." },
        { name: "Relational Databases (PostgreSQL, MySQL)", description: "Traditional databases for structured data with strong consistency (ACID properties)." },
        { name: "NoSQL Databases (MongoDB, Cassandra)", description: "Flexible databases for various data models (document, key-value, etc.), often prioritizing scale." },
        { name: "Message Queues (Kafka, RabbitMQ)", description: "Systems for enabling asynchronous communication between different parts of an application." },
        { name: "Object Storage (S3, GCS)", description: "Scalable storage for large, unstructured data like files, images, and backups." }
    ],
    useCases: ["Storing and retrieving application data", "Caching frequently accessed information", "Enabling asynchronous communication between services", "Persisting large binary objects"],
    realWorldExamples: ["E-commerce sites using Redis for session and product caching", "Social media apps using Cassandra for user feeds", "Financial systems using Kafka for event streaming"],
    eli5Summary: "Detailed Explanation",
    eli5Details: "This represents where your application’s data lives and how it’s replicated. It includes caches, databases, and queues. Think of it as the school's main library, shared toy chests, and message boards – where all important information is kept and shared.",
    complexity: 'Advanced',
    implementationGuidance: [
        "Select appropriate data stores based on consistency, availability, and performance needs (CAP theorem).",
        "Implement data replication and backup strategies.",
        "Optimize data access patterns and query performance.",
        "Consider data partitioning and sharding for scalability."
    ]
  },
  {
    id: 'observability-ops',
    title: 'Observability & Operations',
    icon: Gauge,
    types: [
        { name: "Metrics (Prometheus, Grafana)", description: "Numerical data (e.g., request counts, latency) visualized in dashboards to track performance." },
        { name: "Logging (ELK Stack, Splunk)", description: "Collecting and searching through text-based event logs from all parts of the system." },
        { name: "Tracing (Jaeger, Zipkin)", description: "Following a single request's journey through multiple services to debug issues." },
        { name: "Alerting (PagerDuty, OpsGenie)", description: "Automatically notifying engineers when critical problems or thresholds are detected." },
        { name: "Dashboards", description: "Visual displays combining metrics, logs, and traces to give an overview of system health." }
    ],
    useCases: ["Monitoring system health and performance", "Diagnosing and troubleshooting issues", "Understanding system behavior under load", "Proactive incident detection and response"],
    realWorldExamples: ["Sites using Prometheus/Grafana for real-time dashboards", "Companies using Datadog or New Relic for comprehensive APM", "Distributed tracing to follow requests across microservices"],
    eli5Summary: "Detailed Explanation",
    eli5Details: "This layer is about understanding your system's health through metrics, logs, tracing, dashboards, and alerting. Imagine the school has cameras (logs), thermometers (metrics), and ways to follow a kid from one room to another (tracing), with alarms if something is wrong.",
    complexity: 'Intermediate',
    implementationGuidance: [
        "Instrument applications to emit structured logs, metrics, and traces.",
        "Set up centralized collection and analysis tools.",
        "Define key performance indicators (KPIs) and Service Level Objectives (SLOs).",
        "Configure actionable alerts for critical issues."
    ]
  },
  {
    id: 'deployment-cicd',
    title: 'Deployment & CI/CD',
    icon: Rocket,
    types: [
        { name: "Continuous Integration (Jenkins, GitLab CI, GitHub Actions)", description: "Automatically building and testing code changes frequently." },
        { name: "Continuous Delivery/Deployment", description: "Automating the release of software to staging or production environments." },
        { name: "Infrastructure as Code (Terraform, CloudFormation)", description: "Managing and provisioning infrastructure using code and automation." },
        { name: "Automated Testing (Unit, Integration, E2E)", description: "Running various tests automatically to ensure code quality and prevent regressions." }
    ],
    useCases: ["Automating the software build, test, and release process", "Ensuring consistent and repeatable deployments", "Reducing manual effort and risk of human error", "Enabling faster iteration and delivery of features"],
    realWorldExamples: ["Tech companies using Jenkins or GitHub Actions to automatically build and deploy every code change", "Using Terraform to define and manage cloud infrastructure"],
    eli5Summary: "Detailed Explanation",
    eli5Details: "This encompasses automated build, test, and deploy pipelines for safe and repeatable roll-outs. It's like having an efficient assembly line for making new toys or updating robot teachers, ensuring every change is automatically checked and delivered safely.",
    complexity: 'Intermediate',
    implementationGuidance: [
        "Set up version control (e.g., Git) for all code and configurations.",
        "Automate build and testing processes in a CI server.",
        "Implement deployment pipelines with stages (e.g., dev, staging, prod).",
        "Use Infrastructure as Code for provisioning and managing environments."
    ]
  },
  {
    id: 'autoscaling-resilience',
    title: 'Autoscaling & Resilience Patterns',
    icon: Scaling,
    types: [
        { name: "Horizontal Pod Autoscaler (Kubernetes)", description: "Automatically changes the number of running application instances (pods) in Kubernetes." },
        { name: "Cloud Provider Autoscaling Groups", description: "Managed services from AWS, Azure, GCP that adjust server capacity." },
        { name: "Circuit Breakers", description: "Prevents an application from repeatedly trying an operation that's likely to fail." },
        { name: "Rate Limiting", description: "Controls the amount of traffic sent or received to prevent overload." },
        { name: "Retry Mechanisms", description: "Automatically re-attempts failed operations, often with delays (exponential backoff)." },
        { name: "Bulkheads", description: "Isolates elements of an application into pools so that if one fails, others continue to function." }
    ],
    useCases: ["Automatically adjusting capacity to meet demand", "Preventing cascading failures", "Gracefully handling service degradation", "Improving system stability and availability"],
    realWorldExamples: ["E-commerce sites automatically scaling up web servers during holiday sales", "Microservices using circuit breakers to stop calling a failing downstream service", "APIs implementing rate limiting to prevent abuse"],
    eli5Summary: "Detailed Explanation",
    eli5Details: "These are algorithms and controllers that decide when to scale up/down capacity, handle failures, perform canary deployments, etc. 'Autoscaling' is like magic: if lots of kids show up, more swings appear! 'Resilience' means if one swing breaks, the playground can handle problems without shutting down.",
    complexity: 'Advanced',
    implementationGuidance: [
        "Define scaling policies based on relevant metrics (e.g., CPU, memory, queue length).",
        "Implement circuit breakers to isolate failing services.",
        "Use retries with exponential backoff for transient errors.",
        "Design services to be idempotent to safely handle retries."
    ]
  }
];
