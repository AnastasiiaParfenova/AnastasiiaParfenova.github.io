window.addEventListener("resize", onResize);

var isBigPicOpened = false;
var isHelpOpened = false;
var currentModuleScreen = null;

function getCookie(name) {
    var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie(name, value, options) {
    options = options || {};

    var expires = options.expires;

    if (typeof expires == "number" && expires) {
        var d = new Date();
        d.setTime(d.getTime() + expires * 1000);
        expires = options.expires = d;
    }
    if (expires && expires.toUTCString) {
        options.expires = expires.toUTCString();
    }

    value = encodeURIComponent(value);

    var updatedCookie = name + "=" + value;

    for (var propName in options) {
        updatedCookie += "; " + propName;
        var propValue = options[propName];
        if (propValue !== true) {
            updatedCookie += "=" + propValue;
        }
    }

    document.cookie = updatedCookie;
}

function deleteCookie(name) {
    setCookie(name, "", {
        expires: -1
    })
}

function getStyles(elem) {
    return elem.currentStyle || window.getComputedStyle(elem);
}

function setVH(vh, direction, elemID) {
    // В IE8 нет vh и vw
    // Эмуляция единиц vh
    // direction = Top || Bottom
    var h = window.innerHeight;
    var elem = document.getElementById(elemID);
    elem.style["margin" + direction] =  [(h / 100 * vh).toString(), "px"].join("");
}

function setVW(vw, direction, elemID) {
    // В IE8 нет vh и vw
    // Эмуляция единиц vh
    // direction = Top || Bottom
    var w = window.innerWidth;
    var elem = document.getElementById(elemID);
    elem.style["margin" + direction] =  [(w / 100 * vw).toString(), "px"].join("");
}

function domReady() {
    console.log("Dom ready");

    window.addEventListener("keyup", kp);

    if (getCookie('picSrc') && getCookie('fullPic')) {
        genFullPic({'picStr': getCookie('picSrc'), 'fullPic': getCookie('fullPic')});
    }
}

function onResize() {
    var w = window.innerWidth;
    var h = window.innerHeight;
    console.log(w, h);
    setVH(30, "Top", "gallery-main");
    setVH(20, "Bottom", "gallery-main");
}

function genFullPic(cookie, e) {
    if (cookie) {
        var picSrc = cookie['picSrc'];
        var fullPic = cookie['fullPic'];
    } else {
        var picSrc = e.src;
        var fullPic = e.getAttribute('data-full-pic');
    }
    console.log(cookie, e);
    console.log(picSrc, fullPic);
    var bigPicWrapper = document.createElement('div');
    bigPicWrapper.setAttribute('class', 'big-pic');
    bigPicWrapper.setAttribute('id', 'big-pic');
    var bigPic = document.createElement('img');
    //bigPic.setAttribute('class', 'pure-img');
    bigPic.setAttribute('onclick', 'closeFullPic(this)');
    bigPic.setAttribute('alt', 'bigpic');
    bigPic.setAttribute('src', 'images/placeholder.gif');
    bigPicWrapper.appendChild(bigPic);
    var downloadingImage = new Image();
    downloadingImage.onload = function() {
        var that = this;
        setTimeout(function () {bigPic.src = that.src;}, 1000);
    };
    downloadingImage.src = fullPic;
    document.getElementById("blanket").appendChild(bigPicWrapper);
    document.getElementById("blanket").style.display = "table";
    isBigPicOpened = true;
    setCookie('picSrc', picSrc, {'expires': 99999});
    setCookie('fullPic', fullPic, {'expires': 99999});
}

function genInfo() {
    document.getElementById("blanket").style.display = "block";
    document.getElementById("info").style.display = "block";
    isHelpOpened = true;
}

function exitBigPic(e) {
    var bigPicWrapper = document.getElementById('big-pic');
    document.getElementById("blanket").style.display = "none";
    document.getElementById("blanket").removeChild(bigPicWrapper);
}

function exitHelp() {
    document.getElementById("blanket").style.display = "none";
    document.getElementById("info").style.display = "none";
}

function exitModuleScreen() {
    if (isHelpOpened) {
        exitHelp();
        isHelpOpened = false;
    }
    if (isBigPicOpened) {
        exitBigPic();
        isBigPicOpened = false;
        if (getCookie('picSrc')) {
            deleteCookie('picSrc');
        }
    }
}

function kp (e) {
    console.log(e);
    var code = e.keyCode || e.which;
    if (code === 27) {
        console.log("escape key-up pressed");
        if (isBigPicOpened) {
            exitBigPic(null);
            isBigPicOpened = false;
        }
        if (isHelpOpened) {
            exitHelp();
            isHelpOpened = false;
        }
    }
    if (code === 112) {
        console.log("f1 key-up pressed");
        genInfo();
    }
}