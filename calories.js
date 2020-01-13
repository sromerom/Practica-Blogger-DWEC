async function getFood() {
    const app_id = "32f2df88";
    const app_key = "53d0545fb61ad0cc3a9ea0af076a5e05";
    const c = "";
    const request = await fetch('https://api.edamam.com/api/food-database/parser?ingr=red%20apple&app_id={app_id}&app_key={app_key}', {
        tpe: "GET",
        data: { ingr: "banana" }
    });

    const requestData = request.json();
    console.log(requestData);
}

getFood();