const accionBoton = document.querySelector('.botonActivacionBarra')
const accionBotonIcono = document.querySelector('.botonActivacionBarra i')
const topMenuMovil = document.querySelector('.topMenuMovil')
const accionEquipamiento = document.querySelector('.equipamiento')
const subMenuEquipamiento= document.querySelector('.subMenuMovil.equipamiento')
const accionCapacitaciones = document.querySelector('.capacitaciones')
const subMenuCapacitacion = document.querySelector('.subMenuMovil.capacitaciones')
const accionCursos1 = document.querySelector('.cursos1')
const subMenuCursos1 = document.querySelector('.subMenuMovilC.capacitaciones.cursos1')
const accionCursos2 = document.querySelector('.cursos2')
const subMenuCursos2 = document.querySelector('.subMenuMovilC.capacitaciones.cursos2')
const accionCursos1Top = document.querySelector('.cursos1Top')
const subMenuCursos1Top = document.querySelector('.subMenuCursos.tcursos1')
const accionCursos2Top = document.querySelector('.cursos2Top')
const subMenuCursos2Top = document.querySelector('.subMenuCursos.tcursos2')
const topMenu = document.querySelector('.topMenu');
const buttonIrHaciaArriba = document.querySelector('.buttonIrHaciaArriba');

accionBoton.onclick = function(){
    topMenuMovil.classList.toggle('open')
    const isOpen = topMenuMovil.classList.contains('open')
    accionBotonIcono.classList = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'
}

accionEquipamiento.onclick = function() {
    if (subMenuEquipamiento.classList.contains('open')) {
        subMenuEquipamiento.classList.remove('open')
    } else {
        subMenuCapacitacion.classList.remove('open')
        subMenuCursos1.classList.remove('open')
        subMenuCursos2.classList.remove('open')
        subMenuEquipamiento.classList.add('open')
    }
}

accionCapacitaciones.onclick = function() {
    if (subMenuCapacitacion.classList.contains('open')) {
        subMenuCapacitacion.classList.remove('open')
    } else {
        subMenuEquipamiento.classList.remove('open')
        subMenuCapacitacion.classList.add('open')
    }
}

accionCursos1.onclick = function(event) {
    event.stopPropagation(); // Evita que el clic se propague al menú principal
    if (subMenuCursos1.classList.contains('open')) {
        subMenuCursos1.classList.remove('open')
    } else {
        subMenuCursos2.classList.remove('open')
        subMenuCursos1.classList.add('open')
    }
}

accionCursos2.onclick = function(event) {
    event.stopPropagation(); 
    if (subMenuCursos2.classList.contains('open')) {
        subMenuCursos2.classList.remove('open')
    } else {
        subMenuCursos1.classList.remove('open')
        subMenuCursos2.classList.add('open')
    }
}

accionCursos1Top.onclick = function(){
    subMenuCursos1Top.classList.toggle('open')
}

accionCursos2Top.onclick = function(){
    subMenuCursos2Top.classList.toggle('open')
}


topMenu.addEventListener('mouseleave', function() {
    subMenuCursos1Top.classList.remove('open')
    subMenuCursos2Top.classList.remove('open')
});






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

// Añade el evento de clic para llevar al usuario a la parte superior
buttonIrHaciaArriba.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // Añade una animación suave al desplazamiento
    });
});

