var build = {
  baseUrl: '../',
  name: 'mobileinsideout',
  dir: '../export-optimized/',
  modules: [
    {
      name: 'mobileinsideout',
      adapter: 'ios',
      js: {
        'include': [
          // Vendor
          'joshfire/vendor/zepto',
          'src/app.ios',
        ]
      },
      css: {}
    }
  ]
};
