export default function numberWithCommas(amount){
	if(!amount){
		return ""
	}
	let delimiter = ",";
	if (typeof(amount)!='string'){
		amount = amount.toString()
	}
	if (0 < parseFloat(amount) < 1){
		return parseFloat(amount).toFixed(3)
	}
	let a = amount.split('.',2)
	let i = parseInt(a[0])
	if(isNaN(i)){
		i = 0
	}
	i = Math.abs(i)
	let n = `${i}`
	a = []
	let len = n.length;
	let nn;
  let an;
	if(len > 3){
		nn = n.substr(n.length-3)
		a.unshift(nn)
		n = n.substr(0,n.length-3)
		while(n.length > 2){
			an = n.substr(n.length-2)
			a.unshift(an)
			n = n.substr(0,n.length-2)
		}
		if(n.length > 0){
			a.unshift(n)
		}
		n = a.join(delimiter)
	}
	return n
}
