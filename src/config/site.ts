// Central content + config for the ionvop webcore homepage.
// Text sourced from the old/ PHP site.

import casualChar from "@/assets/character/casual.png";
import liveChar from "@/assets/character/live.png";

import stampBeGoodForSanta from "@/assets/stamps/be-good-for-santa.png";
import stampExcellent from "@/assets/stamps/excellent.png";
import stampHappyBirthday from "@/assets/stamps/happy-birthday.png";
import stampMmmmm from "@/assets/stamps/mmmmm.png";
import stampNotToBeUnderestimated from "@/assets/stamps/not-to-be-underestimated.png";
import stampPareo from "@/assets/stamps/pareo.png";
import stampReadyForTheLive from "@/assets/stamps/ready-for-the-live.png";
import stampUnstoppable from "@/assets/stamps/unstoppable.png";
import stampWhat from "@/assets/stamps/what.png";
import stampWhenDidYou from "@/assets/stamps/when-did-you.png";
import stampYouGame from "@/assets/stamps/you-game.png";

export const SITE = {
  name: "ionvop",
  tagline: "my little corner of the web",
};

export const NAV = [
  { label: "home", to: "/" },
  { label: "about", to: "/about" },
  { label: "contact", to: "/contact" },
  { label: "sites", to: "/sites" },
] as const;

export interface Social {
  key: "discord" | "github" | "youtube";
  label: string;
  handle: string;
  url: string;
  color: string;
}

export const SOCIALS: Social[] = [
  {
    key: "discord",
    label: "Discord",
    handle: "ionvop",
    url: "https://discord.com/users/301203021608779776",
    color: "#ff9ec4",
  },
  {
    key: "github",
    label: "GitHub",
    handle: "ionvop",
    url: "https://github.com/ionvop",
    color: "#d45d79",
  },
  {
    key: "youtube",
    label: "YouTube",
    handle: "Ionvop YT",
    url: "https://www.youtube.com/channel/UCXDfWc9wKYat9KmgRRMqaDg",
    color: "#ff5a4e",
  },
];

export interface SiteProject {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  gradient: string;
}

export const SITE_PROJECTS: SiteProject[] = [
  {
    slug: "ionvop",
    name: "ionvop",
    tagline: "the landing page you're on!",
    description:
      "A personal homepage and a portfolio containing the collection of services made by ionvop.",
    gradient: "linear-gradient(135deg, #ffd9e8, #ff9ec4)",
  },
  {
    slug: "mailist",
    name: "mailist",
    tagline: "custom maimai chart repository",
    description:
      "A simple homemade custom maimai chart repository. mailist offers a platform for sharing, discovering, and enjoying custom maimai charts.",
    gradient: "linear-gradient(135deg, #ffa195, #ff5a4e)",
  },
  {
    slug: "saucedb",
    name: "SauceDB",
    tagline: "anime & manga sauce archiver",
    description:
      "A simple database for archiving sources of anime and manga that took a little more effort to find. One of ionvop's first projects, mostly for personal use.",
    gradient: "linear-gradient(135deg, #d45d79, #c0506e)",
  },
];

export const HERO_CARDS = [
  {
    icon: "code",
    title: "Software Development",
    body: "I am currently a college student studying computer science and I am learning to be a web, software, and game developer.",
  },
  {
    icon: "game",
    title: "Games and Other Hobbies",
    body: "I like playing rhythm games and fast-paced Tetris games. I'm also learning music production and my favorite genre is dubstep.",
  },
  {
    icon: "heart",
    title: "Simping for CHU²",
    body: "My love for CHU² from BanG Dream is like a deep well of happiness. She is the sole reason why I keep going forward in life.",
  },
] as const;

export const CHARACTERS = {
  casual: casualChar,
  live: liveChar,
};

export const ABOUT_LAST_UPDATED = "2024-12-04";

export const ABOUT_TITLES = [
  "2024 ACM Programming Competition Champion",
  "TETR.IO Season 1 U Rank Player",
  "TETR.IO Season 2 U Rank Player",
  "the plap guy",
] as const;

export const ABOUT_BIO = [
  "I'm currently a 3rd year college student studying Bachelor of Science in Computer Science, and my interests include web development, software development, and game development.",
  "The programming languages I'm familiar with are VBScript for automations, HTML, CSS, JavaScript, and PHP for web development, C# for GUI applications, Java for legacy applications and self-torture, Python for machine-learning, Brainf*ck for fun, Lua for game modding, GLSL for post-processing effects, Turbowarp (Scratch) for game development, and ivpy which is a custom programming language that I made for fun.",
  "I like to play rhythm games and fast-paced Tetris games. My favorite rhythm games include osu!, mobile games such as Arcaea, Rotaeno, BanG Dream, and arcade rhythm games such as maimai, SDVX, and PIU. My favorite fast-paced Tetris games include TETR.IO and Jstris.",
  "I'm also learning music production and my favorite genre to listen to is dubstep. My favorite artists include ReeK, Eliminate, and Similar Outskirts. I won't list down the JP artists because there's too many of them. The DAW software I used to use was Caustic 3 but I've since switched to Waveform 11.",
] as const;

export const STAMPS = [
  { src: stampBeGoodForSanta, alt: "be good for santa" },
  { src: stampExcellent, alt: "excellent!" },
  { src: stampHappyBirthday, alt: "happy birthday!" },
  { src: stampMmmmm, alt: "mmmmm" },
  { src: stampNotToBeUnderestimated, alt: "not to be underestimated" },
  { src: stampPareo, alt: "pareo" },
  { src: stampReadyForTheLive, alt: "ready for the live!" },
  { src: stampUnstoppable, alt: "unstoppable" },
  { src: stampWhat, alt: "what?" },
  { src: stampWhenDidYou, alt: "when did you" },
  { src: stampYouGame, alt: "you game?" },
];

export const MARQUEE_ITEMS = [
  "♡ welcome to my corner of the internet ♡",
  "★ best viewed on 800x600 and Netscape Navigator ★",
  "☆ i like rhythm games ☆",
  "✧ 100% hand-picked font choices ✧",
  "✦ chu² simping powered by love ✦",
  "★ webcore ! animecore ! kawaii ! ★",
] as const;

export const COPYRIGHT_YEAR = new Date().getFullYear();