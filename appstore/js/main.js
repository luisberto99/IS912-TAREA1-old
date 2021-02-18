//********** INDEXEDDB **********/
const iDB = indexedDB;

if(iDB){
    let db;
    const request = iDB.open("appstore",1);

    request.onsuccess = (e) => {
        db = e.target.result;
        console.log('open',db);
        addData();
        readData(0);
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


    //¨**** FUNCION QUE AGREGA LOS DATOS *****
    const addData = () =>{
        const trans = db.transaction(['categorias'],'readwrite');
            const objectStore = trans.objectStore('categorias');
        for (let i = 0; i < 5; i++) {
            const request = objectStore.add(categorias[i]);   
        }
    }

    //*****  FUNCION QUE LEE LOS DATOS *****/
    const readData = (n) =>{
        const trans = db.transaction(['categorias'],'readonly');
            const objectStore = trans.objectStore('categorias');
            const request = objectStore.get(`Categoria ${n}`);

            request.onsuccess = (e) => {
               llenarGrild(e.target.result);
            }
    }

    const llenarGrild = (categoria) =>{
      aplicaciones = categoria.aplicaciones;

      aplicaciones.forEach(element => {
          document.getElementById("gridContainer").innerHTML += `
          <div class="cardContainer item1">
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

}