/**
 * @author - Jake Liscom
 * @project - OpenNote
 */

/**
 * Server configuration service
 */
openNote.service("serverConfigService", function ($http, $q, config, userService) {
	/**
	 * @return - config object promise
	 */
	this.getConfig = function(){
		if(!sessionStorage.serverConfig)//if we do not have it yet, request it
			return requestServerConfig();

		//make a quick promise
			var deferred = $q.defer();
			deferred.resolve(angular.fromJson(sessionStorage.serverConfig));
			return deferred.promise;
	};

	/**
	 * Get server config list from server
	 */
	var requestServerConfig = function(){
		return $http.get(config.servicePath() +"/config/").then(
			function(response){//Successful
				if(response.status==200){
					sessionStorage.serverConfig=angular.toJson(response.data);
					return response.data;
				}
				return false;
			},
			function(){
				return false;
			}
		);
	};

	//FIXME pull register again

	/**
	 * @param dark - true if dark theme
	 * @return - ckeditor config object
	 */
	this.getEditorConfig = function(){
		var dark = config.isDarkTheme();
		return this.getConfig().then(function(data){
			var temp = {
					removePlugins 				:	"newpage,save,templates,about,liststyle,tabletools,scayt,contextmenu", //remove some icons menu button
					//extraPlugins				:	"imagepaste",
					height 						: 	"600px",
					disableNativeSpellChecker 	: 	false
				};

// %REMOVE_START%
	// The configuration options below are needed when running CKEditor from source files.
	temp.plugins = 'dialogui,dialog,about,a11yhelp,basicstyles,blockquote,clipboard,panel,floatpanel,menu,contextmenu,resize,button,toolbar,elementspath,enterkey,entities,popup,filebrowser,floatingspace,listblock,richcombo,format,horizontalrule,htmlwriter,wysiwygarea,image,indent,indentlist,fakeobjects,link,list,magicline,maximize,pastetext,pastefromword,removeformat,showborders,sourcearea,specialchar,menubutton,scayt,stylescombo,tab,table,tabletools,undo,wsc';
	temp.skin = 'moono-lisa';
	// %REMOVE_END%

	// Define changes to default configuration here.
	// For complete reference see:
	// http://docs.ckeditor.com/#!/api/CKEDITOR.config

	// The toolbar groups arrangement, optimized for two toolbar rows.
	temp.toolbarGroups = [
		{ name: 'clipboard',   groups: [ 'clipboard', 'undo' ] },
		{ name: 'editing',     groups: [ 'find', 'selection', 'spellchecker' ] },
		{ name: 'links' },
		{ name: 'insert' },
		{ name: 'forms' },
		{ name: 'tools' },
		{ name: 'document',	   groups: [ 'mode', 'document', 'doctools' ] },
		{ name: 'others' },
		'/',
		{ name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
		{ name: 'paragraph',   groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ] },
		{ name: 'styles' },
		{ name: 'colors' },
		{ name: 'about' }
	];

	// Remove some buttons provided by the standard plugins, which are
	// not needed in the Standard(s) toolbar.
	temp.removeButtons = 'Underline,Subscript,Superscript';

	// Set the most common block elements.
	temp.format_tags = 'p;h1;h2;h3;pre';

	// Simplify the dialog windows.
	temp.removeDialogTabs = 'image:advanced;link:advanced';

				//style sheet
					if(dark){
						temp.contentsCss = "openNote/style/invert/dark/note.css";
						temp.skin = "moono.dark,../../openNote/style/dark/ckeditor/moono.dark/";
					}
					else
						temp.contentsCss = "openNote/style/invert/light/note.css";

				//configure the upload path if uploads are enabled
					if(data && data.uploadEnabled && userService.hasValidToken()){
						temp.filebrowserUploadUrl = config.servicePath()+"/file/"+"?token="+userService.getAPITokenObject().token;//FIXME
						temp.filebrowserImageUploadUrl = temp.filebrowserUploadUrl;
					}
				return temp;
		});
	};
});
