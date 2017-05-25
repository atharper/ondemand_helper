function tryParseJSON (jsonString) {
  try {
    var o = JSON.parse(jsonString);
    if (o && typeof o === 'object') {
      return o;
    }
  }
  catch (e) { }
  return false;
}

function getColor (build) {
  if (build.state !== 'Completed') {
    return 'orange';
  } else if (build.result === 'Passed') {
    return 'green';
  } else if (build.result === 'Failed') {
    return 'red';
  }
  return false;
}
