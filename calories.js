async function getFood(nameIngr) {
    const app_id = "32f2df88";
    const app_key = "53d0545fb61ad0cc3a9ea0af076a5e05";

    const request = await fetch(`https://api.edamam.com/api/food-database/parser?app_id=${app_id}&app_key=${app_key}&ingr=${nameIngr}`)
    const ingredients = await request.json();
    console.log(ingredients);
   
}

getFood("red%20apple");


