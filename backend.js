'use strict';

//any function on the "exports" object can be called in index.js like so:
//var backend = require('backend');
//backend.coolfunction();

var users = new Map();
var uids = new Map();

function getNewUid(thing) {
	var uid;
	do {
		uid = Math.floor((Math.random() * 100000000));
	} while(uids.get(uid));
	uids.set(uid, thing);
	return uid;
}

exports.coolfunction = function () {
    return "what";
};

exports.addUser = function (name, password) {
    if (users.get(name)) {
        console.log("User already exists!");
        return exports.getUser(name);
    }
    if (!users.get(name)) {
        var added = new User(name, password); //we should check for if the user already exists
        users.set(name, added);

        console.log("User " + name + " created!");
    }

    return added;
};

exports.getUser = function (name) {
    //console.log("Tried to return " + name + ", got " + (users.get(name) ? users.get(name).name : "nothing!"));
    return users.get(name);
};

exports.removeUser = function (name) {
    users.delete(name);

    //maybe return some value here?
    console.log("User " + name + " removed!");
};

exports.sorts = new Map();

exports.sorts.set("name", function(a, b) {
	return a.name.localeCompare(b.name);
});

exports.sorts.set("username", function(a,b) {
	return a.owner.name.localeCompare(b.owner.name); //check
});

exports.sorts.set("url", function(a,b) {
	return a.url.localeCompare(b.url); //check
});

exports.sorts.set("checks", function(a,b) {
	return 0; //TODO
});

exports.sorts.set("clicks", function(a,b) {
	return 0; //TODO
});

exports.sorts.set("tags", function(a,b) {
	return 0; //TODO
});

class User {

    constructor(name, password) {
        this.name = name;
        this.friends = new Map();
        this.groups = new Map();
        this.marks = new Map();
        this.tags = new Map();
        this.password = password;

        //messy
        this.checks = new Map();

        this.uid = getNewUid(this);
    }

    addFriend(user) {
        this.friends.set(user.name, user);
    }

    removeFriend(user) {
        this.friends.delete(user);
    }

    getFriend(name) {
        return this.friends.get(name);
    }

    addMark(name, owner, url, privacy) {
    	if(!url.includes("//"))
    		url = "http://" + url;
        this.marks.set(name, new Mark(name, owner, url, privacy));
    }

    removeMark(mark) {
        this.marks.delete(mark);
    }

    getMark(mark) {
        return this.marks.get(mark);
    }

    addTag(name) {
        this.tags.set(name, new Tag(name));
    }

    removeTag(name) {
        this.tags.delete(name);
    }

    getTag(name) {
        return this.tags.get(name);
    }

    addGroup(name) {
        this.groups.set(name, new Group(name));
    }

    removeGroup(name) {
        this.groups.delete(name);
    }

    getGroup(name) {
        return this.groups.get(name);
    }

    getMarks(optionalSort) {
    	if(!optionalSort) {
    		optionalSort = exports.sortByName;
    	}

    	var marks = new Array();
    	for(let marko of this.marks.values()) {
    		marks.push(marko);
    	}
    	marks = marks.sort(optionalSort);

    	console.log("GETMARKS we got the marks");

    	return marks;
    }

}

class Group {
    constructor(name) {
        this.name = name;
        this.numUsers = 0;
        this.members = new Map();
    }

    addMember(user) {
        if (!this.members.has(user.name)) {
            this.members.set(user.name, user);
            this.numUsers++;
        }
    }

    removeMember(user) {
        this.members.delete(user);
        this.numUsers--;
    }

    getMember(name) {
        return this.members.get(name);
    }

}

class Tag {
    constructor(name) {
        this.name = name;
        this.marks = new Map();
    }

    addMark(mark) {
        this.marks.set(mark.name, mark);
    }

    removeMark(mark) {
        this.marks.delete(mark);
    }

    getMark(mark) {
        return this.marks.get(mark);
    }

}

class Mark {
    constructor(name, owner, url, privacy) {
    	if(!owner) {
    		console.trace();
    	}
        this.name = name;
        this.owner = owner;
        this.url = url;
        this.tags = new Map();
        this.privacy = privacy;

        //checks are messy
        this.checks = new Array();

        this.uid = getNewUid(this);
    }

    displayMark() {
        console.log("Mark Name: " + name);
        console.log("Mark Owner: " + owner);
        console.log("Mark URL: " + url);
        console.log("Mark Privacy: " + privacy);
    }

    addTag(tag) {
        this.tags.set(tag, tag);
    }

    addCheck(checkingUser) {
    	checks.add(checkingUser);
    	user.checks.push(this);
    }
}
