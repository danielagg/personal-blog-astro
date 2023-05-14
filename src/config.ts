import type { Site, SocialObjects } from "./types";

export const SITE: Site = {
  website: "http://blog.danielagg.com/",
  author: "Daniel Agg",
  desc: "The blog of Daniel Agg.",
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
    active: true,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/danielagg/",
    linkTitle: `${SITE.title} on LinkedIn`,
    active: true,
  },
  {
    name: "Mail",
    href: "mailto:daniel.agg@outlook.com",
    linkTitle: `Send an email to ${SITE.title}`,
    active: false,
  },
  {
    name: "Twitter",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on Twitter`,
    active: false,
  },
];
