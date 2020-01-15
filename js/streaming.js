async function uploadAudioAsync(uri) {
    console.log("Uploading " + uri);
    let apiUrl = 'http://YOUR_SERVER_HERE/upload';
    let uriParts = uri.split('.');
    let fileType = uriParts[uriParts.length - 1];

    console.log(fileType)
    let formData = new FormData();
    formData.append('file', {
        uri,
        name: `recording.${fileType}`,
        type: `audio/x-${fileType}`,
    });

    let options = {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
        },
    };

    console.log("POSTing " + uri + " to " + apiUrl);
    return fetch(apiUrl, options);
}

// Do a recording
let uri = await this.recording.getURI();
await uploadAudioAsync(uri);