const combos = document.querySelectorAll('input[name="combo"]')
const checkbox = document.querySelectorAll('input[class="checkbox"]')
const comDiv = document.querySelector('.comentario-target')
const comInp = document.querySelector('.comentario-input')
const total = document.querySelector('.total-target')
const enviar = document.querySelector('.enviar')
const overlay = document.querySelector('.recibo-div')
const recibo = document.querySelector('.template-recibo')
const formater = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  })
let typing = false

class Pedido {
    constructor(productos){
        this.productos = productos
    }

    getTotal(){
        let aux = 0
        for(let i = 0; i < this.productos.length; i++){
            aux = parseFloat(aux) + parseFloat(this.productos[i].precio)
        }
        return aux
    }
}

const menus = [
    {   nombre: "Combo Super",
        precio: 7.25},
    {   nombre: "Combo Personal",
        precio: 5.75},
    {   nombre: "Combo Infantil",
        precio: 3.50}
]

const productos = [
    {   nombre: "Ensalada",
        precio: 1.50},
    {   nombre: "Papa Frita",
        precio: 1.20},
    {   nombre: "Pieza de pollo grande",
        precio: 1.75},
    {   nombre: "Pieza de pollo mediana",
        precio: 1.50},
    {   nombre: "Pieza de pollo pequeña",
        precio: 1.25},
    {   nombre: "Bebida grande",
        precio: 1.50},
    {   nombre: "Bebida mediana",
        precio: 1.25},
    {   nombre: "Bebida pequena",
        precio: 1.00},
    {   nombre: "Cafe",
        precio: 0.50},
    {   nombre: "Postre",
        precio: 1.25}
]

function get_selected_combo(){
    for(let i = 0; i < combos.length; i++){
        if(combos[i].checked == true){
            return i
        }
        continue
    }
}

function get_selected_poducts_indexes(){
    let aux = [];
    for(let i = 0; i < checkbox.length; i++){
        if(checkbox[i].checked == true){
            aux.push(i)
        }
        continue
    }
    return aux
}

function get_total(comboIndex, productsIndexes){
    let precioMenu = parseFloat(menus[comboIndex].precio)
    let precioProductos = productsIndexes.reduce((prev, ind)=>{
        return prev = parseFloat(prev) + parseFloat(productos[ind].precio)
    }, 0)
    return precioMenu + precioProductos
}

function change_div_text(){
    comDiv.classList.toggle('hidden')
    comInp.classList.toggle('hidden')
    if(typing){
        comDiv.innerHTML = comInp.value
    }else{
        comInp.focus()
    }
    typing = !typing
}

function actualize_active_combo(){
    combos.forEach(combo=>{
        if(combo.checked){
            combo.parentNode.classList.add('active')
        }else{
            combo.parentNode.classList.remove('active')
        }
    })
}

function actualize_active_checkbox(){
    checkbox.forEach(checkbox=>{
        if(checkbox.checked){
            checkbox.parentNode.classList.add('active-product')
        }else{
            checkbox.parentNode.classList.remove('active-product')
        }
    })
}

function show_total(toShow){
    total.value = formater.format(toShow)
}

function create_receipt(pedido){
    let temp = recibo.content.cloneNode(true)
    let date = temp.querySelector('.recipt-date')
    let productTarget = temp.querySelector('.productos-recibo')
    let totalTarget = temp.querySelector('.total-recibo').querySelector('.td')


    let elapsed = Date.now()
    let today = new Date(elapsed)
    let dateText = document.createTextNode(today.toLocaleDateString())
    date.appendChild(dateText)


    for(let i = 0; i < pedido.productos.length; i++){
        let div = document.createElement('div')
        div.classList.add('td')
        
        let h3 = document.createElement('h3')
        let h4 = document.createElement('h4')
        let h3Text = document.createTextNode(pedido.productos[i].nombre)
        let h4Text = document.createTextNode(formater.format(pedido.productos[i].precio))
        h3.appendChild(h3Text)
        h4.appendChild(h4Text)

        div.appendChild(h3)
        div.appendChild(h4)

        productTarget.appendChild(div)
    }

    let totalH4 = document.createElement('h4')
    let totalText = document.createTextNode( formater.format(pedido.getTotal()) )
    totalH4.appendChild(totalText)
    totalTarget.appendChild(totalH4)

    return temp
}

// Listeners

window.addEventListener('load', (e)=>{
    actualize_active_combo()
    actualize_active_checkbox()

    let iCombo = get_selected_combo()
    let iProducts = get_selected_poducts_indexes()
    let total = get_total(iCombo, iProducts)
    show_total(total)
})

window.onkeydown = (e)=>{
    if(e.code == "KeyE" && (e.ctrlKey || e.metaKey)){
        change_div_text()
        return false
    }
    if(e.code == "KeyS" && (e.ctrlKey || e.metaKey)){
        if(typing){
            change_div_text()
        }
        return false
    }
}

comDiv.addEventListener('click', (e)=>{
    change_div_text()
})

combos.forEach(element=>{
    let combo = element.parentNode
    combo.addEventListener('click', (e)=>{
        let aux = combo.querySelector('input')
        if(!aux.checked){
            aux.checked = !aux.checked
            actualize_active_combo()
        }

        let iCombo = get_selected_combo()
        let iProducts = get_selected_poducts_indexes()
        let total = get_total(iCombo, iProducts)
        show_total(total)
    })
})

checkbox.forEach(element=>{
    let chbox = element.parentNode
    chbox.addEventListener('click', (e)=>{
        let aux = chbox.querySelector('input')
        aux.checked = !aux.checked
        actualize_active_checkbox()

        let iCombo = get_selected_combo()
        let iProducts = get_selected_poducts_indexes()
        let total = get_total(iCombo, iProducts)
        show_total(total)
    })
})

enviar.addEventListener('click', (e)=>{
    let selectedProducts = get_selected_poducts_indexes()
    let selectedMenu = get_selected_combo()
    let pCombo = menus[selectedMenu]
    let aux = selectedProducts.map(index => {
        return productos[index]
    });
    aux.unshift(pCombo)
    let pedido = new Pedido(aux)

    overlay.classList.toggle('hidden')
    let nuevoRecibo = create_receipt(pedido)
    overlay.innerHTML = ""
    overlay.appendChild(nuevoRecibo)
})

overlay.addEventListener('click', (e)=>{
    overlay.classList.toggle('hidden')
})

