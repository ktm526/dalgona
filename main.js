/* var http = require('http');
var fs = require('fs');
var url = require('url');

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    title = queryData.id;
    

    console.log(queryData.id);
    if(_url == '/favicon.ico'){
        response.writeHead(404);
        response.end();
        return;
    }
    if(_url == '/'){
        fs.readFile(`data/html/index`,'utf8',function(err,data){
            var template = `${data}`;
            response.end(template);
        });
    }

});
app.listen(5000); */

const { json } = require('body-parser');
const { urlencoded, response } = require('express');
const express = require('express');
const app = express();
const request = require('request');
const fetch = require('node-fetch');
var url = require('url');
var path = require('path');
const { callbackify } = require('util');
app.locals.pretty = true;
app.use(express.json());

app.set('view engine', 'pug');
app.set('views', './views');
app.use("/public", express.static(path.join(__dirname, 'public')));

app.listen(5000, function(){

}
    
);

app.get('/', function(req, res){
    res.render('index');
});


app.get('/summoner', function(req, res){
    //api 호출
    var api_key = "RGAPI-050e49d7-79b4-4529-aded-d5c234477b35";
    var _url = req.url;
    var queryData = url.parse(_url, true).query;
    input_name = queryData.id;
    console.log(queryData.id);
    var api_url = 'https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/' + encodeURIComponent(input_name) +'?api_key=' + api_key;
    // request(api_url, function(err, response, body){
    //     console.log(api_url);
    //     console.log(body);
        
    //     // var key = Object.keys(info_json);
    //     // var result = "id: " +info_json[key]["id"];
    //     console.log(api_url);
    //     express.json(body);
    //     console.log();
    //     if(response.status == 404){
            
    //         res.render('summoner_noexist');
    //     }
    //     else{
    //         res.render('index');
    //     }
    // } 
    // );
    fetch(api_url)
        .then(response => {
            if(!response.ok){
                //에러 난 경우 이므로 처리
                console.log('error');
                res.render('summoner_noexist', {title1: 'lolai'});
            }
            return response.json();
        })
        .then(data => {
            var name = data.name;
            var profileIconId = data.profileIconId;
            var id = data.id;
            var accountId = data.accountId;
            var puuid = data.puuid;
            var summonerLevel = data.summonerLevel;
            
            var rank_url = 'https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/'+ encodeURIComponent(id) +'?api_key=' + api_key;
            fetch(rank_url)
                .then(response => {
                    if(!response.ok){
                        console.log('rank url error');
                    }
                    return response.json();
                })
                .then(data => {
                    if(Object.keys(data).length == 0){ // 랭크 데이터 없음
                        console.log('0');
                        var solo_rank = "unranked";
                        var solo_win = 0;
                        var solo_lose = 0; 
                        var flex_win= 0; 
                        var flex_lose = 0;
                        var flex_rank = "unranked";
                        var solo_rank_num = " ";
                        var flex_rank_num = " ";
                    }
                    else if(Object.keys(data).length == 1){ // 랭크 데이터 1개
                        if(data[0].queueType == 'RANKED_FLEX_SR'){ // 자랭만 있는 경우
                            console.log(data[0].queueType);
                            var solo_rank = "unranked";
                            var flex_rank = data[0].tier;
                            var solo_win = 0;
                            var solo_lose = 0;
                            var flex_win = data[0].wins;
                            var flex_lose = data[0].losses;
                            var flex_rank_num = data[0].rank;
                            var solo_rank_num = " ";
                        }
                        else{ // 솔랭만 있는 경우
                            console.log(data[0].queueType);
                            var solo_rank = data[0].tier;
                            var flex_rank = "Unranked";
                            var flex_win, flex_lose = 0;
                            var solo_win = data[0].wins;
                            var solo_lose = data[0].losses;
                            var flex_rank_num = " ";
                            var solo_rank_num = data[0].rank;
                        }
                    }
                    else if(Object.keys(data).length == 2){ // 랭크 데이터 2개
                        console.log('2');
                        if(data[0].queueType == "RANKED_FLEX_SR"){
                            var solo_rank = data[1].tier;
                            var flex_rank = data[0].tier;
                            var solo_win = data[1].wins;
                            var solo_lose = data[1].losses;
                            var flex_win = data[0].wins;
                            var flex_lose = data[0].losses;
                            var solo_rank_num = data[1].rank;
                            var flex_rank_num = data[0].rank;
                        }
                        else{
                            var solo_rank = data[0].tier;
                            var flex_rank = data[1].tier;
                            var solo_win = data[0].wins;
                            var solo_lose = data[0].losses;
                            var flex_win = data[1].wins;
                            var flex_lose = data[1].losses;
                            var solo_rank_num = data[0].rank;
                            var flex_rank_num = data[1].rank;
                        }
                    }
                    var match_url = 'https://kr.api.riotgames.com/lol/match/v4/matchlists/by-account/'+ encodeURIComponent(accountId) +'?api_key=' + api_key;
                    fetch(match_url)
                        .then(response => {
                            if(!response.ok){
                                console.log('match url error');
                            }
                            return response.json();
                        })
                        .then(data => {
                            var match_ID = data.matches[0].gameId;
                            var matchinfo_url = 'https://kr.api.riotgames.com/lol/match/v4/matches/'+encodeURIComponent(match_ID)+'?api_key=' + api_key;
                            fetch(matchinfo_url)
                                .then(response => {
                                    if(!response.ok){
                                        console.log('matchinfo url error');
                                    }
                                    return response.json();
                                })
                                .then(data => {


                                })

                        })
                    
                    
                    res.render('personal_page', {title1: name, player_level: summonerLevel, flexrank: flex_rank, solorank: solo_rank, flexwin: flex_win, flexlose:flex_lose, solowin: solo_win, sololose: solo_lose, soloranknum: solo_rank_num, flexranknum: flex_rank_num});

                }
                )
            
            var rank_url = ''+ encodeURIComponent(accountId) +'?api_key=' + api_key;
            var rank_url = ''+ encodeURIComponent(puuid) +'?api_key=' + api_key;
            console.log(name);
            console.log(profileIconId);
            console.log(summonerLevel);



            
        });


    // res.render('personal_page', );
});