export async function translate(source, target, text) {
    const dataFetch = await fetch("http://server247.cfgs.esliceu.net/bloggeri18n/blogger.php", {
        method: 'POST',
        body: JSON.stringify({
            MethodName: 'translate',
            params: {
                source: source,
                target: target,
                text: text
            }
        }),
        headers: {
            "Content-type": "application/x-www-form-urlencoded"
        }
    })
    const translate = await dataFetch.json();
    return translate;
}