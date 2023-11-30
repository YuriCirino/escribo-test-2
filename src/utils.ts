export default function formatDate(date:Date){
    const now = new Date()
    const year = now.getFullYear();
    const month = ('0' + (now.getMonth() + 1)).slice(-2); // Mês é base 0, então é adicionado 1
    const day = ('0' + now.getDate()).slice(-2);
    const hours = ('0' + now.getHours()).slice(-2);
    const minutes = ('0' + now.getMinutes()).slice(-2);
    const seconds = ('0' + now.getSeconds()).slice(-2);
    const miliseconds = ('00' + now.getMilliseconds()).slice(-3);
    const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${miliseconds}Z`
    return formattedDate
}

