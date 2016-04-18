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

describe('Backend: User class', function() {
	// require('blanket') ({"pattern":"backend.js"});

	var backend = require('../backend');
	var michael;
	var xander;

	it('should allow us to create a user with any name', function() {
		should.exist(backend.addUser('michael'));
		michael = backend.getUser('michael');
		should.exist(michael);
		should.equal('michael', michael.name);
		should.not.exist(backend.getUser('xander'));
	});

	it('should return the user which is created', function() {
		var one = backend.addUser('one');
		var two = backend.getUser('one');
		should.equal(one, two);
	});

	it('should not allow users to be recreated with the same name', function() {
		// backend.addUser('michael');
		should.not.exist(backend.addUser('michael'));
	});

	it('should allow users to follow each other', function() {
		xander = backend.addUser('xander');
		michael.addFriend(xander);
		michael.friends.has('xander').should.be.true;
	});

	it('should allow deletion of friends', function() {
		michael.removeFriend('xander');
		michael.friends.has('xander').should.be.false;
	});

	var google;
	it('should allow users to add marks', function() {
		google = michael.addMark('google', michael, 'www.google.com');
		google.should.equal(michael.marks.get('google'));
		google.should.not.equal(michael.addMark('goggles', michael, 'www.bing.com'));
	});

	it('should not allow duplicate mark names from the same user', function() {
		should.not.exist(michael.addMark('google', michael, 'www.bing.com'));
	});

	it('should allow duplicate mark names from different users', function() {
		should.exist(xander.addMark('google', michael, 'www.yahoo.com'));
	});

	it('should allow users to remove marks', function() {
		michael.removeMark('google');
		should.not.exist(michael.marks.get('google'));
	});

	var krystal, a, b, c, marks;
	it('should return a list of all marks', function() {
		krystal = backend.addUser('krystal');
		b = krystal.addMark('b', krystal, 'y.example.com');
		a = krystal.addMark('a', krystal, 'z.example.com');
		c = krystal.addMark('c', krystal, 'x.example.com');
		marks = krystal.getMarks();
		marks.length.should.equal(3);
		marks.indexOf(a).should.not.equal(-1);
		marks.indexOf(b).should.not.equal(-1);
		marks.indexOf(a).should.not.equal(-1);
		marks.indexOf(google).should.equal(-1);
		marks = krystal.getMarks(backend.sorts.get('name'));
		marks.indexOf(a).should.equal(0);
		marks.indexOf(c).should.equal(2);
	});

	it('should sort the list of all marks', function() {
		marks = krystal.getMarks(backend.sorts.get('name'));
		marks.indexOf(a).should.equal(0);
		marks.indexOf(c).should.equal(2);
		marks = krystal.getMarks(backend.sorts.get('url'));
		marks.indexOf(a).should.equal(2);
		marks.indexOf(c).should.equal(0);

	})
});