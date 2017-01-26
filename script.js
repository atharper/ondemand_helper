// ==UserScript==
// @name         Build column to bit bucket
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://bitbucket.org/caselledevops/connectmastergit/commits/all
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_xmlhttpRequest
// @connect *
// ==/UserScript==

(function() {
    'use strict';


//  $.ajax("https://ath:a2gocaselle@gocaselle:8153/go/api/pipelines/Build_Development/history")
//  .done(function(data) {
//    console.log(data);
//  });

  alert("hitting");
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "http://ath:a2gocaselle@gocaselle:8153/go/api/pipelines/Build_Development/history", true);
  xhr.onreadystatechange = function() {
  if (xhr.readyState == 4) {
    // WARNING! Might be evaluating an evil script!
    //var resp = eval("(" + xhr.responseText + ")");
    alert(xhr.responseText);
    var obj = JSON.parse(response.responseText);
    console.log(obj.pipelines[0].stages[0].jobs[0].state);
  }
  }
  xhr.send();
  // GM_xmlhttpRequest({
  //   method: "GET",
  //   url: "http://ath:a2gocaselle@gocaselle:8153/go/api/pipelines/Build_Development/history",
  //   //url: "http://caselleconnectasdfasdfasdf.com",
  //   crossDomain: true,
  //   onload: function(response) {
  //     //alert(response.responseText);
  //     var obj = JSON.parse(response.responseText);
  //     console.log(obj.pipelines[0].stages[0].jobs[0].state);
  //   }
  // });

  $("tr").each(function(row) {
    $(this).siblings().find(".hash").children().find("a").css( "color", "red" );



    var link = $(this).children(".hash").children("div").children("a").attr('href');
    if (link != null) {
      var linkParts = link.split("/");
      var revision = linkParts[linkParts.length -1];
      console.log();
      $(this).append("<td class='date'>" + revision +"</td>");
    }
  });
})();
