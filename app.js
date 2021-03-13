let http=require('http'),
 fs=require('fs'),
 path=require('path'),
 reader=require('mime'),
 port =3000,
 cache={};

function error(res){
    res.writeHead(404,{'Content-Type': 'text/html'});
    res.end(__dirname+"/error.html");
}

function s500(res){
    res.writeHead(500,{'Content-Type': 'text/html'});
    res.end("500 - error");
}

function success(res,link,fileContents){
    res.writeHead(200,{"content-type": reader.lookup(path.basename(link))});
    res.end(fileContents);
}

var server=http.createServer(function (req,res){

    switch (req.url) {
        case '/':
            link='index.html';
            break;
        case '/index':
            link='index.html';
            break;
        case '/about':
            link='about.html';
            break;
        case '/img/gallery/graduation':
            link='/img/gallery/graduation.jpg';
            break;
        case '/img/gallery/study':
            link='/img/gallery/graduation.jpg';
            break;
        case '/video/students/memes':
            link='/video/students/memes.mp4';
            break;
        default:
            link=req.url;
            break;
    }

    link=link.replace(/\/?(?:\?.*)?$/,"").toLowerCase();

    var path='./'+ link;

    sendhtml(res,cache,path);
}).listen(port);

function sendhtml(res,cache,path){

    if(cache[path]){success(res,path,cache[path]);
    }else{fs.exists(path,function(exists){if(exists){
    fs.readFile(path,function(err,data){if(err){s500(res);
    }else{cache[path]=data;success(res,path,data);}});}else{error(res);}});}

}