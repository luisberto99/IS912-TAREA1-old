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
                      <strong>${element.precio}</strong>
                  </div>
              </div>
          </div>
          `;

          
          
      });
    }

    //*******      CUANDO HAY UN CAMBIO EN SELECTCATEGORIAS ********/
    document.getElementById("selectCategoria");
    selectCategoria.onchange = () =>{
        readData(selectCategoria.value);
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
                modalBody.innerHTML=`
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
                        <img src="img/app-icons/1.webp" alt="">
                    </div>
                    <div class="modalAppInfo">
                        <strong class="modalAppTitle">${elemento.nombre}</strong><br>
                        <span class="modalAppDev">${elemento.desarrollador}</span><br>
                        <p class="modalAppDescription">
                           ${elemento.descripcion}
                        </p>
                        <strong class="modalAppPrice">${elemento.precio}</strong><br>
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
                    console.log(elemento.instalada)
                    document.getElementById("btnInstall").hidden = true;
                }else{
                    document.getElementById("btnInstall").hidden = false;   
                }
            }
        });
        
    }
    
}


