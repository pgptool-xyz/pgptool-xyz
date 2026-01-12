import * as openpgp from './openpgp/dist/openpgp.min.mjs';

document.getElementById("revokeKeyButton").addEventListener('click', revokeAKey);
document.getElementById("revokeKeyButton2").addEventListener('click', revokeAKey2);

async function revokeAKey() {
    if (document.getElementById("publicKeyArmored").value !== "" && document.getElementById("revocationCertificate").value !== "") {
        document.getElementById("revokeKeyButton").disabled = true;
        document.getElementById("revokeKeyButton").style.backgroundColor = "gray";
        try {
            const publicKeyArmored = document.getElementById("publicKeyArmored").value;
            const revocationCertificate = document.getElementById("revocationCertificate").value;
            const keyRevocationReason_ = document.getElementById("keyRevocationReason").value;
            const { publicKey: revokedKeyArmored } = await openpgp.revokeKey({
                key: await openpgp.readKey({ armoredKey: publicKeyArmored }),
                revocationCertificate,
                reasonForRevocation: keyRevocationReason_,
                format: 'armored'
            });
            const publicKeyObject = await openpgp.readKey({ armoredKey: publicKeyArmored });
            const fingerprint = publicKeyObject.getFingerprint();
            const lastEightCharacters = fingerprint.slice(-8);
            downloadFile(`revokedPublicKey_0x${lastEightCharacters}.asc`, revokedKeyArmored);
            emptyTextarea();
            document.getElementById("break").classList.add("hidden");
            document.getElementById("paragraph").classList.add("hidden");
            document.getElementById("error").classList.add("hidden");
        } catch (error) {
            document.getElementById("revokeKeyButton").disabled = false;
            document.getElementById("revokeKeyButton").style.backgroundColor = "#28a745";
            document.getElementById("break").classList.add("hidden");
            document.getElementById("paragraph").classList.add("hidden");
            document.getElementById("error").innerHTML = "There was an error during the process. Please, try again. (Error: " + error.message + ".)";
            document.getElementById("error").classList.remove("hidden");
        }
    } else {
        document.getElementById("break").classList.remove("hidden");
        document.getElementById("paragraph").classList.remove("hidden");
        document.getElementById("error").classList.add("hidden");
    }
};

async function revokeAKey2() {
    if (document.getElementById("privateKeyArmored").value !== "" &&  document.getElementById("passphrase").value !== "") {
        document.getElementById("revokeKeyButton2").disabled = true;
        document.getElementById("revokeKeyButton2").style.backgroundColor = "gray";
        try {
            const privateKeyArmored = document.getElementById("privateKeyArmored").value;
            const passphrase = document.getElementById("passphrase").value;
            const keyRevocationReason2_ = document.getElementById("keyRevocationReason2").value;
            const { publicKey: revokedKeyArmored } = await openpgp.revokeKey({
                key: await openpgp.decryptKey({
                    privateKey: await openpgp.readPrivateKey({ armoredKey: privateKeyArmored }),
                    passphrase
                }),
                reasonForRevocation: keyRevocationReason2_,
                format: 'armored'
            });
            const privateKeyObject = await openpgp.readKey({ armoredKey: privateKeyArmored });
            const fingerprint = privateKeyObject.getFingerprint();
            const lastEightCharacters = fingerprint.slice(-8);
            downloadFile(`revokedPublicKey_0x${lastEightCharacters}.asc`, revokedKeyArmored);
            emptyTextarea2();
            document.getElementById("break2").classList.add("hidden");
            document.getElementById("paragraph2").classList.add("hidden");
            document.getElementById("incorrectPassphrase2").classList.add("hidden");
            document.getElementById("error2").classList.add("hidden");
        } catch (error) {
            if (error.message.includes("Incorrect key passphrase")) {
                document.getElementById("revokeKeyButton2").disabled = false;
                document.getElementById("revokeKeyButton2").style.backgroundColor = "#28a745";
                document.getElementById("break2").classList.add("hidden");
                document.getElementById("paragraph2").classList.add("hidden");
                document.getElementById("incorrectPassphrase2").classList.remove("hidden");
                document.getElementById("error2").classList.add("hidden");
            } else {
                document.getElementById("revokeKeyButton2").disabled = false;
                document.getElementById("revokeKeyButton2").style.backgroundColor = "#28a745";
                document.getElementById("break2").classList.add("hidden");
                document.getElementById("paragraph2").classList.add("hidden");
                document.getElementById("incorrectPassphrase2").classList.add("hidden");
                document.getElementById("error2").innerHTML = "There was an error during the process. Please, try again. (Error: " + error.message + ".)";
                document.getElementById("error2").classList.remove("hidden");
            }
        }
    } else {
        document.getElementById("break2").classList.remove("hidden");
        document.getElementById("paragraph2").classList.remove("hidden");
        document.getElementById("incorrectPassphrase2").classList.add("hidden");
        document.getElementById("error2").classList.add("hidden");
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
};

function emptyTextarea() {
    document.getElementById("publicKeyArmored").value = "";
    document.getElementById("revocationCertificate").value = "";
};

function emptyTextarea2() {
    document.getElementById("privateKeyArmored").value = "";
    document.getElementById("passphrase").value = "";
};