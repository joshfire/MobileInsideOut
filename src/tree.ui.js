Joshfire.define(['joshfire/class', 'joshfire/tree.ui', 'joshfire/vendor/underscore','joshfire/uielements/list','joshfire/uielements/panel','joshfire/uielements/panel.manager','joshfire/uielements/map','templates_compiled/js/share','templates_compiled/js/aboutinsideout','templates_compiled/js/aboutjr','joshfire/uielements/button'], function(Class, UITree, _,UIList,UIPanel,UIPanelManager,UIMap,TplShare,TplAboutInsideOut,TplAboutJR,UIButton) {

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
                content:"header"
              },
              {
                id:'uploadbutton',
                type:UIButton,
                label:"upload",
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
                    type:UIPanel,
                    innerTemplate:TplAboutInsideOut,
                    autoShow:false
                  },
                  {
                    'id':'aboutjr',
                    type:UIPanel,
                    innerTemplate:TplAboutJR,
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
                type:'list', //UIList,
                data:[
                  // TODO IMAGES
                  {'id':'photos','label':'Mosaic'},
                  //{'id':'map','label':'Map'},
                  {'id':'aboutinside','label':'Inside'},
                  {'id':'aboutjr','label':'About'},
                  {'id':'share','label':'Share'}
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
                content:"header upload"
              },
              {
                id:'view',
                type:UIPanelManager,
                children:[
                  /*{
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
                  */
                  
                  {
                    id:'register',
                    type:UIPanel,
                    autoShow:true,
                    content:"Register form"
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
                type:'list', //UIList,
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
                  {
                    'id':'map',
                    type:UIMap,
                    //dataPath:'/photos',
                    autoShow:false
                  },
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