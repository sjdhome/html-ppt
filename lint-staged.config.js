export default {
  "*.{astro,js,jsx,ts,tsx,mjs,cjs}": [
    "eslint --max-warnings=0",
    "prettier --check",
  ],
  "*.{json,md,css,yaml,yml}": ["prettier --check"],
};
