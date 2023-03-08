class TypeWriter {

	constructor(element, wait, lines, defaultLines) {

		this.element = element;
		this.typeDelay = 30;
		this.wait = parseInt(wait, 10);
		this.firstLine = lines.getRandom(); // get one random line to write;
		this.defaultLines = defaultLines;
		this.text = "";
		this.fastDelete = false;
		
	}
	
	static lineBreak = document.createElement("br");

	async start() {
		
		// TODO: handle HTML/XML tags and any other element inside strings (emoticons, icons) by implementing tokenization.
		// write first line
		for (let currentChar = 0; currentChar < this.firstLine.length; currentChar++) {

			await sleep(between(this.typeDelay - 20, this.typeDelay + 20));
			this.write(this.firstLine[currentChar]);

		}

		// wait some time for the user to read the joke
		await sleep(this.wait);
		
		if (Math.random() < 0.5) {
			
			// select and delete whole text or...
			this.element.classList.add("text--selected");
			await sleep(this.wait/3);
			this.clear();
			this.element.classList.remove("text--selected");

		} else {
			
			// ...delete text letter by letter
			for (let i = this.firstLine.length; i >= 0; i--) {

				await sleep(this.typeDelay/2);
				this.delete(i);

			}

		}

		// write default lines
		for (let currentLine = 0; currentLine < this.defaultLines.length; currentLine++) {

			for (let currentChar = 0; currentChar < this.defaultLines[currentLine].length ; currentChar++) {

				await sleep(between(this.typeDelay - 30, this.typeDelay + 30));
				this.write(this.defaultLines[currentLine][currentChar]);

			}
			if (currentLine != this.defaultLines.length - 1)

				this.element.appendChild(TypeWriter.lineBreak);
				
		}
	}

	write(string) { // type one string/char
		this.element.innerHTML += string;
	}

	delete(n) { // delete last char
		this.element.innerHTML = this.firstLine.substring(0, n);
	}

	clear() {
		this.element.innerHTML = "";
	}

}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}  

function between(first, last) {
	return Math.floor(Math.random() * first) + last;
}

Array.prototype.getRandom = function() {
	return this[Math.floor(Math.random() * this.length)];
}