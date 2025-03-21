# CC SDK - Web
The browser-based SDK for interacting with Connect Components
## Getting started
This project uses [dotenv](https://www.npmjs.com/package/dotenv-webpack) to manage environment variables. A `env.tmpl` file has been provided as a starting point for setting up a local environment. Running `npm run init` will
copy the `env.tmpl` into `.env`, replacing any previously configured values.

## Building
This is a webpack project. To build a development bundle, simply run `npm run build:dev`. For bundles optimized for production, such as minification, run `npm run build:prod`. Additionally, an `npm run dev` script has been created which will generate a dev bundle and enable Webpack's `--watch` flag, causing the bundle to rebuild on changes.