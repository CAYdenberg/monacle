# Monocle #

The goal of this project is to build reading and searching tools for the scientific literature based around open-access, online content. We have integrated [eLife Lens](https://github.com/elifesciences/lens "eLife Lens") with the open-access portion of the [PubMed Central database](http://www.ncbi.nlm.nih.gov/pmc/), and have built a Javascript search module for PubMed's Eutils API.

This project uses parts of [http://github.com/ivangrub/oa-sandbox](OA-Sandbox) but is built using Node, the Express framework, Bower, and Gulp.

## Setting up a development environment ##

### Requirements ###

<table>
  <thead>
    <tr><th>Prerequisite</th><th>Version</th><th>How to Install</th></tr>
  </thead>
  <tbody>
    <tr><td>Node.js</td><td>&gt; 0.12.5</td><td><a href="https://nodejs.org/">Nodejs.org</a></td></tr>
    <tr><td>Gulp</td><td>&gt; 3.9.0</td><td>npm install -g gulp</td></tr>
    <tr><td>Bower</td><td>&gt; 1.4.1</td><td>npm install -g bower</td></tr>
  </tbody>
</table>

### Directions ###

1. Install dependencies above.

1. `git clone https://github.com/CAYdenberg/monocle.git` and then `cd monocle`

1. `npm install`

1. `bower install`

1. `cp config_sample.js config.js`

1. Enter a port (usually 3000) and leave env as `development`. The other lines don't matter for right now.

1. `gulp vendor`, then `gulp`. 

1. Run `npm start`, open a browser and go to `http://localhost/3000` or whatever port you used above.

1. To begin development with watch and automatic reloading, run `gulp watch`. A new browser tab should open at `localhost:4000`