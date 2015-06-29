//test the tests

var assert = require("assert")
describe('Array', function(){
  describe('#indexOf()', function(){
    it('should return -1 when the value is not present', function(){
      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
    })
  })
});


var Eutils = require('../lib/ncbi-eutils/Eutils.js');
describe('Eutils', function() {

  //before each
  var eutils = new Eutils({
    method : 'esearch',
    params : {
      db : 'pubmed',
      term : 'ydenberg ca'
    }
  });

  describe('generateUrl', function() {
    it('should build a valid search url', function() {
      assert.equal(eutils.generateUrl(), 'http://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=ydenberg%20ca');
    });
  });

  describe('send', function() {
    it('should return a promise with method then', function() {
      send = eutils.send();
      send.then();
    });
  });

});



var Parser = require('../lib/ncbi-eutils/Parser.js');
describe('Parser', function() {
  var parser = new Parser();

  describe('load', function() {
    it('should return a promise with method then', function() {
      load = parser.load('<eSearchResult> <Count>8</Count> <RetMax>8</RetMax> <RetStart>0</RetStart> <IdList> <Id>25995115</Id> <Id>24719456</Id> <Id>23727094</Id> <Id>22323294</Id> <Id>22002930</Id> <Id>19188495</Id> <Id>18979235</Id> <Id>18474625</Id> </IdList> <TranslationSet/> <TranslationStack> <TermSet> <Term>ydenberg ca[Author]</Term> <Field>Author</Field> <Count>8</Count> <Explode>N</Explode> </TermSet> <OP>GROUP</OP> </TranslationStack> <QueryTranslation>ydenberg ca[Author]</QueryTranslation> </eSearchResult>');
      load.then();
    });

  });
});
