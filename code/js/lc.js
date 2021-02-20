const analysisUrl = "http://127.0.0.1:3500";

function getUrlParams(key){
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(key);       
}

function loadCommonDetails(condition){
    $.getJSON( "data/tasks.json", function( data ) {
        var taskTopic = getUrlParams('task_topic');
        console.log(data['lc'][taskTopic]);
        console.log(condition, data['lc_' + condition]['description']);
        $('#taskTitle').text(data['lc'][taskTopic]['title']);
        $('#taskDescription').text(data['lc_' + condition]['description']);
        $('#lc_' + condition + '_display').show();
    });
}

function loadLcText(data){
    $('#lc_text_display').text(data['content']);
}

function loadLcViz(data){

}

$( function() {
    var condition = getUrlParams('condition');
    loadCommonDetails(condition);
    console.log(analysisUrl + "/lc");
    $.ajax(analysisUrl + "/lc", {
        data: JSON.stringify({
            'source': 'bbc',
            'key': getUrlParams('key')
        }),
        method: "POST",
        contentType: "application/json"
    }).done(function (data) {
        console.log('?????? in response');
        console.log(data);
        if(condition == 'text'){
            loadLcText(data);
        }else{
            loadLcViz(data);
        }
        $('#lc_text_questions').show();
    });
    
    
});