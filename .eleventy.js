module.exports = function (eleventyConfig) {
  // Pass static assets straight through to /dist/assets
  eleventyConfig.addPassthroughCopy("src/assets");

  // Price formatting: 40000 -> 40,000
  eleventyConfig.addFilter("price", function (value) {
    if (value === undefined || value === null || value === "") return "";
    const n = Number(value);
    if (Number.isNaN(n)) return value;
    return n.toLocaleString("en-US");
  });

  return {
    dir: {
      input: "src",
      output: "dist",
    },
  };
};


