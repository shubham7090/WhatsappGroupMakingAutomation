const pup=require("puppeteer");
const readXlsxFile = require('read-excel-file/node');
let tab,group_name="Trial",inviteLink="";

let excelPromise = readXlsxFile("X:/WebDev/pep/whatsapp/number.xlsx");
let links=[];
excelPromise.then(function(rows){
    for(let i=1;i<rows.length;i++){
        links.push(""+rows[i][0]+rows[i][1]);
    }
    console.log(links);
    
}).catch(function(err){
    console.log(err);
})


let browserPromise=pup.launch({
    headless:false,
    defaultViewport:false,
});
browserPromise.then(function(browser){
    return browser.pages();
}).then(function(pages){
    tab=pages[0];
    return tab.goto("https://web.whatsapp.com/");
}).then(function(){
    let waitPromise = tab.waitForSelector("._2Z4DV",{visible:true});
    return waitPromise;
}).then(function(){
    return tab.type(".RPX_m ._2_1wd.copyable-text.selectable-text",group_name);
}).then(function(){ 
    return tab.waitForSelector("span[title='"+group_name+"']",{visible:true});
}).then(function(){
    return tab.click("span[title='"+group_name+"']");
}).then(function(){
    return tab.waitForSelector("._1-qgF");
}).then(function(){
    return tab.click("._1-qgF ._1IeOz ._1ljzS.pnYZD ._2n-zq div[title='Menu']");
}).then(function(){
    return tab.waitForSelector("._11srW._2xxet");
}).then(function(){
    return tab.click("._11srW._2xxet[aria-label='Group info']");
}).then(function(){
    return tab.waitForSelector(".TbtXF");
}).then(function(){
    return tab.$$("._3ZEdX._3hiFt ._2Z4DV._25uA8 .TbtXF ._2pkLM ._3Dr46");
}).then(function(data){
    return tab.click("._3ZEdX._3hiFt ._2Z4DV._25uA8 ._1_JE6 span[data-testid='link']");
}).then(function(){
    return tab.waitForSelector("._3D4f-");
}).then(function(){
    return tab.$("._3D4f- a");
}).then(function(data){
    return tab.evaluate(function(ele){
        return ele.getAttribute("href");
    },data);
}).then(function(data){
    inviteLink= data;
    let NumberPromise= sendMessage("https://web.whatsapp.com/send?phone="+links[0]+"&text&app_absent=0",inviteLink);
    for(let i=1;i<links.length;i++){    
        NumberPromise=NumberPromise.then(function(){
            return sendMessage("https://web.whatsapp.com/send?phone="+links[i]+"&text&app_absent=0",inviteLink);
        });
    }
}).then(function(){
    console.log("Hogaya");
}).catch(function (err){
    console.log(err);
});



function sendMessage(url,text){
    return new Promise(function(resolve,reject){
        tab.goto(url).then(function(){
            return tab.keyboard.press("Enter");
        }).then(function(){
            return tab.waitForSelector("._1JAUF._2x4bz");
        }).then(function(){
            return tab.type("._1JAUF._2x4bz .OTBsx",text);
        }).then(function(){
            return tab.keyboard.press("Enter");
        }).then(function(){
            return tab.keyboard.press("Enter");
        // }).then(function(){
        //     return tab.$$(".GDTQm.message-out.focusable-list-item ._24wtQ._2W7I- ._3XpKm._20zqk ._1bR5a ._2zWo9 .UFTvj ._2nWgr span");
        // }).then(function(data){
        //     let q;
        //     for(let i of data){
        //         if(i==data.length-1){
        //             q=tab.evaluate(function(ele){
        //                 return ele.getAttribute("aria-label")
        //             },i);
        //         }
        //     }
        //     return q;    
        // }).then(function(data){
        //     if(data=="Sent"){
        //         return;
        //     }
        }).then(function(){
            resolve();
        }).catch(function(){
            resolve();
        });
    })
}