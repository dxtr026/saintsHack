export function sortBy (array, key) {
	const sortedArray = array.sort(function (a, b) {
		if(a[key] < b[key]) return -1;
		if(a[key] > b[key]) return 1;
		return 0;
	})
	return sortedArray
}

export function pluck (array, key) {
	let index, newArray = [], current;
	for(index=0; index<array.length; index++) {
		current = array[index][key]
		if(current && newArray.indexOf(current) === -1) {
			newArray.push(current)
		}
	}
	return newArray
}

export function findWhereSingleKey (array, key, value) {
	let index, current;
	for(index=0; index<array.length; index++) {
		current = array[index]
		if(current[key] === value) {
			return current
		}
	}
	return false
}

export function whereSingleKey (array, key, value) {
	let index, current, newArray = [];
	for(index=0; index<array.length; index++) {
		current = array[index]
		if(current[key] === value) {
			newArray.push(current)
		}
	}
	return newArray
}

export function uniq(array) {
	let index = 0, newArray = [];
	for(; index<array.length; index++) {
		if(newArray.indexOf(array[index]) === -1)
			newArray.push(array[index])
	}
	return newArray
}