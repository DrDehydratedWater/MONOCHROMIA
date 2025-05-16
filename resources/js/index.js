let invert = false;
let title_container_lift_toggle = false;

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