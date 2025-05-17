let inventory_open = false


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

function saveInventory() {
    const slots = document.querySelectorAll(".slot");
    const inventoryState = [];

    slots.forEach(slot => {
        if (slot.children.length > 0) {
            inventoryState.push(slot.children[0].id);
        } else {
            inventoryState.push(null);
        }
    });

    localStorage.setItem("inventory", JSON.stringify(inventoryState));
}

function loadInventory() {
    const inventoryData = JSON.parse(localStorage.getItem("inventory"));
    if (!inventoryData) return;

    inventoryData.forEach((itemId, index) => {
        if (itemId) {
            const item = document.getElementById(itemId);
            const slot = document.querySelectorAll(".slot")[index];
            if (item && slot) {
                item.classList.add("eye-reset");
                slot.appendChild(item);
            }
        }
    });
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

    saveInventory();
}

window.onload = loadInventory;
