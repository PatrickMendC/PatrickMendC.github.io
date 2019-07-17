const rp = require('request-promise')
const cheerio = require('cheerio')

var fs = require('fs');


const options = {
    url: 'http://www.ifms.edu.br/noticias',
    transform: function (body) {
        return cheerio.load(body)
    }
}

function processarDados(dados){
    console.log(JSON.stringify(dados))
    
    
    fs.readFile('rss.json', 'utf8', function readFileCallback(err, dados){
        if (err){
            console.log(err);
        } else {
            var json = JSON.stringify(dados);
            fs.writeFile('rss.json', json, 'utf8', callback);
        }
    })
}

rp(options)
    .then(($) => {
        //console.log($);
        const titles = []
        $('.tileItem').each((i, item) => {
            const title = {
                nome: $(item).find('.tileHeadline').text(),
                descricao: $(item).find('.description').text(),
                img: $(item).find('img.tileImage').text()
            }

            if(title.nome !== "")
                titles.push(title)
        })

        processarDados(titles)
    })
    .catch((err) => {
        console.log(err);
    })