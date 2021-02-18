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
                      <i class="fas fa-star"></i>
                      <i class="fas fa-star"></i>
                      <i class="fas fa-star"></i>
                      <i class="far fa-star"></i>
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

    //**********  OBTIENE EL DETALLE DE UNA APP DE LA CATEGORIA **********/
    function modal1(n){
        aplicaciones.forEach(element => {
            if (element.codigo == n) {
                modalBody = document.getElementById("modal-body");
                modalBody.innerHTML=`Nuevo modal App${n} `;
            }
        });
        
    }


    
}


