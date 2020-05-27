const baseUrl = "https://prog3-dumas-tp2-backend.now.sh/";
//const baseUrl = "http://localhost:3000/";

const apiHeaders = {
    'Content-Type': 'application/json',
    Accept: 'application/json'
}

const fetchParams = (method, data = '')=>
{
    const body = data ? {body: JSON.stringify(data)} : {}
    return {
        method:method,
        headers: apiHeaders,
        credentials: 'same-origin',
        ...body
    }
};

const api = 
{
    //CREATE (para ver...)
    createTiendaJuego: async formData => {
        const dataResponse = await fetch(baseUrl + 'tiendaJuegos', fetchParams('POST', formData));
        const dataInfo = await dataResponse.json();
        return dataInfo;
    },

    //READ
    getTiendaJuegos: async()=>
    {
        const dataResponse = await fetch(baseUrl + 'tiendajuegos', fetchParams('GET'));
        const dataInfo = await dataResponse.json();
        return dataInfo;
    },

    //DELETE
    deleteTiendaJuego: async id =>
    {
        const dataResponse = await fetch(baseUrl + 'tiendajuegos/' + id, fetchParams('DELETE'));
        const dataInfo = await dataResponse.json();
        return dataInfo;
    },

    //UPDATE
    updateTiendaJuego: async (formData,id) => {
        const dataResponse = await fetch(baseUrl + 'tiendajuegos/' + id, fetchParams('PUT', formData));
        const dataInfo = await dataResponse.json();
        return dataInfo;
    }
}