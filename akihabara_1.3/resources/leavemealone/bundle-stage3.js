{
	setObject:[
		{
			object:"tilemaps",
			property:"stage3",
			value:help.finalizeTilemap({
				tileset:"tiles",
				map:[
					[0000,0000,0000,0000,0000,0000,0000,0000,0000,0000,0000,0000,0000,0000,0000,0000],
					[0000,null,null,null,null,null,null,null,null,null,null,null,null,null,null,0000],
					[0000,null,null,null,null,null,null,null,null,null,null,null,null,null,null,0000],
					[0000,null,null,null,null,null,null,null,null,null,null,null,null,null,null,0000],
					[0000,null,null,null,null,null,null,null,null,null,null,null,null,null,null,0000],
					[0000,null,null,null,null,null,null,null,null,null,null,null,null,null,null,0000],
					[0000,null,null,0000,0000,0000,null,null,null,null,0000,0000,0000,null,null,0000],
					[0000,null,null,null,null,null,null,null,null,null,null,null,null,null,null,0000],
					[0000,null,null,null,null,null,null,null,null,null,null,null,null,null,null,0000],
					[0000,null,null,null,null,null,null,0000,0000,null,null,null,null,null,null,0000],
					[0000,null,null,null,null,null,null,null,null,null,null,null,null,null,null,0000],
					[0000,null,null,null,null,null,null,null,null,null,null,null,null,null,null,0000],
					[0000,null,null,0000,0000,0000,null,null,null,null,0000,0000,0000,null,null,0000],
					[0000,null,null,null,null,null,null,null,null,null,null,null,null,null,null,0000],
					[0000,null,null,null,null,null,null,null,null,null,null,null,null,null,null,0000],
					[0000,null,null,null,null,null,null,0000,0000,null,null,null,null,null,null,0000],
					[0000,null,null,null,null,null,null,null,null,null,null,null,null,null,null,0000],
					[0000,null,null,null,null,null,null,null,null,null,null,null,null,null,null,0000],
					[0000,null,null,0000,0000,0000,null,null,null,null,0000,0000,0000,null,null,0000],
					[0000,null,null,null,0000,null,null,null,null,null,null,0000,null,null,null,0000],
					[0000,0000,0000,0000,0000,0000,0000,0000,0000,0000,0000,0000,0000,0000,0000,0000]
				  ],
				 playerSpawnX:30,
				 playerSpawnY:320,
				 addObjects:function() {
					maingame.addEnemy("goo",{x:20*4,y:20*16,side:true});
					maingame.addEnemy("goo",{x:20*4,y:20*11,side:true});
					maingame.addEnemy("goo",{x:20*4,y:20*5,side:true});
					maingame.addEnemy("goo",{x:20*11,y:20*16,side:true});
					maingame.addEnemy("goo",{x:20*11,y:20*11,side:true});
					maingame.addEnemy("goo",{x:20*11,y:20*5,side:true});
				 },
				tileIsSolidCeil:function(obj,t){ return (obj.group=="foes"?false:t==0) }, // false for Bubble bobble style platforming
				tileIsSolidFloor:function(obj,t){ return t==0 },
				nextLevel:"stage4"			
			})
		}
	]
}
