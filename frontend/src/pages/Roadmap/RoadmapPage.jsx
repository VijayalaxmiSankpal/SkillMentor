import React, { useState } from "react";
import RoleSelector    from "./components/RoleSelector";
import RoadmapPhase    from "./components/RoadmapPhase";
import RoadmapProgress from "./components/RoadmapProgress";

const ROADMAP_DATA = {
  frontend: {
    title:   "Frontend Developer",
    total:   24,
    done:    8,
    weeks:   14,
    streak:  7,
    phases: [
      {
        number:   1,
        title:    "Core Web Foundations",
        duration: "3 Weeks",
        status:   "completed",
        skills: [
          { name: "HTML5 Semantics",      status: "completed", duration: "3 days",  topics: ["Tags", "Forms", "Accessibility"],        link: "#" },
          { name: "CSS3 & Flexbox",       status: "completed", duration: "5 days",  topics: ["Selectors", "Flexbox", "Grid"],           link: "#" },
          { name: "Responsive Design",    status: "completed", duration: "3 days",  topics: ["Media Queries", "Mobile First"],          link: "#" },
          { name: "Git & GitHub",         status: "completed", duration: "2 days",  topics: ["Commits", "Branches", "PRs"],             link: "#" },
        ],
      },
      {
        number:   2,
        title:    "JavaScript Mastery",
        duration: "5 Weeks",
        status:   "active",
        skills: [
          { name: "JS Fundamentals",      status: "completed", duration: "5 days",  topics: ["Variables", "Functions", "Loops"],        link: "#" },
          { name: "ES6+ Features",        status: "completed", duration: "4 days",  topics: ["Arrow Fn", "Destructuring", "Modules"],   link: "#" },
          { name: "DOM Manipulation",     status: "active",    duration: "3 days",  topics: ["Selectors", "Events", "CRUD"],            link: "#" },
          { name: "Async JavaScript",     status: "active",    duration: "4 days",  topics: ["Promises", "Async/Await", "Fetch"],       link: "#" },
          { name: "DSA in JavaScript",    status: "locked",    duration: "1 week",  topics: ["Arrays", "Objects", "Recursion"],         link: "#" },
        ],
      },
      {
        number:   3,
        title:    "React & Ecosystem",
        duration: "5 Weeks",
        status:   "locked",
        skills: [
          { name: "React Fundamentals",   status: "locked",    duration: "5 days",  topics: ["JSX", "Props", "State"],                  link: "#" },
          { name: "Hooks Deep Dive",      status: "locked",    duration: "5 days",  topics: ["useState", "useEffect", "Custom Hooks"],  link: "#" },
          { name: "React Router",         status: "locked",    duration: "3 days",  topics: ["Routes", "Params", "Guards"],             link: "#" },
          { name: "State Management",     status: "locked",    duration: "4 days",  topics: ["Context", "Redux", "Zustand"],            link: "#" },
          { name: "React Query",          status: "locked",    duration: "3 days",  topics: ["Fetching", "Caching", "Mutations"],       link: "#" },
        ],
      },
      {
        number:   4,
        title:    "Advanced Frontend",
        duration: "4 Weeks",
        status:   "locked",
        skills: [
          { name: "TypeScript",           status: "locked",    duration: "5 days",  topics: ["Types", "Interfaces", "Generics"],        link: "#" },
          { name: "Testing",              status: "locked",    duration: "4 days",  topics: ["Jest", "RTL", "Cypress"],                 link: "#" },
          { name: "Performance",          status: "locked",    duration: "3 days",  topics: ["Lazy Load", "Memoization", "Bundling"],   link: "#" },
          { name: "CI/CD & Deployment",   status: "locked",    duration: "3 days",  topics: ["GitHub Actions", "Vercel", "Docker"],    link: "#" },
        ],
      },
    ],
  },
  backend: {
    title:   "Backend Developer",
    total:   22,
    done:    3,
    weeks:   16,
    streak:  3,
    phases: [
      {
        number:   1,
        title:    "Server Foundations",
        duration: "3 Weeks",
        status:   "active",
        skills: [
          { name: "Node.js Basics",       status: "completed", duration: "4 days",  topics: ["Runtime", "Modules", "NPM"],              link: "#" },
          { name: "Express.js",           status: "completed", duration: "5 days",  topics: ["Routing", "Middleware", "REST"],          link: "#" },
          { name: "REST API Design",      status: "active",    duration: "4 days",  topics: ["Methods", "Status Codes", "Auth"],        link: "#" },
          { name: "Database Basics",      status: "locked",    duration: "5 days",  topics: ["SQL", "NoSQL", "CRUD"],                   link: "#" },
        ],
      },
      {
        number:   2,
        title:    "Databases & Auth",
        duration: "4 Weeks",
        status:   "locked",
        skills: [
          { name: "MongoDB",              status: "locked",    duration: "5 days",  topics: ["Schema", "Mongoose", "Aggregation"],      link: "#" },
          { name: "PostgreSQL",           status: "locked",    duration: "5 days",  topics: ["Tables", "Joins", "Indexing"],            link: "#" },
          { name: "Authentication",       status: "locked",    duration: "4 days",  topics: ["JWT", "OAuth", "Sessions"],               link: "#" },
          { name: "Authorization",        status: "locked",    duration: "3 days",  topics: ["RBAC", "Middleware", "Guards"],           link: "#" },
        ],
      },
      {
        number:   3,
        title:    "Advanced Backend",
        duration: "5 Weeks",
        status:   "locked",
        skills: [
          { name: "Microservices",        status: "locked",    duration: "1 week",  topics: ["Architecture", "Docker", "K8s"],          link: "#" },
          { name: "Message Queues",       status: "locked",    duration: "4 days",  topics: ["Redis", "RabbitMQ", "Kafka"],             link: "#" },
          { name: "GraphQL",              status: "locked",    duration: "5 days",  topics: ["Schema", "Resolvers", "Subscriptions"],   link: "#" },
          { name: "System Design",        status: "locked",    duration: "1 week",  topics: ["Scalability", "Caching", "Load Balancing"],link: "#" },
        ],
      },
    ],
  },
};

const DEFAULT_ROLE = "frontend";

const RoadmapPage = function() {
  const [selectedRole, setSelectedRole] = useState(DEFAULT_ROLE);

  const data = ROADMAP_DATA[selectedRole] || ROADMAP_DATA[DEFAULT_ROLE];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">

      <div>
        <h2 className="font-display text-2xl font-bold text-white mb-1">
          Career Roadmap
        </h2>
        <p className="text-slate-400 text-sm">
          Follow your structured learning path to land your dream role.
        </p>
      </div>

      <RoleSelector
        selected={selectedRole}
        onSelect={setSelectedRole}
      />

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-5">

        <div className="xl:col-span-3 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-bold text-white">
              {data.title} Path
            </h3>
            <span className="badge badge-indigo">
              {data.phases.length} Phases
            </span>
          </div>

          {data.phases.map(function(phase) {
            return (
              <RoadmapPhase
                key={phase.number}
                number={phase.number}
                title={phase.title}
                duration={phase.duration}
                status={phase.status}
                skills={phase.skills}
              />
            );
          })}
        </div>

        <div className="xl:col-span-1">
          <RoadmapProgress
            completed={data.done}
            total={data.total}
            weeks={data.weeks}
            streak={data.streak}
          />
        </div>

      </div>

    </div>
  );
};

export default RoadmapPage;