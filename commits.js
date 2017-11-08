function mainCommits(dictionary) {
  $('li').each(function(i) {
    var commit = $(this).data('channel');
    if (!commit) return;

    var array = commit.split(':');
    var revision = array[array.length - 1];
    var build = dictionary[revision];

    if (build === undefined) return;

    var color = getColor(build);

    if ($(location).attr('href').indexOf('pull') < 0) $('.container').css('width', '60%');
    $(this).parent().width(1180);

    if ($(this).find('.copy-stuff').length !== 0 || $(this).find('.copy-stuff').attr('refreshing') === 1) return;

    var cell = $(this).children('.commit-links-cell');
    cell.css('width', '500px');
    $.get(chrome.extension.getURL('/templates/github_link.html'), function(data) {
      cell.append(data);
      var div = cell.children('.copy-stuff');
      div.attr('refreshing', 0);
      div.find('button').attr('data-clipboard-text', build.label);
      var a = div.find('a')
      a.attr('href', build.infoLink).text(build.label).css('color', color ? color : '');
      console.log(build);
      if (build.additionalBuilds) {
        build.additionalBuilds.forEach(function(element) {
          a.attr('aria-label', element.label + '\n' + a.attr('aria-label'));
        }, this);
      }
    });
  });
}

(function () {
  if ($(location).attr('href').indexOf('github') < 0) return;
  runWithDictionary(mainCommits);

  window.setInterval(function() {
    $('.copy-stuff').attr('refreshing', 1);
    runWithDictionary(mainCommits);
  }, 5000);
})();
