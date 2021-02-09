//// -- Constantes Generales -- /////

const apiKey = "belgiisAXgPUDQ2K7pJUmjTv3oszUDOz";
const giphyMediaUrl = "https://media1.giphy.com/media/";
const apiBaseUrl = "https://api.giphy.com/v1/gifs/";
const uploadUrl = "https://upload.giphy.com/v1/gifs?api_key=";

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
const crearGifOs_SS = localStorage.getItem('crearguifos');
const contCrearGifos = document.getElementById("cont_crear_gifos");
const logogifos = document.getElementById("logogifos");


/* -- Constantes para crear/subir gif a giphy -- */
const start = document.getElementById("start");
const video = document.querySelector("video");
const record = document.getElementById("record");
const stop = document.getElementById("stop");
const restart = document.getElementById("restart");
const upload = document.getElementById("upload");
const preview = document.getElementById("preview");
const progressBar = document.getElementsByClassName("progress-bar-item");
const uploadMessage = document.getElementById("upload-msg");
const download = document.getElementById("download");
const copy = document.getElementById("copy");
const nav = document.getElementById("nav");
const main = document.getElementById("main");
const dropdown = document.getElementById("dropdown");
const light = document.getElementById("light");
const dark = document.getElementById("dark");
const relojGif = document.getElementById("timer");


let recorder;
let recording = false;


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

//---> Funcion para validar el acceso a crear gifos y mis gifos <---//

window.onload = validarMisGifos();

function validarMisGifos(){
  if(crearGifOs_SS == "true"){
    document.getElementById('upload-intro-cont').classList.remove("hidden");
  }else{
    document.getElementById('upload-intro-cont').classList.add("hidden");
  }
}

document.getElementById("creargif").addEventListener("click", () => {
  document.getElementById('upload-intro-cont').classList.remove("hidden");
  localStorage.setItem('crearguifos', 'true');
 })

 document.getElementById("misgifos").addEventListener("click", () => {
  document.getElementById('upload-intro-cont').classList.add("hidden");
  localStorage.remove('crearguifos');
 })



//--------------->    Funciónes para sección crear GIFOS  <-------------//

function getStreamAndRecord(){
  navigator.mediaDevices.getUserMedia({
    audio: false,
    video:{
      height: {max: 480}
    }
  })
  .then(function(stream){
    video.srcObject = stream;
    video.play()

    record.addEventListener('click', () =>{
      recording = !recording
      record.classList.add("btn-active");
      document.getElementById('stop').classList.add("btn-active");
      document.getElementById('camera-button').src = 'assets/recording.svg'
      
      if(recording === true){
        this.disabled = true;
        recorder = RecordRTC(stream,
          {
            type: "gif",
            frameRate: 1,
            quality: 10,
            width: 360,
            hidden: 240,
            onGifRecordingStarted: function(){
              console.log("started");
            },
          });
          //grabando
          recorder.startRecording();
          //obtener Tiempo de grabado
          getDuration();

          record.classList.add("button-recording");
          record.innerHTML = "listo";
          stop.classList.add("button-recording");

          //finalizar grabación
          recorder.camera = stream;
      }else{
        this.disabled = true;
        recorder.stopRecording(stopRecordingCallback);
        recording = false;
      }
    });
  });
}



function stopRecordingCallback() {
  recorder.camera.stop();
  let form = new FormData();
  form.append("file", recorder.getBlob(), "test.gif");
    upload.addEventListener("click", () => {
    uploadMessage.classList.remove("hidden");
    preview.classList.add("hidden");
    restart.classList.add("hidden");
    upload.classList.add("hidden");
    
    uploadGif(form);
  })
  
  objectURL = URL.createObjectURL(recorder.getBlob());
  preview.src = objectURL;

   //Vista previa de la grabación
  preview.classList.remove("hidden");
  animateProgressBar(progressBar);
  video.classList.add("hidden");
  document.getElementById("video-record-buttons").classList.add("hidden");
  document.getElementById("video-upload-buttons").classList.remove("hidden");

recorder.destroy();
recorder = null;
}
start.addEventListener("click", () =>{
  document.getElementById('pre-upload-text').classList.add("hidden");
  document.getElementById("pre-upload-video").classList.remove("hidden");
  getStreamAndRecord()
});
restart.addEventListener("click", ()=>{
  location.reload();
  getStreamAndRecord();
})



function getDuration(){
  let seconds = 0;
  let minutes = 0;
  let timer = setInterval(() => {
    if(recording){
      if(seconds < 60){
        if(seconds <= 9 ){
          seconds = "0" + seconds;
        }
        relojGif.classList.add("relojgif");
        relojGif.innerHTML=`00:00:0${minutes}:${seconds}`;
        seconds++;
      }else{
        minutes++;
        seconds = 0;
      }
    }
    else{
    clearInterval(timer)
    }
  }, 1000);
}



// -- Barra de progreso --//
let counter = 0;
function animateProgressBar(bar){
setInterval(() => {
  if(counter < bar.length){
    bar.item(counter).classList.toggle("progress-bar-item-active");
    counter++;
  }else{
    counter = 0;
  }
}, 200)
}


function uploadGif(gif){
  document.getElementById("timer").classList.add("hidden");
  document.getElementById("icono-foward").classList.add("hidden");
  document.getElementById("upload-msg").style.position = "relative";
  document.getElementById("progress-bar").style.position = "top=0; left=0";
  document.getElementById("progress-bar").style.position = "absolute";
  document.getElementById("progress-bar").style.width = "324px";
  document.getElementById("progress-bar").style.transform = "translate(65% , -600%)";
  document.getElementById("progress-bar").classList.add("transladar");
  
  fetch(`${uploadUrl}${apiKey}`,{
    method: 'POST', //or 'PUT'
    body: gif,
  })

  .then(res => {
    if(res.status != 200 ){
      uploadMessage.innerHTML = '<h3>Hubo un error subiendo tu Guifo</h3>';
    }
    return (res.json());
  })

  .then(data => {
        const gifID = data.data.id;
        uploadMessage.classList.add("hidden");
        document.getElementById("share-modal-wrapper").classList.remove("hidden");
        document.getElementById("video-upload-buttons").classList.add("hidden");
        document.getElementById("upload-intro-cont").classList.add("hidden");
        
        getGifDetails(gifID);
  })

  .catch(error =>{
    uploadMessage.innerHTML = '<h3>Hubo un error subiendo tu Guifo</h3>';
  });
}



function getGifDetails(id){
  fetch(`${apiBaseUrl}${id}?api_key=${apiKey}`)
  .then(response => response.json()
  .then(data => {
    const gifUrl = data.data.url
    
    localStorage.setItem("gif" + data.data.id, JSON.stringify(data));

   //seteamos el dom para mostrar nuestro modal de success//
    document.getElementById("share-modal-preview").src = data.data.images.fixed_height.url;
    const copyModal = document.getElementById("copy-success");
    preview.classList.remove("hidden");

    download.href = gifUrl;

    // parte de los botones

    //-Copiar-//
      copy.addEventListener("click", async () => {
      await navigator.clipboard.writeText(gifUrl);
      copyModal.innerHTML = "Link Copiado con éxito!";
      copyModal.classList.remove("hidden");
      setTimeout(() => {copyModal.classList.add("hidden") }, 1500);
      })

    //-Descargar-//
      document.getElementById("download").addEventListener("mouseover", async () => {
        copyModal.innerHTML = "Descarga desde Giphy!";
        copyModal.classList.remove("hidden");
        setTimeout(() => {copyModal.classList.add("hidden") }, 1000);
      })
    
      document.getElementById("finish").addEventListener("click", () => {
      location.reload();
      })

      })
      .catch((error) => {
       return error;
       })
  )
};



function getMyGifs(){
  let items = [];
  for(var i = 0; i < localStorage.length; i++){
    const item = localStorage.getItem(localStorage.key(i))
  if(item.includes("data")){
    itemJson = JSON.parse(item)
    items.push(itemJson.data.images.fixed_height.url)
  }
}
return items
}


window.addEventListener("load", () => {
  const localGifs = getMyGifs();

  localGifs.forEach(item => {
    const img = document.createElement("img");
    img.src = item;
    img.classList.add("results-thumb");
    document.getElementById("results").appendChild(img);
  })
})

getMyGifs()

document.getElementById("share-done").addEventListener("click", () => {
  location.reload();
})










