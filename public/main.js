var $ = require('jquery');

var Tab = function() {
    this.submit = $('#submit');
    this.searchBox = $("#searchBox");
};
Tab.prototype.search = function(name) {
    var ajax = $('/search/' + name, {
        type: 'Get',
        datatype: 'json'
    });
    ajax.done(this.displaySearch.bind(this));
};
Tab.prototype.onSearchCLick = function() {
    var name = this.searchBox.val();
    this.search(name);
}; 
Tab.prototype.onSearchSubmit = function(event) {
    event.preventDefault();
    this.submit.trigger('click');
};
Tab.prototype.displaySearch = function(name) {
  var results = $('#search-results');
  results.append('<div>' + name + '</div>');
};

$(document).ready(function() {
    var app = new Tab();
});