let addingPlace = false;
const btnAddPlace = document.querySelector(".addPlace");
btnAddPlace.addEventListener("click", ()=> showDivForm());
let inputName = document.querySelector("#pname");
let inputLat = document.querySelector("#lat");
let inputLng = document.querySelector("#lng");
let inputDesc = document.querySelector("#txtarea_descr");
let inputWebsite = document.querySelector("#website");
let inputType = document.querySelector("#type");
let listObjPlaces = '';
const divForm = document.querySelector('.div_form');

const submitPlace = async ()=>
{
    //Uploading place
    console.log("¡Subiendo datos!")

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

const mainLogic = async ()=>
{
    const url = "https://prog3-dumas-tp2-backend.now.sh/tiendajuegos";
    try {
        const response = await fetch(url);
        const json = await response.json();
        listObjPlaces = json;
        const table = document.querySelector('.table_list');
        const dataHTML = createTableHTML(json);
        let img = document.querySelector('img[alt="loading"]');
        img.classList.add('hidden'); 
        table.innerHTML = dataHTML;
      } 
      catch (error) {
        console.error(error);
      }
};


mainLogic();

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
                <td><a href='javascript:editInfo("${_id}");'><img src='assets/img/lapiz.svg'></a></td>
            </tr>`;
    });
    return `<tr>
        <th>nombre</th>
        <th>lat</th>
        <th >lng</th>
        <th>descripción</th>
        <th>sitio web</th>
        <th>tipo</th>
        <th></th>
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