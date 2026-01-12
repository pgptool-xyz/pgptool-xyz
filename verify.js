import * as openpgp from './openpgp/dist/openpgp.min.mjs';

document.getElementById("verificationButton").addEventListener('click', verify);
const publicKey_Armored = document.getElementById("publicKeyArmored");
const message = document.getElementById("message");
const signatureOutputArea = document.getElementById("signatureOutput");

async function verify() {
    if (publicKey_Armored.value !== "" && message.value !== "") {
        document.getElementById("verificationButton").disabled = true;
        document.getElementById("verificationButton").style.backgroundColor = "gray";
        try {
            const publicKeyArmored = publicKey_Armored.value;
            const cleartextMessage = message.value;

            const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });

            const verificationResult = await openpgp.verify({
                message: await openpgp.readCleartextMessage({ cleartextMessage
                }),
                verificationKeys: publicKey
            });

            const { keyID, signature, verified } = verificationResult.signatures[0];
            try {
                await verified;
                try {
                    const result = await signature;
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
                    signatureOutputArea.innerHTML = "The signature is valid and was created on " + creationDate + " by " + keyID.toHex() + ".";
                } catch (error) {
                    throw new Error("Error: " + error.message);
                }
            } catch (error) {
                signatureOutputArea.innerHTML = "Signature could not be verified.";
            }
            emptyTextarea();
            document.getElementById("break").classList.add("hidden");
            document.getElementById("paragraph").classList.add("hidden");
            document.getElementById("error").classList.add("hidden");
        } catch (error) {
                document.getElementById("verificationButton").disabled = false;
                document.getElementById("verificationButton").style.backgroundColor = "#28a745";
                document.getElementById("break").classList.add("hidden");
                document.getElementById("paragraph").classList.add("hidden");
                document.getElementById("error").innerHTML = "There was an error during the process. Please, see if the entered pieces of information are correct and try again. (Error: " + error.message + ".)"
                document.getElementById("error").classList.remove("hidden");
        }
    } else {
        document.getElementById("break").classList.remove("hidden");
        document.getElementById("paragraph").classList.remove("hidden");
        document.getElementById("error").classList.add("hidden");
    }
};

function emptyTextarea() {
    document.getElementById("publicKeyArmored").value = "";
    document.getElementById("message").value = "";
};