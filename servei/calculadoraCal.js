const buttonCalc = document.querySelector("#calc");

//Button per calcular les calories necessaries
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
    const tmb = calculTMB(sexe, pes, altura, edat);
    const calNecessaries = tmb * activitat;

    document.querySelector("#resultat").innerHTML = calNecessaries + " KCal";
})

//Funcio que ens calcula la tassa metabòlica basal (TMB)
function calculTMB(sexe, pes, altura, edat) {
    if (sexe === "home") {
        return (10 * pes) + (6.25 * altura) - (5 * edat) + 5;
    } else {
        return (10 * pes) + (6.25 * altura) - (5 * edat) - 161;
    }
}

/*#### Drag and Drop ####*/
function startDrag(ev) {
    ev.dataTransfer.setData("idSelec", ev.target.id);
}

function endDrag(ev) {
    ev.dataTransfer.clearData();
}

function zoneDrop(ev) {
    ev.preventDefault();
}

function drop(ev) {
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

}

/*#### IndexedDB ####*/
//Cream la base de dades local a on es guardaran tots els aliments introduits
const req = indexedDB.deleteDatabase("Aliments");
var request = window.indexedDB.open("Aliments", 1);

request.onupgradeneeded = async function(event) {
    const db = event.target.result;
    let objectStore = db.createObjectStore("aliment", { autoIncrement: true });

};


let classifier;
let resultsP;
let video;

//Cream l'objecte constraint que fara servir API de la camara, mediaDevices
const constraints = window.constraints = {
    audio: false,
    video: {
        width: { min: 640 },
        height: { min: 480 }
    }
};

/*#### md5 ####*/
//Reconeixement d'aliments
function setup() {
    noCanvas();
    // Create a camera input
    video = document.querySelector('video');
    navigator.mediaDevices.getUserMedia(constraints)
        .then(function(stream) {
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


function gotResult(err, results) {
    document.querySelector("#reconeixement").innerHTML = results[0].label + ' ' + nf(results[0].confidence, 0, 2);
    //Si la confiança es major al 0.70, començarem el proces d'introducció a la base de dades
    if (results[0].confidence >= 0.70) {
        addData(results[0].label);
    }
    classifyVideo();
}

const calculaDieta = document.querySelector("#calculaDieta");
const eliminarDieta = document.querySelector("#elimina");

calculaDieta.addEventListener("click", function() {
    const db = request.result;

    const transaction = db.transaction("aliment", "readwrite");
    const objectStore = transaction.objectStore("aliment");
    let sumaCal = 0;
    //Abans d'afegir el nou aliment, s'ha de veure si l'aliment es troba en la bbdd o no
    const aliments = objectStore.getAll();

    aliments.onsuccess = function(e) {
        const totsAliments = aliments.result;

        //De cada aliment de la base de dades analitzam les seves calories
        totsAliments.forEach(async function(aliment) {
            let alimentWithCal = await getCalories(aliment.nom);
            sumaCal = sumaCal + alimentWithCal.hints[0].food.nutrients.ENERC_KCAL;
            document.querySelector("#dieta").innerHTML = sumaCal + " KCal";
        })
    }
})

//Boto que ens permet esborrar tots els ingredients de la base de dades i començar un altre dieta de nou.
eliminarDieta.addEventListener("click", function() {
    const req = indexedDB.deleteDatabase("Aliments");
    window.location.href = "calculadorCal.html";
})

/*#### Funcions ####*/
//Funcio que afegeix un aliment a la base de dades. Es comprova que aquest aliment no ha estat inserit previament.
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

        //Si no existeix, es comença a introduir l'aliment a la base de dades
        if (!existeix) {
            const transaction = db.transaction("aliment", "readwrite");
            const objectStore = transaction.objectStore("aliment");

            const newAliment = {
                nom: alimentNou
            }
            objectStore.add(newAliment);
            document.querySelector("#totIngredients").innerHTML += "<p>" + alimentNou + "</p>";

        }
    }
}

//Funcio que ens permet saber quantes calories te un ingredient en concret
async function getCalories(nameIngr) {
    const app_id = "32f2df88";
    const app_key = "53d0545fb61ad0cc3a9ea0af076a5e05";

    const request = await fetch(`https://api.edamam.com/api/food-database/parser?app_id=${app_id}&app_key=${app_key}&ingr=${nameIngr}`)
    const ingredients = await request.json();
    return ingredients;

}