
class Producto {

    constructor(sku,titulo,precio,cantidad = 0) {
        this.sku = sku
        this.titulo = titulo
        this.precio = precio
        this.cantidad = cantidad
    }

    getSku() {
        return this.sku
    }

    getTitulo() {
        return this.titulo
    }

    getPrecio() {
        return this.precio
    }

    getCantidad() {
        return this.cantidad
    }

    setCantidad(cantidad) {
        this.cantidad = cantidad
    }

}

class Carrito {

    constructor(productos) {
        this.productos = productos
        this.total = 0
        this.cantidadDeProductos = this.productos.length
    }

    mostrarProductos() {
        return this.productos
    }

    getNProducto(index) {
        return this.productos[index]
    }

    actualizarTotal() {

        let acc = 0
        for (let i in this.productos) {
            acc += parseFloat(this.productos[i].getPrecio()*this.productos[i].getCantidad())
        }

        this.total = acc
    }

    actualizarUnidades(indiceProducto,nuevaCant) {
        this.productos[indiceProducto].setCantidad(nuevaCant)
        this.actualizarTotal()
    }
}

const url1 = 'https://jsonblob.com/api/1189916901769076736'
const url2 = 'https://jsonblob.com/api/1190568631385055232'
fetch(url2)
    .then(response => response.json())
    .then(data => {
    

        const listaProductosRAW = data["products"]
        const listaProductos = crearListaDeProductos(listaProductosRAW)
        let carrito = new Carrito(listaProductos)
        
        crearRowsyData(carrito.cantidadDeProductos,4)
        cargarCarritoEnTabla(carrito)

    })
    
function crearListaDeProductos(listaRAW) {

    let sku, title, precio, producto;
    const listaProductos = []
    for ( let indiceProducto=0; indiceProducto < listaRAW.length; indiceProducto++ ) {

        sku = listaRAW[indiceProducto]["SKU"]
        title = listaRAW[indiceProducto]["title"]
        precio = listaRAW[indiceProducto]["price"]

        producto = new Producto(sku,title,precio)
        listaProductos.push(producto)
    }

    return listaProductos
}

function crearRowsyData(nRows,nDatas) {

    const tBody = document.getElementById("tBody")
    for (let i = 1; i <= nRows; i++) {

        let tRow = document.createElement("tr")
        tRow.id = "tableRow" + i
        tBody.appendChild(tRow)

        for (let j=1; j<= nDatas; j++) {
            let tData = document.createElement("td")
            tData.id = "td" + i + j
            tRow.appendChild(tData)
        }
    }
}


function cargarData(text,i,j) {

    let tableData = document.getElementById("td" + i + j)
    tableData.innerText = text
    
}

function crearInput() {

}

function cargarCarritoEnTabla(carrito) {
    
    for (let col=1; col <= 4; col++) {
        for (let row=1; row <= carrito.cantidadDeProductos; row++) {
            let tData = document.getElementById("td"+ row + col)

            if (col == 1) {
                tData.innerText = carrito.getNProducto(row-1).getTitulo()
                tData.appendChild(document.createElement("br"))
                let prodRef = document.createElement("div")
                prodRef.className = "ref"
                prodRef.innerText = "Ref: " + carrito.getNProducto(row-1).getSku()
                tData.appendChild(prodRef)

            } else if (col == 2) {

                let btnLess = document.createElement("button")
                btnLess.id = "btnLess" + row
                btnLess.className = "btn-pretty"
                btnLess.textContent = "-"
                tData.appendChild(btnLess)

                let inputCant = document.createElement("input")
                inputCant.type = "text"
                inputCant.id = "input" + row
                inputCant.className = "pretty-input"
                inputCant.value = 0
                tData.appendChild(inputCant)

                let btnMore = document.createElement("button")
                btnMore.id = "btnMore" + row
                btnMore.className = "btn-pretty"
                btnMore.textContent = "+"
                btnMore.onclick = function() {

                    let nBtn = this.id.charAt(7)
                    document.getElementById("input"+ nBtn).value = parseInt(document.getElementById("input"+nBtn).value) + 1
                    let nuevoValor = parseInt(document.getElementById("input"+ nBtn).value)
                    carrito.actualizarUnidades(row-1,nuevoValor)
                    let precioTotal = parseFloat (carrito.getNProducto(row-1).getPrecio() * carrito.getNProducto(row-1).getCantidad())
                    document.getElementById("td"+ row +"4").innerText = precioTotal.toFixed(2)
                    document.getElementById("total-number").innerText = carrito.total.toFixed(2)

                }
                tData.appendChild(btnMore)

                btnLess.onclick = function() {

                    let nBtn = this.id.charAt(7)
                    document.getElementById("input"+ nBtn).value = parseInt(document.getElementById("input"+nBtn).value) - 1
                    let nuevoValor = parseInt(document.getElementById("input"+ nBtn).value)
                    carrito.actualizarUnidades(row-1,nuevoValor)
                    let precioTotal = parseFloat (carrito.getNProducto(row-1).getPrecio() * carrito.getNProducto(row-1).getCantidad())
                    document.getElementById("td"+ row +"4").innerText = precioTotal.toFixed(2)
                    document.getElementById("total-number").innerText = carrito.total.toFixed(2)

                }

            } else if (col == 3) {
                tData.innerText = carrito.getNProducto(row-1).getPrecio()
            } else if (col == 4) {
                tData.innerText = carrito.getNProducto(row-1).getPrecio() * carrito.getNProducto(row-1).getCantidad()
            }

        }
    }
}





