const rp = require('request-promise')
const cheerio = require('cheerio')
const Feed = require('feed').Feed;
var fs = require('fs');
//array de dados
const data = [];

const options = {
    url: 'http://www.ifms.edu.br/noticias',
    transform: function (body) {
        return cheerio.load(body)
    }
}
//criando novo feed 
const feed = new Feed({
    title: "Noticias Ifms",
    description: "Este é um feed de noticias do ifms!",
    id: "https://ifms.edu.br.com/",
    link: "https://ifms.edu.br/noticias",
    language: "en", // optional, used only in RSS 2.0, possible values: http://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
    image: "http://example.com/image.png",
    favicon: "http://example.com/favicon.ico",
    copyright: "All rights reserved 2019, Ifms",
    updated: new Date(2019, 7, 18), // optional, default = today
    generator: "awesome", // optional, default = 'Feed for Node.js'
    feedLinks: {
      json: "https://example.com/json",
      atom: "https://example.com/atom"
    },
    author: {
      name: "John Doe",
      email: "johndoe@example.com",
      link: "https://example.com/johndoe"
    }
  });

console.log(feed.rss2());

function processarDados(dados){
    
    dados.forEach(d => {
        feed.addItem({
          title: d.nome,
          id: d.url,
          link: d.url,
          description: d.descricao,
          content: d.content,
          author: [
            {
              name: "Ifms",
              email: "ifms@example.com",
              link: "https://example.com/ifms"
            }
          ],
          contributor: [
            {
              name: "Shawn Kemp",
              email: "shawnkemp@example.com",
              link: "https://example.com/shawnkemp"
            }
          ],
          date: inverteDate(d.date, d.hora),
          image: d.img+" type='image/jpeg'",
          
        });
        console.log(`Aqui: ${typeof d.hora}`);
      });
      
      //console.log(feed.rss2());
    //console.log(JSON.stringify(dados))
    
    
    //fs.readFile('rss.json', 'utf8', function readFileCallback(err, dados){
    //    if (err){
    //        console.log(err);
    //    } else {
    //        var json = JSON.stringify(dados);
    //        fs.writeFile('rss.json', json, 'utf8', callback);
    //    }
    //})
    fs.writeFile("rss.xml", feed.rss2(), function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("Arquivo xml salvo com sucesso!");
        //console.log(feed.rss2());
    })

    fs.writeFile("rss.json", JSON.stringify(dados), function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("Arquivo json salvo com sucesso!");
    })
    
}

// O formato da data contida no argumento "data" é dd/mm/yyyy como uma String
// inverteDate inverte a data brasileira para formato americano, e a retorna como uma Date
const inverteDate = (data, hora) =>{
  console.log(`Data no inverte: ${data}`);
  console.log(`Hora no inverte: ${hora}`);
  split = data.split('/');
  novadata = split[2] + "/" +split[1] + "/" +split[0]+"/";
  data_americana = new Date(novadata);
  
  novaHora = splitHora(hora);
  data_americana.setUTCHours(novaHora[0]);
  data_americana.setUTCMinutes(novaHora[1]);
  console.log(`Hora split: ${novaHora[0]}`)
  return data_americana;
}

const splitHora = (hora) =>{
  split = hora.split('h');
  nova_hora = [split[0], split[1]];

  return nova_hora;
}

rp(options)
    .then(($) => {
        //console.log($);
        const titles = []
        $('.tileItem').each((i, item) => {
            const title = {
                nome: $(item).find('.tileHeadline').text(),
                descricao: $(item).find('.description').text(),
                img: $(item).find('.tileImage').children('img').eq(0).attr('src'),
                //date: $(item).find('.documentByLine, <i>').children('.summary-view-icon').text()
                date: $(item).find('.summary-view-icon').first().text().replace(/(\n)/g, ""),
                hora: $(item).find('.summary-view-icon').first().next().text().replace(/(\n)/g, ""),
            }
            console.log(`Horas: ${title.hora}`)
            console.log("Formato data: "+inverteDate(title.date, title.hora))
            if(title.nome !== "")
                titles.push(title)
        })

        //processarDados(JSON.stringify(titles))
        processarDados(titles)
        //setDados(titles)
    })
    .catch((err) => {
        console.log(err);
    })