process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require('../src/server/index');
const knex = require('../src/server/db/connection');

describe('routes : vinyls', () => {

  beforeEach(() => {
    return knex.migrate.rollback()
    .then(() => { return knex.migrate.latest(); })
    .then(() => { return knex.seed.run(); });
  });

  afterEach(() => {
    return knex.migrate.rollback();
  });

  describe('GET /api/v1/vinyls', () => {
    it('should return all vinyls', (done) => {
      chai.request(server)
      .get('/api/v1/vinyls')
      .end((err, res) => {
        // there should be no errors
        should.not.exist(err);
        // there should be a 200 status code
        res.status.should.equal(200);
        // the response should be JSON
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "success"}
        res.body.status.should.eql('success');
        // the JSON response body should have a
        // key-value pair of {"data": [3 vinyl objects]}
        res.body.data.length.should.eql(3);
        // the first object in the data array should
        // have the right keys
        res.body.data[0].should.include.keys(
          'id', 'name', 'genre', 'rating', 'explicit'
        );
        done();
      });
    });
  });

  describe('GET /api/v1/vinyls/:id', () => {
    it('should respond with a single vinyl', (done) => {
      chai.request(server)
      .get('/api/v1/vinyls/1')
      .end((err, res) => {
        // there should be no errors
        should.not.exist(err);
        // there should be a 200 status code
        res.status.should.equal(200);
        // the response should be JSON
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "success"}
        res.body.status.should.eql('success');
        // the JSON response body should have a
        // key-value pair of {"data": 1 vinyl object}
        res.body.data[0].should.include.keys(
          'id', 'name', 'genre', 'rating', 'explicit'
        );
        done();
      });
    });

    it('should throw an error if the vinyl does not exist', (done) => {
      chai.request(server)
      .get('/api/v1/vinyls/9999999')
      .end((err, res) => {
        // there should an error
        should.exist(err);
        // there should be a 404 status code
        res.status.should.equal(404);
        // the response should be JSON
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "error"}
        res.body.status.should.eql('error');
        // the JSON response body should have a
        // key-value pair of {"message": "That vinyl does not exist."}
        res.body.message.should.eql('That vinyl does not exist.');
        done();
      });
    });
  });

  describe('POST /api/v1/vinyls', () => {
    it('should return the vinyl that was added', (done) => {
      chai.request(server)
      .post('/api/v1/vinyls')
      .send({
        name: 'The Balcony',
        genre: 'Indie Rock',
        rating: 10,
        year: 2015,
        duration: 78,
        explicit: true
      })
      .end((err, res) => {
        // there should be no errors
        should.not.exist(err);
        // there should be a 201 status code
        // (indicating that something was "created")
        res.status.should.equal(201);
        // the response should be JSON
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "success"}
        res.body.status.should.eql('success');
        // the JSON response body should have a
        // key-value pair of {"data": 1 vinyl object}
        res.body.data[0].should.include.keys(
          'id', 'name', 'genre', 'rating', 'explicit'
        );
        done();
      });
    });

    it('should throw an error if the payload is malformed', (done) => {
      chai.request(server)
      .post('/api/v1/vinyls')
      .send({
        name: 'The Balcony'
      })
      .end((err, res) => {
        // there should an error
        should.exist(err);
        // there should be a 400 status code
        res.status.should.equal(400);
        // the response should be JSON
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "error"}
        res.body.status.should.eql('error');
        // the JSON response body should have a message key
        should.exist(res.body.message);
        done();
      });
    });
  });

  describe('PUT /api/v1/vinyls', () => {
    it('should return the vinyl that was updated', (done) => {
      knex('vinyls')
      .select('*')
      .then((vinyl) => {
        const vinylObject = vinyl[0];
        chai.request(server)
        .put(`/api/v1/vinyls/${vinylObject.id}`)
        .send({
          rating: 9
        })
        .end((err, res) => {
          // there should be no errors
          should.not.exist(err);
          // there should be a 200 status code
          res.status.should.equal(200);
          // the response should be JSON
          res.type.should.equal('application/json');
          // the JSON response body should have a
          // key-value pair of {"status": "success"}
          res.body.status.should.eql('success');
          // the JSON response body should have a
          // key-value pair of {"data": 1 vinyl object}
          res.body.data[0].should.include.keys(
            'id', 'name', 'genre', 'rating', 'explicit'
          );
          // ensure the vinyl was in fact updated
          const newVinylObject = res.body.data[0];
          newVinylObject.rating.should.not.eql(vinylObject.rating);
          done();
        });
      });
    });

    it('should throw an error if the vinyl does not exist', (done) => {
      chai.request(server)
      .put('/api/v1/vinyls/9999999')
      .send({
        rating: 9
      })
      .end((err, res) => {
        // there should an error
        should.exist(err);
        // there should be a 404 status code
        res.status.should.equal(404);
        // the response should be JSON
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "error"}
        res.body.status.should.eql('error');
        // the JSON response body should have a
        // key-value pair of {"message": "That vinyl does not exist."}
        res.body.message.should.eql('That vinyl does not exist.');
        done();
      });
    });
  });

  describe('DELETE /api/v1/vinyls/:id', () => {
    it('should return the vinyl that was deleted', (done) => {
      knex('vinyls')
      .select('*')
      .then((vinyls) => {
        const vinylObject = vinyls[0];
        const lengthBeforeDelete = vinyls.length;
        chai.request(server)
        .delete(`/api/v1/vinyls/${vinylObject.id}`)
        .end((err, res) => {
          // there should be no errors
          should.not.exist(err);
          // there should be a 200 status code
          res.status.should.equal(200);
          // the response should be JSON
          res.type.should.equal('application/json');
          // the JSON response body should have a
          // key-value pair of {"status": "success"}
          res.body.status.should.eql('success');
          // the JSON response body should have a
          // key-value pair of {"data": 1 vinyl object}
          res.body.data[0].should.include.keys(
            'id', 'name', 'genre', 'rating', 'explicit'
          );
          // ensure the vinyl was in fact deleted
          knex('vinyls').select('*')
          .then((updatedVinyls) => {
            updatedVinyls.length.should.eql(lengthBeforeDelete - 1);
            done();
          });
        });
      });
    });
    it('should throw an error if the vinyl does not exist', (done) => {
      chai.request(server)
      .delete('/api/v1/vinyls/9999999')
      .end((err, res) => {
        // there should an error
        should.exist(err);
        // there should be a 404 status code
        res.status.should.equal(404);
        // the response should be JSON
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "error"}
        res.body.status.should.eql('error');
        // the JSON response body should have a
        // key-value pair of {"message": "That vinyl does not exist."}
        res.body.message.should.eql('That vinyl does not exist.');
        done();
      });
    });
  });

});