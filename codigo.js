const url = "https://retoolapi.dev/7mz0Tz/productos";
var fila =
  "<tr><td class='id'></td><td class='foto'></td><td class='price'></td><td class='title'></td><td class='description'></td><td class='category'></td><td class='action'></td></tr>";
var productos = null;
function codigoCat(catstr) {
  var code = "null";
  switch (catstr) {
    case "electronicos":
      code = "c1";
      break;
    case "joyeria":
      code = "c2";
      break;
    case "caballeros":
      code = "c3";
      break;
    case "damas":
      code = "c4";
      break;
  }
  return code;
}
var orden = 0;

function listarProductos(productos) {
  var precio = document.getElementById("price");
  precio.setAttribute("onclick", "orden*=-1;listarProductos(productos);");
  var num = productos.length;
  var listado = document.getElementById("listado");
  var ids, titles, prices, descriptions, categories, fotos, action;
  var tbody = document.getElementById("tbody"),
    nfila = 0;
  tbody.innerHTML = "";
  var catcode;
  for (i = 0; i < num; i++) tbody.innerHTML += fila;
  var tr;
  ids = document.getElementsByClassName("id");
  titles = document.getElementsByClassName("title");
  descriptions = document.getElementsByClassName("description");
  categories = document.getElementsByClassName("category");
  fotos = document.getElementsByClassName("foto");
  prices = document.getElementsByClassName("price");
  action = document.getElementsByClassName("action");
  if (orden === 0) {
    orden = -1;
    precio.innerHTML = "Precio";
  } else if (orden == 1) {
    ordenarAsc(productos, "price");
    precio.innerHTML = "Precio A";
    precio.style.color = "#5e81ac";
  } else if (orden == -1) {
    ordenarDesc(productos, "price");
    precio.innerHTML = "Precio D";
    precio.style.color = "#bf616a";
  }
  var prueba;
  listado.style.display = "block";
  for (nfila = 0; nfila < num; nfila++) {
    ids[nfila].innerHTML = productos[nfila].id;
    titles[nfila].innerHTML = productos[nfila].title;

    descriptions[nfila].innerHTML = productos[nfila].description;
    categories[nfila].innerHTML = productos[nfila].category;
    catcode = codigoCat(productos[nfila].category);
    tr = categories[nfila].parentElement;
    tr.setAttribute("class", catcode);
    prices[nfila].innerHTML = "$" + productos[nfila].price;
    fotos[nfila].innerHTML = "<img src='" + productos[nfila].image + "'>";
    fotos[nfila].firstChild.setAttribute(
      "onclick",
      "window.open('" + productos[nfila].image + "');"
    );
    action[nfila].innerHTML = "<button class='eliminar'>Eliminar</button>";
    action[nfila].firstChild.setAttribute(
      "onclick",
      "deleteProduct(" + productos[nfila].id + ");"
    );
  }
}

function obtenerProductos() {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      productos = data;
      productos.forEach((producto) => {
        producto.price = parseFloat(producto.price);
      });
      listarProductos(data);
    });
}

function ordenarDesc(p_array_json, p_key) {
  p_array_json.sort(function (a, b) {
    if (a[p_key] > b[p_key]) return -1;
    if (a[p_key] < b[p_key]) return 1;
    return 0;
  });
}

function ordenarAsc(p_array_json, p_key) {
  p_array_json.sort(function (a, b) {
    if (a[p_key] > b[p_key]) return 1;
    if (a[p_key] < b[p_key]) return -1;
    return 0;
  });
}
function addProduct() {
  var product = null;
  regexPrice = /^\d+(.\d{1,2})?$/;
  let foto = document.getElementsByName("foto")[0].value;
  let precio = document.getElementsByName("precio")[0].value;
  let titulo = document.getElementsByName("titulo")[0].value;
  let description = document.getElementsByName("description")[0].value;
  let opcion = document.getElementsByName("categorias")[0];
  let seleccion = "";
  let error = document.getElementsByClassName("error")[0];
  if (opcion.options[opcion.selectedIndex].value == "null") {
    alert("DEBE DE SELECCIONAR UNA CATEGORIA");
  } else {
    if (!regexPrice.test(precio)) {
      error.style.display = "block";
      error.innerHTML = `<p>El valor: ${precio} no es valido</p>`;
    } else {
      if (foto == "" || titulo == "" || description == "") {
        alert("No puede haber campos vacios");
      } else {
        error.style.display = "none";
        seleccion = opcion.options[opcion.selectedIndex].text;

        product = {
          image: foto,
          price: precio,
          title: titulo,
          category: seleccion,
          description: description,
        };
        fetch(url, {
          method: "POST",
          body: JSON.stringify(product),
          headers: {
            Accept: "application/json;",
            "Content-Type": "application/json;charset=UTF-8",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            productos = data;
            obtenerProductos();
            alert("Se agrego exitosamente el producto ");
          });
      }
    }
  }
}
function deleteProduct(id) {
  fetch(url + "/" + id, {
    method: "DELETE",
  })
    .then((response) => response.json)
    .then((data) => {
      productos = data;
    })
    .catch((e) => {
      alert("Ups... ocurrio un error de tipo: " + e);
    });

  alert("Se ha borrado exitosamente el producto ");
  obtenerProductos();
}
