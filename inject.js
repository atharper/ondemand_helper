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

  $("tr").each(function(row) {
    var link = $(this).children(".hash").children("div").children("a").attr('href');
    if (link != null) {
      var linkParts = link.split("/");
      var revision = linkParts[linkParts.length -1].split("?")[0];
      var build = dictionary[revision];
      if (build == undefined) build = "";
      $(this).children(".status").html(build);
    }
  });

  $("li").each(function(i) {
    var commit = $(this).data('channel');
    if (commit) {
      var array = commit.split(':');
      var revision = array[array.length-1];
      var build = dictionary[revision];
      if (build == undefined) build = "";
    }
  });
}

(function() {
  var dictionary = {};

  chrome.runtime.sendMessage({
    method: 'GET',
    action: 'xhttp',
    url: 'http://cctray:peekaboo$Treet@gocaselle:8153/go/api/pipelines/Build_Development/history'
  }, function(responseText) {
    var response = JSON.parse(responseText);

    $.each(response.pipelines, function (i, pipeline) {
      $.each(pipeline.build_cause.material_revisions[0].modifications, function (j, modification) {
        if (!dictionary[modification.revision]) dictionary[modification.revision] = pipeline.label;
      });
    });

    main(dictionary);
  });
})();
