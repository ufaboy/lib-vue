const replacements = {
	A: 'А',
	B: 'В',
	C: 'С',
	E: 'Е',
	H: 'Н',
	K: 'К',
	M: 'М',
	O: 'О',
	P: 'Р',
	T: 'Т',
	X: 'Х',
	Y: 'У',
	a: 'а',
	c: 'с',
	e: 'е',
	o: 'о',
	x: 'х',
	y: 'у',
	p: 'р',
};

const bodyText = document.body.innerText;

let replacedText = bodyText;
for (const [eng, rus] of Object.entries(replacements)) {
	const regex = new RegExp(eng, 'g');
	replacedText = replacedText.replace(regex, rus);
}
const divElement = document.createElement('div');
divElement.innerText = replacedText;
navigator.clipboard.writeText(divElement.innerHTML);
