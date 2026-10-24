import { MasterRoadmap } from '../models/MasterRoadmap.js';

/**
 * Validates generated roadmap against structural criteria
 */
export function validateRoadmapSchema(data) {
  if (!data.canonicalGoal || typeof data.canonicalGoal !== 'string') {
    throw new Error('Roadmap missing valid canonicalGoal');
  }
  if (!Array.isArray(data.stages) || data.stages.length === 0) {
    throw new Error('Roadmap must have at least one stage');
  }
  if (!Array.isArray(data.nodes) || data.nodes.length < 3) {
    throw new Error('Roadmap must have at least 3 nodes');
  }
  // Validate node IDs and stage references
  const stageIds = new Set(data.stages.map(s => s.id));
  const nodeIds = new Set();
  
  for (const node of data.nodes) {
    if (!node.id || !node.title || !node.stageId) {
      throw new Error(`Node missing id, title, or stageId: ${JSON.stringify(node)}`);
    }
    if (!stageIds.has(node.stageId)) {
      throw new Error(`Node ${node.id} references non-existent stage ${node.stageId}`);
    }
    if (nodeIds.has(node.id)) {
      throw new Error(`Duplicate node ID: ${node.id}`);
    }
    nodeIds.add(node.id);
  }

  return true;
}

/**
 * Intelligent Generator for novel domains when no API key is provided, or fallback
 */
function generateStructuredDomainRoadmap(rawGoal) {
  const goalClean = rawGoal.trim();
  const slug = goalClean.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
  const id = `gen-${slug.slice(0, 30)}-${Date.now().toString().slice(-4)}`;

  // Determine domain heuristics
  let domain = 'Specialized Technology';
  let color1 = '#8B5CF6';
  let color2 = '#22D3EE';
  let color3 = '#10B981';

  if (/rust|c\+\+|embedded|systems|kernel/i.test(goalClean)) {
    domain = 'Systems Programming';
  } else if (/quantum|physics|qiskit/i.test(goalClean)) {
    domain = 'Quantum Computing';
  } else if (/cyber|security|hack|penetration|infosec/i.test(goalClean)) {
    domain = 'Cybersecurity & InfoSec';
  } else if (/game|unreal|unity|godot|graphics/i.test(goalClean)) {
    domain = 'Game Development';
  } else if (/mobile|flutter|react native|ios|android|swift/i.test(goalClean)) {
    domain = 'Mobile Engineering';
  } else if (/cloud|devops|aws|kubernetes|terraform/i.test(goalClean)) {
    domain = 'Cloud & Infrastructure';
  } else if (/blockchain|web3|solidity|ethereum/i.test(goalClean)) {
    domain = 'Web3 & Distributed Systems';
  }

  const stages = [
    { id: `${id}-s1`, title: 'Core Foundations & Syntax', description: `Fundamental paradigms and core toolchains for ${goalClean}`, order: 1, color: color1 },
    { id: `${id}-s2`, title: 'Applied Architecture & Patterns', description: `Intermediate design structures and practical implementations in ${goalClean}`, order: 2, color: color2 },
    { id: `${id}-s3`, title: 'Production & Master Capstone', description: `Advanced optimizations, testing, and real-world deployment for ${goalClean}`, order: 3, color: color3 },
  ];

  const nodes = [
    {
      id: `${id}-n1`,
      stageId: `${id}-s1`,
      title: `${goalClean}: Core Principles & Environment Setup`,
      subtitle: 'Toolchain configuration, CLI workflows, and fundamental syntax',
      level: 1,
      xp: 120,
      isOptional: false,
      position: { x: 100, y: 120 },
      prerequisites: [],
      description: `Establish a rock-solid foundation in ${goalClean}. Understand core paradigms, package managers, and development runtime.`,
      whyItMatters: 'A disciplined workspace and deep grasp of basic primitives eliminates roadblocks in advanced stages.',
      whatYouWillLearn: [
        'Setting up modern development toolchains and linting',
        'Fundamental syntax structures and execution models',
        'Standard library navigation and package imports'
      ],
      estimatedMinutes: 90,
      resources: [
        {
          id: `res-${id}-1`,
          title: `Official Documentation & Getting Started Guide for ${goalClean}`,
          url: 'https://devdocs.io/',
          source: 'Official Docs',
          type: 'documentation',
          duration: '45 mins',
          difficulty: 'Beginner',
          description: `Authoritative guide covering basic installation and language specifications for ${goalClean}.`
        },
        {
          id: `res-${id}-2`,
          title: `Interactive Fundamentals Sandbox`,
          url: 'https://github.com/topics/' + slug.slice(0, 15),
          source: 'Open Source Community',
          type: 'interactive',
          duration: '35 mins',
          difficulty: 'Beginner',
          description: 'Hands-on practice repository with verified unit test suites.'
        }
      ],
      practicalTask: {
        title: `Build a Functional Hello World Suite in ${goalClean}`,
        instructions: 'Initialize a clean project repository, write core executable logic, and write 3 passing unit tests verifying functionality.',
        acceptanceCriteria: ['Passes unit tests without errors', 'Demonstrates idiomatic project directory layout'],
        starterCode: '// Initialize module and test suite\nfunction init() { return true; }',
        deliverableType: 'code'
      },
      assessment: {
        type: 'quiz',
        questions: [
          {
            id: `q-${id}-1`,
            question: `What is the most effective approach when beginning a project in ${goalClean}?`,
            options: ['Writing entire architecture in one file without tests', 'Configuring standard toolchains, formatting, and automated unit tests from day one', 'Copying unverified code without reading documentation', 'Skipping package management'],
            correctIndex: 1,
            explanation: 'Establishing proper toolchain linting and testing early prevents technical debt and runtime errors.'
          }
        ]
      }
    },
    {
      id: `${id}-n2`,
      stageId: `${id}-s1`,
      title: 'Data Structures & Paradigm Mastery',
      subtitle: 'Type systems, state mutation constraints, and modular organization',
      level: 2,
      xp: 160,
      isOptional: false,
      position: { x: 320, y: 120 },
      prerequisites: [`${id}-n1`],
      description: `Deepen your understanding of ${goalClean} memory layout, standard data collections, and error handling philosophies.`,
      whyItMatters: 'Writing idiomatic code requires understanding how the engine allocates memory and handles exceptional states.',
      whatYouWillLearn: [
        'Memory management and reference passing rules',
        'Implementing clean error propagation patterns',
        'Encapsulating business logic in decoupled modules'
      ],
      estimatedMinutes: 110,
      resources: [
        {
          id: `res-${id}-3`,
          title: `Deep Dive: Architecture & Best Practices`,
          url: 'https://roadmap.sh',
          source: 'Roadmap.sh Community',
          type: 'article',
          duration: '45 mins',
          difficulty: 'Intermediate',
          description: 'Structured overview of intermediate patterns and production considerations.'
        }
      ],
      practicalTask: {
        title: 'Implement a Robust Error-Resilient Module',
        instructions: 'Write a modular data processing unit that handles malformed inputs without crashing, returning typed result objects.',
        acceptanceCriteria: ['Uses exhaustive pattern matching or error types', 'Gracefully recovers from edge cases'],
        starterCode: '// Implement safe parser logic\nfunction processData(input) {}',
        deliverableType: 'code'
      },
      assessment: {
        type: 'quiz',
        questions: [
          {
            id: `q-${id}-2`,
            question: 'Why should error handling be explicit rather than silently swallowed?',
            options: ['To make the program slower', 'To ensure failures are visible and debuggable with actionable stack traces', 'Compilers require errors to be printed', 'It is optional in production'],
            correctIndex: 1,
            explanation: 'Explicit error handling prevents silent data corruption and enables rapid incident resolution.'
          }
        ]
      }
    },
    {
      id: `${id}-n3`,
      stageId: `${id}-s2`,
      title: 'Applied Engineering & System Integration',
      subtitle: 'Concurrency, I/O operations, and third-party integrations',
      level: 3,
      xp: 220,
      isOptional: false,
      position: { x: 540, y: 120 },
      prerequisites: [`${id}-n2`],
      description: `Build real-world systems connecting ${goalClean} with external services, asynchronous event loops, and persistent data stores.`,
      whyItMatters: 'Isolated algorithms must be integrated into broader architectural pipelines to create business value.',
      whatYouWillLearn: [
        'Asynchronous I/O and thread pooling concepts',
        'Consuming and exposing REST/RPC interfaces',
        'Profiling throughput bottlenecks and latency'
      ],
      estimatedMinutes: 140,
      resources: [
        {
          id: `res-${id}-4`,
          title: 'High Performance System Engineering Guide',
          url: 'https://en.wikipedia.org/wiki/Software_architecture',
          source: 'Engineering Reference',
          type: 'documentation',
          duration: '50 mins',
          difficulty: 'Intermediate',
          description: 'Principles of decoupled services, caching layers, and resilient pipelines.'
        }
      ],
      practicalTask: {
        title: 'Build an Asynchronous Pipeline with Rate Limiting',
        instructions: 'Construct an integrated service that ingests streaming events and persists processed records with backpressure handling.',
        acceptanceCriteria: ['Maintains stable memory under load', 'Includes structured JSON logging'],
        starterCode: '// Asynchronous stream handler\nasync function handleStream(events) {}',
        deliverableType: 'code'
      },
      assessment: {
        type: 'quiz',
        questions: [
          {
            id: `q-${id}-3`,
            question: 'What is the purpose of backpressure in asynchronous I/O systems?',
            options: ['To increase memory usage', 'To signal upstream producers to slow down when downstream consumers are saturated', 'To cancel all network requests', 'To encrypt data packets'],
            correctIndex: 1,
            explanation: 'Backpressure prevents memory exhaustion by matching production rate to processing capacity.'
          }
        ]
      }
    },
    {
      id: `${id}-n4`,
      stageId: `${id}-s3`,
      title: `${goalClean} Production Master Capstone`,
      subtitle: 'Complete production-grade project with CI/CD and deployment',
      level: 5,
      xp: 350,
      isOptional: false,
      position: { x: 760, y: 120 },
      prerequisites: [`${id}-n3`],
      description: `Deliver an end-to-end project applying all core concepts of ${goalClean}. Include automated testing, documentation, and live deployment.`,
      whyItMatters: 'Completing a full-lifecycle capstone proves industry readiness and provides a standout portfolio showcase.',
      whatYouWillLearn: [
        'Full software delivery lifecycle from architecture to production',
        'Automated CI/CD testing pipelines and security scans',
        'Writing production documentation and API specifications'
      ],
      estimatedMinutes: 240,
      resources: [
        {
          id: `res-${id}-5`,
          title: 'Production Readiness Checklist',
          url: 'https://github.com/check-spelling/check-spelling',
          source: 'Production Engineering Community',
          type: 'project',
          duration: '60 mins',
          difficulty: 'Advanced',
          description: 'Verification checklist for reliability, telemetry, and observability.'
        }
      ],
      practicalTask: {
        title: `Publish & Submit Your ${goalClean} Capstone Repository`,
        instructions: 'Deploy your project, ensure test coverage exceeds 75%, and submit the repository link with comprehensive architecture diagrams in README.',
        acceptanceCriteria: ['Includes README with setup and design decisions', 'Demonstrates working end-to-end execution'],
        starterCode: '{\n  "projectName": "' + goalClean + ' Capstone",\n  "repoUrl": "https://github.com/learner/project"\n}',
        deliverableType: 'github_url'
      },
      assessment: {
        type: 'project',
        questions: [
          {
            id: `q-${id}-4`,
            question: 'What is the primary indicator of production software quality?',
            options: ['Length of source code', 'Reliability, clear observability (logs/metrics), passing automated tests, and graceful error recovery', 'Number of third-party libraries installed', 'Using dark mode only'],
            correctIndex: 1,
            explanation: 'Production excellence is defined by automated test confidence, comprehensive observability, and resilience against failures.'
          }
        ]
      }
    }
  ];

  const edges = [
    { id: `${id}-e1`, source: `${id}-n1`, target: `${id}-n2` },
    { id: `${id}-e2`, source: `${id}-n2`, target: `${id}-n3` },
    { id: `${id}-e3`, source: `${id}-n3`, target: `${id}-n4` },
  ];

  return {
    id,
    canonicalGoal: goalClean.charAt(0).toUpperCase() + goalClean.slice(1),
    aliases: [
      goalClean.toLowerCase(),
      `learn ${goalClean.toLowerCase()}`,
      `master ${goalClean.toLowerCase()}`,
      `${goalClean.toLowerCase()} guide`
    ],
    domain,
    difficulty: 'Intermediate',
    targetOutcomes: [
      `Master core syntax and toolchains for ${goalClean}`,
      `Architect maintainable and performant systems in ${goalClean}`,
      `Deploy and monitor a production capstone project`
    ],
    version: 1.0,
    estimatedHours: 60,
    tags: [domain, goalClean, 'Practical', 'Interactive', 'Capstone'],
    stages,
    nodes,
    edges,
    isGenerated: true,
  };
}

/**
 * Generates and validates a new Master Roadmap, then saves it to MongoDB
 */
export async function generateAndSaveMasterRoadmap(userGoal) {
  console.log(`[RoadmapGenerator] Generating new master roadmap for novel goal: "${userGoal}"...`);
  
  // Create structured schema
  const roadmapData = generateStructuredDomainRoadmap(userGoal);
  
  // Validate schema thoroughly
  validateRoadmapSchema(roadmapData);

  // Save to MongoDB MasterRoadmap collection
  const newRoadmap = await MasterRoadmap.create(roadmapData);
  console.log(`[RoadmapGenerator] Successfully validated and saved MasterRoadmap: ${newRoadmap.id} (${newRoadmap.canonicalGoal})`);

  return newRoadmap;
}
