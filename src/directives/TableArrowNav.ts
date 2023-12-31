let cellElement = document.querySelector('td');

function init() {
	cellElement = document.querySelector('td');
	document.addEventListener('keydown', keyHandler, { passive: true });
	cellElement?.focus();
}

const tableNav = {
	mounted() {
		init();
	},
	beforeUnmount() {
		document.removeEventListener('keydown', keyHandler);
	},
	updated() {
		if (!cellElement) init();
	},
};

function keyHandler(event: KeyboardEvent) {
	if (!cellElement) return null;
	const idx = cellElement.cellIndex;
	if (event.code === 'ArrowUp') {
		const previousRow = cellElement.parentElement?.previousElementSibling;
		if (previousRow) {
			const previousSibling = (previousRow as HTMLTableRowElement).cells[idx];
			changeStyle(previousSibling);
		}
	} else if (event.code === 'ArrowDown') {
		const nextRow = cellElement.parentElement?.nextElementSibling;
		if (nextRow !== null) {
			const nextSibling = (nextRow as HTMLTableRowElement).cells[idx];
			if (nextSibling) changeStyle(nextSibling as HTMLTableCellElement);
		}
	} else if (event.code === 'ArrowLeft') {
		const previousSibling = cellElement.previousElementSibling;
		if (previousSibling) changeStyle(previousSibling as HTMLTableCellElement);
	} else if (event.code === 'ArrowRight') {
		const nextSibling = cellElement.nextElementSibling;
		if (nextSibling) changeStyle(nextSibling as HTMLTableCellElement);
	} else if (event.code === 'Space') {
		const eventElement = document.activeElement;
		if (eventElement?.tagName === 'BODY') {
			const activeElement = cellElement.querySelector('a') || cellElement.querySelector('button') || cellElement;
			activeElement?.click();
		}
	}
}
function changeStyle(sibling: HTMLTableCellElement) {
	if (sibling !== null && cellElement) {
		cellElement.focus();
		cellElement.style.backgroundColor = '';
		cellElement.style.color = '';
		sibling.focus();
		sibling.style.backgroundColor = '#50b988';
		sibling.style.color = 'white';
		// sibling.classList.add('active')
		cellElement = sibling;
	}
}

export default tableNav;
