class Utils {
    //Aqui é criado uma classe estática que formata a data passada(date) quando chamada.  
    static dateFormat(date){ 
        //É necessário garantir que os minutos tenham o zero a esquerda, porque se for, por exemplo, 11:04, irá mostrar 11:4.
        let minutesWithTwoDigits = String(date.getMinutes()).padStart(2, '0');
        return date.getDate() + '/' + (date.getMonth()+1) + '/' + date.getFullYear() + ' ' + date.getHours()+ ':' + minutesWithTwoDigits;
    }
}