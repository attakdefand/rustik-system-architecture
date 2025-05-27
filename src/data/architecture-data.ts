
import type { LucideIcon } from 'lucide-react';
import { Globe2, Network, ServerCog, Zap, Cpu } from 'lucide-react';

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
  implementationGuidance?: string[]; // New field
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
    ],
    useCases: [
      'High-concurrency servers: serve many connections with few threads.',
      'Streaming & WebSockets: keep idle connections open without blocking.',
      'Real-time services: chat, gaming, live data feeds.',
    ],
    realWorldExamples: [
      'Nginx uses epoll under the hood for its event loop.',
      'Node.js uses libuv (which on Linux uses epoll) to handle thousands of simultaneous sockets.',
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
      'SO_REUSEPORT: all threads bind the same port and the kernel load-balances accepts.',
      'Single-acceptor + handoff: one thread accepts and then passes sockets to workers (less common at high scale).',
    ],
    useCases: [
      'Eliminate accept bottleneck: every CPU core can accept new connections.',
      'CPU locality: each core handles its own connections, reducing cross-core cache misses.',
    ],
    realWorldExamples: [
      'Caddy web server uses SO_REUSEPORT for multi-core scalability.',
      'Envoy’s listener implementation can leverage per-core dispatch to maximize throughput.',
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
];
