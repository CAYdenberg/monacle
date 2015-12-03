var request = require('supertest');
var config = require('./config');
var app = require('../App')(config);
var ORM = require('../ORM');
var orm = new ORM(config.dbConnect);


function clearDb() {
  var users = orm.users();
  return users.remove({}).then(function() {
    users.createIfUnique('user@gmail.com', 'password');
  });
}

describe('Users API', function(){
  before(function(done) {
    clearDb().then(done());
  });

  it('should return 401 if the user already exists');

  it('should create a user and log them in');

  it('should log a user in', function(done) {
    request(app)
      .post('/user/signin')
      .expect(200, {email: 'user@gmail.com', password: 'password'}, done);
  });

});
