function maxProfit(x,y){
    const profitA  = 10000;
    const profitB  = 15000;
    const tenagaA = 4;
    const tenagaB = 5;
    const mesinA = 3;
    const mesinB = 6;
    const maxTenaga = 180; //jam kerja
    const maxmesin = 120; //jam mesin

    const totalTenaga = x * tenagaA + y * tenagaB;
    const totalMesin = x * mesinA + y * mesinB;
    const totalProfit = x * profitA + y * profitB;

    if (totalTenaga > maxTenaga || totalMesin > maxmesin) {
        return 0;
    } else{
        return totalProfit;
    } 
}

export {maxProfit};