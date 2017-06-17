var key = '';

chrome.storage.sync.get({
  key: '',
}, function(items) {
  key = items.key;
  var out = $('#status');

  chrome.tabs.executeScript({
      code: '(' + returnDOM + ')();'
  }, (results) => {
    var build = $(results[0]).find('.build-number').data('build');
    $('#build').text(build.fullBuild);

    addRevision(build);
    addPullRequest(build);
  });
})();

function copyTextToClipboard(text) {
  var copyFrom = $('<textarea/>');
  copyFrom.text('');
  copyFrom.append($('#build-text').text().trim() + '\n\n')
    .append($('#pull-link').text().trim() + '\n\n')
    .append($('#changed-files').text().trim() + '\n')
    .append($('#added-files').text().trim() + '\n')
    .append($('#removed-files').text().trim() + '\n');
  copyFrom.text(copyFrom.text().trim());
  $('body').append(copyFrom);
  copyFrom.select();
  document.execCommand('copy');
  copyFrom.remove();
}

function addRevision(build) {
  request('/repos/caselle/Connect/branches/' + build.branch, function(response) {
    if (response) $('#revision').text(response.commit.sha.substring(0, 7));
  });
}

function addPullRequest(build) {
  request('/repos/caselle/Connect/pulls?head=caselle:' + build.branch, function(response) {
    $('#pull-link').attr('href', response[0].html_url).text(response[0].html_url);
    $('#pull-link').attr('pull-number', response[0].html_url.split('/').pop())

    addFiles(build);
  });
}

function addFiles(build) {
  requestText('/repos/caselle/Connect/pulls/' + $('#pull-link').attr('pull-number') + '.diff', function(data) {
    var lines = data.split(/\r?\n/).filter(function(line) {return line.startsWith('+++') || line.startsWith('---')});
    for (var i = 0; i < lines.length; i += 2) {
      var lineA = lines[i].substring(5);
      var lineB = lines[i+1].substring(5);

      if (lineA == lineB) {
        $('#changed-files').append(lineA.substring(1) + '\n');
      } else if (lineA == 'dev/null') {
        $('#added-files').append('+' + lineB.substring(1) + '\n');
      } else if (lineB == 'dev/null') {
        $('#removed-files').append('-' + lineA.substring(1) + '\n');
      } else {
        $('#removed-files').append(lineA + '/' + lineB);
      }
     }

     $('#copy').click(function () {
       copyTextToClipboard($('#status').text());
     })
  }, function (request) { request.setRequestHeader('Accept', 'application/vnd.github.VERSION.diff')});
}

function request(uri, funct, addHeaders) {
  var request = new XMLHttpRequest();

  request.onload = function() {
    funct(tryParseJSON(this.responseText));
  };

  request.open('GET', 'https://api.github.com' + uri, true)
  request.setRequestHeader('Authorization', 'token ' + key);
  request.setRequestHeader('User-Agent', 'aluhadora');
  if (addHeaders) addHeaders(request);

  request.send()
}

function requestText(uri, funct, addHeaders) {
  var request = new XMLHttpRequest();

  request.onload = function() {
    funct(this.responseText);
  };

  request.open('GET', 'https://api.github.com' + uri, true)
  request.setRequestHeader('Authorization', 'token ' + key);
  request.setRequestHeader('User-Agent', 'aluhadora');
  if (addHeaders) addHeaders(request);

  request.send()
}

function returnDOM() {
  return document.all[0].outerHTML;
}

function tryParseJSON (jsonString) {
  try {
    var o = JSON.parse(jsonString);
    if (o && typeof o === 'object') {
      o.orig = jsonString;
      return o;
    }
  }
  catch (e) { }
  return false;
}
