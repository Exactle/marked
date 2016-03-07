//WARNING: IDK if any of this works

//marks is a Map, tag is a string
function filterByTag(marks, tag){
	array = convertMapToArray(marks);

	function inTag(mark){
		return tag in mark.tags.values()
	}

	return array.filter(inTag);
}



function convertMapToArray(map){
	var array = [], item;

	for (var type in map) {
	    item = {};
	    item.type = type;
	    item.name = input[type];
	    array.push(item);
	}

	return array
}