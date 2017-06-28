# Audax Australia Perm Map

This map displays all perms available, based on a datafile which is at 'data/perms.json' relative to the loadpath of this javascript.

## Usage

Needs node v6 and npm v5 to install/run

## Local dev

`npm run start`

Make sure the `data` directory is symlinked to the perms data directory

## Deployment

`npm run build`

Copy `dist/bundle.js` and `index.html` to the same directory on a webserver. Make sure `data/perms.json` is also available
