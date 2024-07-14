

const btnLeft = document.querySelector(".btn-left"),
    btnRight = document.querySelector(".btn-right"),
    slider = document.querySelector("#slider"),
    sliderSection = document.querySelectorAll(".slider-section-producto, .slider-section");


btnLeft.addEventListener("click", e => moveToLeft())
btnRight.addEventListener("click", e => moveToRight())



// Verifica si algún elemento tiene la clase '.slider-section'
let hasSliderSection = Array.from(sliderSection).some(element => element.classList.contains('slider-section'));

if (hasSliderSection) {
    // Si la clase '.slider-section' está presente, ejecuta el setInterval
    setInterval(() => {
        moveToRight();
    }, 5000);
}




let operacion = 0,
    counter = 0,
    widthImg = 100 / sliderSection.length;

function moveToRight() {
    if (counter >= sliderSection.length - 1) {
        counter = 0;
        operacion = 0;
        slider.style.transform = `translate(-${operacion}%)`;
        slider.style.transition = "none";
        return;
    }
    counter++;
    operacion = operacion + widthImg;
    slider.style.transform = `translate(-${operacion}%)`;
    slider.style.transition = "all ease 2.5s"

}

function moveToLeft() {
    counter--;
    if (counter < 0) {
        counter = sliderSection.length - 1;
        operacion = widthImg * (sliderSection.length - 1)
        slider.style.transform = `translate(-${operacion}%)`;
        slider.style.transition = "none";
        return;
    }
    operacion = operacion - widthImg;
    slider.style.transform = `translate(-${operacion}%)`;
    slider.style.transition = "all ease 2.5s"


}


// esta funcion comprueba si un elemento esta visible en pantalla
function isVisible(elm) {
    var rect = elm.getBoundingClientRect();
    var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
    return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
}

// cuando se carga la página...
window.addEventListener('DOMContentLoaded', (ev0) => {
    // asignamos un evento scroll...
    window.addEventListener('scroll', (ev1) => {
        // y a todos los elementos con la clase paused...
        document.querySelectorAll(".paused").forEach(elm => {
            if (isVisible(elm)) // que sean visibles...
                elm.classList.remove("paused"); // les quitamos la clase paused
        })
    });
});



if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
} else {
    window.onbeforeunload = function () {
        window.scrollTo(0, 0);
    }
}

const accionBoton = document.querySelector('.botonActivacionBarra')
const accionBotonIcono = document.querySelector('.botonActivacionBarra i')
const topMenuMovil = document.querySelector('.topMenuMovil')
const accionEquipamiento = document.querySelector('.equipamiento')
const subMenuEquipamiento= document.querySelector('.subMenuMovil.equipamiento')
const accionCapacitaciones = document.querySelector('.capacitaciones')
const subMenuCapacitacion = document.querySelector('.subMenuMovil.capacitaciones')


accionBoton.onclick = function(){
    topMenuMovil.classList.toggle('open')
    const isOpen = topMenuMovil.classList.contains('open')
    accionBotonIcono.classList = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'
}

accionEquipamiento.onclick = function(){
    subMenuEquipamiento.classList.toggle('open')
}

accionCapacitaciones.onclick=function(){
    subMenuCapacitacion.classList.toggle('open')
}
