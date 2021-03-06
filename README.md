# Glint

[![Build Status](https://travis-ci.com/mlaccetti/glint.svg?branch=develop&token=uhktqkjJc6E4FeVC4kmW)](https://travis-ci.com/mlaccetti/glint)

Real-time distributed processing using RDDs, done right and/or better!

## Building

For local development, we using `npm link`, which would typically need `sudo` to execute.  However, we suggest using an `.npmrc` file to bypass this.  You can run `./configure.sh` to setup your `npm` environment.

Run `./build.sh` to build everything.

### Windows Users

While `npm` should support Windows, there are random native modules that don't, or otherwise have platform compatibility issues.  For that reason, we've created a `Dockerfile`, so you can build and run the entire environment under an Ubuntu 16.04 LTS container.

```bash
docker build -t glint/glint-dev .
docker run -it -v /c/Users/michael/workspace/glint:/opt/glint glint/glint-dev
```

## How this Works

* Fire up the master
* Fire up one or more listeners
* Each listener has to be told how much memory it can use
* Since node.js is single threaded, simply fire up multiple listeners to use multiple cores
* The master receives a job request including:
    * The data to use (either inline or via a link to a file/DB)
    * The various operations to perform
* The master calculates attempts to ascertain exactly how big the dataset is:
    * Using sizeof for the inline data
    * Reading a row from the file and using sizeof on the row
    * Reading a row from the DB and using sizeof on the row
* With the size of the dataset ascertained, the master will ramp up the amount of data sent to each slave via a saturation algorithm where the amount of data being processed decreases as memory usage approaches 100%
* The master keeps track of exactly what portion of the dataset has been sent out to the various workers and keeps track of the results from the operations that the slaves perform
