const username = document.getElementById("username");
const password = document.getElementById("password");

document.addEventListener('DOMContentLoaded', (event) => {
    /**
     * login makes a user login in order to access the application
     */
    function login() {
        if(username.value.length != 0 && password.value.length != 0){
            // errorMessage.style.display = 'none'
            console.log('fields working')
            fetch('/api/users/login', {
                    method: 'POST',
                    body: JSON.stringify({
                        'username': username.value,
                        'password': password.value
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                //.then(res => res.json())
                //.then(task => console.log(task))
                .then(res => {
                    if (res.ok) {
                        //good
                        console.log('user is logged in');
                        window.location = '/';
                    } else {
                        //error
                        console.log('error');
                        // errorMessage.style.display = 'block';
                    }
                })
                .catch(error => {
                    console.log(error);
                    // errorMessage.style.display = 'block';
                });
        } else {
            //error, not username or password input
        }
    }

    /**
     * register will register a new user, and if valid information is provided, log the user in as well
     */
    function register() {
        if(username.value.length != 0 && password.value.length != 0) {
            // console.log('fields working')
            fetch('/api/users/registration', {
                method: 'POST',
                body: JSON.stringify({
                    'username': username.value,
                    'password': password.value,
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(res => {
                console.log("REG res.status: " + res.status);
                console.log("REG res.statusText: " + res.statusText);
                if (res.ok) {
                    console.log("User registered");
                    login();
                } else {
                    //error
                    alert("Try a different username");
                    console.log("error");
                }
            })
            .catch(error => console.log(error));
        } else {
            alert("All fields are required")
            //error, not username or password input
        }
    }

    document.getElementById('submit_register').addEventListener('click', register);
    document.getElementById('submit_login').addEventListener('click', login);
});