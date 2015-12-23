var request = require('supertest');
var config = require('./config');
var app = require('../App')(config);

function clearDb() {
  var db = require('../db')(config.dbConnect);
  var users = db.users;
  var folders = db.folders;
  var citations = db.citations;
  return Promise.all([
    users.remove({}),
    folders.remove({}),
    citations.remove({})
  ]).then(function() {
    return users.createIfUnique('user@gmail.com', 'password');
  }).then(function() {
    return folders.insertByName('My Papers', 'user@gmail.com');
  }).then(function() {
    return citations.create({pmid: 999999}, 'my-papers', 'user@gmail.com');
  });
}

describe('Users API', function(){
  this.timeout(10000);

  before(function(done) {
    clearDb().then(function() {
      done();
    });
  });

  it('should return 401 if the user already exists', function(done) {
    request(app)
      .post('/user/signup/')
      .send({email: 'user@gmail.com', password: 'whatever' })
      .expect(401)
      .end(done);
  });

  it('should create a user and log them in', function(done) {
    request(app)
      .post('/user/signup/')
      .send({email: 'newuser@hotmail.com', password: 'whatever' })
      .expect(200, {loggedIn: true, email: 'newuser@hotmail.com' })
      .expect('set-cookie', /[.]+/)
      .end(done);
  });

  it('should be able to tell us if a user exists', function(done) {
    request(app)
      .get('/user/exists/'+encodeURI('user@gmail.com'))
      .expect(200, {userExists: true})
      .end(done);
  });

  it('should be able to tell us if a user does not exist', function(done) {
    request(app)
      .get('/user/exists/'+encodeURI('nobody@gmail.com'))
      .expect(200, {userExists: false})
      .end(done);
  });

  //tests to make sure that sessions persist

  var agent = request.agent(app);

  it('should log a user in and set a cookie', function(done) {
    agent
      .post('/user/signin/')
      .send({email: 'user@gmail.com', password: 'password'})
      .expect(200, {loggedIn: true, email: 'user@gmail.com'})
      .expect('set-cookie', /[.]+/)
      .end(done);
  });

  it('should send a cookie on subsequent requests', function(done) {
    agent
      .get('/user/')
      .expect(200)
      .end(done);
  });

  it('it should log a user out', function(done) {
    agent
      .get('/user/logout/')
      .expect(200, {loggedIn: false, email: ''})
      .end(done);
  });

  it('should not be able to log in if the password is wrong', function(done) {
    request(app)
      .post('/user/signin/')
      .send({email: 'user@gmail.com', password: 'wrong'})
      .expect(401)
      .end(done);
  });

});

describe('Folders API', function() {
  this.timeout(10000);

  var agent = request.agent(app);
  before(function(done) {
    clearDb().then(function() {
      agent
        .post('/user/signin/')
        .send({email: 'user@gmail.com', password: 'password'})
        .end(done);
    });
  });

  it('should return 401 if the user is not logged in', function(done) {
    request(app)
      .get('/folders/')
      .expect(401)
      .end(done);
  });

  it('should show us a list of folders', function(done) {
    agent
      .get('/folders/')
      .expect(200, [{name: 'My Papers', slug: 'my-papers'}])
      .end(done);
  });

  it('should be able to add a folder', function(done) {
    agent
      .post('/folders/')
      .send({name: 'New Folder'})
      .expect(200, [{name: 'My Papers', slug: 'my-papers'}, {name: 'New Folder', slug: 'new-folder'}])
      .end(done);
  });

  it('should not add a folder if the folder is does not have a unique name/slug', function(done) {
    agent
      .post('/folders/')
      .send({name: 'My Papers'}) //set when the user is created
      .expect(400)
      .end(done);
  });

  it('should be able to delete a folder', function(done) {
    agent
      .delete('/folders/new-folder/')
      .expect(200)
      .end(done);
  });


  it('should show us the contents of a folder', function(done) {
    agent
      .get('/folders/my-papers/')
      .expect(200, [{pmid: 999999}])
      .end(done);
  });

  it('should be able to add a citation to a folder', function(done) {
    agent
      .post('/folders/my-papers/')
      .send({pmid: 111111})
      .expect(200, [
        {pmid: 999999},
        {pmid: 111111}
      ])
      .end(done);
  });

  it('should not add a citation to a folder if the citaion is already present in that folder', function(done) {
    agent
      .post('/folders/my-papers/')
      .send({pmid: 999999})
      .expect(400, [{pmid: 999999}, {pmid: 111111}])
      .end(done);
  });

  it('should return 404 if the folder does not exist', function(done) {
    agent
      .get('/folders/non-existant-folder/')
      .expect(404)
      .end(done);
  });

});

describe('Citations API', function() {
  this.timeout(10000);

  var agent = request.agent(app);
  before(function(done) {
    clearDb().then(function() {
      agent
        .post('/user/signin')
        .send({email: 'user@gmail.com', password: 'password'})
        .end(done);
    });
  });

  it('should return 401 if the user is not logged in', function(done) {
    request(app)
      .get('/citations/999999/')
      .expect(401)
      .end(done);
  });

  it('should retrieve the details of a citation', function(done) {
    agent
      .get('/citations/999999/')
      .expect(200, {
        data: {pmid: 999999},
        userData: {},
        folders: ['my-papers']
      })
      .end(done);
  });

  it('should return 404 if the citation does not exist', function(done) {
    agent
      .get('/citations/111111')
      .expect(404)
      .end(done);
  });

  it('should be able to move a citation from one folder to another', function(done) {
    agent
      .put('/citations/999999/')
      .send({addFolder: 'empty-folder', removeFolder: 'my-papers'})
      .expect(200, {
        data: {pmid: 999999},
        userData: {},
        folders: ['empty-folder']
      })
      .end(done);
  });

  it('should be able to delete a citation completely from the database', function(done) {
    agent
      .delete('/citations/999999/')
      .expect(200)
      .end(done);
  });

  it('should not be able to delete a citation if the citation does not exist', function(done) {
    agent
      .delete('/citations/999999/')
      .expect(404)
      .end(done);
  });

});
