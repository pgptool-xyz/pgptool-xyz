import * as openpgp from './openpgp/dist/openpgp.min.mjs';

document.getElementById("encryptionButton").addEventListener('click', encrypt);
const publicKey_Armored = document.getElementById("publicKeyArmored");
const privateKey_Armored = document.getElementById("privateKeyArmored");
const pass_phrase = document.getElementById("passphrase");
const message = document.getElementById("message");
const outputArea = document.getElementById("output");

async function encrypt() {
    if (publicKey_Armored.value !== "" && message.value !== "") {
        document.getElementById("encryptionButton").disabled = true;
        document.getElementById("encryptionButton").style.backgroundColor = "gray";
        try {
            if (privateKey_Armored.value === "") {
                const publicKeyArmored = publicKey_Armored.value;

                const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });

                const encrypted = await openpgp.encrypt({
                    message: await openpgp.createMessage({ text: message.value }),
                    encryptionKeys: publicKey,
                });

                outputArea.innerHTML = encrypted;
                emptyTextarea();
                document.getElementById("break").classList.add("hidden");
                document.getElementById("paragraph").classList.add("hidden");
                document.getElementById("incorrectPassphrase").classList.add("hidden");
                document.getElementById("emptyPassphrase").classList.add("hidden");
                document.getElementById("error").classList.add("hidden");
            } else {
                if (pass_phrase.value !== "") {
                    const publicKeyArmored = publicKey_Armored.value;
                    const privateKeyArmored = privateKey_Armored.value;
                    const passphrase = pass_phrase.value;

                    const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });

                    const privateKey = await openpgp.decryptKey({
                        privateKey: await openpgp.readPrivateKey({ armoredKey: privateKeyArmored }),
                        passphrase
                    });

                    const encrypted = await openpgp.encrypt({
                        message: await openpgp.createMessage({ text: message.value }),
                        encryptionKeys: publicKey,
                        signingKeys: privateKey
                    });

                    outputArea.innerHTML = encrypted;
                    emptyTextarea();
                    document.getElementById("break").classList.add("hidden");
                    document.getElementById("paragraph").classList.add("hidden");
                    document.getElementById("incorrectPassphrase").classList.add("hidden");
                    document.getElementById("emptyPassphrase").classList.add("hidden");
                    document.getElementById("error").classList.add("hidden");
                } else {
                    document.getElementById("encryptionButton").disabled = false;
                    document.getElementById("encryptionButton").style.backgroundColor = "#28a745";
                    document.getElementById("break").classList.add("hidden");
                    document.getElementById("paragraph").classList.add("hidden");
                    document.getElementById("incorrectPassphrase").classList.add("hidden");
                    document.getElementById("emptyPassphrase").classList.remove("hidden");
                    document.getElementById("error").classList.add("hidden");
                }
            }
        } catch (error) {
            if (error.message.includes("Incorrect key passphrase")) {
                document.getElementById("encryptionButton").disabled = false;
                document.getElementById("encryptionButton").style.backgroundColor = "#28a745";
                document.getElementById("break").classList.add("hidden");
                document.getElementById("paragraph").classList.add("hidden");
                document.getElementById("incorrectPassphrase").classList.remove("hidden");
                document.getElementById("emptyPassphrase").classList.add("hidden");
                document.getElementById("error").classList.add("hidden");
            } else {
                document.getElementById("encryptionButton").disabled = false;
                document.getElementById("encryptionButton").style.backgroundColor = "#28a745";
                document.getElementById("break").classList.add("hidden");
                document.getElementById("paragraph").classList.add("hidden");
                document.getElementById("incorrectPassphrase").classList.add("hidden");
                document.getElementById("emptyPassphrase").classList.add("hidden");
                document.getElementById("error").innerHTML = "There was an error during the process. Please, see if the entered pieces of information are correct and try again. (Error: " + error.message + ".)";
                document.getElementById("error").classList.remove("hidden");
            }
        }
    } else {
        document.getElementById("break").classList.remove("hidden");
        document.getElementById("paragraph").classList.remove("hidden");
        document.getElementById("incorrectPassphrase").classList.add("hidden");
        document.getElementById("emptyPassphrase").classList.add("hidden");
        document.getElementById("error").classList.add("hidden");
    }
};

function emptyTextarea() {
    document.getElementById("publicKeyArmored").value = "";
    document.getElementById("privateKeyArmored").value = "";
    document.getElementById("passphrase").value = "";
    document.getElementById("message").value = "";
};