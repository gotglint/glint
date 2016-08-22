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

for dir in glint-client glint-cluster glint-dashboard glint-dashboard/glint-dashboard-server glint-dashboard/glint-dashboard-ui
do
  echo "Building ${dir}..."

  cd ${dir}

  if [ "${dir}" == "glint-server" ]
  then
    echo "Running \`npm ln\` for ${dir}..."
    npm ln ../glint-client
  fi

  echo "Running \`npm prune\` for ${dir}..."
  npm prune

  echo "Running \`npm install\` for ${dir}..."
  npm install

  echo "Running \`gulp dist\` for ${dir}..."
  gulp dist

  cd -
done

if [ "$run_build" = false ]
then
  gulp watch
fi
