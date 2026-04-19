// @ts-check

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "AkashXDB",
  tagline: "AkashXDB documentation",
  favicon: "img/favicon.ico",

  // 🔴 IMPORTANT: replace with your Vercel URL after first deploy
  url: "https://aakshxdocs.vercel.app",
  baseUrl: "/",

  organizationName: "akshayar249",
  projectName: "aakshxdocs",

  onBrokenLinks: "warn",

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: "warn",
    },
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
        },
        blog: false,
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      },
    ],
  ],

  themeConfig: {
    navbar: {
      title: "AkashXDB",
      logo: {
        alt: "AkashXDB Logo",
        src: "img/logo.svg",
        href: "/",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "tutorialSidebar",
          position: "left",
          label: "Docs",
        },
        {
          href: "https://github.com/akshayar249/aakshxdocs",
          label: "GitHub",
          position: "right",
        },
      ],
    },

    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Introduction",
              to: "/docs/intro",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/akshayar249/aakshxdocs",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} AkashXDB`,
    },
  },
};

module.exports = config;