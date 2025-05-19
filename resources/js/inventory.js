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
            item.setAttribute("data-picked-up", "true"); // Mark as picked up
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

    // Save both to localStorage
    localStorage.setItem("inventory", JSON.stringify(inventoryState));
    localStorage.setItem("itemsState", JSON.stringify(itemsState));
}


function loadInventory() {
    const inventoryData = JSON.parse(localStorage.getItem("inventory"));

    // If no inventory data is available, exit early
    if (!inventoryData) return;

    document.querySelectorAll("#eye1, #eye2").forEach(item => {
        item.remove();
    });

    const slots = document.querySelectorAll(".slot");

    // Loop through the saved inventory data
    inventoryData.forEach((itemId, index) => {
        const slot = slots[index];

        if (itemId) {
            let item = document.getElementById(itemId);  // Try to find item by its ID in the DOM

            // If the item doesn't exist in the DOM, create it
            if (!item) {
                // Create the item dynamically if not found
                console.log(itemId)
                console.log(`resources/images/${itemId.substring(0, itemId.length - 1)}.png`)

                item = document.createElement("div");
                item.id = itemId;  // Ensure the item ID matches the saved ID
                item.classList.add(`${itemId.substring(0, itemId.length - 1)}-item`);  // Or use the correct class for your item
                item.setAttribute("draggable", "true");
                item.addEventListener("dragstart", dragstartHandler);

                const img = document.createElement("img");
                img.src = `resources/images/${itemId.substring(0, itemId.length - 1)}.png`;
                img.alt = itemId;

                item.appendChild(img);
            }

            // Apply the picked-up state to the item
            if (itemId && item.getAttribute("data-picked-up") !== "true") {
                item.setAttribute("data-picked-up", "true");  // Mark it as picked up
            }

            // Add the item to the slot if it isn't already there
            if (slot && !slot.contains(item)) {
                slot.appendChild(item);  // Add item to slot if it's not there
            }
        }
    });

}


function dragstartHandler(ev) {
    // Ensure the correct draggable element is targeted
    let target = ev.target;

    // If the image is dragged, use the parent
    if (!target.id && target.parentElement?.id) {
        target = target.parentElement;
    }

    // Still no ID? Abort
    if (!target.id) {
        console.warn("No ID found for dragged element:", target);
        return;
    }

    ev.dataTransfer.setData("text", target.id);
}


function dragoverHandler(ev) {
    ev.preventDefault();
}

function dropHandler(ev) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData("text");
    const draggedElement = document.getElementById(data);
    const itemId = draggedElement.id;
    
    draggedElement.className = `${itemId.substring(0, itemId.length - 1)}-item`;

    ev.target.appendChild(draggedElement);

    saveInventory();
}

window.onload = () => {
    loadInventory();

    // Ensure dragstart handler is attached to any existing draggable items
    document.querySelectorAll('[draggable="true"]').forEach(el => {
        if (!el.hasAttribute("ondragstart")) {
            el.addEventListener("dragstart", dragstartHandler);
        }
    });
};

loadInventory();