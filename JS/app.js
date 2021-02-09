//// -- Constantes Generales -- /////

const apiKey = "belgiisAXgPUDQ2K7pJUmjTv3oszUDOz";
const giphyMediaUrl = "https://media1.giphy.com/media/";
const urlTren = "https://api.giphy.com/v1/gifs/trending?api_key=";
const urlRandom = "https://api.giphy.com/v1/gifs/random?api_key=";
const urlSearch = "https://api.giphy.com/v1/gifs/search?q=";


/* -- Constantes getElementByID --*/

const theme = document.getElementById("theme");
const searchbar = document.getElementById("searchbar");
const searchlist = document.getElementById("searchlist");
const cont_src_gifs = document.getElementById("cont_src_gifs");
const sugID = document.getElementById("sugerencias");
const menu_temas = document.getElementById("menu_temas");
const tema_1 = document.getElementById("tema_1");
const tema_2 = document.getElementById("tema_2");
const temaGifOS_SS = localStorage.getItem('TemaGifOS');
const logogifos = document.getElementById("logogifos");

//--------------->    Función para cambiar temas  <-------------//

window.onload = validarTema();

function temaSailorDay(){
    theme.setAttribute("href","css/tema_1.css");
    localStorage.removeItem("TemaGifOS");
    localStorage.setItem('TemaGifOS', 'Sailor Day');
    menu_temas.style.display = "none";
  }

function  temaSailorNight(){
  theme.setAttribute("href","css/tema_2.css");
  localStorage.removeItem("TemaGifOS");
  localStorage.setItem('TemaGifOS', 'Sailor Night');
  menu_temas.style.display = "none";
}

function validarTema(){
    if(temaGifOS_SS == "Sailor Day"){
      temaSailorDay()
    } else{
      temaSailorNight();
    }
}

function mostrarTemas() {
  let menu_temas = document.getElementById("menu_temas");

  if (menu_temas.style.display === "none") {
    menu_temas.style.display = "flex";
  } else {
    menu_temas.style.display = "none";
  }
}

//////////////////////   Función Tema fin     ///////////////////




////////////////////// -- Sección buscar gifos -- //////////////////////

//** -  Muestra / Oculta la lista de sugerencias y activa botón - **//


function showSearchList() {
  let botonbuscar = document.getElementById("btn-buscar");
  if (searchbar.value == 0) {
    searchlist.style.display = "none";
    botonbuscar.classList.remove("btn-activo");
  } else {
    searchlist.style.display = "flex";
    botonbuscar.classList.add("btn-activo");
   }
}


function getEventTarget(e) {
  e = e || window.event;
  return e.target || e.srcElement; 
}

searchlist.onclick = function(event) {
  var target = getEventTarget(event);
  searchbar.value = (target.innerHTML);
  searchlist.style.display = "none";
  gifkeyword();
};


//** -  Tecla enter acciona busqueda - **//

function enterkey(e) {
  if (e.keyCode == 13) {
    gifkeyword();
  }
  return;
}

//** - Función para buscar gifs - **//

function gifkeyword() {
  searchlist.style.display = "none";
   let contenedorTags = document.getElementById("cont_tags_gifs");

  contenedorTags.innerHTML = "";
  cont_src_gifs.innerHTML = "";

  var element = !!document.getElementById("resultadotitulo");
  if (element) {
    document.getElementById("resultadotitulo").remove();
  }

  if (searchbar.value === "") {
    alert("Ingrese un valor en el campo de búsqueda.");
  } else {
    gifResult(searchbar.value);
  }
}

let gifResult = async search => {
  const found = await fetch(
    `${urlSearch}${search}&api_key=${apiKey}&limit=36`
  );
  const jsoned = await found.json();

  if (jsoned.data.length == 0) {
    let resultado = `No se encontraron resultados para ${search}.`;
    let resultadoTitulo = document.createElement("h2");
    resultadoTitulo.innerHTML = resultado;
    resultadoTitulo.setAttribute("id", "resultadotitulo");
    resultadoTitulo.setAttribute("class", "resultadotitulo");
    cont_src_gifs.appendChild(resultadoTitulo);
  } else {
    let resultado = `Resultados para ${search}.`;
    let cont_src_gifs = document.getElementById("cont_src_gifs");
    let resultadoTitulo = document.createElement("h2");
    resultadoTitulo.innerHTML = resultado;
    resultadoTitulo.setAttribute("id", "resultadotitulo");
    cont_src_gifs.insertAdjacentElement("beforeBegin", resultadoTitulo);

    for (i of jsoned.data) {
      let gifTitulo = i.title,
        gifShortURL = i.bitly_url,
        gifID = i.id;

      if (gifTitulo != "") {
        gifTitulo = i.title;
      } else {
        gifTitulo = "Animated Gif";
      }

      // variables para la creación de los resultados de la busqueda
      const gifAnchor = document.createElement("a");
      const resultGifImg = document.createElement("img");
      const resultGifTitle = document.createElement("p");

      gifAnchor.href = gifShortURL;
      gifAnchor.target = "_blank";

      resultGifTitle.innerHTML = "#" + gifTitulo;
      resultGifTitle.classList.add("resulttitle");

      resultGifImg.src = `${giphyMediaUrl}${gifID}/giphy.gif`;
      resultGifImg.alt = gifTitulo;
      resultGifImg.classList.add("resultimg");

      cont_src_gifs.appendChild(gifAnchor);
      gifAnchor.appendChild(resultGifTitle);
      gifAnchor.appendChild(resultGifImg);

      // Variables para crear los botones de tags
      let tagBtnAnchor = document.createElement("a");
      let tagBtn = document.createElement("button");

      cont_tags_gifs.appendChild(tagBtnAnchor);

      tagBtnAnchor.appendChild(tagBtn);
      tagBtnAnchor.href = gifShortURL;
      tagBtnAnchor.target = "_blank";

      tagBtn.innerHTML = gifTitulo;
      tagBtn.className = "btn_tag";
    }
  }
};

//////////////////////  -- Bloque Sugerencias --- ////////////////////// 


// - Función para eliminar gif seleccionado - //

function changeGif() {
    for (let i = 0; i <= sugID.children.length - 1; i++) {
    sugID.children[i].addEventListener("click", function() {
      this.parentNode.removeChild(this);
    });
  }
  randomGif();
}

// - Crea un bloque de 4 gifs random - //

for (i = 1; i <= 4; i++) {
  function randomGif() {
    fetch(`${urlRandom}${apiKey}`)
      .then(response => response.json())
      .then(json => {
        json.data;
        let randomUrl = json.data.bitly_url;
        let randomTitle = json.data.title;
        let randomID = json.data.id;

        if (randomTitle == "" || randomTitle == " " ) {
          randomTitle = "Animated Gif";
        }

        let divpadre = document.createElement("div");
        divpadre.id = "sugestion_div";
        divpadre.className = "sugestion_div";
        let conRandom = document.createElement("a");
        conRandom.href = randomUrl;
        conRandom.target = "_blank";

        let newDivEncaRandom = document.createElement("div");
        let newRandomTitle = document.createElement("p");
        newRandomTitle.innerHTML = "#" + randomTitle;

        let closeButton = document.createElement("img");
        closeButton.src = "assets/button_close.svg";
        closeButton.alt = "Boton Cerrar";
        closeButton.onclick = function() {
          changeGif();
        };

        let newRandomImg = document.createElement("img");
        newRandomImg.src = `${giphyMediaUrl}${randomID}/giphy.gif`;
        newRandomImg.alt = randomTitle;
        newRandomImg.classList.add("sugestion_img");

        let BtnVerMas = document.createElement("button");
        BtnVerMas.classList.add("btn_ver_mas");
        BtnVerMas.innerHTML = "Ver más...";

        sugID.appendChild(divpadre);
        divpadre.appendChild(newDivEncaRandom);
        newDivEncaRandom.appendChild(newRandomTitle);
        newDivEncaRandom.appendChild(closeButton);
        divpadre.appendChild(conRandom);
        conRandom.appendChild(newRandomImg);
        conRandom.appendChild(BtnVerMas);
      });
  }
  randomGif();
}

//////////////////////  ---  Fetch Trendings --- //////////////////////  

function trendingsGif() {
  fetch(`${urlTren}${apiKey}&limit=56`)
    .then(response => response.json())
    .then(trendingjson => {
      trendingjson.data;

      console.log(trendingjson.data);

      for (each of trendingjson.data) {
        let gifID = each.id;
        let gifTitle = each.title;
        let gifTrenURL = each.bitly_gif_url;

        let gifTitleNumeral = gifTitle.replace(/ /g, " #");
        let gifTendencia = document.createElement("img");
        gifTendencia.src = `${giphyMediaUrl}${gifID}/giphy.gif`;
        gifTendencia.alt = gifTitle;
        gifTendencia.classList.add("trendingimg");

        const gifTendenciaAnchor = document.createElement("a");
        gifTendenciaAnchor.href = gifTrenURL;
        gifTendenciaAnchor.target = "_blank";

        let block_tendencia = document.getElementById("block_tendencias");
        let gifTendenciaTitle = document.createElement("p");
        gifTendenciaTitle.innerHTML = "#" + gifTitleNumeral;
        gifTendenciaTitle.classList.add("trendingtitle");

        block_tendencia.appendChild(gifTendenciaAnchor);
        gifTendenciaAnchor.appendChild(gifTendencia);
        gifTendenciaAnchor.appendChild(gifTendenciaTitle);
      }
    });
}

trendingsGif();


document.getElementById("creargif").addEventListener("click", () => {
  localStorage.setItem('crearguifos', 'true');
  window.location.href = ("mis_gifos.html");  
 })



function misgifos(){
  window.location.href = ("mis_gifos.html");
  localStorage.removeItem("crearguifos");
}