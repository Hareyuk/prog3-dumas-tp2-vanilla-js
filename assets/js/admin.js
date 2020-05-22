let addingPlace = false;
const btnAddPlace = document.querySelector(".addPlace");
btnAddPlace.addEventListener("click", ()=> showDivForm());
let inputName = document.querySelector("#main_form_name");
let inputLat = document.querySelector("#main_form_lat");
let inputLng = document.querySelector("#main_form_lng");
let inputDesc = document.querySelector("#main_form_txtarea_descr");
let inputWebsite = document.querySelector("#main_form_website");
let inputType = document.querySelector("#main_form_type");
let listObjPlaces = '';
const divForm = document.querySelector('.div_form');
const divAreSure = document.querySelector('.div_you_sure');
const formMain = document.querySelector("#form_main");

const submitPlace = async ()=>
{
    //Uploading place
    console.log("¡Subiendo datos!")
    closeForm();
    addingPlace = false;
    showTable();
    //Falta chequear que todos los campos tengan algún dato, y el LAT y LNG sean numéricos
}

const closeForm =() =>
{
    divForm.classList.add('hidden');
    addingPlace = false;
}

const showDivForm = ()=>
{
    if(addingPlace)
    {
        divForm.classList.add('hidden');
        addingPlace = false;
    }
    else
    {
        inputName.value = "";
        inputLat.value = "";
        inputLng.value = "";
        inputDesc.value = "";
        inputWebsite.value = "";
        inputType.value = "";
        divForm.classList.remove('hidden');
        addingPlace = true;
    }
};

const getDataShops = async ()=>
{
    //GET
    try {
        let img = document.querySelector('img[alt="loading"]');
        const table = document.querySelector('.table_list');
        table.innerHTML = "";

        img.classList.remove('hidden'); 
        const results = await api.getTiendaJuegos();
        listObjPlaces = results;
        const dataHTML = createTableHTML(listObjPlaces);
        img.classList.add('hidden'); 
        table.innerHTML = dataHTML;
      } 
      catch (error) {
        console.error(error);
      }
};


getDataShops();

const createTableHTML = (listObjs)=>
{
    let txt = '';
    listObjs.forEach((obj)=>{
        const {_id, name, lat, lng, description, website, type} = obj;
        txt += `<tr>
                <td>${name}</td>
                <td>${lat}</td>
                <td>${lng}</td>
                <td>${description}</td>
                <td>${website}</td>
                <td>${type}</td>
                <td><a href='javascript:editInfo("${_id}");'><img src='../assets/img/lapiz.svg'></a></td>
                <td><a href='javascript:areSureDelete("${_id}");'>X</a></td>
            </tr>`;
    });
    return `<tr>
        <th>nombre</th>
        <th>lat</th>
        <th >lng</th>
        <th>descripción</th>
        <th>sitio web</th>
        <th>tipo</th>
        <th>Editar</th>
        <th>Borrar</th>
    </tr>
    ${txt}`;
};

const editInfo = (_id)=>
{
    const objSelected = listObjPlaces.find((place)=> place._id === _id);
    const {name, lat, lng, description, website, type} = objSelected;
    inputName.value = name;
    inputLat.value = lat;
    inputLng.value = lng;
    inputDesc.value = description;
    inputWebsite.value = website;
    inputType.value = type;
    divForm.classList.remove('hidden');
    addingPlace = true;
};

const deleteTiendaJuego = async (_id)=>
{
    try
    {
        //DELETE
        const dataResponse = await api.deleteTiendaJuego(_id);
        console.log('Eliminado');
        getDataShops();
    }
    catch(error) 
    {
        console.error(error);
    }
}

const areSureDelete = (_id)=>
{
    divAreSure.innerHTML='<div><p>¿Está usted seguro que desea eliminar este elemento?</p><button id="yes_sure">Sí</button><br><button id="not_sure">No</button></div>';
    divAreSure.classList.remove('hidden');
    document.querySelector('#yes_sure').addEventListener('click', ()=> {
        deleteTiendaJuego(_id);

        console.info('Eliminado!');
    });
    document.querySelector('#not_sure').addEventListener('click', ()=> divAreSure.classList.add('hidden'));
};