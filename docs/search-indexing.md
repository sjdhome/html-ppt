# Search indexing policy

## Requirement

The site should not be included in search engine indexes. The project is meant for presentation use and post-talk review links, not public discovery through search.

## What changed

- Added site-wide `<meta name="robots" content="noindex, nofollow, noarchive" />` and matching `googlebot` directives in `src/layouts/BaseLayout.astro`.
- Added `public/robots.txt` so the built site has a root robots file.
- The robots file intentionally allows crawling because search engines need to fetch HTML pages to see and honor the `noindex` meta directives. Blocking all paths in `robots.txt` can leave URL-only search results indexed when pages are discovered from external links.

## Open issues

No open issues are known in the application code. If the deployment platform supports response headers, an additional `X-Robots-Tag: noindex, nofollow, noarchive` header can be configured later as a defense-in-depth measure for non-HTML assets.
