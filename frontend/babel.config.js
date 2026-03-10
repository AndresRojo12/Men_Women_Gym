const { pl } = require("zod/v4/locales");

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        "module-resolver",
        {
          alias: {
            "@": "./frontend",
          },
        },
      ],
    ],
  };
};