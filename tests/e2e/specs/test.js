// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage

module.exports = {
  'default e2e tests': browser => {
    browser
      .url(process.env.VUE_DEV_SERVER_URL)
      .waitForElementVisible('#app', 5000)
      .assert.elementPresent('.nav') // Header
      .assert.containsText('h1', 'Sample App') // Header logo text
      .assert.elementCount('img', 6) // Footer images
      .end();
  }
};
