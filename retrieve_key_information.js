import * as openpgp from './openpgp/dist/openpgp.min.mjs';

document.getElementById("retrievalButton").addEventListener('click', provideKeyInformation);
const publicKey_Armored = document.getElementById("publicKeyArmored");
const outputArea = document.getElementById("output");

async function provideKeyInformation() {
    if (publicKey_Armored.value !== "") {
        document.getElementById("retrievalButton").disabled = true;
        document.getElementById("retrievalButton").style.backgroundColor = "gray";
        try {
            const publicKeyArmored = publicKey_Armored.value;

            const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });

            const algorithmInfo = publicKey.getAlgorithmInfo();
            let bitsOrCurve = algorithmInfo.bits;
            if (!algorithmInfo.bits) {
                bitsOrCurve = algorithmInfo.curve;
            }
            const result = publicKey.getCreationTime();
            const creationDateSplit = result.toString().split(" ");
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
            const result2 = await publicKey.getExpirationTime();
            let expirationDate;
            if (result2.toString() !== "Infinity") {
                const expirationDateSplit = result2.toString().split(" ");
                if (expirationDateSplit[0] === "Mon") {
                    expirationDateSplit[0] = "Monday,";
                } else if (expirationDateSplit[0] === "Tue") {
                    expirationDateSplit[0] = "Tuesday,";
                } else if (expirationDateSplit[0] === "Wed") {
                    expirationDateSplit[0] = "Wednesday,";
                } else if (expirationDateSplit[0] === "Thu") {
                    expirationDateSplit[0] = "Thursday,";
                } else if (expirationDateSplit[0] === "Fri") {
                    expirationDateSplit[0] = "Friday,";
                } else if (expirationDateSplit[0] === "Sat") {
                    expirationDateSplit[0] = "Saturday,";
                } else {
                    expirationDateSplit[0] = "Sunday,";
                }
                if (expirationDateSplit[1] === "Jan") {
                    expirationDateSplit[1] = "January";
                } else if (expirationDateSplit[1] === "Feb") {
                    expirationDateSplit[1] = "Februaey";
                } else if (expirationDateSplit[1] === "Mar") {
                    expirationDateSplit[1] = "March";
                } else if (expirationDateSplit[1] === "Apr") {
                    expirationDateSplit[1] = "April";
                } else if (expirationDateSplit[1] === "Jun") {
                    expirationDateSplit[1] = "June";
                } else if (expirationDateSplit[1] === "Jul") {
                    expirationDateSplit[1] = "July";
                } else if (expirationDateSplit[1] === "Aug") {
                    expirationDateSplit[1] = "August";
                } else if (expirationDateSplit[1] === "Sep") {
                    expirationDateSplit[1] = "September";
                } else if (expirationDateSplit[1] === "Oct") {
                    expirationDateSplit[1] = "October";
                } else if (expirationDateSplit[1] === "Nov") {
                    expirationDateSplit[1] = "November";
                } else {
                    expirationDateSplit[1] = "December";
                }
                expirationDateSplit[2] += ",";
                expirationDateSplit[3] += ",";
                expirationDate = expirationDateSplit.join(" ");
            } else {
                expirationDate = "Never";
            }
            const fingerprint = publicKey.getFingerprint();
            const lastEightCharacters = fingerprint.slice(-8);
            const userIDs = publicKey.getUserIDs();
            outputArea.innerHTML =
`Algorithm: ${algorithmInfo.algorithm}
Bits/Curve: ${bitsOrCurve}
Creation Time: ${creationDate}
Expiration Time: ${expirationDate}
Fingerprint: ${fingerprint}
(last eight characters: ${lastEightCharacters})
User ID: ${userIDs[0]}`;
            emptyTextarea();
            document.getElementById("break").classList.add("hidden");
            document.getElementById("paragraph").classList.add("hidden");
            document.getElementById("error").classList.add("hidden");
        } catch (error) {
            document.getElementById("retrievalButton").disabled = false;
            document.getElementById("retrievalButton").style.backgroundColor = "#28a745";
            document.getElementById("break").classList.add("hidden");
            document.getElementById("paragraph").classList.add("hidden");
            document.getElementById("error").innerHTML = "There was an error during the process. Please, see if the entered pieces of information are correct and try again. (Error: " + error.message + ".)";
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
};