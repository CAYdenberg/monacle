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
      assert.equal(eutils.generateUrl(), 'http://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=ydenberg%20ca&retmode=json');
    });
  });

  describe('send', function() {
    it('should return a promise with method then', function() {
      send = eutils.send();
      send.then();
    });
  });

});


// var Parser = require('../lib/ncbi-eutils/Parser.js');
// describe('Parser', function() {
//   var documentParser = new Parser('entireResponse');
//   var xml = '<eSearchResult> <Count>8</Count> <RetMax>8</RetMax> <RetStart>0</RetStart> <IdList> <Id>25995115</Id> <Id>24719456</Id> <Id>23727094</Id> <Id>22323294</Id> <Id>22002930</Id> <Id>19188495</Id> <Id>18979235</Id> <Id>18474625</Id> </IdList> <TranslationSet/> <TranslationStack> <TermSet> <Term>ydenberg ca[Author]</Term> <Field>Author</Field> <Count>8</Count> <Explode>N</Explode> </TermSet> <OP>GROUP</OP> </TranslationStack> <QueryTranslation>ydenberg ca[Author]</QueryTranslation> </eSearchResult>';
//
//   describe('parse', function() {
//     it('should return a promise that resolves with valid data', function(done) {
//       documentParser.parseXml(xml).then(function(data) {
//         assert.equal(data.eSearchResult.Count, 8);
//         done();
//       });
//     });
//   });
//
//
//   describe('protocols', function() {
//
//     var countParser = new Parser('count');
//     describe('count', function() {
//       it('should get the count attribute from the parsed data', function(done) {
//         countParser.parseXml(xml).then(function(data) {
//           assert.equal(data, 8);
//           done();
//         });
//       });
//     });
//
//     var idParser = new Parser('ids');
//     describe('ids', function() {
//       it('should return the ids from the parsed data as a simple array', function(done) {
//         idParser.parseXml(xml).then(function(data) {
//           assert.equal(data.length, 8);
//           assert.equal(data[0], '25995115');
//           done();
//         });
//       });
//     });
//
//   });
// });


var actions = require('../lib/ncbi-eutils/actions.js');
describe('actions', function() {
  var pubmedSearch = actions.pubmedSearch;
  describe('pubmedSearch', function() {
    it('should search pubmed', function(done) {
      var result = pubmedSearch(function(papers) {
        assert.equal(papers.length, 10);
        done();
      }, 'rose md', {resultsPerPage : 10});
    });
  });

});
