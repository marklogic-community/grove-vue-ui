# Vue-MarkLogic-Node

This project provides a skeleton for a Vue.js front-end stack, designed to run against a muir-node middle-tier, backed by MarkLogic.

This project is still Work In Progress.

## Quick Start

This template has not been integrated into muir-cli yet, so you'll have to scrape things together yourself. Next to this project, you'll need:

- a copy/clone of latest muir-node
- an instance of some MarkLogic REST api

You could potentially use muir-cli to gather most, hookup your copy of this project to that middle-tier, and launch the Vue-frontend instead of the React-frontend.

Make note at which host and port your middle-tier is running. The Vue front-end by default runs with a hot-reload feature, that runs at its own port (typically 8080, or higher if occupied), and needs to know to where backend calls need to be proxied:

- edit appHost and appPort constants in vue.config.js (should point to the middle-tier)

After that you can pull in dependencies, and launch the front-end:

- npm install
- npm run serve

A browser should open automatically (typically at localhost:8080).

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Run your unit tests
```
npm run test:unit
```

### Run your end-to-end tests
```
npm run test:e2e
```
