const temp_card = document.querySelector(".template-card")
const target = document.querySelector("main")

function create_card(object){

    let card = temp_card.content.cloneNode(true)

    let image = card.querySelector('.image')
    let name = card.querySelector('.name')
    let classification = card.querySelector('.classification')
    let duration = card.querySelector('.duration')
    let format = card.querySelector('.format')
    let seats = card.querySelector('.seats')
    let schedule_list = card.querySelector('.list')

    let img = document.createElement('img')
    img.setAttribute('src', object.imagen)

    let nameText = document.createElement('h3')
    let nameAux = document.createTextNode(object.nombre)
    nameText.appendChild(nameAux)
    nameText.classList.add('text')

    let classificationText = document.createElement('h6')
    let classificationAux = document.createTextNode(object.clasificacion)
    classificationText.appendChild(classificationAux)
    classificationText.classList.add('text')

    let durationText = document.createElement('h6')
    let durationAux = document.createTextNode(object.duracion)
    durationText.appendChild(durationAux)
    durationText.classList.add('text')

    let formatText = document.createElement('h6')
    let formatAux = document.createTextNode(object.formato)
    formatText.appendChild(formatAux)
    formatText.classList.add('text')

    let seatsText = document.createElement('h6')
    let seatsAux = document.createTextNode(object.butacas)
    seatsText.appendChild(seatsAux)
    seatsText.classList.add('text')

    let schedule_listFragment = document.createDocumentFragment()
    object.horarios.forEach(horario => {
        let horarioDiv = document.createElement('div')
        horarioDiv.innerHTML = horario
        schedule_listFragment.appendChild(horarioDiv)
    })

    image.appendChild(img)
    name.appendChild(nameText)
    classification.appendChild(classificationText)
    duration.appendChild(durationText)
    format.appendChild(formatText)
    seats.appendChild(seatsText)
    schedule_list.appendChild(schedule_listFragment)

    return card
}

function add_to_html(object){
    let fragment = document.createDocumentFragment()
    object.peliculas.forEach(pelicula => {
        let aux = create_card(pelicula)
        fragment.appendChild(aux)
    })
    target.appendChild(fragment)
}

function get_data(){
    fetch('cartelera.json')
        .then(data => data.text())
        .then(data => JSON.parse(data))
        .then(data =>{
            add_to_html(data)
        }) 
}

window.addEventListener('load', get_data())