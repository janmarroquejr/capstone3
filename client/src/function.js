const toBase64 = file =>
	new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result)
		reader.onerror = error => reject(error)
	})

const nodeServer = () => {
	return "https://murmuring-journey-00582.herokuapp.com/"
}

export { toBase64, nodeServer }