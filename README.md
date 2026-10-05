# Source of jeffwilcox.[com|dev|blog]

Next.js static site. Previously Jekyll. And WordPress. Inspired by [pilcrow](https://pilcrowonpaper.com/) and [vercel portfolio](https://vercel.com/templates/next.js/portfolio-starter-kit).

# Development

Use Node.js 24 (`nvm use` reads [.nvmrc](./.nvmrc)), matching CI.

```sh
npm ci
npm run dev
```

Run `npm run lint` and `npm run build` before submitting changes. The build
exports the static site to `out/`, which the nginx container serves.

Keep `next` and `eslint-config-next` on matching versions. ESLint remains on
9 because the React, import, and accessibility plugins used by Next.js do not
yet support ESLint 10. TypeScript remains on 6 because `typescript-eslint`
does not yet support TypeScript 7. Node.js types track the Node.js 24 runtime.

# Identity

In 2018 the primary hostname changed from `jeff.wilcox.name` to `jeffwilcox.blog` and `jeffwilcox.com`. I guess `jeffwilcox.dev` at some point, too.

# License

MIT for the code, CC BY for content.
