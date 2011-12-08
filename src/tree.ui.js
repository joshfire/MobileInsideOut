Joshfire.define(['joshfire/class', 'joshfire/tree.ui', 'joshfire/vendor/underscore','joshfire/uielements/list','joshfire/uielements/panel','joshfire/uielements/panel.manager','templates_compiled/js/share','templates_compiled/js/aboutinsideout','templates_compiled/js/aboutjr','templates_compiled/js/registerform','joshfire/uielements/button','joshfire/uielements/forminput'], function(Class, UITree, _,UIList,UIPanel,UIPanelManager,TplShare,TplAboutInsideOut,TplAboutJR,TplRegisterForm,UIButton, FormInput) {

  return Class(UITree, {

    buildTree: function() {
      var app = this.app;

      return {
        id:'root',
        type:UIPanelManager,
        children:[
          {
            id:'browse',
            type:UIPanel,
            autoShow:true,
            children:[
              {
                id:'header',
                type:UIPanel,
                content:""
              },
              {
                id:'uploadbutton',
                type:UIButton,
                label:"PARTICIPATE",
                onSelect:function() {
                  app.ui.element('').switchTo("upload");
                }
              },
              {
                id:'view',
                type:UIPanelManager,
                uiMaster:'/browse/menu',
                children:[
                  {
                    'id':'photos',
                    type:UIList,
                    dataPath:'/photos',
                    autoShow:true,
                    onSelect:function(elt,evt,data) {
                      var photoId = data[0][0];
                      
                      app.ui.element('/entry/view/photos').setDataPath("/photos/"+photoId+"/");
                      //app.ui.element('/entry/view/map').setDataPath("/photos/"+photoId+"/");
                      app.ui.element('/entry/view/statement').setDataPath("/photos/"+photoId+"/statement");
                      app.ui.element('/entry/view/share').setDataPath("/photos/"+photoId);
                      
                      app.ui.element('').switchTo("entry");
                    }
                  },
                  /*{
                    'id':'map',
                    type:UIMap,
                    dataPath:'/photos',
                    autoShow:false
                  },*/
                  {
                    'id':'aboutinside',
                    type:UIList, //List instead of panel so that we can scroll
                    itemInnerTemplate:TplAboutInsideOut,
                    data:[{"id":"void"}],
                    autoShow:false
                  },
                  {
                    'id':'aboutjr',
                    type:UIList,
                    itemInnerTemplate:TplAboutJR,
                    data:[{"id":"void"}],
                    autoShow:false
                  },
                  {
                    'id':'share',
                    type:UIPanel,
                    innerTemplate:TplShare,
                    autoShow:false
                  }
                ]
              },

              {
                id: 'menu',
                type:UIList,
                data:[
                  // TODO IMAGES
                  {'id':'photos','label':'MOSAIC'},
                  //{'id':'map','label':'Map'},
                  {'id':'aboutinside','label':'INSIDE OUT'},
                  {'id':'aboutjr','label':'ABOUT'},
                  {'id':'share','label':'SHARE'}
                ] 
              }
            
            ]
          },
          
          {
            id:'upload',
            autoShow:false,
            type:UIPanel,
            children:[
              {
                id:'header',
                type:UIPanel,
                children: [
                  {
                    id: 'prev',
                    type: UIButton,
                    label: '',
                    onSelect:function() {
                    	app.ui.element('').switchTo("browse");
                    }
                  },
                  {
                    id: 'home',
                    type: UIButton,
                    label: '',
                    onSelect:function() {
                    	app.ui.element('').switchTo("browse");
                    }
                  }
                ]
              },
              {
                id:'view',
                type:UIPanelManager,
                children:[
				  {
				  	id: 'signinform',
				  	type: UIPanel,
				  	children: [
				  	  {
				  	    id: 'title',
				  	    type: UIPanel,
				  	    content: 'Login'
				  	  },
				  	  {
				  	    id: 'login',
				  	    type: FormInput,
				  	    inputType: 'text',
				  	    label: 'Login'
				  	  },
				  	  {
				  	    id: 'password',
				  	    type: FormInput,
				  	    inputType: 'password',
				  	    label: 'Password'
				  	  },
				  	  {
				  	    id: 'ok',
				  	    type: UIButton,
				  	    label: 'Ok',
				  	    onSelect:function() {
				  	    	app.ui.element('/upload/view').switchTo('phototypeform');
				  	    }
				  	  },
				  	  {
				  	    id: 'forgot',
				  	    type: UIButton,
				  	    label: 'Forgot password',
				  	    onSelect:function() {
				  	    	window.open('http://www.insideoutproject.net/user/forgotPassword');
				  	    }
				  	  },
				  	  {
					  	id: 'footer',
					  	type: UIPanel,
					  	children: [
					  	  {
						  	    id: 'title',
						  	    type: UIPanel,
						  	    content: 'Not registered?'
						  	  },
						  	  {
						  	    id: 'createaccount',
						  	    type: UIButton,
						  	    label: 'Create account',
						  	    onSelect:function() {
							  	    app.ui.element('/upload/view').switchTo('registerform');
							  	}
						  	  }
					  	]
					  }
				  	]
				  },
				  
				  {
				  	id: 'registerform',
				  	type: UIPanel,
				  	autoShow:false,
				  	children: [
				  	  {
				  	    id: 'title',
				  	    type: UIPanel,
				  	    content: 'User Registration'
				  	  },
				  	  {
				  	    id: 'firstname',
				  	    type: FormInput,
				  	    inputType: 'text',
				  	    label: 'First Name'
				  	  },
				  	  {
				  	    id: 'lastname',
				  	    type: FormInput,
				  	    inputType: 'text',
				  	    label: 'Last Name'
				  	  },
				  	  {
				  	    id: 'email',
				  	    type: FormInput,
				  	    inputType: 'text',
				  	    label: 'Email'
				  	  },
				  	  {
				  	    id: 'password',
				  	    type: FormInput,
				  	    inputType: 'password',
				  	    label: 'Password'
				  	  },
				  	  {
				  	    id: 'ok',
				  	    type: UIButton,
				  	    label: 'Ok',
				  	    onSelect:function() {
				  	    	
				  	    }
				  	  }
				  	  
				  	]
				  },
				  
				  {
				  	id: 'phototypeform',
				  	type: UIPanel,
				  	autoShow:false,
				  	children: [
				  	  {
				  	    id: 'title',
				  	    type: UIPanel,
				  	    content: 'Participe upload a portrait'
				  	  },
				  	  

				  	  {
				  	    id: 'portrait',
				  	    type: UIButton,
				  	    label: 'Part 1'
				  	  },
				  	  
				  	 
				  	  {
				  	    id: 'street',
				  	    type: UIButton,
				  	    label: 'Part 2'
				  	  },
				  	  
				  	   {
				  	    id: 'title2',
				  	    type: UIPanel,
				  	    content: 'Upload a photo of a poster into the wild'
				  	  }
				  	  
				  	]
				  }
				]
			  },
			  
			  /*{
                id:'view',
                type: UIPanelManager,
                children:[
                  {
                    id:'signin_or_register',
                    type:UIPanel,
                    autoShow:true,
                    children:[
                      {
                        id:'signin',
                        type:UIButton,
                        label:'Sign in',
                        onSelect:function() {
                          app.ui.element("/upload/view").switchTo('signin');
                        }
                      },
                      {
                        id:'register',
                        type:UIButton,
                        label:'Register',
                        onSelect:function() {
                          app.ui.element("/upload/view").switchTo('register');
                        }
                      }
                    ]
                  },
                  {
                    id:'signin',
                    type:UIPanel,
                    autoShow:false,
                    content:"Sign in form"
                  },
                  {
                    id:'register',
                    type:UIPanel,
                    autoShow:true,
                    innerTemplate:TplRegisterForm
                  },
                  
                  {
                    id:'upload',
                    type:UIPanel,
                    autoShow:false,
                    content:"Upload form"
                  },
                  
                  {
                    id:'check',
                    type:UIPanel,
                    autoShow:false,
                    content:"Check the image is good"
                  },
                  
                  {
                    id:'thanks',
                    type:UIPanel,
                    autoShow:false,
                    content:"Thanks!"
                  }
                
                ]
              }
*/
            ]
          },
          
          
          {
            id:'entry',
            autoShow:false,
            type:UIPanel,
            children:[
              {
                id:'header',
                type:UIPanel,
                content:"header entry"
              },
              
              {
                id: 'menu',
                type:UIList,
                data:[
                  // TODO IMAGES
                  {'id':'photo','label':'Photo'},
                  {'id':'map','label':'Where'},
                  {'id':'statement','label':'Statement'},
                  {'id':'share','label':'Share'}
                ] 
              },
              
              {
                id:'view',
                type:UIPanelManager,
                uiMaster:'/entry/menu',
                children:[
                  {
                    'id':'photos',
                    type:UIList,
                    //dataPath:'/photos',
                    autoShow:true
                  },
                  /*{
                    'id':'map',
                    type:UIMap,
                    //dataPath:'/photos',
                    autoShow:false
                  },*/
                  {
                    'id':'statement',
                    type:UIPanel,
                    content:"statement",
                    autoShow:false
                  },
                  {
                    'id':'share',
                    type:UIPanel,
                    innerTemplate:TplShare,
                    autoShow:false
                  }
                ]
              }
            
            
            ]
          }
          
          
          
        ]
      }
        
    }

  });

});
