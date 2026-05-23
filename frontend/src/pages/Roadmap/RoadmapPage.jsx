import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import RoleSelector from "./components/RoleSelector";
import RoadmapPhase from "./components/RoadmapPhase";
import RoadmapProgress from "./components/RoadmapProgress";
import roadmapService from "../../services/roadmapService";

const DEFAULT_ROLE = "frontend";

const ROADMAP_TEMPLATES = {
  frontend: {
    title: "Frontend Developer",
    targetRole: "Frontend Developer",
    description: "Frontend roadmap for HTML, CSS, JavaScript, React, and deployment.",
    weeks: 14,
    milestones: [
      { title: "HTML5 Semantics", description: "Tags, Forms, Accessibility", order: 1 },
      { title: "CSS3 & Flexbox", description: "Selectors, Flexbox, Grid", order: 2 },
      { title: "Responsive Design", description: "Media Queries, Mobile First", order: 3 },
      { title: "Git & GitHub", description: "Commits, Branches, Pull Requests", order: 4 },
      { title: "JavaScript Fundamentals", description: "Variables, Functions, Loops", order: 5 },
      { title: "ES6+ Features", description: "Arrow Functions, Destructuring, Modules", order: 6 },
      { title: "DOM Manipulation", description: "Selectors, Events, CRUD", order: 7 },
      { title: "Async JavaScript", description: "Promises, Async/Await, Fetch", order: 8 },
      { title: "React Fundamentals", description: "JSX, Props, State", order: 9 },
      { title: "React Hooks", description: "useState, useEffect, Custom Hooks", order: 10 },
      { title: "React Router", description: "Routes, Params, Guards", order: 11 },
      { title: "State Management", description: "Context, Redux, Zustand", order: 12 },
      { title: "TypeScript", description: "Types, Interfaces, Generics", order: 13 },
      { title: "Testing & Deployment", description: "Jest, RTL, Vercel, CI/CD", order: 14 },
    ],
  },
  backend: {
    title: "Backend Developer",
    targetRole: "Backend Developer",
    description: "Backend roadmap for Node.js, Express, databases, auth, and system design.",
    weeks: 16,
    milestones: [
      { title: "Node.js Basics", description: "Runtime, Modules, NPM", order: 1 },
      { title: "Express.js", description: "Routing, Middleware, REST", order: 2 },
      { title: "REST API Design", description: "Methods, Status Codes, Auth", order: 3 },
      { title: "Database Basics", description: "SQL, NoSQL, CRUD", order: 4 },
      { title: "MongoDB", description: "Schema, Mongoose, Aggregation", order: 5 },
      { title: "PostgreSQL", description: "Tables, Joins, Indexing", order: 6 },
      { title: "Authentication", description: "JWT, OAuth, Sessions", order: 7 },
      { title: "Authorization", description: "RBAC, Middleware, Guards", order: 8 },
      { title: "Microservices", description: "Architecture, Docker, Kubernetes", order: 9 },
      { title: "Message Queues", description: "Redis, RabbitMQ, Kafka", order: 10 },
      { title: "GraphQL", description: "Schema, Resolvers, Subscriptions", order: 11 },
      { title: "System Design", description: "Scalability, Caching, Load Balancing", order: 12 },
    ],
  },
   fullstack: {
    title: "Full Stack Developer",
    targetRole: "Full Stack Developer",
    description: "Full stack roadmap covering frontend, backend, database, authentication, deployment, and system design.",
    weeks: 18,
    milestones: [
      { title: "HTML5 Semantics", description: "Tags, Forms, Accessibility", order: 1 },
      { title: "CSS3 & Flexbox", description: "Selectors, Flexbox, Grid", order: 2 },
      { title: "JavaScript Fundamentals", description: "Variables, Functions, Loops", order: 3 },
      { title: "React Fundamentals", description: "JSX, Props, State", order: 4 },
      { title: "React Hooks", description: "useState, useEffect, Custom Hooks", order: 5 },
      { title: "Node.js Basics", description: "Runtime, Modules, NPM", order: 6 },
      { title: "Express.js", description: "Routing, Middleware, REST", order: 7 },
      { title: "REST API Design", description: "Methods, Status Codes, Auth", order: 8 },
      { title: "MongoDB", description: "Schema, Mongoose, Aggregation", order: 9 },
      { title: "Authentication", description: "JWT, OAuth, Sessions", order: 10 },
      { title: "MERN Stack", description: "React, Node, Express, MongoDB", order: 11 },
      { title: "Deployment", description: "Vercel, Render, Environment Variables", order: 12 },
      { title: "Testing & Deployment", description: "Jest, RTL, CI/CD", order: 13 },
      { title: "System Design", description: "Scalability, Caching, Load Balancing", order: 14 },
    ],
  },
};
const getResourceLink = (title) => {
  const links = {
    "HTML5 Semantics": "https://developer.mozilla.org/en-US/docs/Web/HTML",
    "CSS3 & Flexbox": "https://developer.mozilla.org/en-US/docs/Web/CSS",
    "Responsive Design": "https://web.dev/learn/design/",
    "Git & GitHub": "https://docs.github.com/en/get-started",
    "JavaScript Fundamentals": "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
    "ES6+ Features": "https://javascript.info/",
    "DOM Manipulation": "https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model",
    "Async JavaScript": "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous",
    "React Fundamentals": "https://react.dev/learn",
    "React Hooks": "https://react.dev/reference/react/hooks",
    "React Router": "https://reactrouter.com/en/main/start/tutorial",
    "State Management": "https://redux.js.org/tutorials/essentials/part-1-overview-concepts",
    "TypeScript": "https://www.typescriptlang.org/docs/",
    "Testing & Deployment": "https://vercel.com/docs",

    "Node.js Basics": "https://nodejs.org/en/learn",
    "Express.js": "https://expressjs.com/",
    "REST API Design": "https://restfulapi.net/",
    "Database Basics": "https://www.mongodb.com/resources/basics/databases",
    "MongoDB": "https://www.mongodb.com/docs/",
    "PostgreSQL": "https://www.postgresql.org/docs/",
    "Authentication": "https://jwt.io/introduction",
    "Authorization": "https://auth0.com/docs/get-started/identity-fundamentals/authorization-and-authentication",
    "Microservices": "https://microservices.io/",
    "Message Queues": "https://www.rabbitmq.com/tutorials",
    "GraphQL": "https://graphql.org/learn/",
    "System Design": "https://github.com/donnemartin/system-design-primer",
  };

  return links[title] || "https://developer.mozilla.org/";
};

const getVideoLink = (title) => {
  const videos = {
    "HTML5 Semantics": "https://www.youtube.com/watch?v=qz0aGYrrlhU",
    "CSS3 & Flexbox": "https://www.youtube.com/watch?v=3YW65K6LcIA",
    "Responsive Design": "https://www.youtube.com/watch?v=srvUrASNj0s",
    "Git & GitHub": "https://www.youtube.com/watch?v=RGOj5yH7evk",
    "JavaScript Fundamentals": "https://www.youtube.com/watch?v=PkZNo7MFNFg",
    "ES6+ Features": "https://www.youtube.com/watch?v=NCwa_xi0Uuc",
    "DOM Manipulation": "https://www.youtube.com/watch?v=0ik6X4DJKCc",
    "Async JavaScript": "https://www.youtube.com/watch?v=PoRJizFvM7s",
    "React Fundamentals": "https://www.youtube.com/watch?v=bMknfKXIFA8",
    "React Hooks": "https://www.youtube.com/watch?v=TNhaISOUy6Q",
    "React Router": "https://www.youtube.com/watch?v=Ul3y1LXxzdU",
    "Node.js Basics": "https://www.youtube.com/watch?v=TlB_eWDSMt4",
    "Express.js": "https://www.youtube.com/watch?v=L72fhGm1tfE",
    "MongoDB": "https://www.youtube.com/watch?v=ofme2o29ngU",
    "TypeScript": "https://www.youtube.com/watch?v=30LWjhZzg50",
    "System Design": "https://www.youtube.com/watch?v=UzLMhqg3_Wc",
  };

  return videos[title] || "https://www.youtube.com/";
};

const buildPhases = (roadmap) => {
  const milestones = roadmap?.milestones || [];

  const skills = milestones
    .sort((a, b) => a.order - b.order)
    .map((milestone, index) => {
      const isCompleted = milestone.isCompleted;
      const firstIncompleteIndex = milestones.findIndex((m) => !m.isCompleted);

      let status = "locked";
      if (isCompleted) status = "completed";
      else if (index === firstIncompleteIndex) status = "active";

      return {
        id: milestone._id,
        name: milestone.title,
        status,
        duration: "3-5 days",
        topics: milestone.description
          ? milestone.description.split(",").map((t) => t.trim())
          : [],
        link: getResourceLink(milestone.title),
videoLink: getVideoLink(milestone.title),
      };
    });

  return [
    {
      number: 1,
      title: roadmap?.title || "Roadmap",
      duration: `${roadmap?.weeks || 12} Weeks`,
      status: skills.every((s) => s.status === "completed")
        ? "completed"
        : "active",
      skills,
    },
  ];
};

const RoadmapPage = function () {
  const [selectedRole, setSelectedRole] = useState(DEFAULT_ROLE);
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);

  const selectedTemplate = ROADMAP_TEMPLATES[selectedRole];

  const currentRoadmap = roadmaps.find(
    (item) => item.targetRole === selectedTemplate.targetRole
  );

  const milestones = currentRoadmap?.milestones || [];
  const completedCount = milestones.filter((m) => m.isCompleted).length;
  const totalCount = milestones.length;

  const phases = currentRoadmap ? buildPhases(currentRoadmap) : [];

  const loadRoadmaps = async () => {
  try {
    setLoading(true);

    const response = await roadmapService.getRoadmaps();

    console.log("ROADMAP RESPONSE:", response);

    const items =
      response?.items ||
      response?.data?.items ||
      [];

    setRoadmaps(items);
  } catch (error) {
    console.error("Load roadmaps failed:", error);
    toast.error("Failed to load roadmaps");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    loadRoadmaps();
  }, []);

  const createSelectedRoadmap = async () => {
    try {
      const template = ROADMAP_TEMPLATES[selectedRole];

      await roadmapService.createRoadmap({
        title: template.title,
        targetRole: template.targetRole,
        description: template.description,
        milestones: template.milestones.map((m) => ({
          ...m,
          resources: [],
          isCompleted: false,
        })),
      });

      toast.success("Roadmap created!");
      await loadRoadmaps();
    } catch (error) {
      console.error("Create roadmap failed:", error);
      toast.error(error?.response?.data?.message || "Failed to create roadmap");
    }
  };

  const handleToggleSkill = async (skillName) => {
    if (!currentRoadmap) return;

    const milestone = currentRoadmap.milestones.find(
      (m) => m.title === skillName
    );

    if (!milestone) return;

    try {
      await roadmapService.updateMilestone(currentRoadmap._id, milestone._id, {
        title: milestone.title,
        description: milestone.description || "",
        order: milestone.order,
        resources: milestone.resources || [],
        isCompleted: !milestone.isCompleted,
      });

      toast.success("Roadmap progress updated!");
      await loadRoadmaps();
    } catch (error) {
      console.error("Update milestone failed:", error);
      toast.error("Failed to update progress");
    }
  };

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

      <RoleSelector selected={selectedRole} onSelect={setSelectedRole} />

      {loading ? (
        <div className="card p-10 text-center text-slate-400">
          Loading roadmap...
        </div>
      ) : !currentRoadmap ? (
        <div className="card p-10 text-center">
          <h3 className="text-white font-semibold text-lg mb-2">
            No roadmap found for {selectedTemplate.title}
          </h3>
          <p className="text-slate-400 text-sm mb-5">
            Create your roadmap to start tracking progress.
          </p>
          <button onClick={createSelectedRoadmap} className="btn-primary">
            Create {selectedTemplate.title} Roadmap
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-5">
          <div className="xl:col-span-3 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-white">
                {currentRoadmap.title} Path
              </h3>
              <span className="badge badge-indigo">
                {phases.length} Phase
              </span>
            </div>

            {phases.map((phase) => (
              <RoadmapPhase
                key={phase.number}
                number={phase.number}
                title={phase.title}
                duration={phase.duration}
                status={phase.status}
                skills={phase.skills}
                onToggleSkill={handleToggleSkill}
              />
            ))}
          </div>

          <div className="xl:col-span-1">
            <RoadmapProgress
              completed={completedCount}
              total={totalCount}
              weeks={selectedTemplate.weeks}
              streak={completedCount}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RoadmapPage;