import * as openpgp from './openpgp/dist/openpgp.min.mjs';

document.getElementById("signingButton").addEventListener('click', sign);
const privateKey_Armored = document.getElementById("privateKeyArmored");
const pass_phrase = document.getElementById("passphrase");
const message = document.getElementById("message");
const outputArea = document.getElementById("output");

async function sign() {
    if (privateKey_Armored.value !== "" && pass_phrase.value !== "" && message.value !== "") {
        document.getElementById("signingButton").disabled = true;
        document.getElementById("signingButton").style.backgroundColor = "gray";
        try {
            const privateKeyArmored = privateKey_Armored.value;
            const passphrase = pass_phrase.value;

            const privateKey = await openpgp.decryptKey({
                privateKey: await openpgp.readPrivateKey({ armoredKey: privateKeyArmored }),
                passphrase
            });

            const cleartextMessage = await openpgp.sign({
                message: await openpgp.createCleartextMessage({ text: message.value }),
                signingKeys: privateKey
            });

            outputArea.innerHTML = cleartextMessage;
            emptyTextarea();
            document.getElementById("break").classList.add("hidden");
            document.getElementById("paragraph").classList.add("hidden");
            document.getElementById("incorrectPassphrase").classList.add("hidden");
            document.getElementById("error").classList.add("hidden");
        } catch (error) {
            if (error.message.includes("Incorrect key passphrase")) {
                document.getElementById("signingButton").disabled = false;
                document.getElementById("signingButton").style.backgroundColor = "#28a745";
                document.getElementById("break").classList.add("hidden");
                document.getElementById("paragraph").classList.add("hidden");
                document.getElementById("incorrectPassphrase").classList.remove("hidden");
                document.getElementById("error").classList.add("hidden");
            }  else {
                document.getElementById("signingButton").disabled = false;
                document.getElementById("signingButton").style.backgroundColor = "#28a745";
                document.getElementById("break").classList.add("hidden");
                document.getElementById("paragraph").classList.add("hidden");
                document.getElementById("incorrectPassphrase").classList.add("hidden");
                document.getElementById("error").innerHTML = "There was an error during the process. Please, see if the entered pieces of information are correct and try again. (Error: " + error.message + ".)"
                document.getElementById("error").classList.remove("hidden");
            }
        }
    } else {
        document.getElementById("break").classList.remove("hidden");
        document.getElementById("paragraph").classList.remove("hidden");
        document.getElementById("incorrectPassphrase").classList.add("hidden");
        document.getElementById("error").classList.add("hidden");
    }
};

function emptyTextarea() {
    document.getElementById("privateKeyArmored").value = "";
    document.getElementById("passphrase").value = "";
    document.getElementById("message").value = "";
};