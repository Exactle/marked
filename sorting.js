//WARNING: IDK if any of this works

//marks is a Map
function sortByViews(marks){
	array = convertMapToArray(marks)

	function mergeSort(arr)
	{
	    if (arr.length < 2)
	        return arr;
	 
	    var middle = parseInt(arr.length / 2);
	    var left   = arr.slice(0, middle);
	    var right  = arr.slice(middle, arr.length);
	 
	    return merge(mergeSort(left), mergeSort(right));
	}
	 
	function merge(left, right)
	{
	    var result = [];
	 
	    while (left.length && right.length) {
	        if (left[0].views <= right[0].views) {
	            result.push(left.shift());
	        } else {
	            result.push(right.shift());
	        }
	    }
	 
	    while (left.length)
	        result.push(left.shift());
	 
	    while (right.length)
	        result.push(right.shift());
	 
	    return result;
	}

	return mergeSort(array)
}

function sortByChecks(marks){

	array = convertMapToArray(marks)

	function mergeSort(arr)
	{
	    if (arr.length < 2)
	        return arr;
	 
	    var middle = parseInt(arr.length / 2);
	    var left   = arr.slice(0, middle);
	    var right  = arr.slice(middle, arr.length);
	 
	    return merge(mergeSort(left), mergeSort(right));
	}
	 
	function merge(left, right)
	{
	    var result = [];
	 
	    while (left.length && right.length) {
	        if (left[0].checks <= right[0].checks) {
	            result.push(left.shift());
	        } else {
	            result.push(right.shift());
	        }
	    }
	 
	    while (left.length)
	        result.push(left.shift());
	 
	    while (right.length)
	        result.push(right.shift());
	 
	    return result;
	}

	return mergeSort(array)
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