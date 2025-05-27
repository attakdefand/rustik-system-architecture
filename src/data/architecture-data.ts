
import type { LucideIcon } from 'lucide-react';
import { Globe2, Network, ServerCog, Zap, Cpu, Database, RouterIcon, Lightbulb, Layers, ShieldCheck, DollarSign } from 'lucide-react';

export interface ArchitectureComponent {
  id: string;
  title: string;
  icon: LucideIcon;
  types: string[];
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
      'IPv4 Anycast (e.g. 203.0.113.0/24)',
      'IPv6 Anycast (e.g. 2001:db8::/32)',
      'Global Anycast (announced from POPs on multiple continents)',
      'Regional Anycast (limited to a single continent or country)',
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
      'Layer-4 (TCP/QUIC) LB: handles raw connections (e.g. HAProxy in TCP mode, Envoy TCP proxy).',
      'Layer-7 (HTTP/TLS) LB: terminates TLS, inspects HTTP, applies routing rules (e.g. Envoy HTTP, NGINX, AWS ALB).',
      'Cloud-native LB: Google Cloud TCP/UDP/SSL LB, AWS Network Load Balancer (NLB).',
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
      'Single-binary service: one executable per node (e.g. your app_server).',
      'Containerized: each node runs in its own Docker container or Kubernetes pod.',
      'VM-based: each node on a dedicated virtual machine.',
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
      'Epoll (Linux)',
      'Kqueue (macOS/BSD)',
      'IOCP (Windows)',
      'Tokio Runtime (Rust)',
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
      'SO_REUSEPORT based sharding',
      'Thread-per-core model',
      'Connection handoff mechanisms',
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
      "Database Sharding (Horizontal Partitioning)",
      "Read Replicas for Read Scalability",
      "NoSQL Databases (Key-Value, Document, Columnar)",
      "Database Caching (e.g., Redis, Memcached)",
      "Connection Pooling"
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
      "High-Bandwidth Global Connectivity",
      "Strategic ISP Peering Agreements",
      "Sufficient Point of Presence (PoP) Capacity",
      "Content Delivery Network (CDN) Integration",
      "Redundant Network Paths"
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
      "Optimized Algorithms & Data Structures",
      "Efficient Data Access Patterns",
      "Stateless Service Design",
      "Asynchronous Processing for Long Tasks",
      "Microservices Architecture"
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
      "Content Delivery Network (CDN) Caching",
      "Load Balancer Caching",
      "Distributed In-Memory Caching (e.g., Redis, Memcached)",
      "Application-Level / Local In-Memory Caching",
      "Database Query Caching",
      "Browser Caching"
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
      "Comprehensive Monitoring & Observability (Metrics, Logs, Traces)",
      "Automated Alerting & Incident Response",
      "Automated Scaling (Horizontal & Vertical)",
      "Safe Deployment Strategies (Blue/Green, Canary, Rolling)",
      "Infrastructure as Code (IaC) & Configuration Management"
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
      "Resource Optimization & Rightsizing",
      "Utilizing Reserved Instances/Capacity or Savings Plans",
      "Leveraging Usage-Based & Spot Instances/Services",
      "Comprehensive Cost Monitoring & Allocation (Tagging)",
      "FinOps Practices & Budgeting"
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
  }
];

