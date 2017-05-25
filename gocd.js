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
    title.append('<span class="github-link" style="background: url"><a href="https://github.com/caselle/Connect/commits/' + branch + '"><img src="http://i.imgur.com/fljzgOQ.png" width="16px"/></a></span>');
  });
}
