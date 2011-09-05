Joshfire.define(['joshfire/class', 'joshfire/tree.ui', 'joshfire/vendor/underscore','joshfire/uielements/list','joshfire/uielements/panel','joshfire/uielements/panel.manager','joshfire/uielements/map'], function(Class, UITree, _,UIList,UIPanel,UIPanelManager,UIMap) {

  return Class(UITree, {

    buildTree: function() {
      var app = this.app;

      return [
        {
          id:'header',
          type:UIPanel,
          content:"header"
        },
        {
          id:'pm',
          type:UIPanelManager,
          uiMaster:'/menubottom',
          children:[
            {
              'id':'photos',
              type:UIList,
              dataPath:'/photos',
              autoShow:true
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
              content:"XXX",
              autoShow:false
            },
            {
              'id':'aboutjr',
              type:UIPanel,
              content:"YYY",
              autoShow:false
            },
            {
              'id':'share',
              type:UIPanel,
              content:"ZZZ",
              autoShow:false
            }
          ]
        },
        
        {
          id: 'menubottom',
          type:'list', //UIList,
          data:[
            // TODO IMAGES
            {'id':'photos','label':'Mosaic'},
            {'id':'map','label':'Map'},
            {'id':'aboutinside','label':'Inside'},
            {'id':'aboutjr','label':'About'},
            {'id':'share','label':'Share'}
          ] 
        }
      ];
    }

  });

});
