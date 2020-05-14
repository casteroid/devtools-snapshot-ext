import optionsStorage from './options-storage';
import Snapshot from './app/snapshot';

// Store form options
optionsStorage.syncForm('#snapshotForm');

// HTML elements
const screenshotEl = document.querySelector('#screenshot');
const consoleEl = document.querySelector('#console');
const saveButtonEl = document.querySelector('#saveButton');

saveButtonEl.addEventListener('click', evt => {
	// Add more options here
	const screenshot = screenshotEl.checked;
	const network = false;
	const console = consoleEl.checked;
	const storage = false;

	const {devtools} = browser;
	const {inspectedWindow} = devtools;
	const {tabId} = inspectedWindow;

	Snapshot.capture(tabId, {screenshot, network, console, storage});

	evt.preventDefault();
});
