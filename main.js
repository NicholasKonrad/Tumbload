const tumblr = require('tumblr.js');
const fs = require('fs');
const https = require('https');
const client = tumblr.createClient({
  //auth token etc go here
});


const MAX_LOOP = 30;
let globalOffset = 0;
let continueDownload = true;

/////////////////////////////////////////////////////////////////////////////////////////////////////////

for (let loop = 0; loop < MAX_LOOP; loop++) {
    if (continueDownload) {
        if (loop < MAX_LOOP/2) {
            activeBlog = <blognamehere>;
        }
        else {
            if (activeBlog == <blognamehere>) globalOffset = 0;
            activeBlog = <otherblognamehere>;
        }        
    
        client.blogPosts(activeBlog, { offset: globalOffset }, (err, data) => {    
            for (let i = 0; i < data.posts.length; i++) {
                let currentPost = data.posts[i];  
                if (currentPost.type == 'photo') {
                    for (let j = 0; j < currentPost.photos.length; j++) {
                        saveFileToDisk(
                            currentPost.photos[j].original_size.url, 
                            activeBlog, 
                            `${String(currentPost.id)}_${String(j)}`, 
                            getPostSuffixAsString(currentPost.photos[j].original_size.url)
                        );
                    }
                }
                if (currentPost.type == 'video') {
                    saveFileToDisk(
                        currentPost.video_url, 
                        activeBlog, 
                        `${String(currentPost.id)}_0`, 
                        getPostSuffixAsString(currentPost.video_url)
                    );
                }
            }
        });
        globalOffset += 20;
    }
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////


function saveFileToDisk(url, blog, imagename, suffix) {
    continueDownload = false;
    let imgSavePath = `E:/Content/Graphics/Pictures/Tumblr/${blog}/${blog}_${imagename}.${suffix}`;
    if (fs.existsSync(imgSavePath) == false) {
        console.log('Created New File ' + imagename + '.' + suffix);
        let writeStream = fs.createWriteStream(`E:/Content/Graphics/Pictures/Tumblr/${blog}/${blog}_${imagename}.${suffix}`);
        https.get(url, response => { 
            let stream = response.pipe(writeStream); 
            stream.on('finish', () => { 
                setTimeout(() => {
                    //Tried to provide more time for the download stream before setting up new streams (i dont think this works)
                    continueDownload = true;
                }, 10000);
            });
        });
    }
}

function getDirLength(dir, callback) {
    let dir_length;
    callback = function() {
        console.log('dir_length: ' + dir_length);
    };
    fs.readdir(dir, (err, files) => {
        if (err) throw err;
        dir_length = files.length;
        if (typeof callback  == 'function') callback();
    });
}

function getPostSuffixAsString(element) {
    array = String(element).split('.');
    return array[array.length - 1];
}
