let inventory_open = false;

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
            const item = slot.children[0];
            item.setAttribute("data-picked-up", "true"); // ✅ Mark as picked up
            inventoryState.push(item.id);
        } else {
            inventoryState.push(null);
        }
    });

    // ✅ Now collect picked-up state after inventoryState is filled
    const itemsState = {};
    inventoryState.forEach(itemId => {
        if (itemId) {
            const item = document.getElementById(itemId);
            if (item && item.hasAttribute("data-picked-up")) {
                itemsState[itemId] = item.getAttribute("data-picked-up") === "true";
            }
        }
    });

    // ✅ Save both to localStorage
    localStorage.setItem("inventory", JSON.stringify(inventoryState));
    localStorage.setItem("itemsState", JSON.stringify(itemsState));
}


function loadInventory() {
    const inventoryData = JSON.parse(localStorage.getItem("inventory"));
    const itemsState = JSON.parse(localStorage.getItem("itemsState"));

    // ✅ Apply data-picked-up to matching existing DOM elements
    if (itemsState) {
        Object.entries(itemsState).forEach(([itemId, wasPickedUp]) => {
            if (wasPickedUp) {
                const existing = document.getElementById(itemId);
                if (existing) {
                    existing.setAttribute("data-picked-up", "true");
                }
            }
        });
    }


    // If no inventory data, just return early.
    if (!inventoryData) return;

    // Clear all elements with IDs that match items in the inventory but only if the item has been picked up
    inventoryData.forEach(itemId => {
        if (itemId) {
            const element = document.getElementById(itemId);
            
            // Only remove items with the `data-picked-up` attribute set to true
            if (element && element.getAttribute("data-picked-up") === "true") {
                element.remove();
            }
        }
    });

    // Ensure the slots are available to add new elements
    const slots = document.querySelectorAll(".slot");

    // Generate and place items in the slots based on the saved inventory data
    inventoryData.forEach((itemId, index) => {
        const slot = slots[index];
        
        if (itemId) {
            let item = document.getElementById(itemId);

            // If the item doesn't exist in the DOM, create it
            if (!item) {
                item = document.createElement("div");
                item.id = itemId;
                item.textContent = itemId;
                item.classList.add("item");
                item.setAttribute("draggable", "true");
                item.addEventListener("dragstart", dragstartHandler);
                item.classList.add("eye")

                // If the item has been picked up before, mark it with the "data-picked-up" attribute
                item.setAttribute("data-picked-up", "true");
            }

            // Ensure we add the item to the correct slot
            if (slot && !slot.contains(item)) {
                item.classList.add("eye-reset");
                slot.appendChild(item);
            }
        }
    });
}

function dragstartHandler(ev) {
    const draggedElement = ev.target;

    ev.dataTransfer.setData("text", draggedElement.id);
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
