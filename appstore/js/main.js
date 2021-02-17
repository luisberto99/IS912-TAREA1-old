
const iDB = indexedDB;

if(iDB){
    let db;
    const request = iDB.open("appstore",1);

    request.onsuccess = (e) => {
        db = e.target.result;
        //db = request.result;
        console.log('open',db);
        addData();
    }

    request.onupgradeneeded = (e) =>{
        db = e.target.result; 
        console.log('create',db);
        const categorias = db.createObjectStore('categorias', {
            keyPath: 'nombreCategoria'
        });
    }

    const addData = () =>{
        const trans = db.transaction(['categorias'],'readwrite');
            const objectStore = trans.objectStore('categorias');
        for (let i = 0; i < 5; i++) {
            const request = objectStore.add(categorias[i]);   
        }
        
    }

    request.onerror = (error) =>{
        console.error("Error", error.result)
    }

}