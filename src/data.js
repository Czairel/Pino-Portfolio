import scholarvault from "./assets/ScholarVault.webp";
import shopease from "./assets/ShopEase.webp";
import twosouls from "./assets/TwoSouls.webp";

// Content

export const profile = {
  name: "Prince Czairel F. Pino",
  shortName: "Prince Czairel Pino",
  role: "Front-End Developer",
  tagline:
    "I enjoy creating clean, accessible, and user-friendly websites.",
  // Paragraphs
  about: [
    "Hi, I'm Prince Czairel Pino, a front-end developer who enjoys creating clean, accessible, and user-friendly websites. I like turning an idea into something people can actually click through, use, and enjoy.",
    "I care about the details that make a site feel good to use a clear layout, readable text, comfortable spacing, and interfaces that work well for everyone on any device. To me, accessibility is not an extra step at the end. It is part of building the site properly from the start, from alt text and keyboard navigation to colors you can actually read.",
  ],
  year: 2026,
};

// Skills
export const skills = [
  {
    group: "Build",
    items: [
      { name: "HTML & CSS" },
      { name: "React" },
      { name: "Python" },
    ],
  },
  {
    group: "Design",
    items: [
      { name: "Figma" },
      { name: "Adobe Photoshop" },
      { name: "Adobe Illustrator" },
    ],
  },
];

// Channels
export const links = {
  github: "https://github.com/czairel",
  linkedin: "",
  email: "202411713@gordoncollege.edu.ph",
};




export const projects = [
  {
    id: "01",
    title: "ScholarVault",
    description:
      "A web-based research management system.",
    tags: [],
    live: "",
    repo: "",
    image: scholarvault,
    imageAlt:
      "ScholarVault login screen with a Welcome back card, email and password fields, and a Log in button.",
    zoom: 1.3, // Zoom
    badge: "Web-based system",
    tone: "blue",
  },
  {
    id: "02",
    title: "ShopEase",
    description: "An online grocery shopping website.",
    tags: [],
    live: "",
    repo: "",
    image: shopease,
    imageAlt:
      "ShopEase login screen beside a photo of a tablet showing an online grocery store.",
    badge: "Online grocery site",
    tone: "blue",
  },
  {
    id: "03",
    title: "Two Souls One Nightmare",
    description: "A game with two play modes, Maze and Survival.",
    tags: [],
    live: "",
    repo: "",
    image: twosouls,
    imageAlt:
      "Two Souls One Nightmare mode select screen with PVC and PVP buttons on a dark brick wall.",
    badge: "Game",
    tone: "violet",
  },
];