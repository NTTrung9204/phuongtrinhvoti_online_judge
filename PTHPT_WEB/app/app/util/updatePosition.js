function updatePosition(score){
    if(score < 300)    return ["black"  , "Gà con", 100];
    if(score < 1000)   return ["#2dda2d", "Mèo nhỏ", 700];
    if(score < 2000)   return ["#008b8b", "Ngài", 700];
    if(score < 4000)   return ["blue"   , "Cao thủ", 700];
    if(score < 7500)   return ["blue"   , "Đại cao thủ", 700];
    if(score < 14000)  return ["#a0a"   , "Bậc thầy", 700];
    if(score < 25000)  return ["#a0a"   , "Thánh nhân", 700];
    if(score < 50000)  return ["#ff8c00", "Chúa tể", 700];
    return ["#e00"   , "Chiến thần", 700];
}

module.exports = updatePosition