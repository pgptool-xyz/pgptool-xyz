import * as openpgp from './openpgp/dist/openpgp.min.mjs';

document.getElementById("generateKeyButton").addEventListener('click', generateKeys);
const name = document.getElementById("name");
const email = document.getElementById("email");
const expiryDate = document.getElementById("expiry");
const passphrase = document.getElementById("passphrase");

async function generateKeys() {
    if (name.value !== "" && expiryDate.value !== "" && passphrase.value  !== "") {
        document.getElementById("generateKeyButton").disabled = true;
        document.getElementById("generateKeyButton").style.backgroundColor = "gray";
        document.getElementById("processUnderWay").classList.remove("hidden");
        try {
            const { privateKey, publicKey, revocationCertificate } = await openpgp.generateKey({
                type: 'ecc',
                curve: 'curve25519',
                userIDs: [{ name: name.value, email: email.value }],
                passphrase: passphrase.value,
                keyExpirationTime: expiryDate.value,
                format: 'armored'
            });
            const publicKeyObject = await openpgp.readKey({ armoredKey: publicKey });
            const fingerprint = publicKeyObject.getFingerprint();
            const lastEightCharacters = fingerprint.slice(-8);
            downloadFile(`publicKey_0x${lastEightCharacters}.asc`, publicKey);
            downloadFile(`privateKey_0x${lastEightCharacters}.asc`, privateKey);
            downloadFile(`${fingerprint}.rev`, revocationCertificate);
            document.getElementById("break").classList.add("hidden");
            document.getElementById("paragraph").classList.add("hidden");
            document.getElementById("error").classList.add("hidden");
            document.getElementById("processUnderWay").classList.add("hidden");
        } catch (error) {
            document.getElementById("generateKeyButton").disabled = false;
            document.getElementById("generateKeyButton").style.backgroundColor = "#28a745";
            document.getElementById("break").classList.add("hidden");
            document.getElementById("paragraph").classList.add("hidden");
            document.getElementById("error").innerHTML = "There was an error during the process. Please, try again. (Error: " + error.message + ".)";
            document.getElementById("error").classList.remove("hidden");
            document.getElementById("processUnderWay").classList.add("hidden");
        }
    } else {
        document.getElementById("break").classList.remove("hidden");
        document.getElementById("paragraph").classList.remove("hidden");
        document.getElementById("error").classList.add("hidden");
        document.getElementById("processUnderWay").classList.add("hidden");
    }
};

function downloadFile(fileName, content) {
    const blob = new Blob([content], { type: 'application/pgp-keys' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    
    document.body.appendChild(a);
    a.click();
    
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    emptyTextarea();
};

function emptyTextarea() {
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("passphrase").value = "";
};