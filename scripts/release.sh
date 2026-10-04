#!/bin/sh

# Increments the project version (e.g. from 2.3.0 to 2.4.0)
# It handles stuff like
# * CHANGELOG
# * Package version
# * Git tags

# Credits for original version to Luca Ravizzotti

# Calculating the new version requires to know which kind of update this is
# The default version increment is patch
# Used values: major|minor|patch where in x.y.z :
# major=x
# minor=y
# patch=z

# Release candidates (x.y.z-rc.n) are published by the CI with the npm "next" tag:
# * -r rc -v patch|minor|major  starts a new rc line (e.g. 1.2.0 -> 1.3.0-rc.0 with -v minor)
# * -r rc                       bumps the current rc (e.g. 1.3.0-rc.0 -> 1.3.0-rc.1),
#                               or starts a patch rc line from a stable version (1.2.0 -> 1.2.1-rc.0)

while getopts ":v:r:" arg; do
  case $arg in
  v) versionType=$OPTARG ;;
  r) releaseType=$OPTARG ;;
  *)
    printf "\n"
    printf "%s -v [none|patch|minor|major] -r [rel|rc]" "$0"
    printf "\n"
    printf "\n\t -v version type, default: none"
    printf "\n\t -r release type, default: rel"
    printf "\n\n"
    exit 0
    ;;
  esac
done

# Version type = none|patch|minor|major
if [ -z "$versionType" ]; then
  versionType="none"
fi
if [ "$versionType" != "none" ] && [ "$versionType" != "patch" ] && [ "$versionType" != "minor" ] && [ "$versionType" != "major" ]; then
  echo "Version type not supported, try with -h for help"
  exit 1
fi

# Release type = rel|rc
if [ -z "$releaseType" ] || [ "$releaseType" = "rel" ]; then
  releaseType=""
fi
if [ "$releaseType" != "" ] && [ "$releaseType" != "rc" ]; then
  echo "Release type not supported, try with -h for help"
  exit 1
fi

# Get current git branch name
branch=$(git rev-parse --abbrev-ref HEAD)

# Release candidates can be done on any branch, stable releases only on main
if [ "$branch" != "main" ] && [ "$releaseType" = "" ]; then
  echo "Release can be done only on main branch"
  exit 1
fi

# Version bump only if needed
if [ "$releaseType" = "rc" ]; then
  # Always bump version for release candidates
  if [ "$versionType" != "none" ]; then
    npmVersion="pre$versionType"
  else
    npmVersion="prerelease"
  fi
  # Increment version without creating a tag and a commit (we will create them later)
  npm --no-git-tag-version version "$npmVersion" --preid rc || exit 1
elif [ "$versionType" != "none" ]; then
  # Increment version without creating a tag and a commit (we will create them later)
  npm --no-git-tag-version version "$versionType" || exit 1
fi

# Using the package.json version
version="$(jq -r '.version' "$(dirname "$0")/../package.json")"

# release candidate: no changelog, it is regenerated on the stable release
if [ "$releaseType" = "rc" ]; then
  git add package.json
  git commit -m "chore(version): 🔜 release candidate version $version"
  git push -u origin "$branch"
  exit 0
fi

# changelog
if [ "$versionType" != "none" ]; then
  rm CHANGELOG.md
  npm run changelog
  git add package.json yarn.lock CHANGELOG.md
  git commit -m "chore(version): 💯 bump version to $version"
  # Gotta push them all
  git push
fi
