export const preloadedRoadmaps = [
  // 1. Full-Stack Web Development
  {
    id: 'web-dev-master',
    canonicalGoal: 'Become a Full-Stack Web Developer',
    aliases: [
      'full-stack developer',
      'full stack web development',
      'fullstack developer',
      'web development',
      'learn web dev',
      'mern stack',
      'frontend and backend',
      'full-stack'
    ],
    domain: 'Web Development',
    difficulty: 'Beginner to Professional',
    targetOutcomes: [
      'Build end-to-end responsive web applications from scratch',
      'Architect robust RESTful APIs with Node.js and Express',
      'Model relational and NoSQL databases with secure authentication',
      'Deploy full-stack projects with Docker and modern cloud platforms'
    ],
    version: 1.0,
    estimatedHours: 85,
    tags: ['Frontend', 'Backend', 'React', 'Node.js', 'MongoDB', 'PostgreSQL', 'APIs'],
    stages: [
      { id: 'web-s1', title: 'Modern Frontend Foundations', description: 'Core web technologies, semantic UI, and reactive state management', order: 1, color: '#8B5CF6' },
      { id: 'web-s2', title: 'Full-Stack Backend & APIs', description: 'Server-side runtime, database persistence, and secure authentication', order: 2, color: '#22D3EE' },
      { id: 'web-s3', title: 'DevOps, Cloud & Production', description: 'Containerization, CI/CD automation, and capstone deployment', order: 3, color: '#10B981' }
    ],
    nodes: [
      {
        id: 'web-html-css',
        stageId: 'web-s1',
        title: 'Modern HTML5 & Responsive CSS',
        subtitle: 'Semantic structure, Flexbox, CSS Grid & accessibility',
        level: 1,
        xp: 120,
        isOptional: false,
        position: { x: 100, y: 120 },
        prerequisites: [],
        description: 'Master modern semantic HTML5 elements, CSS Flexbox and Grid layout engines, mobile-first responsive media queries, and WCAG accessibility standards.',
        whyItMatters: 'Every high-performance web interface requires resilient, accessible markup and layout architecture before introducing client-side JavaScript.',
        whatYouWillLearn: [
          'Semantic HTML tags and ARIA accessibility attributes',
          'Deep dive into Flexbox axes and Grid track sizing',
          'Responsive design principles and fluid typography'
        ],
        estimatedMinutes: 90,
        resources: [
          {
            id: 'res-w1',
            title: 'MDN Web Docs: HTML & CSS Structured Learning',
            url: 'https://developer.mozilla.org/en-US/docs/Learn/HTML',
            source: 'MDN Web Docs',
            type: 'documentation',
            duration: '45 mins',
            difficulty: 'Beginner',
            description: 'Comprehensive guide to modern web markup and CSS styling standards.'
          },
          {
            id: 'res-w2',
            title: 'Flexbox & CSS Grid Interactive Playground',
            url: 'https://cssgridgarden.com/',
            source: 'Grid Garden',
            type: 'interactive',
            duration: '30 mins',
            difficulty: 'Beginner',
            description: 'Gamified puzzle game to master CSS grid alignment and track properties.'
          }
        ],
        practicalTask: {
          title: 'Build a Responsive Gaming Dashboard Card',
          instructions: 'Construct a semantic, accessible dark-mode UI card featuring responsive grid layout, badge indicators, and hover state transitions without external frameworks.',
          acceptanceCriteria: [
            'Use semantic <article>, <header>, and <main> tags',
            'Layout flexes from 1 column on mobile to 2 columns on desktop',
            'Passes WCAG AA color contrast checks'
          ],
          starterCode: '<article class="quest-card">\n  <header><h3>Quest Milestone</h3></header>\n</article>',
          deliverableType: 'code'
        },
        assessment: {
          type: 'quiz',
          questions: [
            {
              id: 'q-w1',
              question: 'Which CSS Grid property specifies default automatic track sizes along the cross axis?',
              options: ['grid-template-rows', 'grid-auto-rows', 'grid-auto-flow', 'align-content'],
              correctIndex: 1,
              explanation: 'grid-auto-rows specifies the size of implicitly created grid rows.'
            },
            {
              id: 'q-w2',
              question: 'Why should buttons always have accessible names and semantic <button> tags instead of <div> with onClick?',
              options: ['For styling speed only', 'For native keyboard focus (Tab/Space/Enter) and screen reader support', 'Browsers crash on clickable divs', 'It is required by CSS'],
              correctIndex: 1,
              explanation: 'Semantic <button> handles keyboard activation and screen reader role announcement natively.'
            }
          ]
        }
      },
      {
        id: 'web-js-async',
        stageId: 'web-s1',
        title: 'Modern JavaScript ES6+ & Async/Await',
        subtitle: 'Closures, Event Loop, Promises, and DOM APIs',
        level: 2,
        xp: 150,
        isOptional: false,
        position: { x: 320, y: 120 },
        prerequisites: ['web-html-css'],
        description: 'Understand JavaScript deep internals: the event loop, execution contexts, closures, promises, async/await, and modern ES module syntax.',
        whyItMatters: 'Asynchronous event handling and modular code organization are the bedrock of interactive single-page applications and backend runtimes.',
        whatYouWillLearn: [
          'Microtask vs Macrotask queue in the browser Event Loop',
          'Promise chaining, error propagation, and Promise.allSettled',
          'Destructuring, spread/rest, and immutability techniques'
        ],
        estimatedMinutes: 120,
        resources: [
          {
            id: 'res-w3',
            title: 'JavaScript.info: The Modern JavaScript Tutorial',
            url: 'https://javascript.info/',
            source: 'JavaScript.info',
            type: 'documentation',
            duration: '60 mins',
            difficulty: 'Intermediate',
            description: 'In-depth reference explaining JavaScript internals, prototypes, and async flows.'
          },
          {
            id: 'res-w4',
            title: 'What the heck is the event loop anyway?',
            url: 'https://www.youtube.com/watch?v=8aGhZQkoFbQ',
            source: 'Philip Roberts / JSConf',
            type: 'video',
            duration: '26 mins',
            difficulty: 'Beginner',
            description: 'The definitive visual guide to the JavaScript call stack, Web APIs, and task queue.'
          }
        ],
        practicalTask: {
          title: 'Implement an Asynchronous Rate-Limited Request Queue',
          instructions: 'Write a JavaScript class that accepts asynchronous task functions and executes them with a maximum concurrency limit of 3 tasks simultaneously.',
          acceptanceCriteria: [
            'Handles Promise rejection gracefully without stopping remaining queue items',
            'Maintains max 3 active in-flight executions at any time',
            'Returns a promise that resolves when all queued items finish'
          ],
          starterCode: 'class AsyncQueue {\n  constructor(concurrency = 3) {}\n  add(taskFn) {}\n}',
          deliverableType: 'code'
        },
        assessment: {
          type: 'quiz',
          questions: [
            {
              id: 'q-w3',
              question: 'In the JavaScript event loop, which queue has priority when the call stack clears?',
              options: ['Macrotask queue (setTimeout)', 'Microtask queue (Promises, queueMicrotask)', 'Render requestAnimationFrame only', 'Worker thread queue'],
              correctIndex: 1,
              explanation: 'All microtasks are exhausted immediately before the next macrotask is dequeued.'
            }
          ]
        }
      },
      {
        id: 'web-react-core',
        stageId: 'web-s1',
        title: 'React 18 & Component State Machines',
        subtitle: 'Hooks, virtual DOM reconciliation, and unidirectional data flow',
        level: 3,
        xp: 180,
        isOptional: false,
        position: { x: 540, y: 120 },
        prerequisites: ['web-js-async'],
        description: 'Build robust component trees using React hooks (useState, useEffect, useMemo, useCallback, useReducer), custom hooks, and concurrent features.',
        whyItMatters: 'React powers the majority of modern enterprise frontend systems with predictable component lifecycles and rich ecosystem tooling.',
        whatYouWillLearn: [
          'Component lifecycle and useEffect dependency rules',
          'Managing complex state with useReducer and Context',
          'Performance optimization with memoization and code-splitting'
        ],
        estimatedMinutes: 150,
        resources: [
          {
            id: 'res-w5',
            title: 'Official React Documentation (react.dev)',
            url: 'https://react.dev/learn',
            source: 'React Team',
            type: 'documentation',
            duration: '90 mins',
            difficulty: 'Intermediate',
            description: 'Modern official guide focusing on function components, hooks, and clean architecture.'
          }
        ],
        practicalTask: {
          title: 'Build a Multi-Step Wizard with Undo/Redo Capability',
          instructions: 'Develop a custom hook `useHistoryState` that records state transitions and allows stepping backward and forward through previous states.',
          acceptanceCriteria: [
            'Implements undo, redo, and canUndo/canRedo boolean flags',
            'Prevents unnecessary component re-renders'
          ],
          starterCode: 'function useHistoryState(initialValue) {\n  // your hook logic here\n}',
          deliverableType: 'code'
        },
        assessment: {
          type: 'quiz',
          questions: [
            {
              id: 'q-w4',
              question: 'Why should state in React never be mutated directly (e.g., state.push(item))?',
              options: ['Direct mutations cause syntax errors in JavaScript', 'React checks reference equality (Object.is) to trigger re-renders', 'React reloads the page on direct mutation', 'It uses too much memory'],
              correctIndex: 1,
              explanation: 'React compares previous and next state references. Mutating existing objects in-place fails reference equality checks.'
            }
          ]
        }
      },
      {
        id: 'web-tailwind-ui',
        stageId: 'web-s1',
        title: 'Design Systems & Utility-First Styling',
        subtitle: 'Tailwind CSS, design tokens, and micro-interactions',
        level: 2,
        xp: 110,
        isOptional: true,
        position: { x: 540, y: 260 },
        prerequisites: ['web-html-css'],
        description: 'Construct cohesive dark-mode UI systems using utility classes, design token variables, and smooth CSS transitions.',
        whyItMatters: 'Rapid prototyping and scalable styling architecture keep design uniform without stylesheet bloat.',
        whatYouWillLearn: [
          'Design tokens and color contrast palettes',
          'Customizing Tailwind themes and animation keyframes',
          'Accessible focus states and responsive modifiers'
        ],
        estimatedMinutes: 60,
        resources: [
          {
            id: 'res-w6',
            title: 'Tailwind CSS Documentation',
            url: 'https://tailwindcss.com/docs',
            source: 'Tailwind Labs',
            type: 'documentation',
            duration: '40 mins',
            difficulty: 'Beginner',
            description: 'Reference for utility classes and configuration presets.'
          }
        ],
        practicalTask: {
          title: 'Design a Sleek Dark Mode Gamified Badge',
          instructions: 'Create an interactive badge component using Tailwind with glowing borders and hover scale animation.',
          acceptanceCriteria: ['Uses dark theme tokens', 'Has hover micro-animation'],
          starterCode: '<div class="rounded-xl border border-violet-500/30"></div>',
          deliverableType: 'code'
        },
        assessment: {
          type: 'quiz',
          questions: [
            {
              id: 'q-w5',
              question: 'Which Tailwind class enables applying styles only when the user prefers dark mode?',
              options: ['theme-dark:', 'dark:', 'night:', 'media-dark:'],
              correctIndex: 1,
              explanation: 'The dark: variant applies classes conditionally based on dark mode.'
            }
          ]
        }
      },
      {
        id: 'web-node-express',
        stageId: 'web-s2',
        title: 'Node.js & Express RESTful APIs',
        subtitle: 'HTTP methods, routing, middleware pipeline, and error handling',
        level: 3,
        xp: 170,
        isOptional: false,
        position: { x: 760, y: 120 },
        prerequisites: ['web-react-core'],
        description: 'Build robust server-side applications using Node.js event-driven runtime and Express framework with modular routers and centralized error handling.',
        whyItMatters: 'The backend serves as the authoritative business logic and security perimeter for any real-world digital product.',
        whatYouWillLearn: [
          'Express middleware pipeline execution model',
          'RESTful endpoint conventions and status code discipline',
          'Centralized async error handling and request validation'
        ],
        estimatedMinutes: 120,
        resources: [
          {
            id: 'res-w7',
            title: 'Express.js Official Guide',
            url: 'https://expressjs.com/en/guide/routing.html',
            source: 'OpenJS Foundation',
            type: 'documentation',
            duration: '45 mins',
            difficulty: 'Intermediate',
            description: 'Routing, middleware composition, and production best practices.'
          }
        ],
        practicalTask: {
          title: 'Construct a Validated Roadmap REST API Endpoint',
          instructions: 'Implement an Express route with validation middleware that handles errors without crashing the node process.',
          acceptanceCriteria: [
            'Returns 201 for valid creations and 400 for bad input',
            'Includes global error middleware'
          ],
          starterCode: 'const express = require("express");\nconst app = express();',
          deliverableType: 'code'
        },
        assessment: {
          type: 'quiz',
          questions: [
            {
              id: 'q-w6',
              question: 'In Express middleware, what happens if next() is not called and no response is sent?',
              options: ['The server throws an UnhandledRejection', 'The request hangs indefinitely until timeout', 'Express sends 200 OK by default', 'The server restarts'],
              correctIndex: 1,
              explanation: 'Without next() or res.send(), the request remains pending until the client or gateway times out.'
            }
          ]
        }
      },
      {
        id: 'web-database-modeling',
        stageId: 'web-s2',
        title: 'Database Architecture: MongoDB & PostgreSQL',
        subtitle: 'Schema design, indexing, relationships, and ACID transactions',
        level: 4,
        xp: 200,
        isOptional: false,
        position: { x: 980, y: 120 },
        prerequisites: ['web-node-express'],
        description: 'Design scalable data stores using MongoDB document schemas and PostgreSQL relational normalization. Master indexing strategies for sub-millisecond lookups.',
        whyItMatters: 'Poor data schemas lead to performance bottlenecks and data corruption as an application scales.',
        whatYouWillLearn: [
          'Embedding vs referencing patterns in document databases',
          'Compound indexes and query execution explain plans',
          'Atomic operations and database migrations'
        ],
        estimatedMinutes: 140,
        resources: [
          {
            id: 'res-w8',
            title: 'MongoDB University: Data Modeling Best Practices',
            url: 'https://www.mongodb.com/docs/manual/core/data-modeling-introduction/',
            source: 'MongoDB Docs',
            type: 'documentation',
            duration: '50 mins',
            difficulty: 'Intermediate',
            description: 'Practical guide to structuring NoSQL collections and query performance.'
          }
        ],
        practicalTask: {
          title: 'Design an Indexed Quest & Progress Database Schema',
          instructions: 'Write a schema definition with compound indexes optimizing query by userId and completion status.',
          acceptanceCriteria: [
            'Creates index on { userId: 1, status: 1 }',
            'Prevents duplicate records with unique constraints'
          ],
          starterCode: 'const schema = new mongoose.Schema({});',
          deliverableType: 'code'
        },
        assessment: {
          type: 'quiz',
          questions: [
            {
              id: 'q-w7',
              question: 'What is the primary benefit of creating an index on frequently queried fields?',
              options: ['Reduces database storage size', 'Turns O(N) collection scans into O(log N) B-Tree lookups', 'Automatically encrypts data', 'Prevents null values'],
              correctIndex: 1,
              explanation: 'Indexes provide logarithmic time search structures instead of scanning every document.'
            }
          ]
        }
      },
      {
        id: 'web-auth-security',
        stageId: 'web-s2',
        title: 'Authentication & Web Security Protocols',
        subtitle: 'JWT, secure cookies, bcrypt password hashing, and CORS',
        level: 4,
        xp: 190,
        isOptional: false,
        position: { x: 980, y: 260 },
        prerequisites: ['web-database-modeling'],
        description: 'Implement ironclad authentication with salted bcrypt hashing, httpOnly refresh token cookies, JWT verification, and OWASP security hardening.',
        whyItMatters: 'Protecting user data and preventing vulnerabilities like CSRF, XSS, and SQL/NoSQL injection is non-negotiable.',
        whatYouWillLearn: [
          'Storing tokens safely: httpOnly, SameSite, and Secure flags',
          'Implementing access token & refresh token rotation',
          'Mitigating XSS and CSRF attack vectors'
        ],
        estimatedMinutes: 100,
        resources: [
          {
            id: 'res-w9',
            title: 'OWASP Top 10 Web Application Security Risks',
            url: 'https://owasp.org/www-project-top-ten/',
            source: 'OWASP Foundation',
            type: 'article',
            duration: '40 mins',
            difficulty: 'Intermediate',
            description: 'Standard security awareness document for web developers.'
          }
        ],
        practicalTask: {
          title: 'Implement JWT Verify Middleware with Token Expiry Handling',
          instructions: 'Write Express authentication middleware extracting Bearer tokens and returning 401 with informative error codes.',
          acceptanceCriteria: ['Validates signature', 'Handles expired tokens cleanly'],
          starterCode: 'function authMiddleware(req, res, next) {}',
          deliverableType: 'code'
        },
        assessment: {
          type: 'quiz',
          questions: [
            {
              id: 'q-w8',
              question: 'Why should sensitive authentication tokens be stored in httpOnly cookies rather than localStorage?',
              options: ['localStorage is slower', 'httpOnly cookies cannot be read by malicious client-side JavaScript, protecting against XSS', 'localStorage is cleared on page reload', 'Cookies have unlimited capacity'],
              correctIndex: 1,
              explanation: 'httpOnly prevents JavaScript from reading the cookie, stopping XSS token theft.'
            }
          ]
        }
      },
      {
        id: 'web-docker-cloud',
        stageId: 'web-s3',
        title: 'Docker Containerization & Production Deployment',
        subtitle: 'Multi-stage Dockerfiles, environment secrets, and cloud hosting',
        level: 5,
        xp: 220,
        isOptional: false,
        position: { x: 1200, y: 120 },
        prerequisites: ['web-auth-security'],
        description: 'Package client and server in lightweight multi-stage Docker containers, configure environment variables safely, and deploy to cloud platforms.',
        whyItMatters: 'Reproducible builds eliminate "it works on my machine" syndrome and enable seamless horizontal scaling.',
        whatYouWillLearn: [
          'Multi-stage Docker builds to reduce image size by 80%',
          'Docker compose orchestration for local microservices',
          'Zero-downtime deployment workflows'
        ],
        estimatedMinutes: 110,
        resources: [
          {
            id: 'res-w10',
            title: 'Docker Official Get Started Tutorial',
            url: 'https://docs.docker.com/get-started/',
            source: 'Docker Inc.',
            type: 'documentation',
            duration: '50 mins',
            difficulty: 'Intermediate',
            description: 'Step-by-step containerization from single container to orchestrated stack.'
          }
        ],
        practicalTask: {
          title: 'Write a Production Multi-Stage Dockerfile for Node/React',
          instructions: 'Build a 2-stage Dockerfile: build stage compiles client bundle, production stage runs lightweight node server.',
          acceptanceCriteria: ['Contains build and runner stages', 'Uses non-root user'],
          starterCode: 'FROM node:20-alpine AS builder\nWORKDIR /app',
          deliverableType: 'code'
        },
        assessment: {
          type: 'quiz',
          questions: [
            {
              id: 'q-w9',
              question: 'What is the primary benefit of multi-stage Docker builds?',
              options: ['Faster internet speed', 'Leaves devDependencies, compilers and intermediate artifacts out of the final slim image', 'Runs multiple containers simultaneously', 'Removes requirement for Linux'],
              correctIndex: 1,
              explanation: 'Multi-stage builds copy only the compiled production output into the final minimal base image.'
            }
          ]
        }
      },
      {
        id: 'web-capstone-project',
        stageId: 'web-s3',
        title: 'Full-Stack Capstone: Production SaaS Quest',
        subtitle: 'End-to-end reactive application with database, auth, and automated tests',
        level: 5,
        xp: 350,
        isOptional: false,
        position: { x: 1420, y: 120 },
        prerequisites: ['web-docker-cloud'],
        description: 'Synthesize every skill acquired by building, documenting, and deploying a full-featured web platform with authentication, interactive UI, and live database persistence.',
        whyItMatters: 'Demonstrating a live, polished application is the ultimate proof of mastery for recruiters and engineering teams.',
        whatYouWillLearn: [
          'Architecting unified full-stack monorepo or microservices',
          'End-to-end integration testing and error resilience',
          'Publishing live production software with custom domain and SSL'
        ],
        estimatedMinutes: 300,
        resources: [
          {
            id: 'res-w11',
            title: 'Full Stack Open: Deep Dive into Modern Web Development',
            url: 'https://fullstackopen.com/en/',
            source: 'University of Helsinki',
            type: 'course',
            duration: '180 mins',
            difficulty: 'Advanced',
            description: 'World-renowned curriculum covering modern full-stack development practices.'
          }
        ],
        practicalTask: {
          title: 'Deploy Complete Full-Stack Web App & Submit Repository Link',
          instructions: 'Deploy your interactive web application with frontend, backend API, database, and authentication. Provide live URL and source repository.',
          acceptanceCriteria: [
            'Live URL accessible over HTTPS',
            'Source code includes README with local setup instructions',
            'Passing automated tests'
          ],
          starterCode: '{\n  "githubRepo": "https://github.com/username/project",\n  "liveUrl": "https://project.example.com"\n}',
          deliverableType: 'github_url'
        },
        assessment: {
          type: 'project',
          questions: [
            {
              id: 'q-w10',
              question: 'Which architectural pattern best protects against frontend cascading crashes when an API endpoint returns 500?',
              options: ['Removing catch blocks', 'React Error Boundaries coupled with resilient fallback UI states', 'Reloading window immediately', 'Using synchronous XMLHttpRequests'],
              correctIndex: 1,
              explanation: 'Error Boundaries catch JavaScript runtime errors anywhere in child component trees and render friendly fallback UIs.'
            }
          ]
        }
      }
    ],
    edges: [
      { id: 'we1', source: 'web-html-css', target: 'web-js-async' },
      { id: 'we2', source: 'web-js-async', target: 'web-react-core' },
      { id: 'we3', source: 'web-html-css', target: 'web-tailwind-ui', isOptional: true },
      { id: 'we4', source: 'web-react-core', target: 'web-node-express' },
      { id: 'we5', source: 'web-node-express', target: 'web-database-modeling' },
      { id: 'we6', source: 'web-database-modeling', target: 'web-auth-security' },
      { id: 'we7', source: 'web-auth-security', target: 'web-docker-cloud' },
      { id: 'we8', source: 'web-docker-cloud', target: 'web-capstone-project' }
    ]
  },

  // 2. Machine Learning
  {
    id: 'ml-master',
    canonicalGoal: 'Learn Machine Learning',
    aliases: [
      'machine learning',
      'learn ml',
      'applied machine learning',
      'ml engineer',
      'data science and machine learning',
      'artificial intelligence and ml'
    ],
    domain: 'AI/ML',
    difficulty: 'Intermediate to Advanced',
    targetOutcomes: [
      'Apply NumPy, Pandas, and Scikit-learn to real-world datasets',
      'Train, evaluate, and tune supervised and unsupervised models',
      'Build and train neural networks using PyTorch',
      'Deploy machine learning models to production APIs'
    ],
    version: 1.0,
    estimatedHours: 90,
    tags: ['Python', 'Data Science', 'Scikit-Learn', 'PyTorch', 'Deep Learning', 'MLOps'],
    stages: [
      { id: 'ml-s1', title: 'Data Foundations & Applied Math', description: 'Matrix operations, vectorized manipulation, and exploratory data analysis', order: 1, color: '#8B5CF6' },
      { id: 'ml-s2', title: 'Classical Machine Learning', description: 'Supervised regression, decision trees, clustering, and cross-validation', order: 2, color: '#22D3EE' },
      { id: 'ml-s3', title: 'Deep Learning & Neural Networks', description: 'PyTorch tensors, backpropagation, and production model serving', order: 3, color: '#10B981' }
    ],
    nodes: [
      {
        id: 'ml-python-math',
        stageId: 'ml-s1',
        title: 'Scientific Python: NumPy & Vectorized Math',
        subtitle: 'Multidimensional arrays, linear algebra, and broadcasting',
        level: 1,
        xp: 130,
        isOptional: false,
        position: { x: 100, y: 120 },
        prerequisites: [],
        description: 'Understand NumPy ndarrays, broadcasting rules, matrix multiplication, dot products, and vectorized operations that power scientific computations.',
        whyItMatters: 'Vectorization enables executing linear algebra routines at C-speed, eliminating Python loop bottlenecks in training algorithms.',
        whatYouWillLearn: [
          'Array creation, indexing, slicing, and reshaping',
          'Broadcasting semantics across dissimilar dimensions',
          'Dot products, matrix inversions, and eigenvalues'
        ],
        estimatedMinutes: 90,
        resources: [
          {
            id: 'res-m1',
            title: 'NumPy: The Absolute Basics for Beginners',
            url: 'https://numpy.org/doc/stable/user/absolute_beginners.html',
            source: 'NumPy Documentation',
            type: 'documentation',
            duration: '45 mins',
            difficulty: 'Beginner',
            description: 'Official introduction to core vector math and multi-dimensional arrays.'
          }
        ],
        practicalTask: {
          title: 'Implement Vectorized Cosine Similarity Matrix',
          instructions: 'Compute pairwise cosine similarity between two 2D numpy matrices without using Python for-loops.',
          acceptanceCriteria: ['Uses np.dot and np.linalg.norm', 'Zero for-loops'],
          starterCode: 'import numpy as np\ndef cosine_similarity_matrix(A, B):\n    pass',
          deliverableType: 'code'
        },
        assessment: {
          type: 'quiz',
          questions: [
            {
              id: 'q-m1',
              question: 'When does NumPy broadcasting allow an operation between arrays of shapes (5, 1) and (1, 4)?',
              options: ['Never, dimensions must match exactly', 'Always, resulting in an array of shape (5, 4)', 'Only if transposed', 'Throws shape error'],
              correctIndex: 1,
              explanation: 'Dimensions of size 1 are stretched along the matching axis, producing shape (5, 4).'
            }
          ]
        }
      },
      {
        id: 'ml-pandas-eda',
        stageId: 'ml-s1',
        title: 'Pandas & Exploratory Data Analysis (EDA)',
        subtitle: 'Data cleaning, feature transformation, and visualization',
        level: 2,
        xp: 140,
        isOptional: false,
        position: { x: 320, y: 120 },
        prerequisites: ['ml-python-math'],
        description: 'Clean raw tabular datasets, handle missing values, transform distributions, and extract statistical insights with Pandas and Seaborn.',
        whyItMatters: 'Data quality determines model accuracy. 80% of machine learning engineering consists of data preparation and validation.',
        whatYouWillLearn: [
          'DataFrame filtering, grouping, aggregation, and merging',
          'Imputing missing values and categorical encoding',
          'Outlier detection and correlation analysis'
        ],
        estimatedMinutes: 100,
        resources: [
          {
            id: 'res-m2',
            title: 'Pandas User Guide & Cookbook',
            url: 'https://pandas.pydata.org/docs/user_guide/index.html',
            source: 'Pandas Dev Team',
            type: 'documentation',
            duration: '50 mins',
            difficulty: 'Intermediate',
            description: 'Data wrangling and feature transformation reference.'
          }
        ],
        practicalTask: {
          title: 'Perform Automated EDA on a Tabular Dataset',
          instructions: 'Write a Python function that identifies skewness, null values, and collinear features above 0.85.',
          acceptanceCriteria: ['Outputs missing value summary', 'Flags highly correlated feature pairs'],
          starterCode: 'import pandas as pd\ndef analyze_dataset(df):\n    pass',
          deliverableType: 'code'
        },
        assessment: {
          type: 'quiz',
          questions: [
            {
              id: 'q-m2',
              question: 'Why should feature scaling (e.g. StandardScaler) be fit strictly on training data and not the whole dataset?',
              options: ['To save computation', 'To prevent data leakage from the test set into training', 'Scalers only work on small datasets', 'Scikit-learn errors out otherwise'],
              correctIndex: 1,
              explanation: 'Fitting on test data leaks future distribution parameters (mean/variance) into the model.'
            }
          ]
        }
      },
      {
        id: 'ml-supervised-learning',
        stageId: 'ml-s2',
        title: 'Supervised Learning: Regression to Random Forests',
        subtitle: 'Linear models, logistic regression, gradient boosting, and loss functions',
        level: 3,
        xp: 200,
        isOptional: false,
        position: { x: 540, y: 120 },
        prerequisites: ['ml-pandas-eda'],
        description: 'Implement fundamental machine learning algorithms: ordinary least squares, logistic classification, decision trees, and ensemble boosting (XGBoost/LightGBM).',
        whyItMatters: 'Tabular supervised models remain the highest performing and most interpretable algorithms across business domains.',
        whatYouWillLearn: [
          'Cost functions: MSE, Cross-Entropy, and Gradient Descent optimization',
          'Bias-Variance tradeoff, regularization (L1 Lasso / L2 Ridge)',
          'Ensemble techniques: Bagging vs Boosting'
        ],
        estimatedMinutes: 150,
        resources: [
          {
            id: 'res-m3',
            title: 'Scikit-Learn Machine Learning in Python',
            url: 'https://scikit-learn.org/stable/tutorial/index.html',
            source: 'Scikit-Learn',
            type: 'documentation',
            duration: '60 mins',
            difficulty: 'Intermediate',
            description: 'Practical guide to model training, pipelines, and parameter tuning.'
          }
        ],
        practicalTask: {
          title: 'Build a Tuned Churn Prediction Pipeline with Cross-Validation',
          instructions: 'Construct an end-to-end Pipeline including preprocessing, SMOTE balancing, and Hyperparameter search for a Random Forest classifier.',
          acceptanceCriteria: ['Uses cross-validation', 'Evaluates using Precision-Recall AUC'],
          starterCode: 'from sklearn.pipeline import Pipeline\nfrom sklearn.ensemble import RandomForestClassifier',
          deliverableType: 'code'
        },
        assessment: {
          type: 'quiz',
          questions: [
            {
              id: 'q-m3',
              question: 'For an imbalanced classification problem where positive fraud cases are 0.5%, why is Accuracy a misleading metric?',
              options: ['Accuracy is mathematically unstable', 'A naive classifier predicting all negatives achieves 99.5% accuracy while finding zero fraud cases', 'Precision and Recall cannot be calculated', 'Accuracy requires equal classes'],
              correctIndex: 1,
              explanation: 'Accuracy ignores class distribution. PR-AUC and F1 provide true predictive performance on minority classes.'
            }
          ]
        }
      },
      {
        id: 'ml-unsupervised-clustering',
        stageId: 'ml-s2',
        title: 'Unsupervised Learning & Dimensionality Reduction',
        subtitle: 'K-Means, DBSCAN, PCA, and t-SNE embeddings',
        level: 3,
        xp: 160,
        isOptional: true,
        position: { x: 540, y: 260 },
        prerequisites: ['ml-pandas-eda'],
        description: 'Discover hidden patterns in unlabeled data using clustering algorithms and project high-dimensional spaces to lower dimensions with Principal Component Analysis.',
        whyItMatters: 'Crucial for customer segmentation, anomaly detection, and visualizing embeddings.',
        whatYouWillLearn: [
          'Elbow method and Silhouette scores for optimal K selection',
          'Eigenvalue decomposition in PCA',
          'Density-based clustering with DBSCAN'
        ],
        estimatedMinutes: 80,
        resources: [
          {
            id: 'res-m4',
            title: 'StatQuest: Principal Component Analysis (PCA) Clearly Explained',
            url: 'https://www.youtube.com/watch?v=FgakZw6K1QQ',
            source: 'StatQuest with Josh Starmer',
            type: 'video',
            duration: '20 mins',
            difficulty: 'Beginner',
            description: 'Intuitive breakdown of variance maximization and eigenvectors in PCA.'
          }
        ],
        practicalTask: {
          title: 'Customer Segmentation with PCA & K-Means',
          instructions: 'Perform dimensional compression on an 18-variable dataset and cluster into distinct behavioral segments.',
          acceptanceCriteria: ['Computes explained variance ratio', 'Plots clusters'],
          starterCode: 'from sklearn.decomposition import PCA\nfrom sklearn.cluster import KMeans',
          deliverableType: 'code'
        },
        assessment: {
          type: 'quiz',
          questions: [
            {
              id: 'q-m4',
              question: 'What does the first Principal Component (PC1) represent in PCA?',
              options: ['The feature with the lowest value', 'The direction in data space along which variance is maximized', 'The mean of all rows', 'The residual error'],
              correctIndex: 1,
              explanation: 'PC1 is the linear combination of original features that captures the largest possible variance.'
            }
          ]
        }
      },
      {
        id: 'ml-deep-learning-pytorch',
        stageId: 'ml-s3',
        title: 'Deep Learning with PyTorch',
        subtitle: 'Tensors, Autograd, backpropagation, and multi-layer perceptrons',
        level: 4,
        xp: 220,
        isOptional: false,
        position: { x: 760, y: 120 },
        prerequisites: ['ml-supervised-learning'],
        description: 'Train neural architectures in PyTorch. Master computational graphs, automatic differentiation with autograd, activation functions, and mini-batch stochastic gradient descent.',
        whyItMatters: 'Deep learning is the engine behind modern vision, natural language understanding, and generative artificial intelligence.',
        whatYouWillLearn: [
          'PyTorch nn.Module architecture and forward pass',
          'Loss backward and optimizer.step lifecycle',
          'Dropout, BatchNorm, and preventing overfitting'
        ],
        estimatedMinutes: 180,
        resources: [
          {
            id: 'res-m5',
            title: 'PyTorch Deep Learning 60-Minute Blitz',
            url: 'https://pytorch.org/tutorials/beginner/deep_learning_60min_blitz.html',
            source: 'PyTorch Official',
            type: 'documentation',
            duration: '60 mins',
            difficulty: 'Intermediate',
            description: 'Hands-on introduction to PyTorch tensors, autograd, and neural net training loops.'
          }
        ],
        practicalTask: {
          title: 'Build and Train a PyTorch Multi-Layer Classifier',
          instructions: 'Construct an nn.Module with ReLU activations and Dropout, write training loop over 15 epochs, and plot validation loss curve.',
          acceptanceCriteria: ['Implements custom nn.Module', 'Demonstrates train and evaluation modes'],
          starterCode: 'import torch\nimport torch.nn as nn\n\nclass Net(nn.Module):\n    pass',
          deliverableType: 'code'
        },
        assessment: {
          type: 'quiz',
          questions: [
            {
              id: 'q-m5',
              question: 'Why must optimizer.zero_grad() be called before loss.backward() in a PyTorch training loop?',
              options: ['To reset model weights', 'Because gradients accumulate by default on backward calls', 'To allocate GPU memory', 'To shuffle batches'],
              correctIndex: 1,
              explanation: 'PyTorch accumulates gradients across iterations unless explicitly cleared using zero_grad().'
            }
          ]
        }
      },
      {
        id: 'ml-model-serving-capstone',
        stageId: 'ml-s3',
        title: 'MLOps & Production Model Deployment Capstone',
        subtitle: 'Model serialization, ONNX, FastAPI inference microservice, and Docker',
        level: 5,
        xp: 320,
        isOptional: false,
        position: { x: 980, y: 120 },
        prerequisites: ['ml-deep-learning-pytorch'],
        description: 'Take a trained model from notebook to production. Export with ONNX runtime, package inside a FastAPI asynchronous REST service, and benchmark throughput with Docker.',
        whyItMatters: 'Models deliver zero business value until integrated reliably into user-facing software systems.',
        whatYouWillLearn: [
          'Model serialization with Joblib, ONNX, and TorchScript',
          'FastAPI batch inference endpoints with input validation',
          'Model drift monitoring and latency profiling'
        ],
        estimatedMinutes: 240,
        resources: [
          {
            id: 'res-m6',
            title: 'Full Stack Deep Learning: Deployment & Monitoring',
            url: 'https://fullstackdeeplearning.com/',
            source: 'FSDL',
            type: 'course',
            duration: '120 mins',
            difficulty: 'Advanced',
            description: 'Comprehensive curriculum on shipping machine learning systems.'
          }
        ],
        practicalTask: {
          title: 'Deploy ML Inference API with Pydantic Input Validation',
          instructions: 'Build a containerized FastAPI endpoint accepting JSON feature vectors and returning prediction scores under 50ms latency.',
          acceptanceCriteria: ['Includes input schema validation', 'Includes Dockerfile'],
          starterCode: 'from fastapi import FastAPI\nfrom pydantic import BaseModel',
          deliverableType: 'github_url'
        },
        assessment: {
          type: 'project',
          questions: [
            {
              id: 'q-m6',
              question: 'What is data drift in production machine learning?',
              options: ['Hardware failure on disk', 'A shift in the statistical distribution of input data compared to training distribution over time', 'Network latency spikes', 'Memory leakage in Python'],
              correctIndex: 1,
              explanation: 'Data drift occurs when real-world input feature distributions diverge from the training distribution, degrading accuracy.'
            }
          ]
        }
      }
    ],
    edges: [
      { id: 'me1', source: 'ml-python-math', target: 'ml-pandas-eda' },
      { id: 'me2', source: 'ml-pandas-eda', target: 'ml-supervised-learning' },
      { id: 'me3', source: 'ml-pandas-eda', target: 'ml-unsupervised-clustering', isOptional: true },
      { id: 'me4', source: 'ml-supervised-learning', target: 'ml-deep-learning-pytorch' },
      { id: 'me5', source: 'ml-deep-learning-pytorch', target: 'ml-model-serving-capstone' }
    ]
  },

  // 3. AI Agents and RAG
  {
    id: 'ai-agents-master',
    canonicalGoal: 'Build AI Agents and RAG Systems',
    aliases: [
      'ai agents',
      'build ai agents',
      'rag',
      'retrieval augmented generation',
      'llm agents',
      'autonomous agents',
      'langchain',
      'llamaindex',
      'ai agent architect'
    ],
    domain: 'AI/ML',
    difficulty: 'Intermediate to Advanced',
    targetOutcomes: [
      'Master prompt engineering, structured outputs, and tool-calling schemas',
      'Build production RAG pipelines with vector databases, hybrid search, and reranking',
      'Design autonomous multi-agent systems using LangGraph or CrewAI',
      'Deploy evaluation systems to test hallucination, relevance, and fidelity'
    ],
    version: 1.0,
    estimatedHours: 75,
    tags: ['LLMs', 'RAG', 'Vector DB', 'LangChain', 'LangGraph', 'AI Agents', 'Embeddings'],
    stages: [
      { id: 'agent-s1', title: 'LLM Foundations & Embeddings', description: 'Prompt optimization, structured JSON generation, and vector spaces', order: 1, color: '#8B5CF6' },
      { id: 'agent-s2', title: 'Production RAG Architecture', description: 'Chunking strategies, semantic indexing, hybrid retrieval, and reranking', order: 2, color: '#22D3EE' },
      { id: 'agent-s3', title: 'Autonomous Multi-Agent Systems', description: 'Tool use, stateful graphs, memory loops, and production deployment', order: 3, color: '#10B981' }
    ],
    nodes: [
      {
        id: 'agent-prompt-structured',
        stageId: 'agent-s1',
        title: 'Prompt Architecture & Structured Outputs',
        subtitle: 'System prompts, few-shot conditioning, and JSON schema enforcement',
        level: 1,
        xp: 130,
        isOptional: false,
        position: { x: 100, y: 120 },
        prerequisites: [],
        description: 'Design robust prompt instructions and enforce strict JSON schemas using instructor, pydantic, and native function calling.',
        whyItMatters: 'Unstructured text generation breaks downstream software pipelines. Reliable schemas bridge LLMs with deterministic software.',
        whatYouWillLearn: [
          'Chain-of-Thought, ReAct, and role prompting techniques',
          'Enforcing strict JSON Schema outputs and handling format drift',
          'Guardrails and jailbreak prevention basics'
        ],
        estimatedMinutes: 90,
        resources: [
          {
            id: 'res-a1',
            title: 'Anthropic Prompt Engineering Interactive Tutorial',
            url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview',
            source: 'Anthropic Docs',
            type: 'documentation',
            duration: '45 mins',
            difficulty: 'Beginner',
            description: 'Comprehensive guidelines on clear specifications, XML tags, and few-shot examples.'
          }
        ],
        practicalTask: {
          title: 'Implement Resilient Structured Extractor with Pydantic',
          instructions: 'Extract complex entity relationships from messy text into validated nested Pydantic models with auto-retry logic.',
          acceptanceCriteria: ['Validates schema strictly', 'Handles schema failure with repair prompt'],
          starterCode: 'from pydantic import BaseModel\n\nclass ExtractedEntity(BaseModel):\n    pass',
          deliverableType: 'code'
        },
        assessment: {
          type: 'quiz',
          questions: [
            {
              id: 'q-a1',
              question: 'Why is providing few-shot examples inside a prompt more reliable than describing rules purely in prose?',
              options: ['It uses fewer tokens', 'LLMs learn patterns and edge cases more effectively through demonstration than abstract instructions', 'It bypasses the system prompt', 'It disables temperature sampling'],
              correctIndex: 1,
              explanation: 'Concrete in-context input/output pairs guide model token probabilities much more accurately than ambiguous textual descriptions.'
            }
          ]
        }
      },
      {
        id: 'agent-embeddings-vectors',
        stageId: 'agent-s1',
        title: 'Vector Embeddings & Semantic Indexing',
        subtitle: 'Embedding models, cosine distance, and vector databases',
        level: 2,
        xp: 160,
        isOptional: false,
        position: { x: 320, y: 120 },
        prerequisites: ['agent-prompt-structured'],
        description: 'Understand vector representations, embedding dimensions, cosine similarity vs Euclidean distance, and index structures like HNSW in Pinecone/Chroma/Qdrant.',
        whyItMatters: 'Embeddings transform arbitrary text and concepts into numerical geometry, enabling semantic discovery.',
        whatYouWillLearn: [
          'Dense vector spaces and token semantic distance',
          'Approximate Nearest Neighbor (ANN) algorithms and HNSW indexing',
          'Metadata filtering and vector partitioning strategies'
        ],
        estimatedMinutes: 100,
        resources: [
          {
            id: 'res-a2',
            title: 'Pinecone Learning Center: Vector Search Explained',
            url: 'https://www.pinecone.io/learn/vector-search-basics/',
            source: 'Pinecone',
            type: 'article',
            duration: '35 mins',
            difficulty: 'Intermediate',
            description: 'Fundamental math and engineering behind vector databases and similarity metrics.'
          }
        ],
        practicalTask: {
          title: 'Build an In-Memory Semantic Search Engine',
          instructions: 'Index 50 technical articles using an embedding API, compute similarity matrix, and benchmark query retrieval times.',
          acceptanceCriteria: ['Returns top 3 nearest documents with cosine scores', 'Filters by category metadata'],
          starterCode: 'import numpy as np\ndef semantic_search(query_vec, doc_matrix, metadata): pass',
          deliverableType: 'code'
        },
        assessment: {
          type: 'quiz',
          questions: [
            {
              id: 'q-a2',
              question: 'Why is HNSW (Hierarchical Navigable Small World) preferred over brute-force search in vector databases?',
              options: ['Brute-force requires O(N) comparisons per query, while HNSW achieves logarithmic O(log N) approximate search', 'HNSW requires no memory', 'HNSW eliminates all search errors', 'Brute force does not support cosine similarity'],
              correctIndex: 0,
              explanation: 'HNSW builds multi-layer skip graphs to find nearest neighbors in sub-linear time.'
            }
          ]
        }
      },
      {
        id: 'agent-rag-pipeline',
        stageId: 'agent-s2',
        title: 'Production RAG: Chunking, Hybrid Search & Reranking',
        subtitle: 'Context window management, BM25 + dense fusion, and cross-encoders',
        level: 3,
        xp: 220,
        isOptional: false,
        position: { x: 540, y: 120 },
        prerequisites: ['agent-embeddings-vectors'],
        description: 'Implement modern RAG: semantic chunking with overlap, hybrid lexical (BM25) and dense retrieval with Reciprocal Rank Fusion (RRF), and cross-encoder reranking.',
        whyItMatters: 'Standard naive RAG fails on keyword precision and context stuffing. Hybrid pipelines achieve 3x higher retrieval precision.',
        whatYouWillLearn: [
          'Parent-document retrieval and sentence window indexing',
          'Reciprocal Rank Fusion (RRF) for combining sparse + dense results',
          'Cross-encoder rerankers (Cohere Rerank / BGE-Reranker)'
        ],
        estimatedMinutes: 140,
        resources: [
          {
            id: 'res-a3',
            title: 'Advanced RAG Techniques by LlamaIndex',
            url: 'https://docs.llamaindex.ai/en/stable/optimizing/production_rag/',
            source: 'LlamaIndex',
            type: 'documentation',
            duration: '60 mins',
            difficulty: 'Intermediate',
            description: 'Deep dive into production retrieval strategies and context optimization.'
          }
        ],
        practicalTask: {
          title: 'Construct a Hybrid Retrieval & Reranking Pipeline',
          instructions: 'Combine BM25 keyword matching with dense embedding similarity using Reciprocal Rank Fusion, then rerank top 10 down to top 3.',
          acceptanceCriteria: ['Implements RRF scoring formula', 'Passes relevant context to synthesis prompt'],
          starterCode: 'def reciprocal_rank_fusion(dense_ranks, sparse_ranks, k=60):\n    pass',
          deliverableType: 'code'
        },
        assessment: {
          type: 'quiz',
          questions: [
            {
              id: 'q-a3',
              question: 'Why is a cross-encoder reranker more accurate than a bi-encoder for relevance scoring?',
              options: ['Cross-encoders pass query and candidate text simultaneously through cross-attention layers', 'Cross-encoders generate shorter vectors', 'Cross-encoders do not use transformers', 'Bi-encoders cannot score texts'],
              correctIndex: 0,
              explanation: 'Cross-encoders compute full pairwise attention between all query and document tokens, capturing subtle semantic nuances.'
            }
          ]
        }
      },
      {
        id: 'agent-tool-use-react',
        stageId: 'agent-s3',
        title: 'Agent Tool Use & ReAct Decision Loops',
        subtitle: 'Function calling, tool registry, and execution sandboxes',
        level: 4,
        xp: 240,
        isOptional: false,
        position: { x: 760, y: 120 },
        prerequisites: ['agent-rag-pipeline'],
        description: 'Build agents that plan, reason, invoke external tools (calculators, web scrapers, databases), inspect execution outputs, and self-correct on failure.',
        whyItMatters: 'Tools give language models hands to interact with the real world and perform actions beyond static text generation.',
        whatYouWillLearn: [
          'ReAct (Reason + Act) loop execution pattern',
          'Defining JSON schema tool specifications',
          'Error recovery and tool output formatting'
        ],
        estimatedMinutes: 120,
        resources: [
          {
            id: 'res-a4',
            title: 'ReAct: Synergizing Reasoning and Acting in Language Models',
            url: 'https://arxiv.org/abs/2210.03629',
            source: 'Princeton / Google Research',
            type: 'article',
            duration: '40 mins',
            difficulty: 'Advanced',
            description: 'The foundational academic paper introducing the ReAct paradigm.'
          }
        ],
        practicalTask: {
          title: 'Build a Multi-Tool Agent with Web & Database Tools',
          instructions: 'Implement an autonomous agent loop that can choose between a SQL query tool and a currency converter to answer multi-step user questions.',
          acceptanceCriteria: ['Supports tool execution loop', 'Handles tool exception without crashing'],
          starterCode: 'class AgentLoop {\n  async run(userInput) {}\n}',
          deliverableType: 'code'
        },
        assessment: {
          type: 'quiz',
          questions: [
            {
              id: 'q-a4',
              question: 'What is the danger of letting an LLM execute arbitrary code or shell commands without sandboxing?',
              options: ['High token consumption only', 'Remote code execution, file system corruption, and data exfiltration vulnerabilities', 'Slow inference times', 'Model hallucinations increase'],
              correctIndex: 1,
              explanation: 'Unsandboxed code execution exposes the host environment to arbitrary malicious commands or unintended data destruction.'
            }
          ]
        }
      },
      {
        id: 'agent-multi-agent-capstone',
        stageId: 'agent-s3',
        title: 'Autonomous Multi-Agent Capstone (LangGraph)',
        subtitle: 'Stateful graphs, supervisor routing, and human-in-the-loop validation',
        level: 5,
        xp: 350,
        isOptional: false,
        position: { x: 980, y: 120 },
        prerequisites: ['agent-tool-use-react'],
        description: 'Orchestrate a team of specialized agents (Researcher, Coder, Critic) collaborating through a cyclic state graph with human approval checkpoints.',
        whyItMatters: 'Complex enterprise tasks require modular division of labor among specialized agentic nodes rather than a single monolithic prompt.',
        whatYouWillLearn: [
          'Stateful cyclic graphs with LangGraph / CrewAI',
          'Supervisor routing vs broadcast collaboration',
          'Human-in-the-loop interrupts and state checkpoints'
        ],
        estimatedMinutes: 240,
        resources: [
          {
            id: 'res-a5',
            title: 'LangGraph Concepts and Architecture Guide',
            url: 'https://langchain-ai.github.io/langgraph/',
            source: 'LangChain',
            type: 'documentation',
            duration: '90 mins',
            difficulty: 'Advanced',
            description: 'Building reliable agent workflows with cyclical graphs and persistent memory.'
          }
        ],
        practicalTask: {
          title: 'Deploy a Multi-Agent Research & Writing System',
          instructions: 'Build a 3-agent graph where an agent researches, a second agent drafts, and a third evaluates quality before final output.',
          acceptanceCriteria: ['Uses stateful communication', 'Includes test scenario with evaluation report'],
          starterCode: 'from langgraph.graph import StateGraph, END',
          deliverableType: 'github_url'
        },
        assessment: {
          type: 'project',
          questions: [
            {
              id: 'q-a5',
              question: 'In a multi-agent system, why is explicit shared state preferred over appending all agent thoughts into a single long conversation history?',
              options: ['Shared state prevents context window explosion and keeps agent inputs scoped to only relevant attributes', 'History cannot be passed to LLMs', 'Multi-agent frameworks forbid strings', 'It reduces temperature to 0'],
              correctIndex: 0,
              explanation: 'Scoped state dictionaries isolate variables, avoiding token waste and attention degradation from massive chat logs.'
            }
          ]
        }
      }
    ],
    edges: [
      { id: 'ae1', source: 'agent-prompt-structured', target: 'agent-embeddings-vectors' },
      { id: 'ae2', source: 'agent-embeddings-vectors', target: 'agent-rag-pipeline' },
      { id: 'ae3', source: 'agent-rag-pipeline', target: 'agent-tool-use-react' },
      { id: 'ae4', source: 'agent-tool-use-react', target: 'agent-multi-agent-capstone' }
    ]
  },

  // 4. DSA for Placements
  {
    id: 'dsa-master',
    canonicalGoal: 'Master DSA for Placements',
    aliases: [
      'dsa',
      'data structures and algorithms',
      'dsa for placements',
      'coding interviews',
      'leetcode mastery',
      'software engineer interview',
      'placement preparation',
      'competitive programming'
    ],
    domain: 'Data Structures & Algorithms',
    difficulty: 'Intermediate to Advanced',
    targetOutcomes: [
      'Master time and space complexity analysis with Big-O notation',
      'Identify and solve standard patterns: Two-Pointer, Sliding Window, Monotonic Stack',
      'Excel at Trees, Graphs (BFS/DFS, Dijkstra), and Dynamic Programming',
      'Ace technical interview rounds with structured problem-solving communication'
    ],
    version: 1.0,
    estimatedHours: 95,
    tags: ['Algorithms', 'Data Structures', 'LeetCode', 'Dynamic Programming', 'Graphs', 'Interviews'],
    stages: [
      { id: 'dsa-s1', title: 'Complexity & Linear Data Structures', description: 'Big-O notation, arrays, hash maps, sliding windows, and stacks', order: 1, color: '#8B5CF6' },
      { id: 'dsa-s2', title: 'Trees, Heaps & Graph Traversal', description: 'Binary search trees, priority queues, BFS, DFS, and shortest paths', order: 2, color: '#22D3EE' },
      { id: 'dsa-s3', title: 'Dynamic Programming & System Design Basics', description: '1D/2D memoization, knapsack variants, intervals, and mock interview drills', order: 3, color: '#10B981' }
    ],
    nodes: [
      {
        id: 'dsa-complexity-arrays',
        stageId: 'dsa-s1',
        title: 'Asymptotic Complexity & Two-Pointer/Sliding Window',
        subtitle: 'Big-O analysis, memory layout, prefix sums, and dual pointers',
        level: 1,
        xp: 130,
        isOptional: false,
        position: { x: 100, y: 120 },
        prerequisites: [],
        description: 'Understand time and space complexity bounds, contiguous memory caching, prefix sums, two-pointer convergence, and sliding window templates.',
        whyItMatters: 'Two-pointer and sliding window techniques optimize brute-force O(N²) quadratic loops into linear O(N) solutions.',
        whatYouWillLearn: [
          'Big-O, Big-Omega, Big-Theta time/space bounds',
          'Two-pointer left/right convergence vs fast/slow pointer cycle detection',
          'Fixed-length and dynamic-length sliding window boundaries'
        ],
        estimatedMinutes: 90,
        resources: [
          {
            id: 'res-d1',
            title: 'NeetCode: Sliding Window & Two Pointer Masterclass',
            url: 'https://neetcode.io/roadmap',
            source: 'NeetCode',
            type: 'interactive',
            duration: '45 mins',
            difficulty: 'Beginner',
            description: 'Clear visual animations of algorithmic pointer movements and edge conditions.'
          }
        ],
        practicalTask: {
          title: 'Implement Longest Substring Without Repeating Characters',
          instructions: 'Solve LeetCode #3 in O(N) time and O(min(N, M)) space using an optimal sliding window hash map.',
          acceptanceCriteria: ['Zero quadratic nested iterations', 'Correctly handles single-character strings and empty input'],
          starterCode: 'function lengthOfLongestSubstring(s: string): number {\n    // solution\n}',
          deliverableType: 'code'
        },
        assessment: {
          type: 'quiz',
          questions: [
            {
              id: 'q-d1',
              question: 'What is the time complexity of finding the maximum sum of any contiguous subarray of size K using sliding window?',
              options: ['O(N * K)', 'O(N)', 'O(N log N)', 'O(K²)'],
              correctIndex: 1,
              explanation: 'By adding the incoming element and subtracting the outgoing element, each item is visited once in O(N) total time.'
            }
          ]
        }
      },
      {
        id: 'dsa-hash-maps-stacks',
        stageId: 'dsa-s1',
        title: 'Hash Maps, Heaps & Monotonic Stacks',
        subtitle: 'Collision resolution, min-heaps, and next greater element patterns',
        level: 2,
        xp: 160,
        isOptional: false,
        position: { x: 320, y: 120 },
        prerequisites: ['dsa-complexity-arrays'],
        description: 'Master hash map bucketing and load factors, priority queues (heaps) for top-K problems, and monotonic stacks for range queries.',
        whyItMatters: 'Monotonic stacks solve complex lookback problems like Daily Temperatures and Trapping Rain Water in linear time.',
        whatYouWillLearn: [
          'Hash table chaining vs open addressing collisions',
          'Binary heaps, heapify in O(N) time, and priority queues',
          'Monotonic increasing/decreasing stack invariant properties'
        ],
        estimatedMinutes: 110,
        resources: [
          {
            id: 'res-d2',
            title: 'VisuAlgo: Visualizing Stacks, Queues, and Binary Heaps',
            url: 'https://visualgo.net/en/heap',
            source: 'VisuAlgo',
            type: 'interactive',
            duration: '40 mins',
            difficulty: 'Intermediate',
            description: 'Interactive step-by-step heapify animations and stack operations.'
          }
        ],
        practicalTask: {
          title: 'Solve Next Greater Element Using a Monotonic Stack',
          instructions: 'Given an array of numbers, return the next strictly greater element for each index in O(N) time.',
          acceptanceCriteria: ['Passes edge cases with identical elements', 'Achieves O(N) time'],
          starterCode: 'function nextGreaterElements(nums: number[]): number[] {}',
          deliverableType: 'code'
        },
        assessment: {
          type: 'quiz',
          questions: [
            {
              id: 'q-d2',
              question: 'Why does finding the top K largest elements in an array of size N take O(N log K) time with a min-heap instead of sorting in O(N log N)?',
              options: ['Min-heaps sort elements faster than quicksort', 'The heap maintains only K elements at any time, making insertion O(log K)', 'Min-heaps don\'t use memory', 'Heaps eliminate duplicate numbers'],
              correctIndex: 1,
              explanation: 'Restricting the heap size to K limits each insertion to log(K) comparisons.'
            }
          ]
        }
      },
      {
        id: 'dsa-trees-bst',
        stageId: 'dsa-s2',
        title: 'Binary Trees & Binary Search Trees (BST)',
        subtitle: 'Traversals, lowest common ancestor, diameter, and balance',
        level: 3,
        xp: 180,
        isOptional: false,
        position: { x: 540, y: 120 },
        prerequisites: ['dsa-hash-maps-stacks'],
        description: 'Master tree traversals (in-order, pre-order, post-order, level-order), recursive tree recursion, BST search/insert invariants, and balanced trees.',
        whyItMatters: 'Hierarchical tree logic is asked in nearly 100% of technical hiring interviews at top-tier software companies.',
        whatYouWillLearn: [
          'DFS recursive patterns vs BFS queue-based level traversals',
          'Lowest Common Ancestor (LCA) algorithms',
          'Validating BST properties in O(N) time'
        ],
        estimatedMinutes: 120,
        resources: [
          {
            id: 'res-d3',
            title: 'Striver\'s SDE Sheet: Complete Binary Tree Series',
            url: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/',
            source: 'takeUforward',
            type: 'article',
            duration: '60 mins',
            difficulty: 'Intermediate',
            description: 'Structured question bank with detailed intuition and code.'
          }
        ],
        practicalTask: {
          title: 'Compute Binary Tree Maximum Path Sum',
          instructions: 'Find the maximum path sum between any two nodes in a binary tree (LeetCode #124 hard).',
          acceptanceCriteria: ['Handles negative node values correctly', 'Traverses each node once'],
          starterCode: 'function maxPathSum(root: TreeNode | null): number {}',
          deliverableType: 'code'
        },
        assessment: {
          type: 'quiz',
          questions: [
            {
              id: 'q-d3',
              question: 'What is the characteristic property of an in-order traversal on a valid Binary Search Tree (BST)?',
              options: ['Returns nodes in descending order', 'Returns nodes in strictly ascending sorted order', 'Visits leaf nodes first', 'Visits root node first'],
              correctIndex: 1,
              explanation: 'In-order traversal visits Left -> Root -> Right, yielding sorted order on valid BSTs.'
            }
          ]
        }
      },
      {
        id: 'dsa-graphs-traversal',
        stageId: 'dsa-s2',
        title: 'Graph Algorithms: BFS, DFS, TopoSort & Shortest Path',
        subtitle: 'Adjacency lists, cycle detection, Kahn\'s algorithm, and Dijkstra',
        level: 4,
        xp: 220,
        isOptional: false,
        position: { x: 760, y: 120 },
        prerequisites: ['dsa-trees-bst'],
        description: 'Represent graphs with adjacency lists, perform cycle detection in directed/undirected graphs, topological sorting for dependency resolution, and Dijkstra shortest path.',
        whyItMatters: 'Real-world networks, road maps, package managers, and social connections are modeled as graphs.',
        whatYouWillLearn: [
          'Breadth-First Search (shortest path in unweighted graphs)',
          'Topological Sort with Kahn\'s in-degree queue algorithm',
          'Dijkstra algorithm with min-heap for weighted shortest paths'
        ],
        estimatedMinutes: 150,
        resources: [
          {
            id: 'res-d4',
            title: 'MIT 6.006: Introduction to Algorithms (Graph Traversals)',
            url: 'https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/',
            source: 'MIT OpenCourseWare',
            type: 'course',
            duration: '90 mins',
            difficulty: 'Advanced',
            description: 'Rigorous analysis of graph representations and pathfinding complexities.'
          }
        ],
        practicalTask: {
          title: 'Implement Course Schedule II (Topological Sort)',
          instructions: 'Given total courses and prerequisite pairs, return valid ordering or empty array if cycle exists.',
          acceptanceCriteria: ['Detects cyclic dependencies', 'Returns valid prerequisite sequence in O(V + E)'],
          starterCode: 'function findOrder(numCourses: number, prerequisites: number[][]): number[] {}',
          deliverableType: 'code'
        },
        assessment: {
          type: 'quiz',
          questions: [
            {
              id: 'q-d4',
              question: 'What is the time complexity of Dijkstra\'s algorithm using an adjacency list and min-heap?',
              options: ['O(V²)', 'O((V + E) log V)', 'O(V * E)', 'O(E²)'],
              correctIndex: 1,
              explanation: 'Each vertex is extracted once (V log V) and each edge relaxed once (E log V), yielding O((V + E) log V).'
            }
          ]
        }
      },
      {
        id: 'dsa-dynamic-programming',
        stageId: 'dsa-s3',
        title: 'Dynamic Programming: 1D & 2D Memoization',
        subtitle: 'Optimal substructure, overlapping subproblems, and knapsack patterns',
        level: 5,
        xp: 280,
        isOptional: false,
        position: { x: 980, y: 120 },
        prerequisites: ['dsa-graphs-traversal'],
        description: 'Master dynamic programming through state transition formulation, top-down memoization, bottom-up tabulation, space optimization, and knapsack variations.',
        whyItMatters: 'DP transforms exponential O(2ᴺ) combinatorial explosions into linear O(N) or polynomial O(N*M) optimal algorithms.',
        whatYouWillLearn: [
          'Identifying recurrence relations and base cases',
          '1D DP (House Robber, Coin Change)',
          '2D DP (Longest Common Subsequence, Edit Distance)'
        ],
        estimatedMinutes: 180,
        resources: [
          {
            id: 'res-d5',
            title: 'Dynamic Programming Patterns by LeetCode Community',
            url: 'https://leetcode.com/discuss/general-discussion/458695/dynamic-programming-patterns',
            source: 'LeetCode Discuss',
            type: 'article',
            duration: '60 mins',
            difficulty: 'Advanced',
            description: 'Comprehensive breakdown of standard DP pattern archetypes.'
          }
        ],
        practicalTask: {
          title: 'Solve 0/1 Knapsack & Coin Change with Space Optimization',
          instructions: 'Implement Coin Change (minimum coins needed) in O(amount * n) time and O(amount) space.',
          acceptanceCriteria: ['Returns -1 if impossible', 'Optimizes memory to 1D array'],
          starterCode: 'function coinChange(coins: number[], amount: number): number {}',
          deliverableType: 'code'
        },
        assessment: {
          type: 'quiz',
          questions: [
            {
              id: 'q-d5',
              question: 'What two properties must a problem have to be solvable using Dynamic Programming?',
              options: ['Continuous variables and sorted inputs', 'Optimal substructure and overlapping subproblems', 'Graph connectivity and trees', 'Binary search properties'],
              correctIndex: 1,
              explanation: 'Optimal substructure (solution built from optimal subproblems) and overlapping subproblems (repeated calculations saved in a table).'
            }
          ]
        }
      },
      {
        id: 'dsa-interview-capstone',
        stageId: 'dsa-s3',
        title: 'Mock Placement Assessment: FAANG Capstone',
        subtitle: 'Timed multi-problem round, edge case defense, and verbal articulation',
        level: 5,
        xp: 350,
        isOptional: false,
        position: { x: 1200, y: 120 },
        prerequisites: ['dsa-dynamic-programming'],
        description: 'Simulate a live 45-minute technical interview round. Clarify problem ambiguity, identify constraints, write bug-free code, and dry-run test cases.',
        whyItMatters: 'Landing placement offers requires clear verbal communication and systematic problem breakdown under time pressure.',
        whatYouWillLearn: [
          'The UMPIRE interview framework: Understand, Match, Plan, Implement, Review, Evaluate',
          'Testing edge cases: null, empty, single element, duplicates, maximum bounds',
          'Handling interviewer hints constructively'
        ],
        estimatedMinutes: 120,
        resources: [
          {
            id: 'res-d6',
            title: 'Cracking the Coding Interview Summary',
            url: 'https://github.com/careercup/ctci',
            source: 'Gayle Laakmann McDowell',
            type: 'article',
            duration: '45 mins',
            difficulty: 'Intermediate',
            description: 'Proven strategies for walking interviewers through thought processes.'
          }
        ],
        practicalTask: {
          title: 'Complete 3-Problem Placement Assessment Round',
          instructions: 'Solve 3 curated placement questions covering Sliding Window, BST, and DP within 45 minutes.',
          acceptanceCriteria: ['Passes all hidden test suites', 'Explains time & space complexity for each solution'],
          starterCode: '// Question 1: Trapping Rain Water\n// Question 2: Lowest Common Ancestor in BST\n// Question 3: Edit Distance',
          deliverableType: 'code'
        },
        assessment: {
          type: 'project',
          questions: [
            {
              id: 'q-d6',
              question: 'When asked a coding interview question, what should you do first before writing any code?',
              options: ['Start typing the brute force solution immediately', 'Clarify constraints, input types, edge cases, and discuss your approach and complexity with the interviewer', 'Ask for the solution', 'Keep silent and think for 20 minutes'],
              correctIndex: 1,
              explanation: 'Interviewers evaluate communication and problem breakdown. Clarifying inputs and aligning on strategy prevents wasted coding time.'
            }
          ]
        }
      }
    ],
    edges: [
      { id: 'de1', source: 'dsa-complexity-arrays', target: 'dsa-hash-maps-stacks' },
      { id: 'de2', source: 'dsa-hash-maps-stacks', target: 'dsa-trees-bst' },
      { id: 'de3', source: 'dsa-trees-bst', target: 'dsa-graphs-traversal' },
      { id: 'de4', source: 'dsa-graphs-traversal', target: 'dsa-dynamic-programming' },
      { id: 'de5', source: 'dsa-dynamic-programming', target: 'dsa-interview-capstone' }
    ]
  },

  // 5. Robotics and ROS 2
  {
    id: 'robotics-master',
    canonicalGoal: 'Learn Robotics and ROS 2',
    aliases: [
      'robotics',
      'ros 2',
      'robotics and ros 2',
      'learn robotics',
      'ros',
      'autonomous robots',
      'slam and navigation',
      'robot operating system',
      'mobile robotics'
    ],
    domain: 'Robotics & Hardware',
    difficulty: 'Intermediate to Advanced',
    targetOutcomes: [
      'Master Linux development for robotics and modern C++/Python',
      'Architect distributed robotics software using ROS 2 Nodes, Topics, Services, and Actions',
      'Simulate kinematic robots in Gazebo with URDF descriptions',
      'Implement autonomous navigation using LiDAR, SLAM, and Nav2'
    ],
    version: 1.0,
    estimatedHours: 80,
    tags: ['Robotics', 'ROS 2', 'Linux', 'C++', 'Python', 'Simulation', 'Gazebo', 'SLAM', 'Nav2'],
    stages: [
      { id: 'rob-s1', title: 'Robotics Math & Linux Environment', description: 'Linux systems, kinematics, coordinate frames (tf2), and Gazebo simulation', order: 1, color: '#8B5CF6' },
      { id: 'rob-s2', title: 'ROS 2 Core Architecture', description: 'Computation graph, publish-subscribe, custom interfaces, and URDF modeling', order: 2, color: '#22D3EE' },
      { id: 'rob-s3', title: 'Perception, SLAM & Autonomous Nav2', description: 'Sensor fusion, LiDAR mapping, path planning, and physical rover control', order: 3, color: '#10B981' }
    ],
    nodes: [
      {
        id: 'rob-linux-kinematics',
        stageId: 'rob-s1',
        title: 'Linux for Robotics & Spatial Kinematics',
        subtitle: 'Bash automation, transformation matrices, and tf2 frames',
        level: 1,
        xp: 130,
        isOptional: false,
        position: { x: 100, y: 120 },
        prerequisites: [],
        description: 'Master Ubuntu Linux robotics tooling, build processes with Colcon, spatial coordinate frames, rotation matrices, quaternions, and forward kinematics.',
        whyItMatters: 'Robots move in 3D physical space. Correctly calculating transformations between sensors, wheels, and world frames prevents mechanical crashes.',
        whatYouWillLearn: [
          'Linux process monitoring, networking, and bash scripting',
          'Homogeneous transformation matrices and Euler angles vs Quaternions',
          'ROS 2 tf2 coordinate frame trees (map -> odom -> base_link)'
        ],
        estimatedMinutes: 90,
        resources: [
          {
            id: 'res-r1',
            title: 'ROS 2 Documentation: Transform Library (tf2) Basics',
            url: 'https://docs.ros.org/en/humble/Tutorials/Intermediate/Tf2/Introduction-To-Tf2.html',
            source: 'Open Robotics',
            type: 'documentation',
            duration: '45 mins',
            difficulty: 'Intermediate',
            description: 'Official guide to maintaining spatial relationships over time in ROS 2.'
          }
        ],
        practicalTask: {
          title: 'Calculate 2D Coordinate Transformation with Quaternions',
          instructions: 'Given a robot base_link pose relative to odom, compute the laser sensor position relative to the world map.',
          acceptanceCriteria: ['Correctly multiplies transformation matrices', 'Normalizes rotation quaternions'],
          starterCode: 'import numpy as np\ndef transform_point(point_in_sensor, tf_sensor_to_base, tf_base_to_odom): pass',
          deliverableType: 'code'
        },
        assessment: {
          type: 'quiz',
          questions: [
            {
              id: 'q-r1',
              question: 'Why are Quaternions preferred over Euler angles (roll, pitch, yaw) for 3D rotations in robotics software?',
              options: ['Quaternions use less memory', 'Quaternions avoid Gimbal Lock and provide smooth spherical interpolation (SLERP)', 'Euler angles cannot represent 90 degrees', 'ROS 2 does not support math'],
              correctIndex: 1,
              explanation: 'Euler angles suffer from mathematical singularities (Gimbal Lock) when axes align, while 4D quaternions rotate smoothly in all orientations.'
            }
          ]
        }
      },
      {
        id: 'rob-ros2-nodes-topics',
        stageId: 'rob-s2',
        title: 'ROS 2 Architecture: Nodes, Topics & Services',
        subtitle: 'DDS middleware, publishers, subscribers, QoS, and rclpy/rclcpp',
        level: 2,
        xp: 180,
        isOptional: false,
        position: { x: 320, y: 120 },
        prerequisites: ['rob-linux-kinematics'],
        description: 'Build modular robotic nodes in ROS 2. Master asynchronous publisher-subscriber messaging over DDS, Quality of Service (QoS) reliability profiles, and request-response services.',
        whyItMatters: 'ROS 2 is the global industry standard for commercial robotics, autonomous driving, and industrial warehouse fleets.',
        whatYouWillLearn: [
          'DDS (Data Distribution Service) decentralized discovery',
          'Writing publisher and subscriber nodes in Python (rclpy)',
          'Configuring QoS profiles (Reliable vs Best Effort) for high-frequency sensor streams'
        ],
        estimatedMinutes: 120,
        resources: [
          {
            id: 'res-r2',
            title: 'ROS 2 Humble / Iron Official Tutorials',
            url: 'https://docs.ros.org/en/humble/Tutorials/Beginner-Client-Libraries.html',
            source: 'ROS 2 Docs',
            type: 'documentation',
            duration: '60 mins',
            difficulty: 'Intermediate',
            description: 'Creating packages, publishing cmd_vel, and listening to odometry topics.'
          }
        ],
        practicalTask: {
          title: 'Build a Collision-Avoidance Teleoperation Controller Node',
          instructions: 'Create a ROS 2 node that subscribes to /scan (LaserScan) and publishes safety stop commands to /cmd_vel when obstacles are within 0.5m.',
          acceptanceCriteria: ['Publishes Twist message', 'Stops forward velocity when obstacle detected'],
          starterCode: 'import rclpy\nfrom rclpy.node import Node\nfrom geometry_msgs.msg import Twist\nfrom sensor_msgs.msg import LaserScan',
          deliverableType: 'code'
        },
        assessment: {
          type: 'quiz',
          questions: [
            {
              id: 'q-r2',
              question: 'Which ROS 2 QoS reliability policy should be chosen for high-bandwidth camera or LiDAR sensor topics where losing occasional frames is better than network lag?',
              options: ['RELIABLE', 'BEST_EFFORT', 'VOLATILE', 'TRANSIENT_LOCAL'],
              correctIndex: 1,
              explanation: 'BEST_EFFORT minimizes latency by skipping re-transmissions for real-time sensor streams.'
            }
          ]
        }
      },
      {
        id: 'rob-urdf-simulation',
        stageId: 'rob-s2',
        title: 'Robot Modeling with URDF & Gazebo Simulation',
        subtitle: 'Visual, collision, inertia links, joints, and physics testing',
        level: 3,
        xp: 190,
        isOptional: false,
        position: { x: 540, y: 120 },
        prerequisites: ['rob-ros2-nodes-topics'],
        description: 'Design digital twin robots using Unified Robot Description Format (URDF) and Xacro macros. Spawn them in the Gazebo physics simulator with friction and inertia.',
        whyItMatters: 'Physical robot prototypes cost tens of thousands of dollars. Testing algorithms in simulation catches mechanical bugs safely and inexpensively.',
        whatYouWillLearn: [
          'Defining links (visual, collision, inertial matrices) and joints',
          'Using Xacro for modular, parameterized robot definitions',
          'Simulating motors and differential drive controllers in Gazebo'
        ],
        estimatedMinutes: 130,
        resources: [
          {
            id: 'res-r3',
            title: 'Articulated Robotics: Building a Mobile Robot with ROS 2',
            url: 'https://articulatedrobotics.xyz/tutorials/mobile-robot/hardware/intro/',
            source: 'Articulated Robotics',
            type: 'video',
            duration: '45 mins',
            difficulty: 'Intermediate',
            description: 'Step-by-step guide to constructing mobile robots from scratch in simulation.'
          }
        ],
        practicalTask: {
          title: 'Design a Differential-Drive Rover in URDF/Xacro',
          instructions: 'Write a valid URDF file for a 2-wheel differential rover with caster wheel, LiDAR mount, and correct inertial parameters.',
          acceptanceCriteria: ['Renders without errors in RViz', 'Defines collision boundaries accurately'],
          starterCode: '<?xml version="1.0"?>\n<robot xmlns:xacro="http://www.ros.org/wiki/xacro" name="quest_rover">',
          deliverableType: 'code'
        },
        assessment: {
          type: 'quiz',
          questions: [
            {
              id: 'q-r3',
              question: 'Why must collision geometry in URDF be simplified into basic primitives (boxes, cylinders, spheres) rather than high-polygon visual meshes?',
              options: ['Visual meshes cannot be loaded', 'Physics engines calculate collision contacts exponentially faster on primitives than thousands of mesh polygons', 'URDF forbids STL files', 'Gazebo crashes on colors'],
              correctIndex: 1,
              explanation: 'Complex meshes cause physics engines to stall during real-time contact point detection.'
            }
          ]
        }
      },
      {
        id: 'rob-slam-mapping',
        stageId: 'rob-s3',
        title: 'Perception, LiDAR Sensor Fusion & SLAM Mapping',
        subtitle: 'Laser scans, occupancy grids, Cartographer, and loop closure',
        level: 4,
        xp: 240,
        isOptional: false,
        position: { x: 760, y: 120 },
        prerequisites: ['rob-urdf-simulation'],
        description: 'Perform Simultaneous Localization and Mapping (SLAM). Combine wheel odometry with 2D/3D LiDAR laser scans using Cartographer or slam_toolbox to generate persistent occupancy grids.',
        whyItMatters: 'Robots operating in unknown or changing environments must localize themselves while building a reliable spatial map.',
        whatYouWillLearn: [
          'Occupancy grid representation (-1 unknown, 0 free, 100 occupied)',
          'Scan matching and submap construction',
          'Loop closure detection to eliminate cumulative odometry drift'
        ],
        estimatedMinutes: 140,
        resources: [
          {
            id: 'res-r4',
            title: 'slam_toolbox ROS 2 Package Documentation',
            url: 'https://github.com/SteveMacenski/slam_toolbox',
            source: 'Steve Macenski / ROS 2 Navigation WG',
            type: 'documentation',
            duration: '45 mins',
            difficulty: 'Advanced',
            description: 'Industry-standard 2D SLAM system for lifelong mapping.'
          }
        ],
        practicalTask: {
          title: 'Generate and Save an Occupancy Grid Map in Gazebo',
          instructions: 'Drive simulated robot around an indoor environment, build SLAM map, and save using nav2_map_server map_saver.',
          acceptanceCriteria: ['Produces .yaml and .pgm map files', 'Shows clear room boundary walls without drift artifacts'],
          starterCode: 'ros2 launch slam_toolbox online_async_launch.py',
          deliverableType: 'code'
        },
        assessment: {
          type: 'quiz',
          questions: [
            {
              id: 'q-r4',
              question: 'What is "loop closure" in SLAM mapping algorithms?',
              options: ['Closing a communication socket', 'Recognizing a previously visited location and adjusting the map to correct accumulated odometry drift', 'Driving in a circle to calibrate motors', 'Shutting down the robot'],
              correctIndex: 1,
              explanation: 'When the robot re-enters a known area, loop closure calculates the drift error and optimizes the entire pose graph.'
            }
          ]
        }
      },
      {
        id: 'rob-nav2-capstone',
        stageId: 'rob-s3',
        title: 'Nav2 Path Planning & Autonomous Rover Capstone',
        subtitle: 'Costmaps, A*/Dijkstra global planners, DWB local planners, and recovery behaviors',
        level: 5,
        xp: 350,
        isOptional: false,
        position: { x: 980, y: 120 },
        prerequisites: ['rob-slam-mapping'],
        description: 'Deploy the full ROS 2 Navigation Stack (Nav2). Configure global and local costmaps, behavior tree navigators, dynamic obstacle avoidance, and waypoint following.',
        whyItMatters: 'Nav2 is the brain that drives automated mobile robots in factories, hospitals, and planetary exploration.',
        whatYouWillLearn: [
          'Inflation layers and lethal obstacle costmaps',
          'Global path planners (NavFn, Smac Planner) vs Local trajectory controllers (DWB, MPPI)',
          'Behavior Tree navigation sequences and recovery actions (spin, backup, wait)'
        ],
        estimatedMinutes: 240,
        resources: [
          {
            id: 'res-r5',
            title: 'Navigation 2 (Nav2) Official Documentation',
            url: 'https://navigation.ros.org/',
            source: 'Nav2 Project',
            type: 'documentation',
            duration: '90 mins',
            difficulty: 'Advanced',
            description: 'Complete architecture reference for ROS 2 autonomous navigation.'
          }
        ],
        practicalTask: {
          title: 'Autonomous Multi-Waypoint Delivery Run',
          instructions: 'Write a Python script using the BasicNavigator API to command simulated rover through 4 waypoints, avoiding dynamic obstacles.',
          acceptanceCriteria: ['Reaches all target goals within 0.1m tolerance', 'Executes recovery behavior if path blocked'],
          starterCode: 'from nav2_simple_commander.robot_navigator import BasicNavigator\nimport rclpy',
          deliverableType: 'github_url'
        },
        assessment: {
          type: 'project',
          questions: [
            {
              id: 'q-r5',
              question: 'What is the role of an inflation layer in Nav2 costmaps?',
              options: ['Increases image brightness', 'Expands obstacle boundaries outward by the robot\'s inscribed radius to prevent robot corners from scraping walls', 'Speed up CPU calculations', 'Compacts map file size'],
              correctIndex: 1,
              explanation: 'Inflation layers calculate safety gradients around obstacles so path planners maintain safe clearance.'
            }
          ]
        }
      }
    ],
    edges: [
      { id: 're1', source: 'rob-linux-kinematics', target: 'rob-ros2-nodes-topics' },
      { id: 're2', source: 'rob-ros2-nodes-topics', target: 'rob-urdf-simulation' },
      { id: 're3', source: 'rob-urdf-simulation', target: 'rob-slam-mapping' },
      { id: 're4', source: 'rob-slam-mapping', target: 'rob-nav2-capstone' }
    ]
  }
];
