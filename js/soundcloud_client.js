(function(){

    // don't need access to account... yet
    // document.getElementById('soundcloud-login').addEventListener('click', soundcloud_login);
    // // initiate auth popup
    // function soundcloud_login() {
    //     SC.connect().then(function() {
    //       return SC.get('/me');
    //     }).then(function(me) {
    //       alert('Hello, ' + me.username);
    //     });  
    // };

    SC.initialize({
      client_id: '5a890217b642c08738865e3687299be3',
      redirect_uri: 'http://127.0.0.1:8080/'
    });

    document.getElementById('submit-search').addEventListener('click', )

    // find all sounds of buskers licensed under 'creative commons share alike'
    SC.get('/tracks', {
      q: 'chrome sparks', license: 'cc-by-sa'
    }).then(function(tracks) {
        // use stream_url property to pass into audio viz
        Audio.loadFile(tracks[0].stream_url + '?client_id=5a890217b642c08738865e3687299be3');
    });
    
}());


