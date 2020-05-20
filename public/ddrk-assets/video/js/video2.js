/* global _wpmejsSettings, MediaElementPlayer */

(function ($, _, Backbone) {
	'use strict';

	/** @namespace wp */
	window.wp = window.wp || {};

	var myPlayer,vjsoptions,SrcType,timerId=-1;
	const zimuOss = "https://ddrk.oss-cn-shanghai.aliyuncs.com";
	
	const videoServer = "https://v.ddrk.me";
	var playlistDiv = $("div.wp-video-playlist");
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

			this.renderCurrent();

			if ( this.data.tracklist ) {
				this.itemTemplate = wp.template( 'wp-playlist-item' );
				this.playingClass = 'wp-playlist-playing';
				this.renderTracks();
			}

			_.bindAll( this, /* 'bindPlayer', 'bindResetPlayer', 'setPlayer', 'ended', */ 'clickTrack' );

			if ( ! _.isUndefined( window._wpmejsSettings ) ) {
				this.settings = _.clone( _wpmejsSettings );
			}
			//this.settings.success = this.bindPlayer;
			if (myPlayer) {
				myPlayer.dispose();
				playlistDiv[0].innerHTML='<video id="vjsp" class="video-js vjs-default-skin vjs-big-play-centered vjs-fluid vjs-playback-rate" controls="controls" x5-playsinline="" preload="none" webkit-playsinline playsinline></video>'+playlistDiv[0].innerHTML;
			}
			//$.ajaxSetup({xhrFields: { withCredentials: true } });
			this.setPlayer();
		},

		setPlayer: function (force) {
			function GetQueryString(name) {
				var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
				var r = window.location.search.substr(1).match(reg);
				var context = "";
				if (r != null)
				context = r[2];
				reg = null;
				r = null;
				return context == null || context == "" || context == "undefined" ? "" : context;
			}
			var videoep = parseInt(GetQueryString("ep"));
			var nosub = parseInt(GetQueryString("nosub"));
			
			if (!force) {
				if (1 <= videoep && videoep!=this.index+1 && videoep <= this.tracks.length) {
					this.index = videoep-1;
					this.current = this.tracks.at( this.index );
					if ( this.data.tracklist ) {
						this.$( '.wp-playlist-item' )
							.removeClass( this.playingClass )
							.eq( this.index )
								.addClass( this.playingClass );
					}
				}
				
				videojs.addLanguage('zh-CN', {"The media could not be loaded, either because the server or network failed or because the format is not supported.": "没有获取到视频地址，请尝试稍后刷新本页",
				"Toggle theater mode":"网页全屏",
				"Quality":"画质",
				"subtitles off":"关闭",
				"subtitles settings":"设置"});
				
				vjsoptions = {
					controlBar: {
						volumePanel: {inline: false},
						playToggle: true,
						remainingTimeDisplay: true,
					},
					userActions: {
						hotkeys: false,
					},
					language: 'zh-CN',
					playbackRates: [0.5, 1, 1.25, 1.5, 2],
				};
			}
			else {
				videoep = this.index + 1;
			}
			
			var subtrackfull=this.current.get( 'subsrc' );
			var [subtracksrc,subshift]=subtrackfull.split(',');
			var haveVtt = true;
			var isiOS = (deviceInfoQJ.os == "iOS");
			var isAndroid = (deviceInfoQJ.os == "Android");
			var isAndroidQQ = isAndroid && /MQQBrowser/i.test(navigator.userAgent);
			//console.log(subtracksrc);
			
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
			//var [vtracksrc,vtrackStartTime]=vtracksrcfull.split(',');
			//if (vtrackStartTime==undefined) vtrackStartTime = "0";
			var userIP=this.current.get('userIP');
			var vdesc=this.current.get('description');
			var videoCutTime=this.current.get('cut');
			var VideoNotJump=true;
			if (videoCutTime == 0) VideoNotJump=false;
			
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
			}
			setTimeout(oneTime, 1);

			const videoPlayHandler = () => {
				if (myPlayer.src() == '') {
					myPlayer.bigPlayButton.hide();
					if (SrcType == 0 || SrcType == 3 ) {
                        $.get('/ddrk/proxy?url=' + encodeURIComponent(videoServer+':'+'9543'+'/video?id='+vtracksrc+'&type=mix'), function(data) {
							if (!data.pin) {
								if (data.url.slice(-4) == '.mp4') {
									myPlayer.src({src: data.url, type: 'video/mp4'});
								}
								else {
									myPlayer.src({src: data.url, type: 'application/x-mpegURL'});
								}
							}
							else {
								var pint = pako.ungzip(data.pin,{to:'string'});
								if (deviceInfoQJ.os.indexOf("Android") != -1) {
                                    const videoUrl = '/ddrk/proxy?url=' + encodeURIComponent(videoServer+':'+'9543'+'/video?id='+vtracksrc+'&type=hls&ee=a.m3u8');
									myPlayer.src({src: videoUrl, type: 'application/x-mpegURL'});
								}
								else {
									if (deviceInfoQJ.device=='PC') {
										var bbimg = new Blob([pint], {type : 'image/png'});
										myPlayer.src({src: URL.createObjectURL(bbimg), type: 'application/x-mpegURL'});
									}
									else {
										if (deviceInfoQJ.os=='iOS') {
											var bpstr = 'data:application/vnd.apple.mpegurl;base64,' + btoa(pint);
											myPlayer.src({src: bpstr, type: 'application/x-mpegURL'});
										}
										else {
                                            const videoUrl = '/ddrk/proxy?url=' + encodeURIComponent(videoServer+':'+'9543'+'/video?id='+vtracksrc+'&type=hls&ee=a.m3u8');
											myPlayer.src({src: videoUrl, type: 'application/x-mpegURL'});
										}
									}
								}
							}
						});
					}
					else if (SrcType == 1 ) {
                        var uurl = 'https://service-k3jx48ay-1251906477.ap-hongkong.apigateway.myqcloud.com/release/hw' + vtracksrc0 + '?ddrkey=' + vtracksrc2;
                        const videoUrl = '/ddrk/proxy?url=' + encodeURIComponent(uurl);
						myPlayer.src({src: videoUrl, type: 'video/mp4'});
					}
					else if ( SrcType == 4 ) {
						if (vtracksrc0.slice(-4) == 'm3u8') {
							myPlayer.src({src: vtracksrc0, type: 'application/x-mpegURL'});
						}
						else {
							myPlayer.src({src: vtracksrc0, type: 'video/mp4'});
						}
					}
					myPlayer.play();
				}
			};
			
			if (force) {
				myPlayer.dispose();
				playlistDiv[0].innerHTML='<video id="vjsp" class="video-js vjs-default-skin vjs-big-play-centered vjs-fluid vjs-playback-rate" controls="controls" x5-playsinline="" preload="none" webkit-playsinline playsinline></video>'+playlistDiv[0].innerHTML;
			}
			////////////////////////////////////////////////////////////////////////////////////////////////////////////
			//if (vttshift != 0) vjsoptions.trackTimeOffset=vttshift;
			myPlayer=videojs('vjsp',vjsoptions);
			
			myPlayer.ready(function(){
				if (vdesc!='download') jQuery('video').bind('contextmenu',function() { return false; });
				
				var oldTracks = this.remoteTextTracks();
				let ti = oldTracks.length;
				while (ti--) {
				  this.removeRemoteTextTrack(oldTracks[ti]);
				}
				
				var settings = this.textTrackSettings;
				settings.setValues({
					"backgroundColor": "#000",
					"backgroundOpacity": "0",
					"edgeStyle": "uniform"
				});
				//settings.updateDisplay();
				
				if (isiOS) {
					//videoPlayHandler();
					//$("div.ht-notification-wrap").css({'display':'block'});
				}
				
				if (videoCutTime != 0) myPlayer.currentTime(videoCutTime);
				
				//if (!force) this.volume(1);
				//////////////////
				//load plugins
				//////////////////
				this.hotkeys({
					volumeStep: 0.1,
					seekStep: 5,
					customKeys: {
					  ctrldKey: {
						key: function(event) {
							return (event.which === 27);	//esc
						},
						handler: function(myPlayer, options, event) {
							$('.vjs-theater-mode-control-close').click();
						}
					  }
					}
				});
				
				this.landscapeFullscreen({
					fullscreen: {
						enterOnRotate: true,
						alwaysInLandscapeMode: true,
						iOS: true
					}
				});
				
				if (deviceInfoQJ.device=='PC') this.theaterMode({ elementToToggle: 'vjsp', className: 'theater-mode' });
				
				if (true) {
					var Button = videojs.getComponent('Button');
					var NextButton = videojs.extend(Button, {
						constructor: function() {
							Button.apply(this, arguments);
							this.addClass('icon-angle-right');
							this.controlText("下一集");
						},
						handleClick: function() {
							$("div.wp-playlist-playing").next().click();
						}
					});
					videojs.registerComponent('NextButton', NextButton);
					myPlayer.getChild('controlBar').addChild('NextButton', {}, 1);
				}
				
				function bodyScroll(e){
				   e.preventDefault();
				}
				
				myPlayer.on('theaterMode', function(elm, data) {
					var viewportmetacontbak;
					if (data.theaterModeIsOn) {
						document.body.parentNode.style.overflow = "hidden";
						document.addEventListener('touchmove', bodyScroll, {passive: false});
						/* if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i)) */ {
							var viewportmeta = document.querySelector('meta[name="viewport"]');
							if (viewportmeta) {
								viewportmetacontbak = viewportmeta.content;
								viewportmeta.content = 'width=device-width, initial-scale=1, user-scalable=yes, minimum-scale=1, maximum-scale=1';
								/* document.body.addEventListener('gesturestart', function () {
									viewportmeta.content = 'width=device-width, minimum-scale=0.25, maximum-scale=1.6';
								}, false); */
							}
						}
					} else {
						document.body.parentNode.style.overflow = "auto";
						document.removeEventListener("touchmove",bodyScroll);
						document.querySelector('meta[name="viewport"]').content = viewportmetacontbak;
					}
				});

				if (isNaN(videoep)) videoep=1;
				myPlayer.Resume({
					uuid: location.pathname + "?ep=" + videoep,
					playbackOffset: 5,
					title: '恢复上次播放进度？',
					resumeButtonText: '是',
					cancelButtonText: '否',
				});
			});
			
			myPlayer.one('loadeddata',()=>{
				if (isiOS) {
					function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
					//var pathSearch=location.search;
					//if (pathSearch == '') pathSearch='?ep=1';
					if (isNaN(videoep)) videoep=1;
					var _store2 = _interopRequireDefault(typeof window !== "undefined" ? window['store'] : typeof global !== "undefined" ? global['store'] : null);
					var resumeFromTime = _store2['default'].get('videojs-resume:' + location.pathname + "?ep=" + videoep);
					if (resumeFromTime != null) myPlayer.currentTime(resumeFromTime);
					else {
						if (videoCutTime != 0) myPlayer.currentTime(videoCutTime);
					}
				}
				else {
					myPlayer.play();
				}
			});
			
			myPlayer.bigPlayButton.one('click',videoPlayHandler);
			myPlayer.bigPlayButton.one('tap',videoPlayHandler);
			myPlayer.one('resumevideo', videoPlayHandler);
			
			myPlayer.one('play',function () {
				if (nosub != 1 && haveVtt == true) {
					let xhr = new XMLHttpRequest();
                    xhr.open("get", '/ddrk/proxy?url=' + encodeURIComponent(zimuOss + subtracksrc), true);
					xhr.responseType = "arraybuffer";
					//if (vdesc=='subt') {
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
							let subTrack = {
								kind: 'subtitles',
								src: img.src,
								srclang: 'zh-cn',
								label: '中文',
								mode: 'showing',
								default: true
							};
							myPlayer.addRemoteTextTrack(subTrack,true);
						}
					}
					xhr.send();
				}
			});
		},

		renderCurrent : function () {

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

		events : {
			'click .wp-playlist-item' : 'clickTrack',
			'click .wp-playlist-next' : 'next',
			'click .wp-playlist-prev' : 'prev'
		},

		clickTrack : function (e) {
			e.preventDefault();
			this.index = this.$( '.wp-playlist-item' ).index( e.currentTarget );
			this.setCurrent();
		},

		ended : function () {
			if ( this.index + 1 < this.tracks.length ) {
				this.next();
			} else {
				this.index = 0;
				this.setCurrent();
			}
		},

		next : function () {
			this.index = this.index + 1 >= this.tracks.length ? 0 : this.index + 1;
			this.setCurrent();
		},

		prev : function () {
			this.index = this.index - 1 < 0 ? this.tracks.length - 1 : this.index - 1;
			this.setCurrent();
		},

		loadCurrent : function () {
			var last = this.playerNode.attr( 'src' ) && this.playerNode.attr( 'src' ).split('.').pop(),
				current = this.current.get( 'src' ).split('.').pop();

			this.mejs && this.mejs.pause();

			if ( last !== current ) {
				this.setPlayer( true );
			} else {
				//console.log('loadCurrent last === current');
			}
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
		}
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

		$('.wpse-playlist').prev().append(`&nbsp;<a style="float:right;" href="${pageUrl}">源站</a><span style="float:right;">&nbsp;&nbsp;</span><a style="float:right;" href="javascript:;" onclick="changeSrctype(1)" class="outSrc-a">海外节点</a><span style="float:right;">&nbsp;&nbsp;</span><span style="float:right;color:white;" class="chinaSrc-a">国内节点</span>`);
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