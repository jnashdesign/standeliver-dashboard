$('#signin').click(function(event) {
    event.preventDefault();
    var email = $('.loginForm #email').val();
    var password = $('.loginForm #password').val();

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(function(val) {
            var uid = val.uid;

            var ref = firebase.database().ref('/users/'+uid);
                ref.on("value", function(snapshot){
                    sessionStorage.setItem('email',snapshot.val().email);
                    sessionStorage.setItem('storeID',snapshot.val().storeID);
                })
            localStorage.setItem('loggedIn', 'true');
            window.location.replace("dashboard-sales.html");
        })
        .catch(function(error) {
            alert(error.message);
        });
  });