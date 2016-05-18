var express = require('express');

var router = express.Router();

router.get('/pubmed/:query/', (req, res) => {

});

router.get('/pubmed/summary/:pmid', (req, res) => {

});

router.get('/pubmed/abstract/:pmid', (req, res) => {

});

router.get('/pubmed/cites/:pmid', (req, res) => {

});

router.get('/pubmed/citedby/:pmid', (req, res) => {

});

router.get('/pubmed/similar/:pmid', (req, res) => {

});

module.exports = router;
