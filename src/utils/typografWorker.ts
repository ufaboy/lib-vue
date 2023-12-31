import Typograf from 'typograf';

self.onmessage = (event) => {
	const typo = new Typograf({ locale: ['ru', 'en-US'] });
	const result = typo.execute(event.data);
	self.postMessage(result);
};
