let invert = false;
let title_container_lift_toggle = false;
let inventory_open = false

function invert_toggle() {
    if (invert === true) {
        invert = false;
        document.documentElement.style.setProperty('--invert', '0');
    } else {
        invert = true;
        document.documentElement.style.setProperty('--invert', '100');
    }
}

function title_container_lift() {
    const titleContainer = document.getElementById("title-container");
    
    if (title_container_lift_toggle === false) {
        titleContainer.classList.add('clicked');
        title_container_lift_toggle = true;
    } else {
        titleContainer.classList.remove('clicked');
        title_container_lift_toggle = false;
    }
}

function inventory_toggle() {
    const inventory = document.getElementById("inventory");

    if (inventory_open == false) {
        inventory.classList.add('clicked');
        inventory_open = true;
    } else {
        inventory.classList.remove('clicked');
        inventory_open = false;
    }
}


function dragstartHandler(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function dragoverHandler(ev) {
    ev.preventDefault();
}

function dropHandler(ev) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData("text");
    const draggedElement = document.getElementById(data);

    draggedElement.classList.add("eye-reset");

    ev.target.appendChild(draggedElement);
}