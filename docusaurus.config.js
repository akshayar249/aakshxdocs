const config = {
 

  onBrokenLinks: 'ignore',
  markdown: {
  hooks: {
    onBrokenMarkdownLinks: 'warn',
  },
},

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
