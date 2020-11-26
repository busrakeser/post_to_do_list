var loginStatus = false;
var url = " http://egitim-api.sercanozen.com.tr";

(function () {

    let token = sessionStorage.getItem("token");

    if (token !== null) {
        let lastLogin = sessionStorage.getItem("time");
        let date = new Date(lastLogin);
        let now = new Date();
        let resultDate = now - date;
        resultDate /= 1000;
        resultDate = parseInt(resultDate / 60);
        if (resultDate < 120){
            loginStatus = true;
        }
        else {
            loginStatus = false;
            sessionStorage.clear();
        }
    }
})();