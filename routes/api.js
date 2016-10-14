var express = require('express');
var router = express.Router();

const pubmed = require('node-ncbi').pubmed;
const popsicle = require('popsicle');

router.get('/*', (req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  next();
});

router.get('/pubmed/:query/', (req, res) => {
  const page = req.query.page || 0;
  pubmed.search(req.params.query, page).then(result => {
    res.json({
      count: Number(result.count),
      papers: result.papers
    });
  });
});

router.get('/pubmed/citedby/:pmid', (req, res) => {
  pubmed.citedBy(req.params.pmid).then(result => {
    res.json(result);
  });
});

router.get('/pubmed/:method/:pmid', (req, res) => {
  if (['summary', 'abstract', 'cites', 'similar'].indexOf(req.params.method) === -1) {
    res.status(404).json();
  }
  pubmed[req.params.method](req.params.pmid).then(result => {
    if (typeof result === "object") {
      res.json(result);
    } else {
      res.send(result);
    }
  });
});

router.get('/pmc/:pmcid', (req, res) => {
  popsicle.get({
    url: 'http://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi',
    query: {
      db: 'pmc',
      id: req.params.pmcid
    }
  }).then(ncbiRes => {
    res.set('Content-Type', 'text/xml');
    res.send(ncbiRes.body);
  });
});

module.exports = router;
