var outputDiv = document.getElementById('outputDiv'); // div where output is rendered
var form = document.getElementById('form');

//form submit event listner
form.addEventListener('submit', function(event) {

  let orgName = document.getElementById('orgName').value; // get organization name
  orgName=orgName.trim();
  let nValue = document.getElementById('nValue').value; // get value of n
  let mValue = document.getElementById('mValue').value; // get value of m


  if(orgName == ""){ // if organization name is empty string, INVALID
    alert("Enter a valid organization name");
  }
  else if (nValue <= 0 || mValue <= 0) { // if value of n or m is lesser than 1, INVALID
    alert("Enter a number greater than 0");
  }
  else {
      window.location.replace('#outputDiv'); // scroll to output div
      if(nValue>=50){
        outputDiv.innerHTML='<p class="text-center mt-2">It requires authentication to Github to process such huge request. <br> The current rate limit is 60 requests per hour.</p>';
      }
      else{
        outputDiv.innerHTML='<div class="loader d-block mt-5 mx-auto"></div>'; //display loader until result is fetched


        // HTTP request to get list of top n repositories of the organization based on number of forks
        axios.get('https://api.github.com/search/repositories?q=org:'+orgName+'&sort=forks&per_page='+nValue)
        .then(async function (response) {
          let isError=false;
          var orgRepos = []; // array to store repositories list
          let i = 0;
          for(let data of response.data.items){
            orgRepos[i] = {};
            orgRepos[i].repoName = data.name;
            orgRepos[i].forksCount = data.forks;
            orgRepos[i].committeesList = [];
            try{
              orgRepos[i].committeesList = await getCommittees(data.full_name, mValue); // get list of top m committees
            }
            catch(err){
              isError=true;
              break;
            }
            i++;
          }
          if(isError==false)
            constructOutput(orgRepos, orgName); // Construct inner HTML of output div
          else{
            alert("Oops! An error occurred");
            location.reload();
          }

        })
        .catch(function (error) {
          console.log(error);
          if(error.response.data.message == "Validation Failed"){ // if invalid organization name is given, give alert
            alert('"' + orgName + '" organization does not exist');
          }
          else{
            alert("Oops! An error occurred");
          }
          location.reload();
        });
      }
  }
  event.preventDefault();
});


// function to get the list of committees of the given repository
function getCommittees(repoName, perPage){
  let committeesList = []; // array to store committees list

  //HTTP request to get top m committees of the given repository
  return axios.get('https://api.github.com/repos/' +repoName + '/contributors?per_page=' + perPage)
  .then(function (response) {
    let i = 0;
    for(let data of response.data){
      committeesList[i] = {};
      committeesList[i].committeeName = data.login;
      committeesList[i].commitsCount = data.contributions;
      i++;
    }
    return committeesList;
  })
  .catch(function (error) {
    console.log(error);
    throw new Error("Error occured");
  });
}


// function to construct result output
function constructOutput(orgRepos, orgName){
  var output =
   `<p class="h4 mt-5 pb-2 text-center text-muted border-secondary border-bottom">RESULT</p>
    <p class="h4 my-3">Organization : <b>`+ orgName + `</b></p>
    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3">`;

  // iterate repositories of the organization
  for(let repo of orgRepos){
    output +=
      `<div class="card">
        <div class="card-body">
          <h5 class="card-title">`+ repo.repoName +`</h5>
          <h6 class="card-subtitle mb-2 text-muted">`+ repo.forksCount +` forks</h6>
          <h6 class="text-center mt-2">Top committees</h6>
          <table class="table table-sm table-striped table-hover">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Committee</th>
                <th scope="col">Commit count</th>
              </tr>
            </thead>
            <tbody>`;

            let card = ""; // Build cards containing output
            let j = 1;
            // iterate committees list of each repository
            for(let committee of repo.committeesList){
              card += `<tr><td>` + j + `</td><td>` + committee.committeeName + `</td><td>` + committee.commitsCount + `</td></tr>`;
              j++;
            }
            output += card +

            `</tbody>
          </table>
        </div>
      </div>`;
  }
  output += `</div>`;
  outputDiv.innerHTML = output;
}
