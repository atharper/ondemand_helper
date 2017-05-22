function addJQuery(callback) {
  var script = document.createElement("script");
  script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js");
  script.addEventListener('load', function() {
    var script = document.createElement("script");
    script.textContent = "window.jQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
    document.body.appendChild(script);
  }, false);
  document.body.appendChild(script);
}

function main(dictionary) {

  $("li").each(function(i) {
    var commit = $(this).data('channel');
    if (commit) {
      var array = commit.split(':');
      var revision = array[array.length-1];
      var build = dictionary[revision];
      if (build != undefined)
      {
        $(this).parent().width(1150);
        if ($(this).find(".copy-stuff").length === 0)
        {
          $(this).children(".commit-links-cell").css('width', '360px');
          $(this).children(".commit-links-cell").append('<div class="commit-links-group BtnGroup copy-stuff"><button aria-label="Copy the build number" class="sha js-zeroclipboard btn btn-outline BtnGroup-item zeroclipboard-button tooltipped tooltipped-s" data-clipboard-text="' + build + '" data-copied-hint="Copied!" type="button"><svg aria-hidden="true" class="octicon octicon-clippy" height="16" version="1.1" viewBox="0 0 14 16" width="14"><path fill-rule="evenodd" d="M2 13h4v1H2v-1zm5-6H2v1h5V7zm2 3V8l-3 3 3 3v-2h5v-2H9zM4.5 9H2v1h2.5V9zM2 12h2.5v-1H2v1zm9 1h1v2c-.02.28-.11.52-.3.7-.19.18-.42.28-.7.3H1c-.55 0-1-.45-1-1V4c0-.55.45-1 1-1h3c0-1.11.89-2 2-2 1.11 0 2 .89 2 2h3c.55 0 1 .45 1 1v5h-1V6H1v9h10v-2zM2 5h8c0-.55-.45-1-1-1H8c-.55 0-1-.45-1-1s-.45-1-1-1-1 .45-1 1-.45 1-1 1H3c-.55 0-1 .45-1 1z"></path></svg></button><a href="#" aria-label="Get Build Information" class="sha btn btn-outline tooltipped tooltipped-sw" style="width:125px;text-align:center;" rel="nofollow">' + build +'</a></div>');
        }
      }
    }
  });
}

(function() {
  var dictionary = {};

  $.each(["2017.05", "2017.08", "Development"], function(__, buildBranch) {
    $.each([0, 10, 20, 30, 40], function(_, x) {
      chrome.runtime.sendMessage({
        method: 'GET',
        action: 'xhttp',
        url: 'http://cctray:peekaboo$Treet@gocaselle:8153/go/api/pipelines/' + buildBranch + '/history/' + x
      }, function(responseText) {
        var response = JSON.parse(responseText);

        $.each(response.pipelines, function(i, pipeline) {
          $.each(pipeline.build_cause.material_revisions[0].modifications, function(j, modification) {
            if (!dictionary[modification.revision]) dictionary[modification.revision] = pipeline.label;
          });
        });

        main(dictionary);
      });
    });
  });
})();
