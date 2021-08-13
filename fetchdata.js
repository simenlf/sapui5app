async function fetchTempData (startdate, enddate) {
    uriStr = "http://localhost:5000/temperature?startdate=" + startdate + "&enddate=" + enddate;
    var data = await fetch(uriStr, {
        method: 'GET',
        mode: 'cors'
    });
    return await data.json();
}