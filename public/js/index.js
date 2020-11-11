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
      .then(function (response) {
        var arr = response.data.items;
        var ans="";
        for(var item of arr){
          ans+=item.full_name+" "+item.forks+"<br>";
        }
        result.innerHTML=ans;
        console.log(response.data.items);
      })
      .catch(function (error) {
        console.log(error);
      });
  // }
  event.preventDefault();

});
//https://api.github.com/search/repositories?q=org:google&sort=forks&per_page=100
//https://api.github.com/repos/google/dopamine/contributors
