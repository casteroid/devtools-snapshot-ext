const LOG_TAG = 'FileUtils |';

export default class FileUtils {
	/**
	 * Creates a Blob instance from a data URL string.
	 * @param {String} dataUrl The image in data URL base64 format.
	 * @returns {Blob} Blob instance created from the data URL argument.
	 */
	static toBlob(dataUrl) {
		// Convert base64 to raw binary data held in a string
		// doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
		const byteString = atob(dataUrl.split(',')[1]);

		// Separate out the mime component
		const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];

		// Write the bytes of the string to an ArrayBuffer
		const ab = new ArrayBuffer(byteString.length);

		// Create a view into the buffer
		const ia = new Uint8Array(ab);

		// Set the bytes of the buffer to the correct values
		for (let i = 0; i < byteString.length; i++) {
			ia[i] = byteString.charCodeAt(i);
		}

		// Write the ArrayBuffer to a blob, and you're done
		return new Blob([ab], {type: mimeString});
	}

	static async downloadFile(file, name) {
		console.log(`${LOG_TAG} Downloading file...`, {file, name});

		const url = URL.createObjectURL(file);

		const options = {
			url,
			saveAs: true,
			filename: name
		};

		try {
			const result = await browser.downloads.download(options);
			console.log(`${LOG_TAG} File downloaded successfully.`, result);

			return true;
		} catch (error) {
			console.error(`${LOG_TAG} Error on file download.`, error);
			throw error;
		} finally {
			URL.revokeObjectURL(url);
		}
	}

	static async saveFile(blob, name) {
		// Saving a file calls the download logic, since there is no better alternative
		return FileUtils.downloadFile(blob, name);
	}

	static zip(name, files) {
		console.log(`${LOG_TAG} Zipping files.`, {name, files});
		throw new Error('todo');
	}
}
