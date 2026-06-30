// Central content file — edit the values here to update the site.
// Replace placeholder links/contact info with your real details.

export const profile = {
  name: "Ali Husnain",
  role: "BSIT Student · Software Developer",
  tagline:
    "Passionate about software development, web technologies, mobile applications, and problem solving.",
  location: "Lahore, Pakistan",
  email: "alihusnain00019@gmail.com",
  phone: "+92 321 4578128",
  social: {
    github: "https://github.com/yourusername", // TODO: add your real GitHub URL
    linkedin: "https://linkedin.com/in/yourusername", // TODO: add your real LinkedIn URL
    email: "mailto:alihusnain00019@gmail.com",
  },
  resumeUrl: "/resume.pdf", // TODO: drop your resume PDF into /public as resume.pdf
};

export const stats = [
  { label: "Years learning to build", value: 3 },
  { label: "Projects shipped", value: 8 },
  { label: "Technologies used", value: 14 },
];

export type SkillCategory = {
  category: string;
  eyebrow: string;
  skills: { name: string; level: number }[];
};

export const skillCategories: SkillCategory[] = [
  {
    category: "Programming Languages",
    eyebrow: "$ lang --list",
    skills: [
      { name: "Python", level: 85 },
      { name: "Java", level: 75 },
      { name: "C++", level: 70 },
      { name: "Dart", level: 80 },
    ],
  },
  {
    category: "Web Development",
    eyebrow: "$ web --stack",
    skills: [
      { name: "HTML", level: 95 },
      { name: "CSS", level: 90 },
      { name: "JavaScript", level: 85 },
      { name: "React.js", level: 80 },
    ],
  },
  {
    category: "Mobile Development",
    eyebrow: "$ mobile --target",
    skills: [{ name: "Flutter", level: 85 }],
  },
  {
    category: "Database",
    eyebrow: "$ db --connect",
    skills: [
      { name: "MySQL", level: 80 },
      { name: "Firebase", level: 80 },
    ],
  },
  {
    category: "Tools",
    eyebrow: "$ tools --installed",
    skills: [
      { name: "Git", level: 85 },
      { name: "GitHub", level: 85 },
      { name: "VS Code", level: 95 },
    ],
  },
  {
    category: "Computer Science Concepts",
    eyebrow: "$ man cs-fundamentals",
    skills: [
      { name: "Object-Oriented Programming", level: 80 },
      { name: "Operating Systems", level: 70 },
      { name: "Networking Basics", level: 65 },
    ],
  },
];

export type Project = {
  id: string;
  title: string;
  category: "Web" | "Mobile" | "Desktop";
  description: string;
  tech: string[];
  github: string;
  live?: string;
  accent: "primary" | "secondary";
};

export const projects: Project[] = [
  {
    id: "studymate",
    title: "StudyMate — AI Study Assistant",
    category: "Mobile",
    description:
      "A Flutter mobile app for AI-powered studying: scans handwritten or printed notes with on-device OCR, summarizes them, and auto-generates flashcards and quizzes to track progress over time.",
    tech: ["Flutter", "Dart", "Firebase", "Google ML Kit", "TFLite", "FastAPI"],
    github: "https://github.com/yourusername/studymate",
    accent: "primary",
  },
  {
    id: "sms",
    title: "Student Management System",
    category: "Desktop",
    description:
      "Desktop application for managing student records, attendance, and academic data, built with a relational database backend for fast lookups and reporting.",
    tech: ["Python", "MySQL"],
    github: "https://github.com/yourusername/student-management-system",
    accent: "secondary",
  },
  {
    id: "ecommerce",
    title: "E-Commerce Platform",
    category: "Web",
    description:
      "A modern online shopping platform with user authentication, a product catalog, cart workflow, and integrated payment handling.",
    tech: ["React", "Node.js", "MongoDB"],
    github: "https://github.com/yourusername/ecommerce-platform",
    live: "https://your-ecommerce-demo.example.com",
    accent: "primary",
  },
  {
    id: "portfolio",
    title: "This Portfolio",
    category: "Web",
    description:
      "An interactive 3D portfolio site — the one you're looking at right now — built to showcase projects and skills with motion and depth instead of static cards.",
    tech: ["React", "Tailwind CSS", "Three.js", "Framer Motion"],
    github: "https://github.com/yourusername/portfolio",
    live: "https://your-portfolio.example.com",
    accent: "secondary",
  },
];

export const experience = [
  {
    role: "Teacher Assistant",
    org: "Computer Science Department",
    period: "Current",
    points: [
      "Supported lab sessions and assisted students with coding exercises and debugging during practical classes",
      "Prepared short instructional materials and example solutions to clarify assignment requirements",
      "Graded assignments each semester and provided constructive feedback to improve student understanding and code quality",
      "Coordinated with the course instructor to organize lab schedules and resolve technical issues in the lab environment",
    ],
  },
  {
    role: "Academic Project Experience",
    org: "BSIT Coursework",
    period: "Ongoing",
    points: [
      "Contributed to small feature development and debugging tasks within a project setting to learn software development lifecycle practices",
      "Wrote and tested modular code, used version control for collaboration, and documented small components for future reference",
      "Implemented fixes for reported issues and validated changes through basic unit tests and manual testing",
    ],
  },
  {
    role: "IT / Lab Assistant",
    org: "University Computer Lab", // TODO: add the exact lab/department name
    period: "Previous",
    points: [
      "Assisted with lab setup and basic maintenance tasks to ensure smooth operation of practical sessions",
      "Helped students with software installation, environment configuration, and troubleshooting common issues",
      "Documented recurring issues and suggested small process improvements to reduce setup time",
    ],
  },
];

export const education = [
  {
    degree: "BS Information Technology",
    institute: "University", // TODO: add your institute name
    period: "2023 — 2027 (Expected)",
    detail: "Currently in 6th semester.",
    currentSemester: 6,
    totalSemesters: 8,
    coursework: [
      "Object-Oriented Programming",
      "Operating Systems",
      "Database Systems",
      "Computer Networks",
    ],
  },
];

export const certifications = [
  { title: "Python Programming", issuer: "Add issuer name" },
  { title: "Web Development", issuer: "Add issuer name" },
  { title: "Flutter Development", issuer: "Add issuer name" },
  { title: "Data Structures and Algorithms", issuer: "Add issuer name" },
];

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Education", href: "#education" },
  { label: "Contact", href: "#contact" },
];
