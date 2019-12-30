function Log(_str){
	console.log(_str);
}

datasource = "SMDB";

grpBadHash = {};
grpMarginalHash = {};
grpGoodHash = {};

grpBadWeight = {};

grpOutputHash = {};

srvBadHash = {};
srvMarginalHash = {};

srvOutputHash = {};

grpArray = [];
sidArray = [];

current_childSid = 0;
function RunPropagation(sid){
	current_childSid = sid;
	// get parent id list
	var pr = [];
	$("#loader").attr('class', 'loader');
	$.ajax({
		cache: false,
		url:'/Propagation?p=getParentList&sid=' + sid,
		success:function(pdata) {
			Log(pdata);
			propagate(JSON.parse(pdata).parentList);
		}
	});
	
	function propagate(pr){
		if(pr.length > 0) {

			grpArray = [];
			sidArray = [];

		    pi = 0;
		    Log('pr: ' + pr[0].sid + ' length: ' + pr.length);
		    while(pi < pr.length) {
		    //for(pi=0; pi<pr.length; pi++){
		        parentid = pr[pi].sid;
		        
		        Log(pi + ' Parent id of ' + current_childSid + ': ' + parentid);

		        pi++;
		        // get parent's groups and non grouped children
		        Log('running getParentChildrenAndGroups: /Propagation?p=getParentChildrenAndGroups&sid=' + parentid);
		        $.ajax({
		    		cache: false,
		    		url:'/Propagation?p=getParentChildrenAndGroups&sid=' + parentid,
		    		success:function(data1) {
		    			Log(data1);
		    			processForParent(JSON.parse(data1));
		    		}
		    	});
		    }
		    
		    function processForParent(gr){
		        prev_group = -1;
		        current_group = -1;
		        grpBadCount = 0;
		        grpMarginalCount = 0;
		        grpGoodCount = 0;
		        grpBadHash = {};
		        grpMarginalHash = {};
		        grpGoodHash = {};
		        srvBadHash = {};
		        srvMarginalHash = {};
		        srvOutputHash = {};
		        if(gr != undefined)
		        if(gr.length > 0){
		            gi = 0;
		            Log('All children count of found parent: ' + gr.length);

		            while(gi < gr.length){
		                prev_group = current_group;
		                //current_group = gr[gi].node_group_id;
		                current_group = gr[gi][3];
		                if(current_group === undefined)
		                    current_group = 0;

		            	if(grpBadHash[current_group] === undefined)
		            		grpBadHash[current_group] = 0;
		            	if(grpMarginalHash[current_group] === undefined)
		            		grpMarginalHash[current_group] = 0;
		            	if(grpGoodHash[current_group] === undefined)
		            		grpGoodHash[current_group] = 0;
	                    
		            	Log('Initiated grpGoodHash for group ' + current_group + ' value: ' + grpGoodHash[current_group]);
		                
		                if(current_group != prev_group && current_group > 0){
		                	Log('grpArray current: ' + grpArray + ' length: ' + grpArray.length);
		                    grpArray[grpArray.length] = current_group;
		                    Log('Filling grpArray with ' + current_group + ' legnth: ' + grpArray.length);
		                }

		                Log('Current group ID: ' + current_group);
		                Log('Current service_instance_id: ' + gr[gi][0]);
		                
		                if(current_group > 0){
		                    grpBadWeight[current_group] = gr[gi][4];
							// increase stat counts according to group member services stats
			            	
		                    if(gr[gi][5] == 5){
		                        if(grpBadHash[current_group] === undefined){
									grpBadHash[current_group] = 0;
								}
		                        grpBadHash[current_group]++;
		                        
		                        Log('grpBadCount: ' + grpBadCount);
		                        
		                    } else if(gr[gi][5] == 3) {
		                        if(grpMarginalHash[current_group] === undefined){
									grpMarginalHash[current_group] = 0;
								}
		                        grpMarginalHash[current_group]++;
		                        
		                        Log('grpMarginalCount: ' + grpMarginalHash[current_group] + ' current_group: ' + current_group);
		                        
		                    } else {
		                        if(grpGoodHash[current_group] === undefined){
									grpGoodHash[current_group] = 0;
								}
		                        grpGoodHash[current_group]++;
		                        
		                        Log('grpGoodCount: ' + grpGoodHash[current_group] + ' current_group: ' + current_group);
		                        
		                    }
		                } else {
			            	if(srvBadHash[gr[gi][0]] === undefined)
			            		srvBadHash[gr[gi][0]] = 0;
			            	if(srvMarginalHash[gr[gi][0]] === undefined)
			            		srvMarginalHash[gr[gi][0]] = 0;
			            	if(srvOutputHash[gr[gi][0]] === undefined)
			            		srvOutputHash[gr[gi][0]] = 0;
			            	
		                    sidArray[sidArray.length] = gr[gi][0];

		                    Log('Non grouped service ' + gr[gi][0] + ' status: ' + gr[gi][5]);
		                    if(gr[gi][5] == 5){

		                        srvBadHash[gr[gi][0]] = 1;
		                        srvMarginalHash[gr[gi][0]] = 0;
		                        srvOutputHash[gr[gi][0]] = 5;

		                        Log('Non grouped service ' + gr[gi][0] + ' bad count: ' + srvBadHash[gr[gi][0]]);

		                    } else if(gr[gi][5] == 3){

		                        srvBadHash[gr[gi][0]] = 0;
		                        srvMarginalHash[gr[gi][0]] = 1;
		                        srvOutputHash[gr[gi][0]] = 3;
		                        
		                    } else {
		                        srvOutputHash[gr[gi][0]] = 0;
		                    }

		                }

		                gi++;
		            }
		        }
		        
		        totalGrp = 0;
		        gind = 0;
		        globalBadCnt = 0;
		        globalMarginalCnt = 0;
		        Log('grpArray length: ' +  grpArray.length);
		        badcnt = 0;
		        marginalcnt = 0;
		        goodcnt = 0; 
		        while(gind < grpArray.length){
		            badcnt = grpBadHash[grpArray[gind]];
		            marginalcnt = grpMarginalHash[grpArray[gind]];
		            goodcnt = grpGoodHash[grpArray[gind]];
		            
		            globalBadCnt = globalBadCnt + badcnt;
		            globalMarginalCnt = globalMarginalCnt + marginalcnt;

		            Log('Global bad cnt: ' + globalBadCnt + ' grp ' + grpArray[gind] + ' bad cnt: ' + badcnt);
		            Log('Global marginal cnt: ' + grpMarginalHash[grpArray[gind]] + ' grp ' + grpArray[gind] + ' marginal cnt: ' + marginalcnt);
		            Log('grp ' + grpArray[gind] + ' good cnt: ' + goodcnt);
		            
		            totalGrp = badcnt + marginalcnt + goodcnt;
		            Log('updating totalGrp: ' + totalGrp);
		            
		            // if there are members of groups calculate outputs of each group
		            if(totalGrp > 0){
		                badweight = grpBadWeight[grpArray[gind]];
		                rate = (badcnt / (badcnt + marginalcnt + goodcnt)) * 100;
		                Log('badweight: ' + badweight + ' rate: ' + rate + ' bmg: ' + badcnt + ' '+ marginalcnt + ' ' + goodcnt);
		                if( rate >= badweight){
		                    grpOutputHash[grpArray[gind]] = 5;
		                } else if( badcnt > 0 || marginalcnt > 0 ) {
		                    grpOutputHash[grpArray[gind]] = 3;
		                } else {
		                    grpOutputHash[grpArray[gind]] = 0;
		                }

		            }
		            
		            gind = gind + 1;
		        }
		        
		        sind = 0;
		        Log('sidArray length: ' + sidArray.length);
		        while(sind < sidArray.length){
		            Log('sidArray sid: ' + sidArray[sind] + ' badStat: ' + srvBadHash[sidArray[sind]]);
		            // if there are groups calculate outputs of each group
		            globalBadCnt = globalBadCnt + srvBadHash[sidArray[sind]];
		            globalMarginalCnt = globalMarginalCnt + srvMarginalHash[sidArray[sind]];

		            Log('Global bad cnt: ' + globalBadCnt + ' srv ' + sidArray[sind] + ' bad cnt: ' + badcnt);
		            Log('Global marginal cnt: ' + globalMarginalCnt + ' srv ' + sidArray[sind] + ' marginal cnt: ' + marginalcnt);
		            
		            sind = sind + 1;
		        }
		            
		        // get output rule if exists
		        Log('running getOutputRule: /Propagation?p=getOutputRule&sid=' + parentid);
		        $.ajax({
		    		cache: false,
		    		url:'/Propagation?p=getOutputRule&sid=' + parentid,
		    		success:function(data2) {
		    			if(data2 != "") {
		    				or = JSON.parse(data2);
		    				
				            // set output status according to the output rule
				            cond = or.condition;
				            cond = cond.split("=").join("==");
				            Log('Condition to be evaluated: ' + cond);
				            
				            gind = 0;
				            Log('totalGrp: ' + totalGrp);
				            while(gind < grpArray.length){
				                // if there are groups calculate outputs of each group
				                if(totalGrp > 0){
				                    grpStatus = grpOutputHash[grpArray[gind]];
				                    cond = cond.split("g_" + grpArray[gind]).join(grpStatus);
				                }
				                
				                gind = gind + 1;
				            }
				            
				            sind = 0;
				            while(sind < sidArray.length){
				                // if there are groups calculate outputs of each group
				                srvStatus = srvOutputHash[sidArray[sind]];
				                cond = cond.split("s_" + sidArray[sind]).join(srvStatus);
				                sind = sind + 1;
				            }
				            cond = cond.split("AND").join("&&");
				            cond = cond.split("OR").join("||");
				            cond = '(' + cond + ')';
				            Log('Final condition: ' + cond);
				            
				            var condres = eval(cond);
				            Log('condres: ' + condres);
				            // eval cond
				            parentStatus = 0;
				            if(condres)
				            {
				                parentStatus = 5;
				            } else if(globalBadCnt > 0 || globalMarginalCnt){
				                parentStatus = 3;
				            } else {
				                parentStatus = 0;
				            }
				            
				        } else {
				            // set generic output status
				            if(globalBadCnt == gr.length){
				                parentStatus = 5;
				            } else if(globalBadCnt > 0 || globalMarginalCnt){
				                parentStatus = 3;
				            } else {
				                parentStatus = 0;
				            }
				        }
		    			
		    			// update parent status
				        //uq = "update smdbadmin.service_instances set current_status = " + parentStatus + ", ";
				        //uq = uq + " status_timestamp=EXTRACT(EPOCH FROM (select current_timestamp))  where service_instance_id = " + parentid;
				        //DirectSQL(datasource, uq, false);
		    			Log('running updateNodeStatus: /Propagation?p=updateNodeStatus&sid=' + parentid + '&status=' + parentStatus);
		    			$.ajax({
		    				cache: false,
		    				url:'/Propagation?p=updateNodeStatus&sid=' + parentid + '&status=' + parentStatus,
		    				success:function(data3) {
		    					//
		    				}
		    			});
		    		}
		    	});
		    }
		}
		
		$("#loader").attr('class', 'loader collapse');
	}

}


