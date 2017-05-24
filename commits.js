function main(dictionary) {
  $("li").each(function(i) {
    var commit = $(this).data('channel');
    if (commit) {
      var array = commit.split(':');
      var revision = array[array.length-1];
      var build = dictionary[revision];
      if (build != undefined)
      {
        console.log(build);
        var buildNumber = build.label;
        var color = getColor(build);
        var buildLink = getBuildLink(build);

        if ($(location).attr('href').indexOf("pull") < 0) $(".container").css('width', '60%');
        $(this).parent().width(1150);
        if ($(this).find(".copy-stuff").length === 0)
        {
          var cell = $(this).children(".commit-links-cell");
          cell.css('width', '375px');
          cell.append('<div class="commit-links-group BtnGroup copy-stuff">' +
           '<button aria-label="Copy the build number" class="sha js-zeroclipboard btn btn-outline BtnGroup-item zeroclipboard-button tooltipped tooltipped-s" ' +
           'style="border-right-width: 0px;" ' +
           'data-clipboard-text="' + buildNumber + '" data-copied-hint="Copied!" type="button"><svg aria-hidden="true" class="octicon octicon-clippy" height="16" ' +
           'version="1.1" viewBox="0 0 14 16" width="14"><path fill-rule="evenodd" ' +
           'd="M2 13h4v1H2v-1zm5-6H2v1h5V7zm2 3V8l-3 3 3 3v-2h5v-2H9zM4.5 9H2v1h2.5V9zM2 12h2.5v-1H2v1zm9 1h1v2c-.02.28-.11.52-.3.7-.19.18-.42.28-.7.3H1c-.55 0-1-.45-1-1V4c0-.55.45-1 1-1h3c0-1.11.89-2 2-2 1.11 0 2 .89 2 2h3c.55 0 1 .45 1 1v5h-1V6H1v9h10v-2zM2 5h8c0-.55-.45-1-1-1H8c-.55 0-1-.45-1-1s-.45-1-1-1-1 .45-1 1-.45 1-1 1H3c-.55 0-1 .45-1 1z">' +
           '</path></svg></button><a href="' + buildLink+ '" aria-label="Get Build Information" class="sha btn btn-outline tooltipped tooltipped-sw" style="width:125px;text-align:center;' + color + '" rel="nofollow">' + buildNumber + '</a></div>');
        }
      }
    }
  });
}
function getBuildLink(build) {
  return build.infoLink;
}

function getColor(build) {
  if (build.state != 'Completed') {
    return 'color: orange;';
  } else if (build.result == 'Passed') {
    return 'color: green;'
  } else if (build.result == 'Failed') {
    return 'color: red;'
  }
  return '';
}

(function () {
  runWithDictionary(main);
})();
