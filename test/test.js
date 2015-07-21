//test the tests
var assert = require("assert")
describe('Array', function(){
  describe('#indexOf()', function(){
    it('should return -1 when the value is not present', function(){
      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
    })
  })
})


var Api = require('../lib/NCBI/src/Api.js');
describe('Api', function() {

  //before each
  var search = new Api({
    method : 'esearch',
    params : {
      db : 'pubmed',
      term : 'ydenberg ca'
    }
  });

  describe('generateUrl', function() {
    it('should build a valid search url', function() {
      assert.equal(search.generateUrl(), 'http://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=ydenberg%20ca&retmode=json');
    });
  });

  describe('send', function() {
    it('should return a promise with method then', function() {
      send = search.send();
      send.then();
    });
  });

});


var parsers = require('../lib/NCBI/src/parsers.js');
describe('Parser', function() {

  var xml = '<eSearchResult> <Count>8</Count> <RetMax>8</RetMax> <RetStart>0</RetStart> <IdList> <Id>25995115</Id> <Id>24719456</Id> <Id>23727094</Id> <Id>22323294</Id> <Id>22002930</Id> <Id>19188495</Id> <Id>18979235</Id> <Id>18474625</Id> </IdList> <TranslationSet/> <TranslationStack> <TermSet> <Term>ydenberg ca[Author]</Term> <Field>Author</Field> <Count>8</Count> <Explode>N</Explode> </TermSet> <OP>GROUP</OP> </TranslationStack> <QueryTranslation>ydenberg ca[Author]</QueryTranslation> </eSearchResult>';
  var json = JSON.parse('{"header":{"type":"esearch","version":"0.3"},"esearchresult":{"count":"9","retmax":"9","retstart":"0","idlist":["26147656","25995115","24719456","23727094","22323294","22002930","19188495","18979235","18474625"],"translationset":[],"translationstack":[{"term":"ydenberg ca[Author]","field":"Author","count":"9","explode":"N"},"GROUP"],"querytranslation":"ydenberg ca[Author]"}}');

  describe('count', function() {
    it('should return a promise that resolves with valid data', function() {
      assert.equal(parsers.count(json), 9);
    });
  });

  describe('ids', function() {
    it('should return an array of ids', function() {
      assert.equal(parsers.ids(json).length, 9);
    });
  });

  
});


var actions = require('../lib/NCBI/NCBI.js');
describe('NCBI actions', function() {
  var pubmedSearch = actions.pubmedSearch;
  describe('pubmedSearch', function() {
    it('should search pubmed', function(done) {
      var result = pubmedSearch('rose md', {resultsPerPage : 10}).then(function(papers) {
        assert.equal(papers.length, 10);
        done();
      });
    });
  });

});
