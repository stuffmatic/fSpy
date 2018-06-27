const https = require('https');

const options = {
  hostname: 'api.github.com',
  port: 443,
  path: '/repos/stuffmatic/fspy/releases',
  method: 'GET',
  headers: { 'User-Agent': 'fSpy stats script' }
};

https.get(options, (resp) => {
  let data = ''

  resp.on('data', (chunk) => {
    data += chunk;
  });

  resp.on('end', () => {
    let releases = JSON.parse(data)
    for (let i = 0; i < releases.length; i++) {
      let release = releases[i]
      console.log(release.tag_name)
      let assets = release.assets
      for (let j = 0; j < assets.length; j++) {
        let asset = assets[j]
        console.log('  ' + asset.name + ', ' + asset.download_count + ' downloads')
      }
    }

  });

}).on("error", (err) => {
  console.log("Error: " + err.message);
});