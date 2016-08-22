const hub = require('gulp-hub');

const projects = {
  client: 'glint-client/gulpfile.js',
  server: 'glint-server/gulpfile.js'
  dashboard: 'glint-dashboard/gulpfile.js'
};

hub([projects.client, projects.server, projects.dashboard]);
