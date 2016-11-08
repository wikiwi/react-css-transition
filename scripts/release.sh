#!/bin/bash

# Copyright (C) 2016 Chi Vinh Le and contributors.
#
# This software may be modified and distributed under the terms
# of the MIT license. See the LICENSE file for details.

set -euo pipefail

if [[ $# != 1 ]]; then
  echo "$0 [<newversion> | major | minor | patch | premajor | preminor | prepatch | prerelease | from-git]"
  exit 1
fi

package=$(grep -oP '(?<="name": ").*(?=")' package.json | head -n1) || (echo "Failed determine package name" && exit 1)
echo "Detected package name: ${package}."

npm version "$1" -m "${package} release %s"

echo "Please check your changes with 'git log' and finally execute 'git push --follow-tags'"
