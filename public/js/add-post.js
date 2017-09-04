var addPostButton = document.querySelector('#addPostButton');
addPostButton.addEventListener('click', function() {

    const title = document.getElementById("title").value;
    const summary = document.getElementById("summary").value;
    const contents = document.getElementById("contents").value;

    // create data object
    const postData= {
        title: title,
        summary: summary,
        contents: contents
    }

    // AJAX
    var url = '/admin';
    var oReq = new XMLHttpRequest();

    oReq.addEventListener('load', onLoad);
    oReq.open('POST', url);
    //Send the proper header information along with the request
    oReq.setRequestHeader("Content-type", "application/json");
    oReq.send(JSON.stringify(postData));
});

function onLoad() {
    // clear form 
    document.getElementById("title").value = "";
    document.getElementById("summary").value = "";
    document.getElementById("contents").value = "";

    // redirect to main page
    window.location.href = '/';
}