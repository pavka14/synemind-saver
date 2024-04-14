var api_url = "https://www.notefox.eu/api/v1"

loadAPI();

function loadAPI() {
    browser.runtime.onMessage.addListener((message) => {
        if (message["api"] !== undefined && message["api"]) {
            api_request(message);
        }
    });
}

function api_request(message) {
    console.log("API request received");
    console.log(message);
    let data = message["data"];
    switch (message["type"]) {
        case "login":
            login(data["email"], data["password"]);
            break;
        case "login-new-code":
            login_new_code(data["email"], data["password"], data["login-id"]);
            break;
        case "login-verify":
            login_verify(data["email"], data["password"], data["login-id"], data["verification-code"]);
            break;
        case "signup":
            signup(data["username"], data["email"], data["password"]);
            break;
        case "signup-new-code":
            signup_new_code(data["email"], data["password"]);
            break;
        case "signup-verify":
            signup_verify(data["email"], data["password"], data["verification-code"]);
            break;
        case "logout":
            logout(data["login-id"], false);
            break;
        case "logout-all":
            logout(data["login-id"], true);
            break;
        case "get-data":
            get_data(data["login-id"], data["token"]);
            break;
        case "get-data-after-check-id":
            //do not call this function directly, it's called automatically by get-date
            get_data_after_check_id(data["login-id"], data["token"]);
            break;
        case "send-data":
            send_data(data["login-id"], data["token"], data["updated-locally"], data["data"]);
            break;
        case "send-data-after-check-id":
            //do not call this function directly, it's called automatically by send-date
            send_data_after_check_id(data["login-id"], data["token"], data["updated-locally"], data["data"]);
            break;
        default:
            console.error("Unknown API request type (" + message["type"] + ")");
    }
}

function signup(username_value, email_value, password_value) {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', api_url + '/signup/', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function () {
        // Check if the request was successful
        if (xhr.status >= 200 && xhr.status < 300) {
            // Parse the response JSON if needed
            var data = JSON.parse(xhr.responseText);
            // Do something with the data
            browser.runtime.sendMessage({
                "api_response": true,
                "type": "signup",
                "data": data
            });
        } else {
            // Handle errors
            console.error('Request failed with status:', xhr.status);
            browser.runtime.sendMessage({
                "api_response": true,
                "type": "signup",
                "data": {
                    "error": true,
                    "status": xhr.status
                }
            });
        }
    };
    xhr.onerror = function () {
        browser.runtime.sendMessage({
            "api_response": true,
            "type": "signup",
            "data": {
                "error": true,
                "status": xhr.status
            }
        });
    };
    xhr.send(JSON.stringify({
        "username": username_value,
        "email": email_value,
        "password": password_value
    }));
}

function signup_new_code(email_value, password_value) {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', api_url + '/signup/verify/get-new-code/', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function () {
        // Check if the request was successful
        if (xhr.status >= 200 && xhr.status < 300) {
            // Parse the response JSON if needed
            var data = JSON.parse(xhr.responseText);
            // Do something with the data
            browser.runtime.sendMessage({
                "api_response": true,
                "type": "signup-new-code",
                "data": data
            });
        } else {
            // Handle errors
            console.error('Request failed with status:', xhr.status);
            browser.runtime.sendMessage({
                "api_response": true,
                "type": "signup-new-code",
                "data": {
                    "error": true,
                    "status": xhr.status
                }
            });
        }
    };
    xhr.onerror = function () {
        browser.runtime.sendMessage({
            "api_response": true,
            "type": "signup-new-code",
            "data": {
                "error": true,
                "status": xhr.status
            }
        });
    };
    xhr.send(JSON.stringify({
        "email": email_value,
        "password": password_value
    }));
}

function signup_verify(email_value, password_value, verification_code_value) {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', api_url + '/signup/verify/', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function () {
        // Check if the request was successful
        if (xhr.status >= 200 && xhr.status < 300) {
            // Parse the response JSON if needed
            var data = JSON.parse(xhr.responseText);
            // Do something with the data
            browser.runtime.sendMessage({
                "api_response": true,
                "type": "signup-verify",
                "data": data
            });
        } else {
            // Handle errors
            console.error('Request failed with status:', xhr.status);
            browser.runtime.sendMessage({
                "api_response": true,
                "type": "signup-verify",
                "data": {
                    "error": true,
                    "status": xhr.status
                }
            });
        }
    };
    xhr.onerror = function () {
        browser.runtime.sendMessage({
            "api_response": true,
            "type": "signup-verify",
            "data": {
                "error": true,
                "status": xhr.status
            }
        });
    };
    xhr.send(JSON.stringify({
        "email": email_value,
        "password": password_value,
        "verification-code": verification_code_value
    }));
}

function login(email_value, password_value) {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', api_url + '/login/', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function () {
        // Check if the request was successful
        if (xhr.status >= 200 && xhr.status < 300) {
            // Parse the response JSON if needed
            var data = JSON.parse(xhr.responseText);
            // Do something with the data
            browser.runtime.sendMessage({
                "api_response": true,
                "type": "login",
                "data": data
            });
        } else {
            // Handle errors
            console.error('Request failed with status:', xhr.status);
            browser.runtime.sendMessage({
                "api_response": true,
                "type": "login",
                "data": {
                    "error": true,
                    "status": xhr.status
                }
            });
        }
    };
    xhr.onerror = function () {
        browser.runtime.sendMessage({
            "api_response": true,
            "type": "login",
            "data": {
                "error": true,
                "status": xhr.status
            }
        });
    };
    xhr.send(JSON.stringify({
        "email": email_value,
        "password": password_value
    }));
}

function login_new_code(email_value, password_value, login_id_value) {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', api_url + '/login/verify/get-new-code/', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function () {
        // Check if the request was successful
        if (xhr.status >= 200 && xhr.status < 300) {
            // Parse the response JSON if needed
            var data = JSON.parse(xhr.responseText);
            // Do something with the data
            browser.runtime.sendMessage({
                "api_response": true,
                "type": "login-new-code",
                "data": data
            });
        } else {
            // Handle errors
            console.error('Request failed with status:', xhr.status);
            browser.runtime.sendMessage({
                "api_response": true,
                "type": "login-new-code",
                "data": {
                    "error": true,
                    "status": xhr.status
                }
            });
        }
    };
    xhr.onerror = function () {
        browser.runtime.sendMessage({
            "api_response": true,
            "type": "login-new-code",
            "data": {
                "error": true,
                "status": xhr.status
            }
        });
    };
    xhr.send(JSON.stringify({
        "email": email_value,
        "password": password_value,
        "login-id": login_id_value
    }));
}

function login_verify(email_value, password_value, login_id_value, verification_code_value) {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', api_url + '/login/verify/', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function () {
        // Check if the request was successful
        if (xhr.status >= 200 && xhr.status < 300) {
            // Parse the response JSON if needed
            var data = JSON.parse(xhr.responseText);
            // Do something with the data
            browser.runtime.sendMessage({
                "api_response": true,
                "type": "login-verify",
                "data": data
            });
        } else {
            // Handle errors
            console.error('Request failed with status:', xhr.status);
            browser.runtime.sendMessage({
                "api_response": true,
                "type": "login-verify",
                "data": {
                    "error": true,
                    "status": xhr.status
                }
            });
        }
    };
    xhr.onerror = function () {
        browser.runtime.sendMessage({
            "api_response": true,
            "type": "login-verify",
            "data": {
                "error": true,
                "status": xhr.status
            }
        });
    };
    xhr.send(JSON.stringify({
        "email": email_value,
        "password": password_value,
        "login-id": login_id_value,
        "verification-code": verification_code_value
    }));
}

function logout(login_id_value, all_devices_value = false) {
    let get_params = "";
    if (all_devices_value) {
        get_params = "?all-devices=true";
    }
    let xhr = new XMLHttpRequest();
    xhr.open('POST', api_url + '/logout/' + get_params, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function () {
        // Check if the request was successful
        if (xhr.status >= 200 && xhr.status < 300) {
            // Parse the response JSON if needed
            var data = JSON.parse(xhr.responseText);
            // Do something with the data
            browser.runtime.sendMessage({
                "api_response": true,
                "type": "logout",
                "data": data
            });
        } else {
            // Handle errors
            console.error('Request failed with status:', xhr.status);
            browser.runtime.sendMessage({
                "api_response": true,
                "type": "logout",
                "data": {
                    "error": true,
                    "status": xhr.status
                }
            });
        }
    };
    xhr.onerror = function () {
        browser.runtime.sendMessage({
            "api_response": true,
            "type": "logout",
            "data": {
                "error": true,
                "status": xhr.status
            }
        });
    };
    xhr.send(JSON.stringify({
        "login-id": login_id_value
    }));
}

function get_data_after_check_id(login_id_value, token_value) {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', api_url + '/data/get/', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function () {
        // Check if the request was successful
        if (xhr.status >= 200 && xhr.status < 300) {
            // Parse the response JSON if needed
            var data = JSON.parse(xhr.responseText);
            // Do something with the data
            response({
                "api_response": true,
                "type": "get-data",
                "data": data
            });
        } else {
            // Handle errors
            console.error('Request failed with status:', xhr.status);
            response({
                "api_response": true,
                "type": "get-data",
                "data": {
                    "error": true,
                    "status": xhr.status
                }
            });
        }
    };
    xhr.onerror = function () {
        response({
            "api_response": true,
            "type": "get-data",
            "data": {
                "error": true,
                "status": xhr.status
            }
        });
    };
    xhr.send(JSON.stringify({
        "login-id": login_id_value,
        "token": token_value
    }));
}

function get_data(login_id_value, token_value) {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', api_url + '/login/check-id/', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function () {
        // Check if the request was successful
        if (xhr.status >= 200 && xhr.status < 300) {
            // Parse the response JSON if needed
            var data = JSON.parse(xhr.responseText);
            // Do something with the data
            api_request({
                "api": true,
                "type": "get-data-after-check-id",
                "data": {
                    "login-id": login_id_value,
                    "token": token_value
                }
            });
        } else {
            // Handle errors
            console.error('Request failed with status:', xhr.status);
            browser.runtime.sendMessage({
                "api_response": true,
                "type": "check-id-get",
                "data": {
                    "error": true,
                    "status": xhr.status
                }
            });
        }
    };
    xhr.onerror = function () {
        browser.runtime.sendMessage({
            "api_response": true,
            "type": "check-id-get",
            "data": {
                "error": true,
                "status": xhr.status
            }
        });
    };
    xhr.send(JSON.stringify({
        "login-id": login_id_value
    }));
}

function send_data_after_check_id(login_id_value, token_value, updated_locally_value, data_value) {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', api_url + '/data/insert/', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function () {
        // Check if the request was successful
        if (xhr.status >= 200 && xhr.status < 300) {
            // Parse the response JSON if needed
            var data = JSON.parse(xhr.responseText);
            // Do something with the data
            response({
                "api_response": true,
                "type": "send-data",
                "data": data
            });
        } else {
            // Handle errors
            console.error('Request failed with status:', xhr.status);
            response({
                "api_response": true,
                "type": "send-data",
                "data": {
                    "error": true,
                    "status": xhr.status
                }
            });
        }
    };
    xhr.onerror = function () {
        response({
            "api_response": true,
            "type": "send-data",
            "data": {
                "error": true,
                "status": xhr.status
            }
        });
    };
    xhr.send(JSON.stringify({
        "login-id": login_id_value,
        "token": token_value,
        "updated-locally": updated_locally_value,
        "data": data_value
    }));
}

function send_data(login_id_value, token_value, updated_locally_value, data_value) {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', api_url + '/login/check-id/', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function () {
        // Check if the request was successful
        if (xhr.status >= 200 && xhr.status < 300) {
            // Parse the response JSON if needed
            var data = JSON.parse(xhr.responseText);
            // Do something with the data
            api_request({
                "api": true,
                "type": "send-data-after-check-id",
                "data": {
                    "login-id": login_id_value,
                    "token": token_value,
                    "updated-locally": updated_locally_value,
                    "data": data_value
                }
            });
        } else {
            // Handle errors
            console.error('Request failed with status:', xhr.status);
            browser.runtime.sendMessage({
                "api": true,
                "type": "check-id-send",
                "data": {
                    "error": true,
                    "status": xhr.status
                }
            });
        }
    };
    xhr.onerror = function () {
        browser.runtime.sendMessage({
            "api": true,
            "type": "check-id-send",
            "data": {
                "error": true,
                "status": xhr.status
            }
        });
    };
    xhr.send(JSON.stringify({
        "login-id": login_id_value
    }));
}