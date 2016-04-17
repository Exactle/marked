'use strict';

var chai = require('chai');
var should = chai.should();

// describe('signup and login', function() {
// 	it('should allow user to make a new account', function() {

// 	})

// 	it('should not allow account to be created that already exists')
// 	it('should authenticate user with the correct password')
// 	it('should not authenticate user with the wrong password')
// })

describe('Backend: Users', function() {
	var backend = require('../backend');

	it('should allow us to create a user with any name', function() {
		backend.addUser('michael');
		var michael = backend.getUser('michael');
		should.exist(michael);
		should.not.exist(backend.getUser('xander'));
	});

	it('should return the user which is created', function() {
		var one = backend.addUser('one');
		var two = backend.getUser('one');
		should.equal(one, two);
	});

	it('should not allow users to be recreated with the same name');
});