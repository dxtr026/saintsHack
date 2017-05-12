import React, { Component, PropTypes } from 'react';

class imageCard extends Component {

	constructor (props, context) {
	  super(props, context)
	  this.loadImage = this.loadImage.bind(this)
	  this.state = {
	  	loaded : false,
	  	style : {}
	  }
	}

	componentDidMount () {
		if (window.loaded) {
			this.loadImage()
		} else {
			window.addEventListener('load', this.loadImage)
		}
	}

	loadImage () {
		if (this.props.type === 'div' && this.props.image) {
			const style = {
				backgroundImage: `url(${this.props.image})`
			}
			return this.setState({style : style, loaded: true})
		}
		return this.setState({loaded: true})
	}

	render () {
		let {styles, type, image, ...attributes} = this.props

		if (type === 'img' && this.state.loaded) {

			attributes = {...attributes, ...{src: src}}
			return (<img style={this.props.styles} {...attributes}/>)

		} else if (type === 'div') {

			const style = {...this.props.styles, ...this.state.style}
			return (<div style={style} {...attributes}> </div>)
		}
	}

	componentWillUnmount () {
		window.removeEventListener('load', this.loadImage)
	}
}

imageCard.propTypes = {
	type: PropTypes.string, //img, div
	image : PropTypes.string, // imageUrl
	styles : PropTypes.object,
}

imageCard.defaultProps = {
	image : '',
	styles : {}
}

export default imageCard
