export const maskCEP = (value: string) => {
    if (!value) return "";
    return value
        .replace(/\D/g, "")
        .replace(/(\d{5})(\d)/, "$1-$2")
        .substring(0, 9);
};

export const maskDate = (value: string) => {
    if (!value) return "";

    let v = value.replace(/\D/g, '');

    if (v.length >= 2) {
        let day = parseInt(v.substring(0, 2), 10);
        if (day > 31) v = '31' + v.substring(2);
        if (day === 0) v = '01' + v.substring(2);
    }

    if (v.length >= 4) {
        let month = parseInt(v.substring(2, 4), 10);
        if (month > 12) v = v.substring(0, 2) + '12' + v.substring(4);
        if (month === 0) v = v.substring(0, 2) + '01' + v.substring(4);
    }
    
    v = v.replace(/(\d{2})(\d)/, '$1/$2');
    v = v.replace(/(\d{2})(\d)/, '$1/$2');

    if (v.length === 10) {
        const year = parseInt(v.substring(6, 10), 10);
        if (year < 1900) {
            v = v.substring(0, 6) + '1900';
        }
        if (year > 2100) {
            v = v.substring(0, 6) + '2100';
        }
    }

    return v.substring(0, 10);
};

export const maskPhone = (value: string) => {
    if (!value) return "";
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .substring(0, 15);
};

export const validateEmail = (email: string) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};

export const validatePassword = (password: string) => {
    // Requisitos: 8+ caracteres, 1 maiúscula, 1 minúscula, 1 número, 1 especial
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.,@$!%*?&])[A-Za-z\d.,@$!%*?&]{8,}$/;
    return re.test(password);
};