import Logger from './app/logger';
import Constants from './app/constants';
import Messaging from './app/messaging';
import PageMessaging from './app/page-messaging';

Logger.enabled = false;

Messaging.registerMessageHandler(Constants.Messages.CONSOLE_ENTRIES, handleConsoleEntriesRequest);

async function handleConsoleEntriesRequest() {

    // Request the page context for logEntries
    const logEntries = await PageMessaging.postMessage(Constants.PageMessages.CONSOLE_ENTRIES);

    return Promise.resolve(logEntries);
}

/*
* Adapted from:
* https://stackoverflow.com/questions/9515704/insert-code-into-the-page-context-using-a-content-script
*/
function scriptFromFile(file) {
    const script = document.createElement("script");
    script.src = browser.extension.getURL(file);
    return script;
}

function inject(parentNode, scripts) {
    if (scripts.length === 0) {
        return;
    }
    const otherScripts = scripts.slice(1);
    const script = scripts[0];
    const onload = function () {
        script.parentNode.removeChild(script);
        inject(parentNode, otherScripts);
    };
    if (script.src !== "") {
        script.onload = onload;
        parentNode.appendChild(script);
    } else {
        parentNode.appendChild(script);
        onload();
    }
}

function onDocumentHeadReady() {
    const scriptFiles = [
        'content_inject.js'
    ];
    const scripts = scriptFiles.map(scriptFromFile);
    inject(document.head || document.documentElement, scripts);
}

onDocumentHeadReady();