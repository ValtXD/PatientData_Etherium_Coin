class DataConverter {
    static toBinary(data) {
        // Converte uma string em binário
        return data.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
    }

    static objectToBinary(obj) {
        // Converte um objeto para binário, campo por campo
        const binaryObject = {};
        for (const key in obj) {
            if (typeof obj[key] === 'string') {
                binaryObject[key] = this.toBinary(obj[key]);
            } else {
                binaryObject[key] = obj[key]; // Mantém valores que não são strings
            }
        }
        return binaryObject;
    }
}

module.exports = DataConverter;
