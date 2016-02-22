'use strict';

var users = new Map();

exports.coolfunction = function() {return "what"};
exports.addUser = function(name) {
	users.set(name, new User(name));

	console.log(name + " created!");
	return users.get(name);
};
exports.getUser = function(name) {
	console.log(name + " returned!");

	return users.get(name);
};
exports.removeUser = function(name) {
	users.delete(name);
	
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
		this.friends[this.friends.length] = friend;
	}
	
	addMark(mark){
		this.marks[this.marks.length] = mark;
	}
	
	addTag(tag) {
		this.tags[this.tags.length] = tag;
	}
}