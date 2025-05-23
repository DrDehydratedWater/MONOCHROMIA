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
            item.setAttribute("data-picked-up", "true"); 
            inventoryState.push(item.id);
        } else {
            inventoryState.push(null);
        }
    });

    const itemsState = {};
    inventoryState.forEach(itemId => {
        if (itemId) {
            const item = document.getElementById(itemId);
            if (item && item.hasAttribute("data-picked-up")) {
                itemsState[itemId] = item.getAttribute("data-picked-up") === "true";
            }
        }
    });

    localStorage.setItem("inventory", JSON.stringify(inventoryState));
    localStorage.setItem("itemsState", JSON.stringify(itemsState));
}


function loadInventory() {
    const inventoryData = JSON.parse(localStorage.getItem("inventory"));

    if (!inventoryData) return;

    document.querySelectorAll("#eye").forEach(item => {
        item.remove();
    });

    const slots = document.querySelectorAll(".slot");

    inventoryData.forEach((itemId, index) => {
        const slot = slots[index];

        if (itemId) {
            let item = document.getElementById(itemId);  

            if (!item) {
                console.log(itemId)
                console.log(`resources/images/${itemId}.png`)

                item = document.createElement("div");
                item.id = itemId;
                item.classList.add(`${itemId}-item`);
                item.setAttribute("draggable", "true");
                item.addEventListener("dragstart", dragstartHandler);

                const img = document.createElement("img");
                img.src = `resources/images/${itemId}.png`;
                img.alt = itemId;

                item.appendChild(img);
            }

            // Apply the picked-up state to the item
            if (itemId && item.getAttribute("data-picked-up") !== "true") {
                item.setAttribute("data-picked-up", "true"); 
            }

            if (slot && !slot.contains(item)) {
                slot.appendChild(item);
            }
        }
    });

}


function dragstartHandler(ev) {
    let target = ev.target;

    if (!target.id && target.parentElement?.id) {
        target = target.parentElement;
    }

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

    draggedElement.className = `${itemId}-item`;

    const targetSlot = ev.target;

    if (itemId === "eye" && targetSlot.id === "eye-slot") {
        console.log("Eye slot activated");

        targetSlot.appendChild(draggedElement);

        draggedElement.style.transition = "opacity 1s ease";
        draggedElement.style.opacity = 1;

        requestAnimationFrame(() => {
            draggedElement.style.opacity = 0;

            setTimeout(() => {
                draggedElement.remove();
                saveInventory();
            }, 1000);
        });

        return;
    }

    targetSlot.appendChild(draggedElement);
    saveInventory();
}



window.onload = () => {
    loadInventory();

    document.querySelectorAll('[draggable="true"]').forEach(el => {
        if (!el.hasAttribute("ondragstart")) {
            el.addEventListener("dragstart", dragstartHandler);
        }
    });
};

loadInventory();