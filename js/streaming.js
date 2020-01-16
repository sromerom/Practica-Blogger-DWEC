//Constraints de la camara i del microfon
if (navigator.mediaDevices) {
    let video;

    let constraints = {
        audio: true
    };

    let constraintsVideo = {
        audio: false,
        video: {
            width: {
                min: 640
            },
            height: {
                min: 480
            }
        }
    };

    //Carregam el video
    video = document.querySelector('video');
    navigator.mediaDevices.getUserMedia(constraintsVideo)
        .then(function(stream) {
            window.stream = stream; // make variable available to browser console
            video.srcObject = stream;
        })

        //Inicialitzam la variable chunks, que posteriorment s'afegira al fitxer blob
    let chunks = [];

    navigator.mediaDevices.getUserMedia(constraints)
        .then(function(stream) {

            const mediaRecorder = new MediaRecorder(stream);
            let record = document.querySelector("#record");
            let stop = document.querySelector("#stop");

            //Quan s'activi el button record, es començara a gravar l'audio
            record.onclick = function() {
                mediaRecorder.start();
                console.log("recorder started");
                record.setAttribute("class", "btn btn-danger")
                //record.style.background = "red";
                record.style.color = "black";
            }

            //Quan s'aturi, s'aturara l'actual record
            stop.onclick = function() {
                mediaRecorder.stop();
                record.setAttribute("class", "btn btn-info")
                record.style.color = "white";
            }

            //Una vegada s'aturat (i nomes quan s'atura), crearem el fitxer blob que posteriorment enviarem al servidor
            //Important posar els chunks a 0, ja que si no agafara les petites parts de l'anterior audio gravat
            mediaRecorder.onstop = async function(e) {
                console.log("recorder stopped");

                let blob = new Blob(chunks, {
                    'type': 'audio/webm; codecs=opus'
                });
                chunks = [];

                //Enviam el blob al servidor i guardam el que ens retorna
                const transcripcioServidor = await uploadAudio(blob);

                //Si la confiança del missatge que hem enviat es superior a 0.70, doncs passarem a introduir la codificació al text area
                if(transcripcioServidor[0].confianca > 0.70) {
                    tinymce.activeEditor.setContent(transcripcioServidor[0].transcripcio);
                    //Agafam el options seleccionats
                    const idiomaOriginal = document.querySelector("#idiomaOriginal");
                    const idiomaATraduir = document.querySelector("#idiomaTraduir");
                    const codeIdiomaOriginal = idiomaOriginal.options[idiomaOriginal.selectedIndex].value;
                    const codeIdiomaATraduir = idiomaATraduir.options[idiomaATraduir.selectedIndex].value;

                    //Agafam el titol i el content actual
                    const content = (tinymce.get('content').getContent());
                    const title = document.querySelector("#title").value;

                    //Traduim el titol i el content del post
                    const titleTraduit = await translate(codeIdiomaOriginal, codeIdiomaATraduir, title);
                    const contentTraduit = await translate(codeIdiomaOriginal, codeIdiomaATraduir, content);

                    //I actualizam
                    tinymce.activeEditor.setContent(contentTraduit);
                    document.querySelector("#title").value = titleTraduit;
                }
            }

            //Quan estigui gravant, anirem fent push dels chunks
            mediaRecorder.ondataavailable = function(e) {
                chunks.push(e.data);
            }
        })
}

async function uploadAudio(blob) {
    let apiUrl = 'http://server247.cfgs.esliceu.net/bloggeri18n/blogger.php';

    //Cream el formData amb les caracteristiques que es demana
    let formData = new FormData();
    formData.append('arxiu', blob);
    formData.append('MethodName', 'transcribe_sync');
    formData.append('params', "{}");

    const response = await fetch(apiUrl, {
        method: "POST",
        body: formData
    })

    
    const responseJSON = await response.json();

    return responseJSON;
}

async function translate(source, target, text) {
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

async function traduir() {

    //Agafam el options seleccionats
    const idiomaOriginal = document.querySelector("#idiomaOriginal");
    const idiomaATraduir = document.querySelector("#idiomaTraduir");
    const codeIdiomaOriginal = idiomaOriginal.options[idiomaOriginal.selectedIndex].value;
    const codeIdiomaATraduir = idiomaATraduir.options[idiomaATraduir.selectedIndex].value;

    //Agafam el titol i el content actual
    const content = (tinymce.get('content').getContent());
    const title = document.querySelector("#title").value;

    //Traduim el titol i el content del post
    const titleTraduit = await translate(codeIdiomaOriginal, codeIdiomaATraduir, title);
    const contentTraduit = await translate(codeIdiomaOriginal, codeIdiomaATraduir, content);

    //I actualizam
    tinymce.activeEditor.setContent(contentTraduit);
    document.querySelector("#title").value = titleTraduit;

}