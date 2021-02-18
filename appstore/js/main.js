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
                let categoria = e.target.result;

                console.log(categoria.nombreCategoria);
            
            }
    }

}