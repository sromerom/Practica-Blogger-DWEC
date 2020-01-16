export function creaNotificacio(tipusNotificacio) {

    const div = document.createElement("div");
    const button = document.createElement("button");
    const span = document.createElement("span");
    let contentDiv;

    if (tipusNotificacio === "alert-success") {
       contentDiv = document.createTextNode("S'ha creat el post correctament");
    } else if (tipusNotificacio === "alert-warning") {
        contentDiv = document.createTextNode("S'ha actualizat el post correctament");
    } else {
        contentDiv = document.createTextNode("S'ha eliminat el post correctament");
    }

    //div
    div.appendChild(contentDiv);
    div.setAttribute("class", "alert " + tipusNotificacio + " alert-dismissible fade show");
    div.setAttribute("role", "alert");

    //button
    button.setAttribute("type", "button");
    button.setAttribute("class", "close");
    button.setAttribute("data-dismiss", "alert");
    button.setAttribute("aria-label", "Close");

    //span
    span.setAttribute("aria-hidden", "true");
    const contentSpan =  document.createTextNode("x");
    span.appendChild(contentSpan);
    

    button.appendChild(span);
    div.appendChild(button);
    document.querySelector("#alert").appendChild(div);
}