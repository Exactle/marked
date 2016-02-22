'use strict';

var users = new Map();

//any function on the "exports" object can be called in index.js like so:
//var backend = require('backend');
//backend.coolfunction();

exports.coolfunction = function() {
	return "what"
};

exports.addUser = function(name) {
	var added = new User(name); //we should check for if the user already exists
	users.set(name, added);

	console.log(name + " created!");
};

exports.getUser = function(name) {
	console.log(name + " returned!");

	return users.get(name);
};

exports.removeUser = function(name) {
	users.delete(name);
	
	//maybe return some value here?
	console.log(name + " removed!");
};


class User{
	constructor(name){
		this.name = name;
		this.friends = new Array();
		this.marks = new Array();
		this.tags = new Array();
	}
	
	addFriend(friend){
		this.friends.push(this.friend);
	}
	
	addMark(mark){
		this.marks.push(this.mark);
	}
	
	addTag(tag) {
		this.tags.push(this.tag);
	}
}