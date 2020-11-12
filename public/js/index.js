var form = document.getElementById('form');

form.addEventListener('submit', function(event) {
  let orgName = document.getElementById('orgName').value;
  let nValue = document.getElementById('nValue').value;
  let mValue = document.getElementById('mValue').value;
  let outputDiv = document.getElementById('output');

  if (form.checkValidity() === false) {
    form.classList.add('was-validated');
  }
  else {
      outputDiv.innerHTML='<div class="loader d-block mt-5 mx-auto"></div>';

      axios.get('https://api.github.com/search/repositories?q=org:'+orgName.trim()+'&sort=forks&per_page='+nValue)
      .then(async function (response) {

        var orgRepos=[];

        let i=0;
        for(var item of response.data.items){
          orgRepos[i]={};
          orgRepos[i].name=item.name;
          orgRepos[i].full_name=item.full_name;
          orgRepos[i].forks=item.forks;
          orgRepos[i].contributors=[];
          orgRepos[i].contributors = await getContributors(item.full_name, mValue);
          i++;
        }

        let output=`
          <p class="h4 mt-5 pb-2 text-center text-muted border-secondary border-bottom">RESULT<p>
          <p class="h4 my-3">Organization : <b>`+ orgName.trim() + `</b></p>
          <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3">
        `;

        for(var repo of orgRepos){
          output+=`
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">`+ repo.name +`</h5>
                <h6 class="card-subtitle mb-2 text-muted">`+ repo.forks +` forks</h6>
                <h6 class="text-center mt-2">Top committes</h6>
                <table class="table table-sm table-striped table-hover">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Committee</th>
                      <th scope="col">Commit count</th>
                    </tr>
                  </thead>
                  <tbody>`;
                  let card="";
                  let j=1;
                  for(var user of repo.contributors){
                    card+=`<tr><td>`+ j +`</td><td>`+user.name+`</td><td>`+user.commits+`</td></tr>`;
                    j++;
                  }
                  output+=card+`
                  </tbody>
                </table>
              </div>
            </div>`;
        }
        output+=`</div>`;
        outputDiv.innerHTML = output;
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  event.preventDefault();

});
//https://api.github.com/search/repositories?q=org:google&sort=forks&per_page=100
//https://api.github.com/repos/google/dopamine/contributors

function getContributors(repoName, perPage){
  let array=[];
  return axios.get('https://api.github.com/repos/' +repoName + '/contributors?per_page=' + perPage)
  .then(function (res) {
    let j=0;
    for(var item of res.data){
      array[j]={};
      array[j].name=item.login;
      array[j].commits=item.contributions;
      j++;
    }
    return array;
  })
  .catch(function (err) {
    console.log(err);
  });
}
