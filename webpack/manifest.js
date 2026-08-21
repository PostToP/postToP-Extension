const TARGET_OVERRIDES = {
  chrome: {
    background: {service_worker: "js/background.js"},
  },
  firefox: {
    background: {scripts: ["js/background.js"]},
    // 127 is the first release that grants MV3 host_permissions at install instead of on demand.
    browser_specific_settings: {gecko: {id: "posttop@devla.dev", strict_min_version: "127.0"}},
  },
};

module.exports = {
  targets: Object.keys(TARGET_OVERRIDES),
  buildManifest(base, target) {
    return `${JSON.stringify({...JSON.parse(base.toString()), ...TARGET_OVERRIDES[target]}, null, 2)}\n`;
  },
};
