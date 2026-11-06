# Notes for developers

By Chris Black writing to all project contributors, who are: Chris Black.

I got tired of forgetting the entire process in between releases and decided to write it down.

## Release Process

* merge all relevant updates to main
* add notes for the release under a `## [Unreleased]` heading at the top of CHANGELOG.md
* run the "Release" workflow from the Actions tab on main, picking patch/minor/major. It
	- runs `npm ci && npm run all` and checks the tree is still clean
	- bumps the version in package.json and package-lock.json (`npm version`)
	- renames `## [Unreleased]` in the changelog to the new version and today's date
	- commits that to main
	- commits `dist/` on top of that (it is gitignored on main) and tags that
	  commit with the new version (e.g. v2.0.1), force-moving the major tag (e.g. v2) too
	- creates a GitHub release using the changelog section as its notes
	  (or auto-generated notes if there was no `[Unreleased]` section)



### Release Troubleshooting

* the release workflow needs the GHA token to have write permission to the repo
  (it requests `contents: write`, but repo/org settings can still restrict it),
  and to be allowed to push to main if main has branch protection
* the project is ESM (`"type": "module"`), because `@actions/core` and
  `@actions/exec` v3+ are ESM-only. Don't switch it back to CommonJS.
* don't bump version numbers by hand; the release workflow does it.
* the node_modules directory *does not* need to be checked in;
  ncc bundles everything into `dist/index.js`


## npm Cheatsheet

(Yes, I really do touch npm rarely enough that I forget all of this stuff)

Basic check for packages needing security updates:

```
npm ci
npm audit fix --force
```

Bumping to a new node version:

```
nvm install 24
```

npm won't auto-bump a dependency past a major version change.
To override, need to list packages by name and (I think) version:
(This set of packages probably unique to today's update, but shows the idea)
```
npm install --save @actions/core@latest @actions/exec@latest
```
