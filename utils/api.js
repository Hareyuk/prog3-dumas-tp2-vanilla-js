const baseUrl = "http://localhost:3000/";

const apiHeaders = {
    'Content-Type': 'application/json',
    Accept: 'application/json'
}

const fetchParams = (method, data = '')=>
{
    const body = data ? {body: JSON.stringify(data)} : {}
    return {
        method:method,
        headers:apiHeaders,
        credentials: 'same-origin',
        ...body
    }
};

const api = 
{
    //GET
    getTiendaJuegos: async()=>
    {
        const dataResponse = await fetch(baseUrl + 'tiendajuegos', fetchParams('GET'));
        const dataInfo = await dataResponse.json();
        return dataInfo;
    }

    //DELETE


    //PUT

    //POST
}