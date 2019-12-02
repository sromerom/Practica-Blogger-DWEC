export async function getLanguages() {
    const dataFetch = await fetch("http://server247.cfgs.esliceu.net/bloggeri18n/blogger.php", {
        method: 'POST',
        body: JSON.stringify({
            MethodName: 'languages',
            params: ''
        }),
        headers: {
            "Content-type": "application/x-www-form-urlencoded"
        }
    })

    const languages = await dataFetch.json();
    return languages;
}