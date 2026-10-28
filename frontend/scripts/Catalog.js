import { cars } from "./data/Cars.js";

/*
    Page Elements
*/
const searchbar = document.getElementById("search_bar");
const scale = document.getElementById("scale_menu");
const brand = document.getElementById("brand_menu");
const make = document.getElementById("make_menu");
const clear = document.getElementById("clear_filters");
const count = document.getElementById("result_count");
const model = document.getElementById("model_dialog");
const grid = document.getElementById("card_grid");
const dropdowns = document.querySelectorAll(".dropdown");


//  Event to close dialog clicking outside its scope
model.addEventListener("click", (event) => { if (event.target === model) { model.close() } } );

//  Clears and populates the gird
function populateCardGrid(list) {
    grid.replaceChildren();

    if(list.length === 0) {
        count.textContent = "No models found.";
        return;
    }

    count.textContent = list.length + (list.length === 1 ? " model" : " models");

    list.forEach(car => grid.append(createCard(car)));
    return;
};

//  Creates each cars' card
function createCard(car) {
    const card = document.createElement("article");
    card.classList.add("card");
    card.dataset.id = car.id;

    const img = document.createElement("img");
    img.src = car.img;
    img.alt = car.name;

    const title = document.createElement("h2");
    const open_button = document.createElement("button");
    open_button.classList.add("card_open");
    open_button.type = "button";
    open_button.textContent = car.name;
    open_button.setAttribute("aria-haspopup", "dialog");
    open_button.addEventListener("click", () => openCard(car));
    title.append(open_button);

    const info = document.createElement("ul");
    const make = document.createElement("li");
    make.textContent = car.make;
    const brand = document.createElement("li");
    brand.textContent = car.brand;
    info.append(make, brand);

    card.append(img, title, info);
    return card;
};

//  Creates the pop-up page for a cars' card
function openCard(car) {
    model.replaceChildren();

    const body = document.createElement("div");
    body.classList.add("dialog_body");

    const header = document.createElement("div");
    header.classList.add("dialog_header");
    
    const title = document.createElement("h2");
    title.id = "dialog_title";
    title.textContent = car.name;
    const export_model = document.createElement("button");
    export_model.classList.add("export");
    export_model.type = "button";
    export_model.textContent = "Export";
    const modify_model = document.createElement("button");
    modify_model.classList.add("modify");
    modify_model.type = "button";
    modify_model.textContent = "Modify";
    const delete_model = document.createElement("button");
    delete_model.classList.add("delete");
    delete_model.type = "button";
    delete_model.textContent = "Delete";
    const close_model = document.createElement("button");
    close_model.classList.add("close");
    close_model.type = "button";
    close_model.textContent = "Close";
    close_model.addEventListener("click", () => model.close());

    header.append(title, export_model, modify_model, delete_model, close_model);

    const img = document.createElement("img");
    img.src = car.img;
    img.alt = car.name;

    const info = document.createElement("ul");

    const car_brand = document.createElement("li");
    car_brand.textContent = "Brand: " + car.brand;
    const car_make = document.createElement("li");
    car_make.textContent = "Maker: " + car.make;
    const car_year = document.createElement("li");
    car_year.textContent = "Year: " + car.year;
    const car_series = document.createElement("li");
    car_series.textContent = "Series: " + car.series;
    const car_collection = document.createElement("li");
    car_collection.textContent = "Collection: " + car.collection;
    const model_number = document.createElement("li");
    model_number.textContent = "Model number: " + car.model_number;

    info.append(car_brand, car_make, car_year, car_series, car_collection, model_number);

    body.append(header, img, info);
    model.append(body);
    model.showModal();
};

//  Populate each of the dropdown menus
function populateDropdown(menu, list) {
    const field = menu.dataset.field;
    const container = menu.querySelector(".options");

    const counts = {};
    list.forEach(car => {counts[car[field]] = (counts[list[field]] || 0) + 1;});

    container.replaceChildren();
    Object.keys(counts).sort().forEach(value => {
        const label = document.createElement("label");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = value;

        //label.append(checkbox, ${value} (${counts[value]}));
        label.append(checkbox, value, counts[value]);
        container.append(label);
    })
}

//  Generate the grid
populateCardGrid(cars);

dropdowns.forEach(dropdown => {
    const button = dropdown.querySelector("button");
    const menu = dropdown.querySelector(".dropdown_content");

    populateDropdown(menu, cars);
    button.addEventListener("click", () => {
        const expanded = button.getAttribute("aria-expanded") === "true";
        button.setAttribute('aria-expanded', !expanded ? 'true' : 'false')
    });
});