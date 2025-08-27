function caesarDecrypt(encrypted, key) {
    let decrypted = '';
    for (let i = 0; i < encrypted.length; i++) {
        const digit = parseInt(encrypted[i]);
        let decryptedDigit = digit - key;
        
        // Handle negative numbers with mod 10
        if (decryptedDigit < 0) {
            decryptedDigit += 10;
        }
        
        decrypted += decryptedDigit.toString();
    }
    return decrypted;
}

function polyalphabeticDecrypt(encrypted, key) {
    encrypted = encrypted.toUpperCase();
    key = key.toUpperCase();
    let decrypted = '';
    
    // Remove non-alphabetic characters from key
    const cleanKey = key.replace(/[^A-Z]/g, '');
    if (cleanKey.length === 0) {
        return "Kunci tidak valid";
    }
    
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let keyIndex = 0;
    
    for (let i = 0; i < encrypted.length; i++) {
        const encryptedChar = encrypted[i];
        
        // Skip non-alphabetic characters
        if (!alphabet.includes(encryptedChar)) {
            decrypted += encryptedChar;
            continue;
        }
        
        const keyChar = cleanKey[keyIndex % cleanKey.length];
        const rowIndex = alphabet.indexOf(keyChar);
        const colIndex = alphabet.indexOf(encryptedChar);
        const decryptedChar = alphabet[(colIndex - rowIndex + 26) % 26];
        
        decrypted += decryptedChar;
        keyIndex++;
    }
    
    return decrypted;
}

function analyzeSecurity() {
    const nim = document.getElementById('nim').value;
    const caesarKey = parseInt(document.getElementById('caesar-key').value);
    const nama = document.getElementById('nama').value;
    const polyKey = document.getElementById('poly-key').value;
    
    // Validasi input
    if (!nim || !nama || !polyKey) {
        alert('Harap isi semua field!');
        return;
    }
    
    if (!/^\d{12}$/.test(nim)) {
        alert('NIM harus 12 digit angka!');
        return;
    }
    
    if (caesarKey < 0 || caesarKey > 9) {
        alert('Kunci Caesar harus antara 0-9!');
        return;
    }
    
    // Decrypt data
    const decryptedNim = caesarDecrypt(nim, caesarKey);
    const decryptedNama = polyalphabeticDecrypt(nama, polyKey);
    
    // Calculate security metrics
    const securityMetrics = calculateSecurityMetrics(caesarKey, polyKey);
    
    // Display results
    displayResults(nim, decryptedNim, nama.toUpperCase(), decryptedNama, securityMetrics);
}

function calculateSecurityMetrics(caesarKey, polyKey) {
    // Calculate brute force complexity
    const caesarComplexity = 10; // 10 possible keys (0-9)
    const polyComplexity = Math.pow(26, polyKey.length);
    const totalComplexity = caesarComplexity * polyComplexity;
    
    // Estimate time to brute force (1 million attempts per second)
    const attemptsPerSecond = 1000000;
    const secondsToCrack = totalComplexity / attemptsPerSecond;
    
    // Convert to human-readable time
    let timeToCrack;
    if (secondsToCrack < 60) {
        timeToCrack = `${Math.round(secondsToCrack)} detik`;
    } else if (secondsToCrack < 3600) {
        timeToCrack = `${Math.round(secondsToCrack / 60)} menit`;
    } else if (secondsToCrack < 86400) {
        timeToCrack = `${Math.round(secondsToCrack / 3600)} jam`;
    } else if (secondsToCrack < 31536000) {
        timeToCrack = `${Math.round(secondsToCrack / 86400)} hari`;
    } else {
        timeToCrack = `${Math.round(secondsToCrack / 31536000)} tahun`;
    }
    
    // Determine vulnerability level
    let vulnerability, recommendation, securityClass;
    
    if (polyKey.length <= 3) {
        vulnerability = "Sangat Rentan";
        securityClass = "not-secure";
        recommendation = "Kunci terlalu pendek. Gunakan kunci polyalphabetic minimal 8 karakter untuk keamanan yang lebih baik.";
    } else if (polyKey.length <= 7) {
        vulnerability = "Rentan";
        securityClass = "somewhat-secure";
        recommendation = "Kunci masih terlalu pendek. Disarankan menggunakan kunci minimal 8 karakter dengan kombinasi huruf dan angka.";
    } else if (polyKey.length <= 14) {
        vulnerability = "Cukup Aman";
        securityClass = "secure";
        recommendation = "Sistem cukup aman, tetapi bisa ditingkatkan dengan kunci yang lebih panjang dan kompleks.";
    } else {
        vulnerability = "Sangat Aman";
        securityClass = "very-secure";
        recommendation = "Sistem sangat aman terhadap serangan brute force dengan konfigurasi saat ini.";
    }
    
    // Add warning if Caesar key is trivial
    if (caesarKey <= 1 || caesarKey >= 9) {
        vulnerability += " (Perhatian: Kunci Caesar terlalu sederhana)";
        recommendation += " Hindari menggunakan kunci Caesar yang terlalu sederhana (0,1,9). Gunakan kunci antara 2-8.";
    }
    
    return {
        vulnerability: vulnerability,
        complexity: totalComplexity.toExponential(2),
        timeToCrack: timeToCrack,
        recommendation: recommendation,
        securityClass: securityClass
    };
}

function displayResults(encryptedNim, decryptedNim, encryptedNama, decryptedNama, metrics) {
    document.getElementById('encrypted-nim').textContent = encryptedNim;
    document.getElementById('decrypted-nim').textContent = decryptedNim;
    document.getElementById('encrypted-nama').textContent = encryptedNama;
    document.getElementById('decrypted-nama').textContent = decryptedNama;
    
    document.getElementById('vulnerability-level').textContent = metrics.vulnerability;
    document.getElementById('crypto-strength').textContent = metrics.complexity + " kemungkinan kombinasi";
    document.getElementById('brute-force-time').textContent = metrics.timeToCrack;
    document.getElementById('security-recommendation').textContent = metrics.recommendation;
    
    const securityBadge = document.getElementById('security-level-badge');
    securityBadge.textContent = metrics.vulnerability.split(" (")[0];
    securityBadge.className = "security-level " + metrics.securityClass;
    
    document.getElementById('result').style.display = 'block';
}