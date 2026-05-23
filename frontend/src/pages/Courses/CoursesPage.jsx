import React, { useEffect, useState } from "react";
import TopicFilter from "./components/TopicFilter";
import CourseCard from "./components/CourseCard";
import VideoPlayer from "./components/VideoPlayer";
import ResourceCard from "./components/ResourceCard";
import { RiBookOpenLine, RiVideoLine, RiFileTextLine } from "react-icons/ri";
import toast from "react-hot-toast";
import courseService from "../../services/courseService";

const ALL_COURSES = [
  {
    id: 1,
    title: "The Complete JavaScript Course",
    author: "Jonas Schmedtmann",
    duration: "69 hrs",
    rating: "4.8",
    level: "Beginner",
    lessons: 10,
    color: "yellow",
    topic: "JavaScript",
    sourceUrl: "https://www.youtube.com/watch?v=PkZNo7MFNFg",
  },
  {
    id: 2,
    title: "React - The Complete Guide",
    author: "Maximilian Schwarzmüller",
    duration: "48 hrs",
    rating: "4.9",
    level: "Intermediate",
    lessons: 10,
    color: "brand",
    topic: "React",
    sourceUrl: "https://react.dev/learn",
  },
  {
    id: 3,
    title: "Node.js, Express, MongoDB Bootcamp",
    author: "Jonas Schmedtmann",
    duration: "42 hrs",
    rating: "4.8",
    level: "Intermediate",
    lessons: 10,
    color: "accent",
    topic: "Node.js",
    sourceUrl: "https://nodejs.org/en/learn",
  },
  {
    id: 4,
    title: "HTML and CSS for Beginners",
    author: "Brad Traversy",
    duration: "21 hrs",
    rating: "4.7",
    level: "Beginner",
    lessons: 10,
    color: "purple",
    topic: "HTML & CSS",
    sourceUrl: "https://developer.mozilla.org/en-US/docs/Learn",
  },
  {
    id: 5,
    title: "Data Structures and Algorithms",
    author: "Colt Steele",
    duration: "31 hrs",
    rating: "4.8",
    level: "Intermediate",
    lessons: 10,
    color: "yellow",
    topic: "DSA",
    sourceUrl: "https://leetcode.com",
  },
  {
    id: 6,
    title: "TypeScript for Professionals",
    author: "Academind",
    duration: "15 hrs",
    rating: "4.7",
    level: "Advanced",
    lessons: 10,
    color: "brand",
    topic: "TypeScript",
    sourceUrl: "https://www.typescriptlang.org/docs/",
  },
  {
    id: 7,
    title: "System Design for Interviews",
    author: "Gaurav Sen",
    duration: "18 hrs",
    rating: "4.9",
    level: "Advanced",
    lessons: 10,
    color: "accent",
    topic: "System Design",
    sourceUrl: "https://github.com/donnemartin/system-design-primer",
  },
  {
    id: 8,
    title: "SQL and PostgreSQL Complete Course",
    author: "Stephen Grider",
    duration: "22 hrs",
    rating: "4.7",
    level: "Beginner",
    lessons: 10,
    color: "purple",
    topic: "Database",
    sourceUrl: "https://www.postgresql.org/docs/",
  },
];

const ALL_VIDEOS = [
  { id: 1, title: "JavaScript Full Course for Beginners", videoId: "PkZNo7MFNFg", channel: "freeCodeCamp", duration: "3:26:42", topic: "JavaScript" },
  { id: 2, title: "React JS Full Course", videoId: "bMknfKXIFA8", channel: "freeCodeCamp", duration: "1:47:32", topic: "React" },
  { id: 3, title: "Node.js and Express.js Full Course", videoId: "Oe421EPjeBE", channel: "freeCodeCamp", duration: "8:16:48", topic: "Node.js" },
  { id: 4, title: "HTML Full Course", videoId: "pQN-pnXPaVg", channel: "freeCodeCamp", duration: "2:02:34", topic: "HTML & CSS" },
  { id: 5, title: "Data Structures Easy to Advanced", videoId: "RBSGKlAvoiM", channel: "freeCodeCamp", duration: "8:03:51", topic: "DSA" },
  { id: 6, title: "TypeScript Full Course", videoId: "30LWjhZzg50", channel: "Traversy Media", duration: "1:54:56", topic: "TypeScript" },
  { id: 7, title: "System Design Interview Concepts", videoId: "FSR1s2b-l_I", channel: "Gaurav Sen", duration: "0:52:18", topic: "System Design" },
  { id: 8, title: "SQL Tutorial for Beginners", videoId: "HXV3zeQKqGY", channel: "freeCodeCamp", duration: "4:20:27", topic: "Database" },
];

const ALL_RESOURCES = [
  { id: 1, title: "MDN Web Docs", type: "docs", desc: "Complete reference for HTML, CSS, JavaScript.", isFree: true, link: "https://developer.mozilla.org", topic: "JavaScript" },
  { id: 2, title: "React Official Docs", type: "docs", desc: "Official React documentation with examples.", isFree: true, link: "https://react.dev", topic: "React" },
  { id: 3, title: "Node.js Official Docs", type: "docs", desc: "Complete Node.js API reference.", isFree: true, link: "https://nodejs.org/docs", topic: "Node.js" },
  { id: 4, title: "CSS Tricks", type: "website", desc: "Tips, tricks and techniques on CSS.", isFree: true, link: "https://css-tricks.com", topic: "HTML & CSS" },
  { id: 5, title: "LeetCode DSA Problems", type: "website", desc: "Practice coding problems by topic and difficulty.", isFree: false, link: "https://leetcode.com", topic: "DSA" },
  { id: 6, title: "TypeScript Handbook", type: "docs", desc: "Official TypeScript language documentation.", isFree: true, link: "https://www.typescriptlang.org/docs", topic: "TypeScript" },
  { id: 7, title: "System Design Primer GitHub", type: "github", desc: "Learn how to design large-scale systems.", isFree: true, link: "https://github.com/donnemartin/system-design-primer", topic: "System Design" },
  { id: 8, title: "PostgreSQL Tutorial", type: "docs", desc: "Complete PostgreSQL database tutorial.", isFree: true, link: "https://www.postgresqltutorial.com", topic: "Database" },
];

const TABS = [
  { id: "courses", label: "Courses", icon: RiBookOpenLine },
  { id: "my-courses", label: "My Courses", icon: RiBookOpenLine },
  { id: "videos", label: "Videos", icon: RiVideoLine },
  { id: "resources", label: "Resources", icon: RiFileTextLine },
];

function CoursesPage() {
  const [activeTab, setActiveTab] = useState("courses");
  const [activeTopic, setActiveTopic] = useState("All");
  const [myCourses, setMyCourses] = useState([]);

  const loadMyCourses = async () => {
    try {
      const response = await courseService.getMyCourses();
      const data = response.data?.data || response.data;
      setMyCourses(data.items || []);
    } catch (error) {
      console.error("Load courses failed:", error);
    }
  };

  useEffect(() => {
    loadMyCourses();
  }, []);

  function filterByTopic(items) {
    if (activeTopic === "All") return items;
    return items.filter((item) => item.topic === activeTopic);
  }

  const visibleCourses = filterByTopic(ALL_COURSES);
  const visibleVideos = filterByTopic(ALL_VIDEOS);
  const visibleResources = filterByTopic(ALL_RESOURCES);

  const handleEnroll = async (course) => {
    try {
      const lessons = Array.from({ length: course.lessons }).map((_, index) => ({
        title: `Lesson ${index + 1}`,
        completed: false,
      }));

      await courseService.enrollCourse({
        title: course.title,
        topic: course.topic,
        author: course.author,
        level: course.level,
        duration: course.duration,
        sourceUrl: course.sourceUrl,
        lessons,
      });

      toast.success("Course added to My Courses!");
      await loadMyCourses();
      setActiveTab("my-courses");
    } catch (error) {
      console.error("Enroll failed:", error);
      toast.error("Failed to enroll course");
    }
  };

  const handleToggleLesson = async (courseId, lessonId, completed) => {
    try {
      await courseService.updateLesson(courseId, lessonId, !completed);
      toast.success("Progress updated!");
      await loadMyCourses();
    } catch (error) {
      console.error("Lesson update failed:", error);
      toast.error("Failed to update lesson");
    }
  };

  const handleRemoveCourse = async (courseId) => {
    try {
      await courseService.deleteCourse(courseId);
      toast.success("Course removed!");
      await loadMyCourses();
    } catch (error) {
      console.error("Remove course failed:", error);
      toast.error("Failed to remove course");
    }
  };

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

      <div className="flex gap-1 p-1 bg-surface-card border border-surface-border rounded-xl w-fit flex-wrap">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={
                isActive
                  ? "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-brand-500 text-white transition-all duration-150"
                  : "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-slate-400 hover:text-white transition-all duration-150"
              }
            >
              <Icon className="text-base" />
              {tab.label}
              {tab.id === "my-courses" && (
                <span className="bg-surface px-2 py-0.5 rounded-full text-xs text-gray-300">
                  {myCourses.length}
                </span>
              )}
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
              {visibleCourses.map((course) => (
                <div key={course.id} className="relative">
                  <CourseCard
                    title={course.title}
                    author={course.author}
                    duration={course.duration}
                    rating={course.rating}
                    level={course.level}
                    lessons={course.lessons}
                    color={course.color}
                    onClick={() => handleEnroll(course)}
                  />
                  <button
                    onClick={() => handleEnroll(course)}
                    className="mt-3 w-full btn-primary py-2 rounded-xl text-sm"
                  >
                    Enroll Course
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "my-courses" && (
        <div>
          {myCourses.length === 0 ? (
            <div className="card p-10 text-center">
              <p className="text-slate-400">No enrolled courses yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {myCourses.map((course) => (
                <div key={course._id} className="card p-5">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <h3 className="text-white font-semibold text-base">
                        {course.title}
                      </h3>
                      <p className="text-slate-400 text-xs mt-1">
                        {course.author} • {course.level} • {course.duration}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveCourse(course._id)}
                      className="text-rose-400 hover:text-rose-300 text-xs"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-400">Progress</span>
                      <span className="text-white font-semibold">
                        {course.progress || 0}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-surface rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-500 rounded-full"
                        style={{ width: `${course.progress || 0}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {(course.lessons || []).map((lesson) => (
                      <button
                        key={lesson._id}
                        onClick={() =>
                          handleToggleLesson(
                            course._id,
                            lesson._id,
                            lesson.completed
                          )
                        }
                        className={
                          lesson.completed
                            ? "px-3 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs text-left"
                            : "px-3 py-2 rounded-xl bg-surface text-slate-400 border border-surface-border text-xs text-left hover:text-white"
                        }
                      >
                        {lesson.completed ? "✓ " : ""}
                        {lesson.title}
                      </button>
                    ))}
                  </div>

                  {course.sourceUrl && (
                    <button
                      onClick={() => window.open(course.sourceUrl, "_blank")}
                      className="mt-4 text-brand-400 hover:text-brand-300 text-sm"
                    >
                      Continue Learning →
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "videos" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {visibleVideos.map((video) => (
            <VideoPlayer
              key={video.id}
              title={video.title}
              videoId={video.videoId}
              channel={video.channel}
              duration={video.duration}
            />
          ))}
        </div>
      )}

      {activeTab === "resources" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleResources.map((res) => (
            <ResourceCard
              key={res.id}
              title={res.title}
              type={res.type}
              desc={res.desc}
              isFree={res.isFree}
              link={res.link}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CoursesPage;