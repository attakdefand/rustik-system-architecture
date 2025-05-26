import type { LucideIcon } from 'lucide-react';
import { Globe2, Network, ServerCog, Zap, Split, Cpu } from 'lucide-react';

export interface ArchitectureComponent {
  id: string;
  title: string;
  icon: LucideIcon;
  types: string[];
  useCases: string[];
  realWorldExamples: string[];
  eli5Summary: string;
  eli5Details: string;
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
    eli5Summary: '👶 Explained like you’re 5',
    eli5Details: 'Imagine you have the same toy in lots of playgrounds around the world. When your friend wants to play, they automatically go to the nearest playground and pick up the toy—so they don’t have to travel far and can play quickly. If one playground is closed, they just go to the next nearest one without even noticing.',
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
    eli5Summary: '👶 Explained like you’re 5',
    eli5Details: 'Think of a teacher at the door who sends each new kid to an empty classroom. If one classroom is full or the teacher sees a problem inside, they send the next kid to a different room—so no room gets too crowded.',
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
    eli5Summary: '👶 Explained like you’re 5',
    eli5Details: 'Imagine each classroom has a super-smart robot teacher (Rust app). That robot can talk to lots and lots of kids all at once really fast and never gets tired or makes silly mistakes.',
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
    eli5Summary: '👶 Explained like you’re 5',
    eli5Details: 'Picture a mail sorter who doesn’t deliver every letter one by one but instead watches lots of mailboxes at once and only goes to the ones that have new mail. That mail sorter never stands idle or gets stuck waiting.',
  },
  {
    id: 'per-core-socket',
    title: 'Per-core Socket Accept + Sharding',
    icon: Cpu, // Using CPU icon as Split is not available in lucide-react directly, or 'Share2' for sharding aspect
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
    eli5Summary: '👶 Explained like you’re 5',
    eli5Details: 'Imagine each robot teacher has its own door to the playground. When a new kid arrives, whichever robot’s door the kid walks up to is ready to let them in—so no single door gets a big line.',
  },
];
