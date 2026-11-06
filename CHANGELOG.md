## [2.0.2], 2026-10-03

* Replace the release-triggered publish workflow with a one-click "Release"
  workflow that bumps the version, tags and creates the GitHub release.

## [2.0.1], 2026-10-03

* Fix broken 2.0.0 release, which was published without `dist/index.js`.
  `@actions/core` and `@actions/exec` v3 are ESM-only, so the CommonJS build
  failed. The project is now ESM.
* Replace JasonEtco/build-and-tag-action with plain workflow steps.

## [2.0.0], 2026-03-19

* Update to node 24, with many dependency bumps.

## [1.0.6], 2024-04-04

* Bump unidici to 5.28.4.

## [1.0.5], 2023-11-30

* Fix broken release by packaging the right file.

## [1.0.4], 2023-11-30

* Update to Node 20 and Typescript 5, with bumps to almost every dependency.

## [1.0.3], 2022-01-08

* Update to Node 16

## [1.0.2], 2020-11-04

* Bump dependencies to mitigate vulnerabilities in
	`lodash`, `yargs-parser`, `node-fetch`, `@actions/core`
* Add summary of dependency licenses in `dist/licenses.txt`
* Update eslint
* Run CI tests using `npm ci` and with v2 of `@actions/checkout`
* Build releases according to current recommendations in
	`@actions/typescript-action`.
	Specifically: `node_modules` no longer added to release branch.


## [1.0.1], 2020-03-21

* Bump dependencies to avoid downstream vulnerabilities in `minimist`
	(CVE-2020-7598) and `acorn` (SNYK-JS-ACORN-559469)
* Add changelog


## [1.0.0], 2020-02-17

* First release