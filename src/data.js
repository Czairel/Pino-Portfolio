import scholarvault from "../ScholarVault.webp";
import shopease from "../ShopEase.webp";
import twosouls from "../TwoSouls.webp";

// All editable content lives here, so you can update the site without touching the layout code.

export const profile = {
  name: "Prince Czairel F. Pino",
  shortName: "Prince Czairel Pino",
  role: "Front-End Developer",
  tagline:
    "I enjoy creating clean, accessible, and user-friendly websites.",
  // Each string is one paragraph on the About page.
  about: [
    "I'm Prince Czairel Pino, a front-end developer who enjoys creating clean, accessible, and user-friendly websites.",
    "I care about the details that make a site feel good to use: a clear layout, readable text, and interfaces that work well for everyone on any device. I like turning an idea into something people can actually click through and use.",
    "I'm also always curious about new things in technology. Trying out new tools and techniques, and learning by building with them, is how I keep growing as a developer.",
  ],
  year: 2026,
};

// Fill in any empty value and the matching link appears automatically
// in the hero, the contact page and the footer. Empty ones stay hidden.
export const links = {
  github: "https://github.com/czairel",
  linkedin: "",
  email: "",
};

export const projects = [
  {
    id: "01",
    title: "ScholarVault",
    description:
      "A web-based research management system .",
    tags: [],
    live: "",
    repo: "",
    image: scholarvault,
    zoom: 1.3, // zooms the screenshot in so the small login card is readable
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
    badge: "Game",
    tone: "violet",
  },
];
