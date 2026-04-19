const config = {
  title: 'Safe Docs',
  url: 'http://localhost',
  baseUrl: '/',
  favicon: 'img/favicon.ico',

  organizationName: 'test',
  projectName: 'test',

  onBrokenLinks: 'ignore',
  onBrokenMarkdownLinks: 'warn',

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
        },
        blog: false,
      },
    ],
  ],
};

module.exports = config;
