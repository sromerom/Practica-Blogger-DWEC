// Copyright (c) 2019 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
Webcam Image Classification using MobileNet and p5.js
This example uses a callback pattern to create the classifier
=== */
var request = window.indexedDB.open("Aliments", 1);

request.onupgradeneeded = async function(event) {
    var db = event.target.result;
    let objectStore = db.createObjectStore("aliment", { autoIncrement: true });

};

let classifier;
let video;
let resultsP;

function setup() {
    noCanvas();
    // Create a camera input
    video = createCapture(VIDEO);
    // Initialize the Image Classifier method with MobileNet and the video as the second argument
    classifier = ml5.imageClassifier('MobileNet', video, modelReady);
    resultsP = createP('Loading model and video...');
}

function modelReady() {
    console.log('Model Ready');
    classifyVideo();
}

// Get a prediction for the current video frame
function classifyVideo() {
    classifier.classify(gotResult);
}

// When we get a result
function gotResult(err, results) {
    console.log(results)
        // The results are in an array ordered by confidence.
    resultsP.html(results[0].label + ' ' + nf(results[0].confidence, 0, 2));
    if (results[0].confidence >= 0.70) {
        console.log("Se añade: " + results[0].label);
        //addData(results[0].label);
    }
    //classifyVideo();
}

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
        } else {
            console.log("L'ingredient existeix...")
        }
    }
}

const btn = document.querySelector("#afegeix");

btn.addEventListener("click", function() {
    addData("hola");
})