var express = require('express');
var router = express.Router();

const pubmed = require('node-ncbi').pubmed;

router.get('/*', (req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  next();
});

router.get('/pubmed/:query/', (req, res) => {
  pubmed.search(req.params.query).then(result => {
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
    res.json(result);
  });
});

module.exports = router;
