export default function capitalize (string) {
	if (typeof(string)!='string') {
		return string
	}
	return `${string.slice(0, 1).toUpperCase()}${string.slice(1, string.length)}`
}
