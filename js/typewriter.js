class TypeWriter {
	
	static lineBreak = document.createElement("br");

	constructor(element, lines, defaultLines, typingDelay = 30, readingDelay = 3000, useCurrentElementAsDefault = false) {

		this.element = element;
		this.typingDelay = typingDelay;
		this.typingDelayRange = 30; // typingDelay will be calculated in a range between - an + typingDelayRange
		this.readingDelay = parseInt(readingDelay, 10); // time given to the user to read before deleting
		this.firstLine = lines.getRandom(); // get one random line to write;
		/*
		element could be already filled with a default text, to avoid a blank page if JS is disabled.
		In this case I get it and use it later as a default text,
		then I clean the element before running the typewriter
		*/
		// combined optional chaining (?) and nullish coaleshing (??) operator, not working on older browsers but very clean code
		// this.defaultLines = this.element?.innerHTML?.trim() ?? defaultLines;
		this.defaultLines = useCurrentElementAsDefault && element && element.innerHTML.trim() ? element.innerHTML.trim().split(/<br\s*\/?>/) : defaultLines;
		this.element.innerHTML = "";
		this.text = "";
		
	}

	async start() {
		
		// TODO: handle HTML/XML tags and any other element inside strings (emoticons, icons) by implementing tokenization.
		// write first line
		for (let currentChar = 0; currentChar < this.firstLine.length; currentChar++) {

			await sleep(randomBetween(this.typingDelay - this.typingDelayRange, this.typingDelay + this.typingDelayRange));
			this.write(this.firstLine[currentChar]);

		}

		// wait some time for the user to read the line
		await sleep(this.readingDelay);
		
		if (Math.random() < 0.5) { // select and delete whole text or...
			
			this.element.classList.add("text--selected");
			await sleep(this.readingDelay/3);
			this.clear();
			this.element.classList.remove("text--selected");

		} else { // ...delete text character by character
			
			for (let i = this.firstLine.length; i >= 0; i--) {

				await sleep(this.typingDelay/2);
				this.delete(i);

			}

		}

		// write default lines
		for (let currentLine = 0; currentLine < this.defaultLines.length; currentLine++) {

			for (let currentChar = 0; currentChar < this.defaultLines[currentLine].length ; currentChar++) {

				await sleep(randomBetween(this.typingDelay - this.typingDelayRange, this.typingDelay + this.typingDelayRange));
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

function randomBetween(first, last) {
	return Math.floor(Math.random() * first) + last;
}

Array.prototype.getRandom = function() {
	return this[Math.floor(Math.random() * this.length)];
}