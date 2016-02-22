'use strict';

//any function on the "exports" object can be called in index.js like so:
//var backend = require('backend');
//backend.coolfunction();

var users = new Map();

exports.coolfunction = function() {
	return "what"
};

exports.addUser = function(name) {
	if(users.get(name))
		console.log("User already exists!");
	if(!users.get(name)){
		var added = new User(name); //we should check for if the user already exists
		users.set(name, added);

		console.log(name + " created!");
	}
	
	return added;
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
		this.friends = new Map();
		this.groups = new Map();
		this.marks = new Map();
		this.tags = new Map();
	}
	
	addFriend(user){
		this.friends.set(user.name, user);
	}
	
	removeFriend(user){
		this.friends.delete(user);
	}
	
	getFriend(name){
		return this.friends.get(name);
	}	
	
	addMark(mark){
		this.marks.set(mark, mark);
	}
	
	removeMark(mark){
		this.marks.delete(mark);
	}
	
	//dunno if getMark is necessary??
	getMark(mark){
		return this.marks.get(mark);
	}
	
	addTag(tag) {
		this.tags.set(tag, tag);
	}
	
	removeTag(tag) {
		this.tags.delete(tag);
	}
	
	getTag(tag) {
		return this.tags.get(tag);
	}

	addGroup(name){
		this.groups.set(name, name);
	}
	
	removeGroup(name) {
		this.groups.delete(name);
	}
	
	getGroup(name){
		return this.groups.get(name);
	}

}

class Group{
	constructor(name){
		this.name = name;
		this.members = new Map();
	}
	
	addMember(user){
		this.members.set(user.name, user);
	}
	
	removeMember(user){
		this.members.delete(user);
	}
	
	getMember(name){
		return this.members.get(name);
	}
	
}

class Tag{
	constructor(name){
		this.name = name;
		this.marks = new Map();
	}
	
	addMark(mark){
		this.marks.set(mark, mark);
	}
	
	removeMark(mark){
		this.marks.delete(mark);
	}
	
	getMark(mark){
		return this.marks.get(mark);
	}
	
}