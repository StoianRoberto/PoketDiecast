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

/*
=============================
    GRID + DIALOG
=============================
*/

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
    const car_make = document.createElement("li");
    car_make.textContent = car.make;
    const car_brand = document.createElement("li");
    car_brand.textContent = car.brand;
    info.append(car_make, car_brand);

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

//  Generate the grid
populateCardGrid(cars);


/*
=============================
    DROPDOWNS
=============================
*/

const selected = {};
document.querySelectorAll("[data-field]").forEach(menu => {
    selected[menu.dataset.field] = new Set();
});
let query = "";

document.querySelectorAll("[data-field]").forEach(content => populateDropdown(content, cars));
document.addEventListener('click', (event) => handle(event));
clear.addEventListener('click', (event) => {
    Object.values(selected).forEach(set => set.clear());
    query = "";
    searchbar.value = "";
    
    document.querySelectorAll('.dropdown_content input[type="checkbox"]')
        .forEach(checkbox => checkbox.checked = false);
    document.querySelectorAll(".dropdown_content").forEach(resetMenuSearch);

    update();
});

searchbar.addEventListener('input', (event) => {
    query = event.target.value.toLowerCase().trim();
    update();
});

document.addEventListener("change", (event) => {
    if(!event.target.matches('.dropdown_content input[type="checkbox"]')) return;

    const name = event.target.name;
    const value = event.target.value;
    const checked = event.target.checked;
    if(checked) selected[name].add(value);
    else selected[name].delete(value);
    update();
});

document.addEventListener("input", (event) => {
    //  Ignore every input that isn't a dropdown search box (main search bar, etc.)
    if(!event.target.matches('.dropdown_content input[type="search"]')) return;

    const text = event.target.value.toLowerCase().trim();
    const menu = event.target.closest(".dropdown_content");

    menu.querySelectorAll(".options label").forEach(label => {
        const value = label.querySelector("input").value.toLowerCase();
        label.hidden = !value.includes(text);
    });
});

function closeAll() {
    document.querySelectorAll('.dropdown_content input[type="search"]')
        .forEach(box => box.value = "");
    document.querySelectorAll('.dropdown > button').forEach(btn => btn.setAttribute('aria-expanded', 'false'));
      document.querySelectorAll(".dropdown_content").forEach(resetMenuSearch);
};

function toggle(button){
    const exp = button.getAttribute("aria-expanded") === "true";
    closeAll();

    button.setAttribute("aria-expanded", String(!exp));
};

function handle(event) {
    const button = event.target.closest('.dropdown > button');
    if(button) {
        toggle(button);
        return;
    }

    if(event.target.closest('.dropdown')) return;

    closeAll();
};

function populateDropdown(content, cars) {
    const field = content.dataset.field;
    const options = content.querySelector(".options");
    const count = {};
    cars.forEach(car => {count[car[field]] = (count[car[field]] || 0) + 1;});

    Object.keys(count)
        .sort()
        .forEach(value => {
            const label = document.createElement("label");

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.name = field;
            checkbox.value = value;

            const name = document.createElement("span");
            name.classList.add("option_name");
            name.textContent = value;
            
            const amount = document.createElement("span");
            amount.classList.add("option_count");
            amount.textContent = `(${count[value]})`;

            label.append(checkbox, name, amount);
            options.append(label);
    })
};

function applyFilters(cars, selected, query) {
    return cars.filter(car => {
        const matches_text = car.name.toLowerCase().includes(query);
        const matches_fields = Object.keys(selected).every(field =>
            selected[field].size === 0 || selected[field].has(String(car[field]))
        );
        return matches_text && matches_fields;
    });
};

function resetMenuSearch(menu) {
    const box = menu.querySelector('input[type="search"]');
    if(box) box.value = "";
    menu.querySelectorAll(".options label[hidden]").forEach(label => label.hidden = false);
};

function countBy(list, field) {
    const counts = {};
    list.forEach(car => { counts[car[field]] = (counts[car[field]] || 0) + 1; });
    return counts;
};

function updateCounts() {
    document.querySelectorAll("[data-field]").forEach(menu => {
        const field = menu.dataset.field;
        const others = applyFilters(cars, { ...selected, [field]: new Set() }, query);
        const counts = countBy(others, field);

        menu.querySelectorAll(".options label").forEach(label => {
            const box = label.querySelector("input");
            box.checked = selected[field].has(box.value);
            const amount = counts[box.value] || 0;
            label.querySelector(".option_count").textContent = `(${amount})`;
            label.classList.toggle("unavailable", amount === 0 && !box.checked);
        });
    });
};

function update() {
    populateCardGrid(applyFilters(cars, selected, query));
    updateCounts();
};
