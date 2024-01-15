class Carrito {
    constructor(productos) {
        this.productos = productos

    }

    aumentarUnidades(indice) {
      // Actualiza el número de unidades que se quieren comprar de un producto
      this.productos[indice]["quantity"] += 1
    }

    disminuirUnidades(indice){
      // Disminuye las unidades del carrito
      this.productos[indice]["quantity"] -= 1    
    }

    get_cantidad_productos(){
      // Devuelve una lista con la cantidad de productos
      let cantidad = []
      for (let i=0; i <= 2; i++){
        cantidad.push((this.productos)[i]['quantity'])
        
      }
      return cantidad
      
    }
    getProductos(indice) {
      // Devuelve los datos de un producto además de las unidades seleccionadas
      // Por ejemplo
      // {
      //   "sku": "0K3QOSOV4V",
      //   "quantity": 3
      // } 
      return this.productos[indice] 
    }
    
    getPrecioTotal(indice){
      // Devuelve el precio total de un producto por la cantidad de unidades del mismo
      // Type = Number

      return (this.productos[indice]['quantity'])*(this.productos[indice]['price']) 
    }

    obtenerCarrito() {
      // Devuelve información de los productos añadidos al carrito
      // Además del total calculado de todos los productos
      // Por ejemplo:
      // {
      //   "total": "5820",
      //   "currency: "€",
      //   "products" : [
      //     {
      //       "sku": "0K3QOSOV4V"
      //       ..
      //     }
      //    ]} 
      // }
      let total = 0;  // Inicializa el total fuera del bucle
      for (let i = 0; i < 3; i++) {
        total += this.getPrecioTotal(i);  // Acumula el total en cada iteración
      }

      this.productos['total'] = total
      return this.productos
    }
  }

const api_url ="https://jsonblob.com/api/1190065610796425216"
const api_url2 = "http://jsonblob.com/api/1190486976624451584"

async function obtener_info_api(api_url) {

    // Guardo la informacion en la respuesta de la api
    const response = await fetch(api_url);
   
    // Guardamos la informacion en formato JSON
    var data = await response.json();
    return data;
}


async function obtener_info_productos(data){
  let informacion = await data
  let productos = informacion['products'] // productos es un objeto

  for (indice in productos) {
    productos[indice].quantity = 0
  }
  
  // console.log(productos)
  return productos
}

function boton_restar(carrito,id){
  let input_id = document.getElementById("input_id"+id)
  if (parseInt(input_id.value) > 0) {
    input_id.value = parseInt(input_id.value) - 1;
  }
  carrito.disminuirUnidades(id)
  cargar_columna(carrito, id)
  cargar_total_carrito(carrito)
}

function boton_sumar(carrito,id){
  let input_id = document.getElementById("input_id"+id)
  input_id.value = parseInt(input_id.value) + 1
  carrito.aumentarUnidades(id)
  cargar_columna(carrito, id)
  cargar_total_carrito(carrito)
}

function crear_tabla(fila,columna){
  let tbody = document.getElementById("tbody")
  for (let i=0; i < fila;i++){
    var tr = document.createElement("tr")
    
    tr.id = 'tr'+i
    tbody.appendChild(tr)

    for (let j=0; j< columna; j++){
      var td = document.createElement("td")
      td.id = 'td'+i+j
      tr.appendChild(td) 
    }
  }
}


function cargar_columna(carrito,fila){
  let producto = carrito.getProductos(fila)
  let precioTotal = carrito.getPrecioTotal(fila);
  let cantidad = producto['quantity']


  for (let i = 0; i < 4; i++) {
    let td = document.getElementById('td' + fila + i);
    td.innerText = i === 0 ? producto['title'] : 
                   i === 1 ? "" : 
                   i === 2 ? producto['price']:
                   precioTotal.toFixed(2)+"€";

    if (i==0){
      var espacio = document.createElement("br")
      var ref = document.createElement("span")
      ref.innerText = "ref:"+ " "+ producto['SKU']
      td.appendChild(espacio)
      td.appendChild(ref)
    }
    if (i==1){
      var boton_izquierdo = document.createElement("button")
      boton_izquierdo.id = fila
      boton_izquierdo.innerText = "-"
      boton_izquierdo.onclick = function(){
        boton_restar(carrito,fila)
      }
      td.appendChild(boton_izquierdo)

      var input = document.createElement("input")
      input.id = "input_id"+fila
      input.type = "number"
      input.value = cantidad

      td.appendChild(input)

      var boton_derecho = document.createElement("button")
      boton_derecho.id = fila
      boton_derecho.innerText = "+"
      boton_derecho.onclick = function(){
        boton_sumar(carrito,fila)
      };
      td.appendChild(boton_derecho)
      
    }
  }
}

async function cargar_tabla(carrito) {
  let cantidad_productos = carrito.get_cantidad_productos()
  for (let fila=0; fila < cantidad_productos.length; fila++ ){
    cargar_columna(carrito,fila)
  }
}

function cargar_tabla_totales(carrito){
  div_productos = document.getElementById("contenedor_productos")
  div_contenedor_precios = document.getElementById("contenedor_precios")
  productos = carrito.obtenerCarrito()

  for (let i=0; i < productos.length;i++){
    div_titulos_productos = document.createElement("div")
    p = document.createElement("p")
    p.id = "productos"+i

    precios = document.createElement("p")
    precios.id = "precios"+i
    div_productos.appendChild(p)
    div_contenedor_precios.appendChild(precios)
   
  }

  total = document.createElement("p")
  total.id = "total_carrito"
  div_contenedor_precios.appendChild(total)
}

function cargar_total_carrito(carrito){
  parrafo_productos = document.getElementById('productos')
  total = document.getElementById('precio_total')
  productos = carrito.obtenerCarrito()
  
  let precio_carrito = 0 
  for (let i=0; i< productos.length;i++){
    let precioTotal = carrito.getPrecioTotal(i);
    precio_carrito += carrito.getPrecioTotal(i)
    p = document.getElementById("productos"+i)
    precios = document.getElementById("precios"+i)
    p.innerText = productos[i]['title']
    precios.innerText = precioTotal.toFixed(2)+"€"

  }
  total.innerText = productos['total'].toFixed(2)+"€"
  console.log(carrito.obtenerCarrito())
}


async function iniciar() {
  const data = await obtener_info_api(api_url);
  const productos = await obtener_info_productos(data);
  const carrito = new Carrito(productos);

  crear_tabla(3, 4);
  cargar_tabla(carrito);
  cargar_tabla_totales(carrito);
  cargar_total_carrito(carrito);
}

iniciar();