var form = document.getElementById('form');
form.addEventListener('submit', function(event) {
  let orgName = document.getElementById('orgName').value;
  let nValue = document.getElementById('nValue').value;
  let mValue = document.getElementById('mValue').value;
  let result = document.getElementById('result');
  // if (form.checkValidity() === false) {
  //   form.classList.add('was-validated');
  // }
  // else {
      axios.get('https://api.github.com/search/repositories?q=org:'+orgName+'&sort=forks&per_page='+nValue)
      .then(async function (response) {

        var orgRepos=[];

        let i=0;
        for(var item of response.data.items){
          orgRepos[i]={};
          orgRepos[i].full_name=item.full_name;
          orgRepos[i].forks=item.forks;
          orgRepos[i].contributors=[];
          orgRepos[i].contributors = await getContributors(item.full_name, mValue);
          i++;
        }

        let ans="";
        for(var item of orgRepos){
          ans+=item.full_name+" "+item.forks+" "+item.contributors+"<br>";
        }
        result.innerHTML=ans;
      })
      .catch(function (error) {
        console.log(error);
      });
  // }
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
      array[j]=item.login;
      j++;
    }
    return array;
  })
  .catch(function (err) {
    console.log(err);
  });
}
