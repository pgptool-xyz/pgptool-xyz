import * as openpgp from './openpgp/dist/openpgp.min.mjs';

document.getElementById("decryptionButton").addEventListener('click', decrypt)
const encryptedMessage = document.getElementById("message");
const publicKey_Armored = document.getElementById("publicKeyArmored");
const pass_phrase = document.getElementById("passphrase");
const privateKey_Armored = document.getElementById("privateKeyArmored");
const outputArea = document.getElementById("output");
const signatureOutputArea = document.getElementById("signatureOutput");

async function decrypt() {
    if (encryptedMessage.value !== "" && privateKey_Armored.value !== "" && passphrase.value !== "") {
        document.getElementById("decryptionButton").disabled = true;
        document.getElementById("decryptionButton").style.backgroundColor = "gray";
        try {
            if (publicKey_Armored.value === "") {
                const privateKeyArmored = privateKey_Armored.value;
                const passphrase = pass_phrase.value;
                const signedOnly = document.getElementById("signedOnly").checked;

                const privateKey = await openpgp.decryptKey({
                    privateKey: await openpgp.readPrivateKey({ armoredKey: privateKeyArmored }),
                    passphrase
                });
    
                const message = await openpgp.readMessage({
                    armoredMessage: encryptedMessage.value
                });

                const { data: decrypted } = await openpgp.decrypt({
                    message,
                    decryptionKeys: privateKey,
                    expectSigned: signedOnly
                });
                outputArea.innerHTML = decrypted;
                emptyTextarea();
                document.getElementById("break").classList.add("hidden");
                document.getElementById("paragraph").classList.add("hidden");
                document.getElementById("incorrectPassphrase").classList.add("hidden");
                document.getElementById("notSigned").classList.add("hidden");
                document.getElementById("error").classList.add("hidden");
            } else {
                const publicKeyArmored = publicKey_Armored.value;
                const privateKeyArmored = privateKey_Armored.value;
                const passphrase = pass_phrase.value;
                const signedOnly = document.getElementById("signedOnly").checked;

                const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });
    
                const privateKey = await openpgp.decryptKey({
                    privateKey: await openpgp.readPrivateKey({ armoredKey: privateKeyArmored }),
                    passphrase
                });
    
                const message = await openpgp.readMessage({
                    armoredMessage: encryptedMessage.value
                });

                const { data: decrypted, signatures } = await openpgp.decrypt({
                    message,
                    verificationKeys: publicKey,
                    decryptionKeys: privateKey,
                    expectSigned: signedOnly
                });
                outputArea.innerHTML = decrypted;

                try {
                    await signatures[0].verified;
                    try {
                        const result = await signatures[0].signature;
                        const creationDateSplit = result.packets[0].created.toString().split(" ");
                        if (creationDateSplit[0] === "Mon") {
                            creationDateSplit[0] = "Monday,";
                        } else if (creationDateSplit[0] === "Tue") {
                            creationDateSplit[0] = "Tuesday,";
                        } else if (creationDateSplit[0] === "Wed") {
                            creationDateSplit[0] = "Wednesday,";
                        } else if (creationDateSplit[0] === "Thu") {
                            creationDateSplit[0] = "Thursday,";
                        } else if (creationDateSplit[0] === "Fri") {
                            creationDateSplit[0] = "Friday,";
                        } else if (creationDateSplit[0] === "Sat") {
                            creationDateSplit[0] = "Saturday,";
                        } else {
                            creationDateSplit[0] = "Sunday,";
                        }
                        if (creationDateSplit[1] === "Jan") {
                            creationDateSplit[1] = "January";
                        } else if (creationDateSplit[1] === "Feb") {
                            creationDateSplit[1] = "Februaey";
                        } else if (creationDateSplit[1] === "Mar") {
                            creationDateSplit[1] = "March";
                        } else if (creationDateSplit[1] === "Apr") {
                            creationDateSplit[1] = "April";
                        } else if (creationDateSplit[1] === "Jun") {
                            creationDateSplit[1] = "June";
                        } else if (creationDateSplit[1] === "Jul") {
                            creationDateSplit[1] = "July";
                        } else if (creationDateSplit[1] === "Aug") {
                            creationDateSplit[1] = "August";
                        } else if (creationDateSplit[1] === "Sep") {
                            creationDateSplit[1] = "September";
                        } else if (creationDateSplit[1] === "Oct") {
                            creationDateSplit[1] = "October";
                        } else if (creationDateSplit[1] === "Nov") {
                            creationDateSplit[1] = "November";
                        } else {
                            creationDateSplit[1] = "December";
                        }
                        creationDateSplit[2] += ",";
                        creationDateSplit[3] += ",";
                        const creationDate = creationDateSplit.join(" ");
                        signatureOutputArea.innerHTML = "The signature is valid and was created on " + creationDate + " by " + signatures[0].keyID.toHex() + ".";
                    } catch (error) {
                        throw new Error("Error: " + error.message);
                    }
                } catch (error) {
                    signatureOutputArea.innerHTML = "Signature could not be verified.";
                }
                emptyTextarea();
                document.getElementById("break").classList.add("hidden");
                document.getElementById("paragraph").classList.add("hidden");
                document.getElementById("incorrectPassphrase").classList.add("hidden");
                document.getElementById("verificationKeysRequired").classList.add("hidden");
                document.getElementById("notSigned").classList.add("hidden");
                document.getElementById("error").classList.add("hidden");
            }
        } catch (error) {
            if (error.message.includes("Incorrect key passphrase")) {
                document.getElementById("decryptionButton").disabled = false;
                document.getElementById("decryptionButton").style.backgroundColor = "#28a745";
                document.getElementById("break").classList.add("hidden");
                document.getElementById("paragraph").classList.add("hidden");
                document.getElementById("incorrectPassphrase").classList.remove("hidden");
                document.getElementById("verificationKeysRequired").classList.add("hidden");
                document.getElementById("notSigned").classList.add("hidden");
                document.getElementById("error").classList.add("hidden");
            } else if (error.message.includes("Verification keys are required to verify message signatures")) {
                document.getElementById("decryptionButton").disabled = false;
                document.getElementById("decryptionButton").style.backgroundColor = "#28a745";
                document.getElementById("break").classList.add("hidden");
                document.getElementById("paragraph").classList.add("hidden");
                document.getElementById("incorrectPassphrase").classList.add("hidden");
                document.getElementById("verificationKeysRequired").classList.remove("hidden");
                document.getElementById("notSigned").classList.add("hidden");
                document.getElementById("error").classList.add("hidden");
            } else if (error.message.includes("Message is not signed")) {
                document.getElementById("decryptionButton").disabled = false;
                document.getElementById("decryptionButton").style.backgroundColor = "#28a745";
                document.getElementById("break").classList.add("hidden");
                document.getElementById("paragraph").classList.add("hidden");
                document.getElementById("incorrectPassphrase").classList.add("hidden");
                document.getElementById("verificationKeysRequired").classList.add("hidden");
                document.getElementById("notSigned").classList.remove("hidden");
                document.getElementById("error").classList.add("hidden");
            } else {
                document.getElementById("decryptionButton").disabled = false;
                document.getElementById("decryptionButton").style.backgroundColor = "#28a745";
                document.getElementById("break").classList.add("hidden");
                document.getElementById("paragraph").classList.add("hidden");
                document.getElementById("incorrectPassphrase").classList.add("hidden");
                document.getElementById("verificationKeysRequired").classList.add("hidden");
                document.getElementById("notSigned").classList.add("hidden");
                document.getElementById("error").innerHTML = "There was an error during the process. Please, see if the entered pieces of information are correct and try again. (Error: " + error.message + ".)";
                document.getElementById("error").classList.remove("hidden");
            }
        }
    } else {
        document.getElementById("break").classList.remove("hidden");
        document.getElementById("paragraph").classList.remove("hidden");
        document.getElementById("incorrectPassphrase").classList.add("hidden");
        document.getElementById("verificationKeysRequired").classList.add("hidden");
        document.getElementById("notSigned").classList.add("hidden");
        document.getElementById("error").classList.add("hidden");
    }
};

function emptyTextarea() {
    document.getElementById("message").value = "";
    document.getElementById("publicKeyArmored").value = "";
    document.getElementById("privateKeyArmored").value = "";
    document.getElementById("passphrase").value = "";
};