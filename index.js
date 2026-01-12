document.querySelector(".js-enabled").style.display = "block";

document.getElementById("navOpeningButton").addEventListener('click', openNav);
document.getElementById("navClosureButton").addEventListener('click', closeNav);
document.getElementById("redirect1").addEventListener('click', redirect1);
document.getElementById("redirect2").addEventListener('click', redirect2);
document.getElementById("redirect3").addEventListener('click', redirect3);
document.getElementById("redirect4").addEventListener('click', redirect4);
document.getElementById("redirect5").addEventListener('click', redirect5);
document.getElementById("redirect6").addEventListener('click', redirect6);
document.getElementById("redirect7").addEventListener('click', redirect7);
document.getElementById("redirect8").addEventListener('click', redirect8);
document.getElementById("redirect1_").addEventListener('click', redirect1_);
document.getElementById("redirect2_").addEventListener('click', redirect2_);
document.getElementById("redirect3_").addEventListener('click', redirect3_);
document.getElementById("redirect4_").addEventListener('click', redirect4_);
document.getElementById("redirect5_").addEventListener('click', redirect5_);
document.getElementById("redirect6_").addEventListener('click', redirect6_);
document.getElementById("redirect7_").addEventListener('click', redirect7_);
document.getElementById("redirect8_").addEventListener('click', redirect8_);

function openNav() {
    document.getElementById("navPortrait").classList.remove("hidden");
    document.getElementById("noNavPortrait").classList.add("hidden");
};

function closeNav() {
    document.getElementById("navPortrait").classList.add("hidden");
    document.getElementById("noNavPortrait").classList.remove("hidden");
};

function redirect1() {
    window.location.href = "generate_rsa_key_pair.html";
};

function redirect2() {
    window.location.href = "generate_ecc_key_pair.html";
};

function redirect3() {
    window.location.href = "encrypt.html";
};

function redirect4() {
    window.location.href = "decrypt.html";
};

function redirect5() {
    window.location.href = "sign.html";
};

function redirect6() {
    window.location.href = "verify.html";
};

function redirect7() {
    window.location.href = "revoke_a_key.html";
};

function redirect8()  {
    window.location.href = "retrieve_key_information.html";
};

function redirect1_() {
    window.location.href = "generate_rsa_key_pair.html";
};

function redirect2_() {
    window.location.href = "generate_ecc_key_pair.html";
};

function redirect3_() {
    window.location.href = "encrypt.html";
};

function redirect4_() {
    window.location.href = "decrypt.html";
};

function redirect5_() {
    window.location.href = "sign.html";
};

function redirect6_() {
    window.location.href = "verify.html";
};

function redirect7_() {
    window.location.href = "revoke_a_key.html";
};

function redirect8_() {
    window.location.href = "retrieve_key_information.html";
};