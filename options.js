function save_options() {
  var key = document.getElementById('key').value;
  chrome.storage.sync.set({
    key: key,
  }, function() {
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

function restore_options() {
  chrome.storage.sync.get({
    key: '',
  }, function(items) {
    document.getElementById('key').value = items.key;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
