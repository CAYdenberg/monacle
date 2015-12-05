var request = require('supertest');
var config = require('./config');
var app = require('../App')(config);
var ORM = require('../ORM');
var orm = new ORM(config.dbConnect);


function clearDb() {
  var users = orm.users();
  var folders = orm.folders();
  return users.remove({}).then(function() {
    return users.createIfUnique('user@gmail.com', 'password');
  }).then(function() {
    return folders.remove({});
  })
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
      .post('/user/signup')
      .send({email: 'user@gmail.com', password: 'whatever' })
      .expect(401)
      .end(done);
  });

  it('should create a user and log them in', function(done) {
    request(app)
      .post('/user/signup')
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
      .post('/user/signin')
      .send({email: 'user@gmail.com', password: 'password'})
      .expect(200, {loggedIn: true, email: 'user@gmail.com'})
      .expect('set-cookie', /[.]+/)
      .end(done);
  });

  it('should send a cookie on subsequent requests', function(done) {
    agent
      .get('/user')
      .expect(200)
      .end(done);
  });

  it('it should log a user out', function(done) {
    agent
      .get('/user/logout')
      .expect(200, {loggedIn: false, email: '' })
      .end(done);
  });

});
