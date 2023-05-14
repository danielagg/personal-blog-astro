import type { Site, SocialObjects } from "./types";

export const SITE: Site = {
  website: "http://blog.danielagg.com/",
  author: "Daniel Agg",
  desc: "Exploring the World of Full Stack Development.",
  title: "Blog | Daniel Agg",
  lightAndDarkMode: false,
  postPerPage: 3,
};

export const LOCALE = ["en-EN"]; // set to [] to use the environment default

export const LOGO_IMAGE = {
  enable: false,
  svg: true,
  width: 216,
  height: 46,
};

export const SOCIALS: SocialObjects = [
  {
    name: "Github",
    href: "https://github.com/danielagg",
    linkTitle: ` ${SITE.title} on Github`,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/danielagg/",
    linkTitle: `${SITE.title} on LinkedIn`,
  },
  {
    name: "Twitter",
    href: "https://twitter.com/a13dan",
    linkTitle: `${SITE.title} on Twitter`,
  },
];
