# Notes for developers

By Chris Black writing to all project contributors, who are: Chris Black.

I got tired of forgetting the entire process in between releases and decided to write it down.

## Release Process

* merge all relevant updates to main
* update changelog
* make sure working tree is clean
* `npm version [major|minor|patch]`
	- bumps versions in package.json and package-lock.json
	- creates tag
* push tag
* create GitHub release
* GHA will run .github/workflows/publish.yml, which
	- calls JasonEtco/build-and-tag-action, which
		+ runs the build script listed in package.json, which
			* builds `dist/index.js`
		+ and then force-pushes `dist/index/js` and `action.yml` to the release tag
		+ and then force-pushes the major version tag (e.g. v1) to match the release tag



### Release Troubleshooting

* build-and-tag action needs the GHA token to have write permission to the repo
* remember `npm version` bumps numbers for you; don't start manually updating them beforehand.
* the node_modules directory *does not* need to be checked in --
  see https://github.com/JasonEtco/build-and-tag-action?tab=readme-ov-file#motivation


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
