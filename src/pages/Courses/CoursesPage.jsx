import React, { useState } from "react";
import TopicFilter  from "./components/TopicFilter";
import CourseCard   from "./components/CourseCard";
import VideoPlayer  from "./components/VideoPlayer";
import ResourceCard from "./components/ResourceCard";
import { RiBookOpenLine, RiVideoLine, RiFileTextLine } from "react-icons/ri";

const ALL_COURSES = [
  { id: 1, title: "The Complete JavaScript Course",        author: "Jonas Schmedtmann",  duration: "69 hrs", rating: "4.8", level: "Beginner",     lessons: 320, color: "yellow", topic: "JavaScript"    },
  { id: 2, title: "React - The Complete Guide",            author: "Maximilian Schwarzm", duration: "48 hrs", rating: "4.9", level: "Intermediate", lessons: 504, color: "brand",  topic: "React"         },
  { id: 3, title: "Node.js, Express, MongoDB Bootcamp",    author: "Jonas Schmedtmann",  duration: "42 hrs", rating: "4.8", level: "Intermediate", lessons: 230, color: "accent", topic: "Node.js"        },
  { id: 4, title: "HTML and CSS for Beginners",            author: "Brad Traversy",      duration: "21 hrs", rating: "4.7", level: "Beginner",     lessons: 145, color: "purple", topic: "HTML & CSS"    },
  { id: 5, title: "Data Structures and Algorithms",        author: "Colt Steele",        duration: "31 hrs", rating: "4.8", level: "Intermediate", lessons: 180, color: "yellow", topic: "DSA"           },
  { id: 6, title: "TypeScript for Professionals",          author: "Academind",          duration: "15 hrs", rating: "4.7", level: "Advanced",     lessons: 98,  color: "brand",  topic: "TypeScript"    },
  { id: 7, title: "System Design for Interviews",          author: "Gaurav Sen",         duration: "18 hrs", rating: "4.9", level: "Advanced",     lessons: 76,  color: "accent", topic: "System Design" },
  { id: 8, title: "SQL and PostgreSQL Complete Course",    author: "Stephen Grider",     duration: "22 hrs", rating: "4.7", level: "Beginner",     lessons: 132, color: "purple", topic: "Database"      },
];

const ALL_VIDEOS = [
  { id: 1, title: "JavaScript Full Course for Beginners",              videoId: "PkZNo7MFNFg", channel: "freeCodeCamp",        duration: "3:26:42", topic: "JavaScript"    },
  { id: 2, title: "React JS Full Course",                              videoId: "bMknfKXIFA8", channel: "freeCodeCamp",        duration: "1:47:32", topic: "React"         },
  { id: 3, title: "Node.js and Express.js Full Course",                videoId: "Oe421EPjeBE", channel: "freeCodeCamp",        duration: "8:16:48", topic: "Node.js"       },
  { id: 4, title: "HTML Full Course - Build a Website Tutorial",       videoId: "pQN-pnXPaVg", channel: "freeCodeCamp",        duration: "2:02:34", topic: "HTML & CSS"    },
  { id: 5, title: "Data Structures Easy to Advanced Course",           videoId: "RBSGKlAvoiM", channel: "freeCodeCamp",        duration: "8:03:51", topic: "DSA"           },
  { id: 6, title: "TypeScript Full Course for Beginners",              videoId: "30LWjhZzg50", channel: "Traversy Media",      duration: "1:54:56", topic: "TypeScript"    },
  { id: 7, title: "System Design Interview Concepts",                  videoId: "FSR1s2b-l_I", channel: "Gaurav Sen",          duration: "0:52:18", topic: "System Design" },
  { id: 8, title: "SQL Tutorial for Beginners",                        videoId: "HXV3zeQKqGY", channel: "freeCodeCamp",        duration: "4:20:27", topic: "Database"      },
];

const ALL_RESOURCES = [
  { id: 1, title: "MDN Web Docs",                  type: "docs",    desc: "Complete reference for HTML, CSS, JavaScript.",        isFree: true,  link: "https://developer.mozilla.org", topic: "JavaScript"    },
  { id: 2, title: "React Official Docs",           type: "docs",    desc: "Official React documentation with examples.",          isFree: true,  link: "https://react.dev",             topic: "React"         },
  { id: 3, title: "Node.js Official Docs",         type: "docs",    desc: "Complete Node.js API reference.",                     isFree: true,  link: "https://nodejs.org/docs",       topic: "Node.js"       },
  { id: 4, title: "CSS Tricks",                    type: "website", desc: "Tips, tricks and techniques on CSS.",                 isFree: true,  link: "https://css-tricks.com",        topic: "HTML & CSS"    },
  { id: 5, title: "LeetCode DSA Problems",         type: "website", desc: "Practice coding problems by topic and difficulty.",   isFree: false, link: "https://leetcode.com",          topic: "DSA"           },
  { id: 6, title: "TypeScript Handbook",           type: "docs",    desc: "Official TypeScript language documentation.",         isFree: true,  link: "https://www.typescriptlang.org/docs", topic: "TypeScript" },
  { id: 7, title: "System Design Primer GitHub",  type: "github",  desc: "Learn how to design large-scale systems.",            isFree: true,  link: "https://github.com/donnemartin/system-design-primer", topic: "System Design" },
  { id: 8, title: "PostgreSQL Tutorial",           type: "docs",    desc: "Complete PostgreSQL database tutorial.",              isFree: true,  link: "https://www.postgresqltutorial.com", topic: "Database" },
];

const TABS = [
  { id: "courses",   label: "Courses",   icon: RiBookOpenLine  },
  { id: "videos",    label: "Videos",    icon: RiVideoLine     },
  { id: "resources", label: "Resources", icon: RiFileTextLine  },
];

function CoursesPage() {
  const [activeTab,   setActiveTab]   = useState("courses");
  const [activeTopic, setActiveTopic] = useState("All");

  function filterByTopic(items) {
    if (activeTopic === "All") return items;
    return items.filter(function(item) { return item.topic === activeTopic; });
  }

  const visibleCourses   = filterByTopic(ALL_COURSES);
  const visibleVideos    = filterByTopic(ALL_VIDEOS);
  const visibleResources = filterByTopic(ALL_RESOURCES);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">

      <div>
        <h2 className="font-display text-2xl font-bold text-white mb-1">
          Course Recommendations
        </h2>
        <p className="text-slate-400 text-sm">
          Curated learning resources for every skill in your roadmap.
        </p>
      </div>

      <TopicFilter selected={activeTopic} onSelect={setActiveTopic} />

      <div className="flex gap-1 p-1 bg-surface-card border border-surface-border rounded-xl w-fit">
        {TABS.map(function(tab) {
          const Icon     = tab.icon;
          const isActive = activeTab === tab.id;
          const tabClass = isActive
            ? "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-brand-500 text-white transition-all duration-150"
            : "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-slate-400 hover:text-white transition-all duration-150";

          function handleTab() { setActiveTab(tab.id); }

          return (
            <button key={tab.id} onClick={handleTab} className={tabClass}>
              <Icon className="text-base" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === "courses" && (
        <div>
          {visibleCourses.length === 0 ? (
            <div className="card p-10 text-center">
              <p className="text-slate-400">No courses found for this topic.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {visibleCourses.map(function(course) {
                function handleClick() {}
                return (
                  <CourseCard
                    key={course.id}
                    title={course.title}
                    author={course.author}
                    duration={course.duration}
                    rating={course.rating}
                    level={course.level}
                    lessons={course.lessons}
                    color={course.color}
                    onClick={handleClick}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === "videos" && (
        <div>
          {visibleVideos.length === 0 ? (
            <div className="card p-10 text-center">
              <p className="text-slate-400">No videos found for this topic.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {visibleVideos.map(function(video) {
                return (
                  <VideoPlayer
                    key={video.id}
                    title={video.title}
                    videoId={video.videoId}
                    channel={video.channel}
                    duration={video.duration}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === "resources" && (
        <div>
          {visibleResources.length === 0 ? (
            <div className="card p-10 text-center">
              <p className="text-slate-400">No resources found for this topic.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {visibleResources.map(function(res) {
                return (
                  <ResourceCard
                    key={res.id}
                    title={res.title}
                    type={res.type}
                    desc={res.desc}
                    isFree={res.isFree}
                    link={res.link}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}

    </div>
  );
}

export default CoursesPage;