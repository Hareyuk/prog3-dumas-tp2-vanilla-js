const btnAddPlace = document.querySelector(".addPlace");
btnAddPlace.addEventListener("click", ()=> showDivForm());
const $inputName = document.querySelector("#main_form_name");
const $inputLat = document.querySelector("#main_form_lat");
const $inputLng = document.querySelector("#main_form_lng");
const $inputDesc = document.querySelector("#main_form_txtarea_descr");
const $inputWebsite = document.querySelector("#main_form_website");
const $inputType = document.querySelector("#main_form_type");
const $formId = document.querySelector("#main_form_id");        
const $formMain = document.querySelector("#form_main");
const $divForm = document.querySelector('.div_form');
const $divAreSure = document.querySelector('.div_you_sure');
let listObjPlaces = '';

const submitPlace = async ()=>
{
    //Uploading place
    console.log("¡Subiendo datos!")
    closeForm();
    showTable();
}

const closeForm =() =>
{
    $divForm.classList.add('hidden');
}

const showDivForm = (id = "")=>
{
    if (id != "") //Edit a existent place
    {
        const objSelected = listObjPlaces.find((place)=> place._id === id);
        const {name, lat, lng, description, website, type} = objSelected;
        $inputName.value = name;
        $inputLat.value = lat;
        $inputLng.value = lng;
        $inputDesc.value = description;
        $inputWebsite.value = website;
        $inputType.value = type;
        $divForm.classList.remove('hidden');
        $formId.value = id;
    }
    else //Adding new place
    {
        $inputName.value = "";
        $inputLat.value = "";
        $inputLng.value = "";
        $inputDesc.value = "";
        $inputWebsite.value = "";
        $inputType.value = "";
        $divForm.classList.remove('hidden');
    }
};

//READ
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
        
        //Agrego estos dos nuevo EventListeners apenas agrego los elementos nuevos al DOM
        const $btnsDelete = document.querySelectorAll('.handleDelete');
        $btnsDelete.forEach(element => {
            element.addEventListener('click', handleClickDelete)
        });
        const $btnsEdit = document.querySelectorAll('.handleEdit');
        $btnsEdit.forEach(element => {
            element.addEventListener('click', handleClickEdit)
        });
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
                <td>
                    <a  href="#Edit">
                        <img data-id="${_id}" class="handleEdit cicklable" src='../assets/img/lapiz.svg'>
                    </a>
                </td>
                <td><a data-id="${_id}" href="#Delete" class='handleDelete cicklable'>X</a></td>
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

//DELETE

const handleClickDelete = async () => {
    const id = event.target.dataset.id;
    deleteCerveceria(id);
}

const deleteTiendaJuego = async (_id)=>
{
    try
    {
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

//UPDATE
const handleClickEdit = async () => {
    const id = event.target.dataset.id;
    showDivForm(id);
}

const updateTiendaJuego = async (data,id) => {
    const result = await api.updateTiendaJuego(data,id);
    console.log('Updated', result)
    getDataShops();
}

//FORM (Update o Create)
$formMain.addEventListener('submit', (event) => {
    event.preventDefault();
    const id = $formId.value
    const formData = {
        "lat": $inputLat.value,
        "lng": $inputLng.value,
        "name": $inputName.value,
        "description": $inputDesc.value,
        "website": $inputWebsite.value,
        "type": $inputType.value
    }
    updateTiendaJuego(formData,id);

    //Chequear que si el id viene vacio es create, sino es update
    //createCerveceria(formData)

    //Reseteo el form
    $formId.value = '';
    $formMain.reset();
    closeForm();
})
