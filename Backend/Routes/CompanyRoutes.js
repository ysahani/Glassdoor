const express = require('express');
const kafka = require('../kafka/client');

const Router = express.Router();

// Get all companies
Router.get('/', (request, response) => {
  console.log('\nEndpoint GET: get all companies');
  console.log('Req Body: ', request.body);
  kafka.make_request('companiesTopic', 'GETALL', request.body, (err, result) => {
    console.log('Get all result ', result);
    if (err) {
      console.log('Companies getall Kafka error');
      response.writeHead(401, {
        'Content-Type': 'text/plain',
      });
      response.end('Companies getall Kafka error');
    } else {
      response.writeHead(result.status, {
        'Content-Type': result.header,
      });
      console.log(result.content);
      response.end(result.content);
    }
  });
});

// Get one company
Router.get('/:id', (request, response) => {
  console.log('\nEndpoint GET: get company');
  console.log('Req Body: ', request.body);
  const data = { ...request.params };

  kafka.make_request('companiesTopic', 'GETONE', data, (err, result) => {
    console.log('Get one company result ', result);
    if (err) {
      console.log('Companies getone Kafka error');
      response.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      response.end('Companies getone Kafka error');
    } else {
      response.writeHead(result.status, {
        'Content-Type': result.header,
      });
      console.log(result.content);
      response.end(result.content);
    }
  });
});

// Update company's profile details
// please refer model: clocation-cceo can be updated here
Router.put('/profile/:cid', (request, response) => {
  console.log('\nEndpoint PUT: Update company profile');
  console.log('Req Body: ', request.body);
  const data = { ...request.params, ...request.body };

  kafka.make_request('companiesTopic', 'UPDATEPROFILE', data, (err, result) => {
    console.log('Update company profile result ', result);
    if (err) {
      console.log('Update company profile Kafka error');
      response.writeHead(401, {
        'Content-Type': 'text/plain',
      });
      response.end('Update company profile Kafka error');
    } else {
      response.writeHead(result.status, {
        'Content-Type': result.header,
      });
      console.log(result.content);
      response.end(result.content);
    }
  });
});

// Update company--Add review to featured
Router.put('/profile/addFtReview/:cid', (request, response) => {
  console.log('\nEndpoint PUT: Add featured review');
  console.log('Req Body: ', request.body);
  const data = { ...request.params, ...request.body };

  kafka.make_request('companiesTopic', 'ADDFTREVIEW', data, (err, result) => {
    console.log('Add featured review result ', result);
    if (err) {
      console.log('Add featured review Kafka error');
      response.writeHead(401, {
        'Content-Type': 'text/plain',
      });
      response.end('Add featured review Kafka error');
    } else {
      response.writeHead(result.status, {
        'Content-Type': result.header,
      });
      console.log(result.content);
      response.end(result.content);
    }
  });
});

// Delete review from featured
Router.put('/profile/delFtReview/:cid', (request, response) => {
  console.log('\nEndpoint PUT: Delete featured review');
  console.log('Req Body: ', request.body);
  const data = { ...request.params, ...request.body };

  kafka.make_request('companiesTopic', 'DELFTREVIEW', data, (err, result) => {
    console.log('Delete featured review result ', result);
    if (err) {
      console.log('Delete featured review Kafka error');
      response.writeHead(401, {
        'Content-Type': 'text/plain',
      });
      response.end('Delete featured review Kafka error');
    } else {
      response.writeHead(result.status, {
        'Content-Type': result.header,
      });
      console.log(result.content);
      response.end(result.content);
    }
  });
});

// Update company-- Add photos
Router.put('/profile/addPhoto/:cid', (request, response) => {
  console.log('\nEndpoint PUT: Add photo');
  console.log('Req Body: ', request.body);
  const data = { ...request.params, ...request.body };

  kafka.make_request('companiesTopic', 'ADDPHOTO', data, (err, result) => {
    console.log('Company add photo result ', result);
    if (err) {
      console.log('Company add photo Kafka error');
      response.writeHead(401, {
        'Content-Type': 'text/plain',
      });
      response.end('Company add photo Kafka error');
    } else {
      response.writeHead(result.status, {
        'Content-Type': result.header,
      });
      console.log(result.content);
      response.end(result.content);
    }
  });
});

/*
// Get number of reviews
Router.get('/numReviews', (request, response) => {

});

// Get number of salary reviews
Router.get('/numSalReviews', (request, response) => {

});

// Get number of interview reviewss
Router.get('/numIntReviews', (request, response) => {

});
*/

// get average rating

module.exports = Router;
