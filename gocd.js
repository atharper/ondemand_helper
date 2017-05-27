(function () {
  if ($(location).attr('href').indexOf('gocaselle:8153/go/pipelines') < 0) return;

  mainGoCD();
  window.setInterval(mainGoCD, 500);
})();

function mainGoCD() {
  $('.pipeline').each(function(index) {
    if ($(this).siblings('.entity_title').text() !== 'ConnectBranches') return;

    var title = $(this).children().children().children('.title');

    if (title.children('.github-link').length > 0) return;
    var branch = title.children('a').text();
    $.get(chrome.extension.getURL('/templates/build_title.html'), function(data) {
      title.append(data);
      var link = title.children('.github-link');
      link.find('a').attr('href', 'https://github.com/caselle/Connect/commits/' + branch);
      link.find('img').attr('src', chrome.extension.getURL('/images/github.png'));
    });
  });
}
