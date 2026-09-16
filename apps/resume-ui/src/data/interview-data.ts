export interface InterviewQuestion {
  id: string
  question: string
  answer: string
}

export interface InterviewSubtopic {
  id: string
  topic: string
  questions: InterviewQuestion[]
}

export interface InterviewGroup {
  id: string
  topic: string
  questions: InterviewQuestion[]
  subtopics?: InterviewSubtopic[]
}

export const interviewGroups: InterviewGroup[] = [
  {
    id: 'load-balancers',
    topic: 'Load Balancers',
    questions: [
      {
        id: 'what-is-load-balancing',
        question: 'What is load balancing?',
        answer:
          "Load balancing is the practice of distributing network traffic or computational workloads across multiple servers to improve an application's performance and reliability.",
      },
      {
        id: 'what-is-a-load-balancer',
        question: 'What is a load balancer?',
        answer:
          'A load balancer is a tool or application — either hardware-based or software-based — that distributes workloads and traffic among multiple servers.',
      },
      {
        id: 'static-vs-dynamic-load-balancing',
        question:
          'What is the difference between static and dynamic load balancing algorithms?',
        answer:
          'Static load balancing algorithms assign traffic based on a predetermined plan, without considering server status, while dynamic algorithms adjust traffic distribution in real time based on server health and performance.',
      },
      {
        id: 'server-monitoring',
        question: 'What is server monitoring in load balancing?',
        answer:
          'Server monitoring involves regularly checking the health and performance of servers so the load balancer can distribute traffic efficiently and avoid overloading unhealthy servers.',
      },
      {
        id: 'failover',
        question: 'What is failover in load balancing?',
        answer:
          'Failover is the automatic rerouting of traffic to backup servers when a primary server fails, ensuring near-continuous service availability.',
      },
      {
        id: 'how-load-balancing-improves-performance',
        question: 'How does load balancing improve performance?',
        answer:
          'Load balancing reduces the strain on each server, making servers more efficient, and helping to make sure all users do not get stuck waiting for responses from the same server (or server pool). This speeds up response times and lowers latency, resulting in faster and more efficient service for users.',
      },
      {
        id: 'common-load-balancing-methods',
        question: 'What are common load balancing methods?',
        answer:
          'Common methods include round-robin DNS, weighted round-robin DNS, least connection, weighted least connection, and resource-based load balancing.',
      },
      {
        id: 'where-load-balancing-is-used',
        question: 'Where is load balancing commonly used?',
        answer:
          'Load balancing is commonly used in web applications, data centers, and large networks to manage and distribute computational workloads effectively.',
      },
      {
        id: 'global-server-load-balancing',
        question: 'What is global server load balancing (GSLB)?',
        answer:
          'Global server load balancing (GSLB) distributes Internet traffic across servers located around the world, helping to optimize performance for users regardless of their location.',
      },
      {
        id: 'load-balancing-user-experience',
        question: 'How does load balancing affect the user experience?',
        answer:
          'Load balancing minimizes wait times and ensures a smoother, more responsive service, which leads to a better experience for end users.',
      },
      {
        id: 'types-of-load-balancer',
        question: 'What are the types of load balancers?',
        answer: 'Hardware load balancer and Software load balancer.',
      },
    ],
    subtopics: [
      {
        id: 'load-balancing-algorithm-types',
        topic: 'Types of Load Balancing Algorithms',
        questions: [
          {
            id: 'types-of-load-balancing-algorithms',
            question: 'What are the types of load balancing algorithms?',
            answer: 'Static load balancer and Dynamic load balancer.',
          },
        ],
      },
    ],
  },
]
