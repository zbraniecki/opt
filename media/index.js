
var c_re = /candidate([\d]+)/;
var q_re = /question([\d]+)/;

function getAnswers() {
  var pos = 2;
  var distances = [];
  var trs = document.getElementsByTagName('thead')[0].children[0];
  for (var i=pos+1;i<trs.children.length;i++) {
    var num = parseInt(trs.children[i].className.match(c_re)[1]);
    var answers = [];
    var tbody = document.getElementsByTagName('tbody')[0];
    for (var x=0;x<tbody.children.length;x++) {
      var question = tbody.children[x];
      var qnum = parseInt(question.className.match(q_re)[1]);
      var answer = question.getElementsByClassName('candidate'+num)[0]
                           .getElementsByTagName('input')[0].value;
      answers[qnum] = parseInt(answer);
    }
    distances[num] = answers;
  }
  return distances;
}

function getImportance() {
  var tbody = document.getElementsByTagName('tbody')[0];
  var values = [];
  for (var i=0;i<tbody.children.length;i++) {
    var tr = tbody.children[i];
    var num = parseInt(tr.className.match(q_re)[1]);
    var imp = tbody.children[i]
                   .getElementsByClassName('importance')[0]
                   .getElementsByTagName('input')[0].value;

    values.push([num, parseInt(imp)]);
  }
  return values;
}

function getOpinions() {
  var tbody = document.getElementsByTagName('tbody')[0];
  var values = [];
  for (var i=0;i<tbody.children.length;i++) {
    var tr = tbody.children[i];
    var num = parseInt(tr.className.match(q_re)[1]);
    var imp = tbody.children[i]
                   .getElementsByClassName('opinion')[0]
                   .getElementsByTagName('input')[0].value;

    values.push([num, parseInt(imp)]);
  }
  return values;

}

function getDistances() {
  var answers = getAnswers();
  var importance = getImportance();
  var imps = [];
  for (var i in importance)
    imps[importance[i][0]] = importance[i][1];
  var opinions = getOpinions();
  var ops = [];
  for (var i in opinions)
    ops[opinions[i][0]] = opinions[i][1];
  var distances = [];
  for (var cnum in answers) {
    distances[cnum] = 0;
    for (var qnum in answers[cnum]) {
      var d = Math.abs(answers[cnum][qnum]-ops[qnum])*(imps[qnum]/100);
      distances[cnum] += d;
    }
  }
  return distances;
}

function updateCandidates() {
  var pos = 2;
  var order=[];
  var distances = getDistances();

  var dists = [];
  for (var i in distances)
    dists.push([i, distances[i]]);
  
  dists.sort(sortBySecond);
  dists.reverse();
  for (var i in dists)
    order.push(dists[i][0]);
  
  var trs = document.getElementsByTagName('tr');
  for (var i=0;i<trs.length;i++) {
    var ref = trs[i].children[pos];
    for (var x=order.length-1;x>=0;x--) {
      var elem = trs[i].getElementsByClassName('candidate'+order[x])[0];
      trs[i].insertBefore(elem, ref.nextSibling);
    }
  }
  for (var x=0;x<order.length;x++) {
    var tfoot = document.getElementsByTagName('tfoot')[0];
    var td = tfoot.getElementsByClassName('candidate'+order[x])[0];
    td.innerHTML = distances[order[x]];
  }
}

function sortBySecond(a,b) {
  if (a[1]>b[1]) return -1; 
  if (a[1]<b[1]) return 1;
  return 0;
}

function updateAnswers() {
  var values = getImportance();

  values.sort(sortBySecond);
  var order = [];
  for (var i in values) {
    order.push(values[i][0]);
  }
 
  var tbody = document.getElementsByTagName('tbody')[0];
  for (var x=order.length-1;x>=0;x--) {
    var elem = tbody.getElementsByClassName('question'+order[x])[0];
    tbody.insertBefore(elem, tbody.firstChild);
  }
  updateCandidates();
}
