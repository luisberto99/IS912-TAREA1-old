//********** INDEXEDDB **********/
const iDB = indexedDB;




if(iDB){
    let aplicaciones;
    let db;
    const request = iDB.open("appstore",1);

    request.onsuccess = (e) => {
        db = e.target.result;
        console.log('open',db);
        addData(); //AGREGA LOS DATOS AL INDEXEDDB
        redCategorias(); //LLENA EL SELECTCATEGORIAS
        readData(0); //LLENA EL GRID DE APP CON LA CATEGORIA 0 (PRIMERA SELECCIONADA)
    }

    request.onupgradeneeded = (e) =>{
        db = e.target.result; 
        console.log('create',db);
        const categorias = db.createObjectStore('categorias', {
            keyPath: 'nombreCategoria'
        });
    }

    request.onerror = (error) =>{
        console.error("Error", error.result)
    }


    //¨**** FUNCION QUE AGREGA LOS DATOS AL INDEXEDDB *****
    const addData = () =>{
        const trans = db.transaction(['categorias'],'readwrite');
        const objectStore = trans.objectStore('categorias');
        for (let i = 0; i < 5; i++) {
            const request = objectStore.add(categorias[i]);   
        }
    }
    //*****  FUNCION QUE LEE LOS DATOS DEL INDEXEDDB *****/
    const redCategorias = () => {
        const trans = db.transaction(['categorias'],'readonly');
        const objectStore = trans.objectStore('categorias');
        const request =objectStore.openCursor();
        
        // LIMIPA EL SELECTCATEGORIA
        document.getElementById("selectCategoria").innerHTML ="";
        let cont = 0
        // UTILIZA UN CURSOR QUE RECORRE LA INDEXEDDB PARA OBTENER EL NOMBRE DE LAS CATEGORIAS Y AGREGARLO AL SELECTCATEGORIA
        request.onsuccess = (e) => {
            cursor = e.target.result
            if (cursor) {
                document.getElementById("selectCategoria").innerHTML += `
                    <option value="${cont++}">${cursor.value.nombreCategoria}</option>
                `;
                cursor.continue(); //SIGUIENTE CATEGORIA
            }
        }
    }

    //*****  FUNCION QUE LEE LOS DATOS DEL INDEXEDDB *****/
    const readData = (n) =>{
        const trans = db.transaction(['categorias'],'readonly');
        const objectStore = trans.objectStore('categorias');

        const request = objectStore.get(`Categoria ${n}`);

        request.onsuccess = (e) => {
            llenarGrild(e.target.result);
        }
    }
//*****  FUNCION QUE LLENA LOS DATOS *****/
    const llenarGrild = (categoria) =>{
      aplicaciones = categoria.aplicaciones;

      document.getElementById("gridContainer").innerHTML=""; // BORRADO DE LAS CATEGORIAS ANTERIORES

      // RECORRE EL ARREGLO APLICACIONES Y CREA UNA CARD POR CADA ITEM DEL ARREGLO
      aplicaciones.forEach(element => {
          document.getElementById("selectCategoria")
          document.getElementById("gridContainer").innerHTML += `
          <div class="cardContainer" id="app${element.codigo}" onclick="modal(${element.codigo})" data-toggle="modal" data-target="#Modal">
              <div class="card">
                  <img src="${element.icono}" alt="">
                  <div class="cardInfo">
                      <strong class="cardAppTitle">${element.nombre}</strong><br>
                      <span class="cardAppDev">${element.desarrollador}</span><br>
                      <div id="stars" class="stars">
                        ${starts(element.calificacion)}
                      </div>
                      <br>
                      <strong>${precio(element.precio)}</strong>
                  </div>
              </div>
          </div>
          `;

          
          
      });
    }

    //*******      CUANDO HAY UN CAMBIO EN SELECTCATEGORIAS ********/
    //document.getElementById("selectCategoria");
    selectCategoria.onchange = () =>{
        readData(selectCategoria.value);
    }

    function precio(p) {
        if (p.substring(1) < 0.5) {
            return 'FREE';
        }else{
            return p;
        }
    }

   function starts(n, id){
        let r = "";
        for (let i = 0; i < 5; i++) {
            if (i < n) {
                r += `<i class="fas fa-star"></i>`;
            }
            else{
                r += `<i class="far fa-star"></i>`;
            }
        }
        return r;
   }
    //**********  OBTIENE EL DETALLE DE UNA APP DE LA CATEGORIA **********/
    function modal(n){
        aplicaciones.forEach(elemento => {
            if (elemento.codigo == n) {
                modalBody = document.getElementById("modal-body");
                modalBody.innerHTML = `
                <div class="modalCarousel">
                    <div id="carouselIndicators" class="carousel slide" data-ride="carousel">
                        <div class="carousel-inner">
                            <div class="carousel-item active">
                                <img src="${elemento.imagenes[0]}" class="d-block w-100" alt="...">
                            </div>
                            <div class="carousel-item">
                                <img src="${elemento.imagenes[1]}" class="d-block w-100" alt="...">
                            </div>
                            <div class="carousel-item">
                                <img src="${elemento.imagenes[2]}" class="d-block w-100" alt="...">
                            </div>
                            
                        </div>
                        <a class="carousel-control-prev" href="#carouselIndicators" role="button" data-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="sr-only">Previous</span>
                        </a>
                        <a class="carousel-control-next" href="#carouselIndicators" role="button" data-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="sr-only">Next</span>
                        </a>
                    </div>        
                </div>
                <div class="modalApp">
                    <div class="img">
                        <img src="${elemento.icono}" alt="">
                    </div>
                    <div class="modalAppInfo">
                        <strong class="modalAppTitle">${elemento.nombre}</strong><br>
                        <span class="modalAppDev">${elemento.desarrollador}</span><br>
                        <p class="modalAppDescription">
                           ${elemento.descripcion}
                        </p>
                        <strong class="modalAppPrice">${precio(elemento.precio)}</strong><br>
                    </div>
                </div>
                <div id="modalStars" class="modalStars">
                    ${starts(elemento.calificacion)}
                    <i>  ${elemento.calificacion}</i>
                </div>
                <div class="modalComments">
                    <div class="modalUserComent">
                        <div class="modalImgUserComent">
                            <img src="img/user.webp" alt="">
                        </div>
                        <div class="modalcoment">
                            <strong>${elemento.comentarios[0].usuario}</strong>
                            <p>${elemento.comentarios[0].comentario}</p>
                        </div>
                    </div>

                    <div class="modalUserComent">
                        <div class="modalImgUserComent">
                            <img src="img/user.webp" alt="">
                        </div>
                        <div class="modalcoment">
                            <strong>${elemento.comentarios[1].usuario}</strong>
                            <p>${elemento.comentarios[1].comentario}</p>
                        </div>
                    </div>

                    <div class="modalUserComent">
                        <div class="modalImgUserComent">
                            <img src="img/user.webp" alt="">
                        </div>
                        <div class="modalcoment">
                            <strong>${elemento.comentarios[2].usuario}</strong>
                            <p>${elemento.comentarios[2].comentario}</p>
                        </div>
                    </div>

                </div>
                `;

                if(elemento.calificacion < 3){
                    document.getElementById("modalStars").classList.add("starsRed");
                }

                if(elemento.instalada){
                    document.getElementById("btnInstall").hidden = true;
                }else{
                    document.getElementById("btnInstall").hidden = false;   
                }
            }
        });
    }

     //**********  AGREGA UNA NUEVA APLICACION ENLA CATEGORIA SELECCIONADA **********/
     function agregarApp() {
         var id = document.getElementById("idAppAdd");
         var nombre = document.getElementById("txtNombre");
         var dev = document.getElementById("txtDev");
         var descripcion = document.getElementById("txtDescripcion");
         var icon = document.getElementById("fileIcon");
         var screenshots = document.getElementById("fileScreenshots");
         var precio = document.getElementById("txtPrecio");

         let aplicacion ;
         const categoiraID = document.getElementById('selectCategoria').value;
         
        if(nombre.value != ""){
            if(dev.value != ""){
                if(descripcion.value != ""){
                    if(icon.value != ""){
                        if(screenshots.files.length >0){
                            if(precio.value != ""){
                                aplicacion = {
                                    codigo: id.value,
                                    nombre: nombre.value,
                                    precio: `$${precio.value}`,
                                    descripcion: descripcion.value,
                                    icono: `img/app-icons/${icon.files[0].name}`,
                                    instalada: false,
                                    app: "app/demo.apk",
                                    calificacion: 5,
                                    descargas: 0,
                                    desarrollador: dev.value,
                                    imagenes:["img/app-screenshots/1.webp","img/app-screenshots/2.webp","img/app-screenshots/3.webp"],
                                    comentarios:[
                                        { comentario: "Quaerat quod qui molestiae sequi, sint aliquam omnis quos voluptas?" ,calificacion:Math.floor(Math.random() * (5 - 1)) + 1,fecha:"12/12/2012",usuario:"Juan"},
                                        {comentario: "Quaerat quod qui molestiae sequi, sint aliquam omnis quos voluptas?",calificacion:Math.floor(Math.random() * (5 - 1)) + 1,fecha:"12/12/2012",usuario:"Pedro"},
                                        {comentario: "Quaerat quod qui molestiae sequi, sint aliquam omnis quos voluptas?",calificacion:Math.floor(Math.random() * (5 - 1)) + 1,fecha:"12/12/2012",usuario:"Maria"},
                                    ],

                                };

                                console.log(aplicacion);

                                const trans = db.transaction(['categorias'],'readwrite');
                                const objectStore = trans.objectStore('categorias');  
                                const request = objectStore.get(`Categoria ${categoiraID}`);

                                request.onsuccess = (e) =>{

                                    categoria = e.target.result;
                                    categoria.aplicaciones.push(aplicacion);

                                    const request1 = objectStore.put(categoria);

                                    request1.onsuccess = (e) =>{
                                        alert("Se ha guardado", e.target.result);
                                        readData(categoiraID);
                                        $("#btnCerrarAgregarApp").click();
                                        document.getElementById("formAgregar").reset();
                                    }

                                    request1.onerror =(e) =>{
                                        console.log(e)
                                        alert("error",e.target.error);
                                    }
                                }

                                request.onerror =(e) =>{
                                    alert(e.result);
                                }

                                //var request = objectStore.add()
                            }
                        }
                    }
                }
            }  
        }


            
       
         
     }

     function getLastCodigo() {
        var max = 0;
        const trans = db.transaction(['categorias'],);
        const objectStore = trans.objectStore('categorias');  
        for (let i = 0; i < 5; i++) {
            const request = objectStore.get(`Categoria ${i}`);
            request.onsuccess = (e) => {
                let categoria = e.target.result;
                let aplicacion = categoria.aplicaciones;
                aplicacion.forEach(app => {
                    if (app.codigo > max) {
                        max = app.codigo;
                    }
                });     
                if (i === 4) {
                    document.getElementById("idAppAdd").value = ++max;
                }
            }
        }
     }

     function btnAgregar(){
        document.getElementById("lblCategoriaID").innerHTML = `Categoria ${selectCategoria.value}`;
        getLastCodigo()
     }
}


