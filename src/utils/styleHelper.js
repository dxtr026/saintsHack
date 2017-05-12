export function prefixedTransform(transformValue){
	return {
		transform: transformValue,
		WebkitTransform: transformValue,
		MozTransform: transformValue,
		msTransform: transformValue,
		OTransform: transformValue
	}
}

export function prefixedTransition(transitionValue){
	return {
		transition: transitionValue,
		WebkitTransition: transitionValue,
		MozTransition: transitionValue,
		msTransition: transitionValue,
		OTransition: transitionValue
	}
}