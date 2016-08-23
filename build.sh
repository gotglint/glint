#!/usr/bin/env bash

run_build=true

while getopts ":w" opt; do
  case $opt in
    w)
      echo "Running as watch instead of build" >&2
      run_build=false
      ;;
    \?)
      echo "Invalid option: -$OPTARG" >&2
      ;;
  esac
done

for dir in glint-client glint-cluster glint-dashboard
do
  echo "Building ${dir}..."

  cd ${dir}

  echo "Running \`npm prune\` for ${dir}..."
  npm prune

  echo "Running \`npm install\` for ${dir}..."
  npm install

  if [ "${dir}" == "glint-cluster" ]
  then
    echo "Running \`npm ln ../glint-client\` for ${dir}..."
    npm ln ../glint-client
  fi

  echo "Running \`npm run build\` for ${dir}..."
  npm run build

  cd -
done

if [ "$run_build" = false ]
then
  npm watch
fi
