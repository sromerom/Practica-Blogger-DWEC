const buttonCalc = document.querySelector("#calc");

buttonCalc.addEventListener("click", function() {
    let sexe;
    if (document.querySelector('#rad1').checked) {
        sexe = document.querySelector("#rad1").value;
    } else {
        sexe = document.querySelector("#rad2").value;
    }

    const pes = document.querySelector("#pes").value;
    const altura = document.querySelector("#altura").value;
    const edat = document.querySelector("#edat").value;
    const activitat = document.querySelector("#activitat").value;

    console.log(sexe);
    console.log(pes)
    console.log(altura);
    console.log(edat);
    console.log(activitat)

    const tmb = calculTMB(sexe, pes, altura, edat);
    const calNecessaries = tmb * activitat;
    document.querySelector("#resultat").innerHTML = calNecessaries + " KCal";
})

function calculTMB(sexe, pes, altura, edat) {
    if (sexe === "home") {
        return (10 * pes) + (6.25 * altura) - (5 * edat) + 5;
    } else {
        return (10 * pes) + (6.25 * altura) - (5 * edat) - 161;
    }
}

function startDrag(ev) {
    console.log("Comença el drag")
    ev.dataTransfer.setData("idSelec", ev.target.id);
}

function endDrag(ev) {
    console.log("Termina el drag")
    ev.dataTransfer.clearData();
}

function zoneDrop(ev) {
    console.log("zona a on es pot fer drop")
    ev.preventDefault();
}

function drop(ev) {
    console.log("Drop!")
    ev.preventDefault();

    const myNode = document.querySelector("#destiDrag");
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }


    const id = ev.dataTransfer.getData("idSelec");
    if (id === "pocCap") {
        const elmnt = document.querySelector("#pocCap");
        const cln = elmnt.cloneNode(true);
        document.querySelector("#destiDrag").appendChild(cln);
        document.querySelector("#activitat").value = 1.2;

    } else if (id === "lleuger") {
        const elmnt = document.querySelector("#lleuger");
        const cln = elmnt.cloneNode(true);
        document.querySelector("#destiDrag").appendChild(cln);
        document.querySelector("#activitat").value = 1.375;

    } else if (id === "moderat") {
        const elmnt = document.querySelector("#moderat");
        const cln = elmnt.cloneNode(true);
        document.querySelector("#destiDrag").appendChild(cln);
        document.querySelector("#activitat").value = 1.55;

    } else if (id === "fort") {
        const elmnt = document.querySelector("#fort");
        const cln = elmnt.cloneNode(true);
        document.querySelector("#destiDrag").appendChild(cln);
        document.querySelector("#activitat").value = 1.725;

    } else if (id === "professional") {
        const elmnt = document.querySelector("#professional");
        const cln = elmnt.cloneNode(true);
        document.querySelector("#destiDrag").appendChild(cln);
        document.querySelector("#activitat").value = 1.9;

    }

    console.log(id)
}

//Cream la base de dades local

var request = window.indexedDB.open("Aliments", 1);

request.onupgradeneeded = async function(event) {
    var db = event.target.result;
    let objectStore = db.createObjectStore("aliment", { autoIncrement: true });

};



// Put variables in global scope to make them available to the browser console.
let classifier;
let resultsP;
var video;

//Cream l'objecte constraint que fara servir API de la camara, mediaDevices
var constraints = window.constraints = {
    audio: false,
    video: {
        width: { min: 640 },
        height: { min: 480 }
    }
};

/* md5 */
function setup() {
    noCanvas();
    // Create a camera input
    video = document.querySelector('video');
    navigator.mediaDevices.getUserMedia(constraints)
        .then(function(stream) {
            var videoTracks = stream.getVideoTracks();
            console.log('Got stream with constraints:', constraints);
            console.log('Using video device: ' + videoTracks[0].label);

            stream.onremovetrack = function() {
                console.log('Stream ended');
            };
            window.stream = stream; // make variable available to browser console
            video.srcObject = stream;
        })

    // Initialize the Image Classifier method with MobileNet and the video as the second argument
    classifier = ml5.imageClassifier('MobileNet', video, modelReady);
    document.querySelector("#reconeixement").innerHTML = 'Loading model and video...';
}

function modelReady() {
    console.log('Model Ready');
    classifyVideo();
}

function classifyVideo() {
    classifier.classify(gotResult);
}

// When we get a result
function gotResult(err, results) {
    console.log(results)
        // The results are in an array ordered by confidence.
        //resultsP.html(results[0].label + ' ' + nf(results[0].confidence, 0, 2));
    document.querySelector("#reconeixement").innerHTML = results[0].label + ' ' + nf(results[0].confidence, 0, 2);
    if (results[0].confidence >= 0.70) {
        console.log("Se añade: " + results[0].label);
        addData(results[0].label);
    }
    classifyVideo();
}

//Funcio que afegeix un aliment a la base de dades. Previament es comprova que aquest aliment no estigui inserit d'abans.
function addData(alimentNou) {
    const db = request.result;

    const transaction = db.transaction("aliment", "readwrite");
    const objectStore = transaction.objectStore("aliment");

    //Abans d'afegir el nou aliment, s'ha de veure si l'aliment es troba en la bbdd o no
    const aliments = objectStore.getAll();

    aliments.onsuccess = function(e) {
        const totsAliments = aliments.result;
        let existeix = false;

        totsAliments.map(aliment => {
            //return aliment.nom === alimentNou;
            if (aliment.nom === alimentNou) {
                existeix = true;
            }
        })

        console.log(existeix)
            //Si no existeix, es comença a introduir l'aliment a la base de dades
        if (!existeix) {
            console.log("No existeix!!, Introduint ingredient")
            const transaction = db.transaction("aliment", "readwrite");
            const objectStore = transaction.objectStore("aliment");

            const newAliment = {
                nom: alimentNou
            }
            objectStore.add(newAliment);
            document.querySelector("#totIngredients").innerHTML += "<p>" + alimentNou + "</p>";

        } else {
            console.log("L'ingredient existeix...")
        }
    }
}

async function getCalories(nameIngr) {
    const app_id = "32f2df88";
    const app_key = "53d0545fb61ad0cc3a9ea0af076a5e05";

    const request = await fetch(`https://api.edamam.com/api/food-database/parser?app_id=${app_id}&app_key=${app_key}&ingr=${nameIngr}`)
    const ingredients = await request.json();
    return ingredients;

}

const calculaDieta = document.querySelector("#calculaDieta");
const eliminarDieta = document.querySelector("#elimina");

calculaDieta.addEventListener("click", function() {
    const db = request.result;

    const transaction = db.transaction("aliment", "readwrite");
    const objectStore = transaction.objectStore("aliment");
    var sumaCal = 0;
    let arraysCalories = [];
    //Abans d'afegir el nou aliment, s'ha de veure si l'aliment es troba en la bbdd o no
    const aliments = objectStore.getAll();

    aliments.onsuccess = function(e) {
        const totsAliments = aliments.result;

        totsAliments.forEach(async function(aliment) {
            //console.log(aliment)
            let alimentWithCal = await getCalories(aliment.nom);
            sumaCal = sumaCal + alimentWithCal.hints[0].food.nutrients.ENERC_KCAL;
            console.log(sumaCal)
            document.querySelector("#dieta").innerHTML = sumaCal + " KCal";
        })
    }
})


eliminarDieta.addEventListener("click", function() {
    console.log("Eliminando!!!!")
    var req = indexedDB.deleteDatabase("Aliments");
    req.onsuccess = function() {
        console.log("Deleted database successfully");
    };
    req.onerror = function() {
        console.log("Couldn't delete database");
    };
    req.onblocked = function() {
        console.log("Couldn't delete database due to the operation being blocked");
    };
    window.location.href = "calculadorCal.html";
})