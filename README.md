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
    <tr><td>Node.js</td><td>&gt; 6.6.0</td><td><a href="https://nodejs.org/">Nodejs.org</a></td></tr>
    <tr><td>Gulp</td><td>&gt; 3.9.1</td><td>npm install -g gulp</td></tr>
  </tbody>
</table>

### Directions ###

1. Install dependencies above.

1. `git clone https://github.com/CAYdenberg/monocle.git` and then `cd monocle`

1. `npm install`

1. `cp .env.example` to `.env`. Configure environment and port if you wish.

1. Run `gulp build` to build resources.

1. To run tests, run `gulp test`.

1. To fire up the app for development purposes, run `gulp watch`.
