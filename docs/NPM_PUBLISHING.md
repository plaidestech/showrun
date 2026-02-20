# NPM Publishing Guide

This guide explains how to publish ShowRun packages to npm.

## Prerequisites

1. **npm account**: Create an account at [npmjs.com](https://www.npmjs.com/)
2. **npm authentication**: Log in via CLI:
   ````bash
   npm login
   ````
3. **Organization access** (optional): If publishing under `@showrun` scope, you need access to the npm organization
4. **Clean working directory**: Commit all changes before publishing

## Package Structure

ShowRun uses a monorepo with 7 publishable packages:

````
packages/
├── core/                   # @showrun/core
├── harness/                # @showrun/harness
├── mcp-server/             # @showrun/mcp-server
├── dashboard/              # @showrun/dashboard
├── browser-inspector-mcp/  # @showrun/browser-inspector-mcp
├── taskpack-editor-mcp/    # @showrun/taskpack-editor-mcp
└── showrun/                # showrun (main CLI package)
````

### Dependency Order

Packages must be published in dependency order:

1. **@showrun/core** (no internal dependencies)
2. **@showrun/harness** (depends on core)
3. **@showrun/mcp-server** (depends on core, harness)
4. **@showrun/dashboard** (depends on core, harness, mcp-server)
5. **@showrun/browser-inspector-mcp** (depends on core)
6. **@showrun/taskpack-editor-mcp** (depends on core, mcp-server, harness)
7. **showrun** (depends on all above packages)

## Pre-Publishing Checklist

Before publishing, ensure:

- [ ] All packages build successfully: `pnpm build`
- [ ] All tests pass: `pnpm test:unit`
- [ ] Example task pack runs: `pnpm test:example`
- [ ] Version numbers are updated consistently across all packages
- [ ] CHANGELOG.md is updated with release notes
- [ ] README.md reflects current functionality
- [ ] All workspace dependencies (`workspace:*`) are updated to specific versions for publishing

## Publishing Process

### Step 1: Update Versions

Update version in all `package.json` files. For example, for version 0.2.0:

````bash
# Update all package versions
pnpm -r exec npm version 0.2.0 --no-git-tag-version
````

### Step 2: Update Workspace Dependencies

Before publishing, workspace dependencies (`workspace:*`) must be replaced with specific versions.

**Option A: Manual Update**
Edit each package.json to replace `workspace:*` with specific versions (e.g., `^0.2.0`).

**Option B: Use pnpm publish (recommended)**
pnpm automatically handles workspace dependencies during publish.

### Step 3: Build All Packages

````bash
pnpm build
````

Verify the build:
- Check `packages/*/dist/` directories exist
- Verify `packages/showrun/dist/ui/` contains dashboard assets
- Test the CLI: `node packages/showrun/dist/cli.js --version`

### Step 4: Dry Run

Test the publishing process without actually publishing:

````bash
pnpm publish:dry-run
````

This will show:
- What files will be included in each package
- Package sizes
- Any warnings or errors

### Step 5: Publish to npm

Publish all packages in correct order:

````bash
# Publish all packages (pnpm handles dependency order automatically)
pnpm publish:packages
````

Or publish individually for more control:

````bash
cd packages/core && pnpm publish --access public
cd ../harness && pnpm publish --access public
cd ../mcp-server && pnpm publish --access public
cd ../dashboard && pnpm publish --access public
cd ../browser-inspector-mcp && pnpm publish --access public
cd ../taskpack-editor-mcp && pnpm publish --access public
cd ../showrun && pnpm publish --access public
````

### Step 6: Verify Publication

After publishing, verify packages are available:

````bash
# Check package on npm
npm view showrun
npm view @showrun/core

# Test npx installation
npx showrun@latest --version

# Test in a new directory
mkdir test-showrun && cd test-showrun
npx showrun --help
````

### Step 7: Tag Release on GitHub

After successful publishing:

````bash
git tag -a v0.2.0 -m "Release v0.2.0"
git push origin v0.2.0
````

Create a GitHub release with the same version and changelog.

## Publishing Best Practices

### Version Management

Follow [Semantic Versioning](https://semver.org/):
- **MAJOR** (x.0.0): Breaking changes
- **MINOR** (0.x.0): New features, backward compatible
- **PATCH** (0.0.x): Bug fixes, backward compatible

### Pre-Release Versions

For alpha/beta releases:

````bash
# Alpha release
pnpm -r exec npm version 0.2.0-alpha.1 --no-git-tag-version

# Beta release
pnpm -r exec npm version 0.2.0-beta.1 --no-git-tag-version

# Publish with tag
pnpm publish:packages --tag next
````

Users can install pre-releases:

````bash
npx showrun@next
````

### Security

- **Never publish** `.env` files or secrets
- Review `files` field in each `package.json` to control what gets published
- Use `.npmignore` if needed to exclude files
- Run `npm publish --dry-run` to preview package contents

### Rollback

If you need to unpublish (within 72 hours):

````bash
npm unpublish showrun@0.2.0
npm unpublish @showrun/core@0.2.0
# ... etc for all packages
````

⚠️ **Warning**: Unpublishing is discouraged and may not be possible after 72 hours.

Instead, publish a patch version with fixes:

````bash
pnpm -r exec npm version patch
pnpm build
pnpm publish:packages
````

## Troubleshooting

### Issue: "ENEEDAUTH" error

**Solution**: Run `npm login` and authenticate.

### Issue: Package already exists at this version

**Solution**: Bump version number and republish.

### Issue: Missing files in published package

**Solution**: Check `files` field in package.json or add `.npmignore` file.

### Issue: Workspace dependencies not resolved

**Solution**: Ensure all internal dependencies are published before publishing dependent packages.

### Issue: Binary not executable

**Solution**: Ensure `bin/showrun.js` has shebang `#!/usr/bin/env node` and executable permissions.

## Continuous Integration

For automated publishing via CI/CD (GitHub Actions example):

````yaml
name: Publish to npm

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          registry-url: 'https://registry.npmjs.org'
      - run: pnpm install
      - run: pnpm build
      - run: pnpm test:unit
      - run: pnpm publish:packages
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
````

## Resources

- [npm Documentation](https://docs.npmjs.com/)
- [pnpm Publishing](https://pnpm.io/cli/publish)
- [Semantic Versioning](https://semver.org/)
- [npm Scoped Packages](https://docs.npmjs.com/cli/v9/using-npm/scope)
