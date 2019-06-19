const workboxBuild = require('workbox-build');

const buildSW = () => {
  return workboxBuild.injectManifest({
    swSrc: 'service-worker.dev.js',
    swDest: 'service-worker.js',
    globDirectory: '.',
    globPatterns: [
      '*.{js,css,html}',
    ]
  }).then(({count, size}) => {
    console.log(`${count} files will be precached, totaling ${size} bytes.`);
  });
}

buildSW();