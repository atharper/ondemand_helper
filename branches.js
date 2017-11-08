(function () {
  if ($(location).attr('href').indexOf('github.com/caselle/Connect') < 0) return;
  
  branchTask();
  window.setInterval(branchTask, 5000);

  commitTask();
  window.setInterval(commitTask, 5000);
})();

function branchTask() {
  $('.branch-name').each(function() {
    var label = $(this);
    var buildLabel = label.text();
    
    getLastBuild(buildLabel != 'master' ? buildLabel : 'Development', function(build) {
      label.text(buildLabel + '.' + build.fullBuild.split('.').pop());
      label.css('color', getColor(build));
    });
  });
}

function commitTask() {
  var span = $('.commit .commit-meta .float-right');

  if (!span.find('#builds').length) {

    span.find('.user-select-contain').attr('id', 'revision');
  
    var buildLabel = '<span class="sha-block" id="builds">build </span>';
    span.append(buildLabel);
  } 

  runWithDictionary(commitDictionary)
}

function commitDictionary(dictionary) {
  
  var revision = $('#revision').text();
  var build = dictionary[revision];
  if (!build) return;

  addBuild(build);
  build.additionalBuilds.forEach(function(element) {
    addBuild(element);
  }, this);
}

function addBuild(build) {
  if (!build) return;
  
  var branchLabel = $('[data-branch="' + build.branch +'"]');
  if (!branchLabel.length) {
    $('#builds').append('<span class="sha user-select-contain" data-branch="' + build.branch + '"></span>');
  }
  branchLabel = $('[data-branch="' + build.branch +'"]');
  branchLabel.text(build.fullBuild + ' ');
  branchLabel.css('color', getColor(build));;
}