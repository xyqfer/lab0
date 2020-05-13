(function ($, _, Backbone) {
	window.wp = window.wp || {};

	var SrcType = 0;
    const zimuOss = "https://ddrk.oss-cn-shanghai.aliyuncs.com";
    const videoElem = $('#J-video')[0];
    const $source = $('#J-video-source');
    const $track = $('#J-video-track');
	
    const videoServer = "https://v.ddrk.me";
    
    if (!deviceInfoQJ) window.deviceInfoQJ = new Browser();
    
	var WPPlaylistView = Backbone.View.extend({
		initialize : function (options) {
			this.index = 0;
			this.settings = {};
			this.data = options.metadata || $.parseJSON( this.$('script.wp-playlist-script').html() );
			this.playerNode = this.$( this.data.type );

			this.tracks = new Backbone.Collection( this.data.tracks );
			this.current = this.tracks.first();

			if ( 'audio' === this.data.type ) {
				this.currentTemplate = wp.template( 'wp-playlist-current-item' );
				this.currentNode = this.$( '.wp-playlist-current-item' );
			}

			if ( this.data.tracklist ) {
				this.itemTemplate = wp.template( 'wp-playlist-item' );
				this.playingClass = 'wp-playlist-playing';
				this.renderTracks();
			}

			_.bindAll( this, 'clickTrack' );

			this.setCurrent();
        },
        
        renderTracks : function () {
			let self = this, i = 1, tracklist = $( '<div class="wp-playlist-tracks"></div>' );
			this.tracks.each(function (model) {
				if ( ! self.data.images ) {
					model.set( 'image', false );
				}
				model.set( 'artists', self.data.artists );
				model.set( 'index', self.data.tracknumbers ? i : false );
				tracklist.append( self.itemTemplate( model.toJSON() ) );
				i += 1;
			});
			this.$el.append( tracklist );

			this.$( '.wp-playlist-item' ).eq(0).addClass( this.playingClass );
        },
        
        events: {
			'click .wp-playlist-item' : 'clickTrack',
			'click .wp-playlist-next' : 'next',
			'click .wp-playlist-prev' : 'prev'
		},

		clickTrack : function (e) {
			e.preventDefault();
			this.index = this.$( '.wp-playlist-item' ).index( e.currentTarget );
			this.setCurrent();
        },
        
        setCurrent : function () {
			this.current = this.tracks.at( this.index );

			if ( this.data.tracklist ) {
				this.$( '.wp-playlist-item' )
					.removeClass( this.playingClass )
					.eq( this.index )
						.addClass( this.playingClass );
			}

			this.loadCurrent();
        },
        
        loadCurrent : function () {
			var last = this.playerNode.attr( 'src' ) && this.playerNode.attr( 'src' ).split('.').pop(),
				current = this.current.get( 'src' ).split('.').pop();

			this.mejs && this.mejs.pause();

			if ( last !== current ) {
				this.setPlayer( true );
			}
		},

		setPlayer: function (force) {
            var subtrackfull=this.current.get( 'subsrc' );
            var [subtracksrc,subshift]=subtrackfull.split(',');
            
			if (subshift==undefined) subshift = "0";
			var vttshift=this.current.get( 'vttshift' );
			if (vttshift==undefined) vttshift = 0;
			var portn=this.current.get('portn');
			var vtracksrc0=this.current.get( 'src0' );
			var vtracksrc=this.current.get( 'src1' );
			var vtracksrc2=this.current.get( 'src2' );
			var vtracksrc3=this.current.get( 'src3' );
			
			if (window.vjs_list_SrcType != -1) SrcType = window.vjs_list_SrcType;
			else SrcType=this.current.get('srctype');
			var userIP=this.current.get('userIP');
			var vdesc=this.current.get('description');
			var videoCutTime=this.current.get('cut');
			var VideoNotJump=true;
			if (videoCutTime == 0) VideoNotJump=false;
			var logdata = {
				action: 'is_user_logged_in'
            };
			
			function oneTime(){
                let srvdate = new Date();
				let eTimes = srvdate.getTime() + 600000;
				let uTxt = CryptoJS.enc.Utf8.parse("{\"path\":\"" + vtracksrc0 + "\",\"expire\":" + eTimes.toString() + "}");
				let uKey = CryptoJS.enc.Utf8.parse("zevS%th@*8YWUm%K");
				let waiv = CryptoJS.enc.Utf8.parse("5080305495198718");
				var ttestvtrack = CryptoJS.AES.encrypt(uTxt,uKey,{
					iv: waiv,
					mode: CryptoJS.mode.CBC
				});
                vtracksrc = encodeURIComponent(ttestvtrack.ciphertext.toString(CryptoJS.enc.Base64));
                prepareVideo();

                let xhr = new XMLHttpRequest();
                xhr.open("get", '/ddrk/proxy?url=' + encodeURIComponent(zimuOss + subtracksrc), true);
                xhr.responseType = "arraybuffer";
                xhr.onload = function() {
                    if (this.status == 200) {
                        let eAB = this.response;
                        
                        let wordArray = CryptoJS.lib.WordArray.create(eAB.slice(16));
                        let hexStr = Array.prototype.map.call(new Uint8Array(eAB.slice(0, 16)), x => ('00' + x.toString(16)).slice(-2)).join('');
                        let wordArray2 = CryptoJS.enc.Hex.parse(hexStr);
                        
                        let jsdec = CryptoJS.AES.decrypt({ciphertext:wordArray},wordArray2,{
                            iv: wordArray2,
                            mode: CryptoJS.mode.CBC
                        });
                        
                        let binary_string = window.atob(jsdec.toString(CryptoJS.enc.Base64));
                        let len = binary_string.length;
                        let bytes = new Uint8Array(len);
                        for (let i = 0; i < len; i++) {
                            bytes[i] = binary_string.charCodeAt(i);
                        }

                        let blob = new Blob([pako.ungzip(bytes.buffer,{to:'string'})], {type : 'image/png'});
                        let img = document.createElement("img");
                        img.src = window.URL.createObjectURL(blob);
                        $track.attr('src', img.src);
                    }
                }
                xhr.send();
            }
            setTimeout(oneTime, 1);
            
            function prepareVideo() {
                videoElem.pause();

                if (SrcType == 0 || SrcType == 3 ) {
                    $.get('/ddrk/proxy?url=' + encodeURIComponent(videoServer+':'+'9543'+'/video?id='+vtracksrc+'&type=mix'), function(data) {
                        if (!data.pin) {
                            if (data.url.slice(-4) == '.mp4') {
                                $source.attr('src', data.url);
                                $source.attr('type', 'video/mp4');
                            }
                            else {
                                $source.attr('src', data.url);
                                $source.attr('type', 'application/x-mpegURL');
                            }
                        }
                        else {
                            var pint = pako.ungzip(data.pin,{to:'string'});
                            if (deviceInfoQJ.os.indexOf("Android") != -1) {
                                $source.attr('src', videoServer+':'+'9543'+'/video?id='+vtracksrc+'&type=hls&ee=a.m3u8');
                                $source.attr('type', 'application/x-mpegURL');
                            }
                            else {
                                if (deviceInfoQJ.device=='PC') {
                                    var bbimg = new Blob([pint], {type : 'image/png'});
                                    const videoUrl = URL.createObjectURL(bbimg);
                                    $source.attr('src', videoUrl);
                                    $source.attr('type', 'application/x-mpegURL');
                                }
                                else {
                                    if (deviceInfoQJ.os=='iOS') {
                                        var bpstr = 'data:application/vnd.apple.mpegurl;base64,' + btoa(pint);
                                        var bbimg = new Blob([pint], {type : 'image/png'});
                                        const $source = $('#J-video-source');
                                        $source.attr('src', bpstr);
                                        $source.attr('type', 'application/x-mpegURL');
                                    }
                                    else {
                                        $source.attr('src', videoServer+':'+'9543'+'/video?id='+vtracksrc+'&type=hls&ee=a.m3u8');
                                        $source.attr('type', 'application/x-mpegURL');
                                    }
                                }
                            }
                        }

                        videoElem.load();
                        videoElem.play();
                    });
                }
                else if (SrcType == 1 ) {
                    var uurl = 'https://service-k3jx48ay-1251906477.ap-hongkong.apigateway.myqcloud.com/release/hw' + vtracksrc0 + '?ddrkey=' + vtracksrc2;
                    $source.attr('src', uurl);
                    $source.attr('type', 'video/mp4');
                    videoElem.load();
                    videoElem.play();
                }
                else if ( SrcType == 4 ) {
                    if (vtracksrc0.slice(-4) == 'm3u8') {
                        $source.attr('src', vtracksrc0);
                        $source.attr('type', 'application/x-mpegURL');
                    }
                    else {
                        $source.attr('src', vtracksrc0);
                        $source.attr('type', 'video/mp4');
                    }
                    videoElem.load();
                    videoElem.play();
                }
            }
		},
	});

	/**
	 * Initialize media playlists in the document.
	 *
	 * Only initializes new playlists not previously-initialized.
	 *
	 * @since 4.9.3
	 * @returns {void}
	 */
	function initialize() {
		window.vjs_list_SrcType = -1;
		$( '.wp-playlist:not(:has(.mejs-container))' ).each( function() {
			new WPPlaylistView( { el: this } );
		} );

		$('.wpse-playlist').prev().append(`&nbsp;<a style="float:right;" href="https://ddrk.me/?p=${pageId}">源站</a><span style="float:right;">&nbsp;&nbsp;</span><a style="float:right;" href="javascript:;" onclick="changeSrctype(1)" class="outSrc-a">海外节点</a><span style="float:right;">&nbsp;&nbsp;</span><span style="float:right;color:white;" class="chinaSrc-a">国内节点</span>`);
	}

	/**
	 * Expose the API publicly on window.wp.playlist.
	 *
	 * @namespace wp.playlist
	 * @since 4.9.3
	 * @type {object}
	 */
	window.wp.playlist = {
		initialize: initialize
	};

	$( document ).ready( initialize );

	window.WPPlaylistView = WPPlaylistView;

}(jQuery, _, Backbone));
