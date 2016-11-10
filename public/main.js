var getResults = function(name) {
    var ajax = $.ajax('/search/' + name, {
        type: 'Get',
        datatype: 'json'
    });
    ajax.done(function(item) {
        $.each(item, function(i, data) {
            var tag = showResults(data);
            $('#container').append(tag);
        });
    });
};

var showResults = function(data) {
    
    var url = "https://www.songsterr.com/a/wsa/" + data.artist.name + "-" + data.title + "-tab-g-s" + data.id;
    
    var results = $('.template.hidden').clone(true, true);
    
    var artistElm = results.find('.artist');
    artistElm.text(data.artist.name);
    
    var songElm = results.find('.song a');
    songElm.attr('href', url);
    songElm.text(data.title);
    
    var songIdElm = results.find('.song-id');
    songIdElm.text(data.id);
    
    results.removeClass('hidden');
    
    return results;
};

var getFavorites = function() {
    var ajax = $.ajax('/favorites', {
        type: 'Get',
        datatype: 'json',
    });
    ajax.done(function(item) {
        $.each(item, function(i, data) {
            var favs = showFavorites(data);
            $('#fav-container').append(favs);
        });
    });
};

var showFavorites = function (data) {
    
    $('#main-page').hide();
    $('#favorite-page').show();
    $('#fav-container').show();
    var url = "https://www.songsterr.com/a/wsa/" + data.name + "-" + data.title + "-tab-g-s" + data.song_id;
    
    var results = $('.fav-temp.hidden').clone(true, true);
    
    var artistElm = results.find('.artist');
    artistElm.text(data.name);
    
    var songElm = results.find('.song a');
    songElm.attr('href', url);
    songElm.text(data.title);
    
    var idElm = results.find('.id');
    idElm.text(data._id);
    
    results.removeClass('hidden');
    
    return results;
    
};

var returnHome = function(){
    $('.home').click(function() {
        $('#favorites-page').hide();
        $('#main-page').show();
        $('#fav-container').empty();
    });
};

var addToFavorites = function(name, title, id) {
    var item = {'name': name, 'title': title, 'song_id': id};
    var ajax = $.ajax('/favorites', {
        type: 'POST',
        data: JSON.stringify(item),
        datatype: 'json',
        contentType: 'application/json'
    });
    return ajax;
};

var addToFavoritesDone = function(ajax) {
    ajax.done(function(err, res) {
        if(res.status == 'true') {
            $(this).css('color', 'gold');
        }
    });
};

var deleteFavorite = function(id) {
    var ajax = $.ajax('/favorites/' + id, {
        type: 'DELETE',
        datatype: 'json'
    });
};

$(document).ready(function() {
    $('form').submit(function(event) {
        event.preventDefault();
        $('#container').html('');
        var val = $('#search-box').val();
        getResults(val);
        $('#search-box').val("");
    });
    $('.fa-star-o').click(function() {
        var name = $(this).parent().children('dl').children('.artist').text();
        var title = $(this).parent().children('dl').children('.song').text();
        var songId = $(this).parent().children('dl').children('.song-id').text();
        var promise = addToFavorites(name, title, songId);
        var action = addToFavoritesDone.bind(this);
        action(promise);
    });
    $('#favorites').click(function(event) {
        event.preventDefault();
        getFavorites();
        $('#container').empty();
    });
    $('.delete').click(function() {
        var id = $(this).parent().children("dl").children('.id').text();
        deleteFavorite(id);
        $(this).parent().remove();
    });
    returnHome();
});