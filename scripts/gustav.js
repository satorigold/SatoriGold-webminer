// Copyright (c) 2017 - 2019 | PiTi - crypto-webminer.com

	function lsTest(){		//check is LocalStorage available (true/false)
		var test = 'test';
		try {
			localStorage.setItem(test, test);
			localStorage.removeItem(test);
			return true;	//true
		} catch(e) {
			return false;	//false
		}
	}
	var IsLocalStorageAvailable = lsTest();		//test is LocalStorage available? true/false

$(function() {
  if(navigator.hardwareConcurrency > 1)
	{
		$('#threads').text(navigator.hardwareConcurrency - 1);
	}
	else
	{
		$('#threads').text(navigator.hardwareConcurrency);
	}
  var threads = $('#threads').text();
  var gustav;
  var walletcustom;
  var pooladdress;
  var algovariant;
  var pass;
  var statuss;
  var barChart;
  var barChartCanvas = $("#barchart-canvas");
  var siteKey = "nowalletinput";
  var hashingChart;
  var charts = [barChartCanvas];
  var selectedChart = 0;
  
  //new
  var lastrate = 0;
  var totalHashes = 0;
  var totalHashes2 = 0;
  var acceptedHashes = 0;
  var hashesPerSecond = 0;
  
	var defaultPool = (
		//"xxx"								//old default value - seems like not working.
		//"xaupool.walemo.com:36633"		//seems like working
		"letshash.it:6560"					//seems like working, on low difficulty, port for diff=2000
		//xau.pool-pay.com:7797";			//seems like not working, because autoswithing used, and maybe - difficulty so high.
	);

	var defaultAlgo 		= "?algo=cn-pico/trtl";
	var defaultPoolAddress	= (	//try to get custom pool address from ls, or use default
									//"xxx"
									"letshash.it:6560"		//but use this
	);
	
	var defaultAddress 		= "Xau1aJNVtTH8rpSXA2UijkFxpQu3kYeGFCtEzTtgVvmeYTJzYpxM4R3ZgeUuog3RT9JFuens9FVtxJCKLBjNfJ3w12WynpH296";
	
	var defaultPass = function(walletcustom){
		if(walletcustom === "Xau1aJNVtTH8rpSXA2UijkFxpQu3kYeGFCtEzTtgVvmeYTJzYpxM4R3ZgeUuog3RT9JFuens9FVtxJCKLBjNfJ3w12WynpH296"){		//if walletcustom was not specified, and used default test address
			return "Xau1aJNVtTH8rpSXA2UijkFxpQu3kYeGFCtEzTtgVvmeYTJzYpxM4R3ZgeUuog3RT9JFuens9FVtxJCKLBjNfJ3w12WynpH296@letsTESTit";		//use this pass
		}else{
			return "x";	//use default pass "x"
		}
	}
  
  if(IsLocalStorageAvailable === true){	//if LocalStorage is available
		//working with localStorage...
	algovariant		=	localStorage.getItem("algovariant") 	|| (defaultAlgo);					//try to get custom algovariant from ls, or use default
	pooladdress		=	localStorage.getItem("pooladdress") 	|| (defaultPoolAddress);			//try to get custom pool address from ls, or use default
	walletcustom	=	localStorage.getItem("walletcustom")	|| (defaultAddress);				//try to get walletcustom from ls, or use default
	pass			=	localStorage.getItem("pass") 			|| (defaultPass(walletcustom));		//try to get walletcustom from ls, or use default
  }else{ //else, if local storage is not available...
	//try to working with cookies.
	algovariant		=	$.cookie("algovariant") 	|| (defaultAlgo);					//try to get custom algovariant from ls, or use default
	pooladdress		=	$.cookie("pooladdress") 	|| (defaultPoolAddress);			//try to get custom pool address from ls, or use default
	walletcustom	=	$.cookie("walletcustom")	|| (defaultAddress);				//try to get walletcustom from ls, or use default
	pass			=	$.cookie("pass") 			|| (defaultPass(walletcustom));		//try to get walletcustom from ls, or use default
  }//end working with cookies.
														//and then
	$('#algovariant').val(algovariant);					//set this in input
	$('#walletcustom').val(walletcustom);				//set this in input
	$('#pass').val(pass);								//set this in input
	$('#pooladdress').val(pooladdress);					//set this in input
  
  
  function htmlEncode(value) {
    return $('<div/>').text(value).html();
  }

  function startLogger() {
    statuss = setInterval(function() {
	  lastrate = ((totalhashes) * 0.5 + lastrate * 0.5);
	  totalHashes = totalhashes + totalHashes
      hashesPerSecond = Math.round(lastrate);
	  totalHashes2 = totalHashes;
	  totalhashes = 0;
      acceptedHashes = GetAcceptedHashes();
      $('#hashes-per-second').text(hashesPerSecond);
      $('#accepted-shares').text(totalHashes2 +' | '+ acceptedHashes);
      $('#threads').text(threads);
    }, 1000);

    hashingChart = setInterval(function() {
      if (barChart.data.datasets[0].data.length > 25) {
        barChart.data.datasets[0].data.splice(0, 1);
        barChart.data.labels.splice(0, 1);
      }
      barChart.data.datasets[0].data.push(hashesPerSecond);
      barChart.data.labels.push("");
      barChart.update();
    }, 1000);
  };

  function stopLogger() {
    clearInterval(statuss);
    clearInterval(hashingChart);
  };
  
  $('#thread-add').click(function() {
    threads++;
    $('#threads').text(threads);
        /* if(navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i))
		{
			
		}
		else
		{
			deleteAllWorkers(); addWorkers(threads);
		} */
	  //Temp fix for iOS no longer needed
		deleteAllWorkers(); addWorkers(threads);
  });

  $('#thread-remove').click(function() {
    if (threads > 1) {
      threads--;
      $('#threads').text(threads);
		/* if(navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i))
		{
			
		}
		else
		{
			removeWorker();
		} */
	    //Temp fix for iOS no longer needed
	    removeWorker();
    }
  });

  $("#start").click(function() {	  
   if ($("#start").text() === "Start") {
      walletcustom = $('#walletcustom').val();
	  pooladdress = $('#pooladdress').val();
	  algovariant = $('#algovariant').val();
	  pass = $('#pass').val();
      if (walletcustom) 
      {
		PerfektStart(walletcustom, pass, threads);
		console.log(
			algovariant			+'\n'+
			pooladdress			+'\n'+
			walletcustom		+'\n'+
			pass
		);
		
		//save values in localstorage or in cookies.
		if(												//if
				IsLocalStorageAvailable === true		//localstorage is available
			||	window.location.origin === 'file://'	//or if this is local page (Google Chrome do not allow to use cookies for local-pages.)
		)
		{
			//Try to save values, in localstorage.
			if(IsLocalStorageAvailable === true){		//If LocalStorage is available
				//save values there:
				localStorage.setItem("algovariant",		algovariant);
				localStorage.setItem("pooladdress",		pooladdress);
				localStorage.setItem("walletcustom",	walletcustom);
				localStorage.setItem("pass",			pass);
				
				console.log(
								"Saved in localStorage:\n"+
								algovariant+'\n'+
								pooladdress+'\n'+
								walletcustom+'\n'+
								pass+'\n'
				);
				
			}else{
				console.log("LocalStorage is not available. IsLocalStorageAvailable = ", IsLocalStorageAvailable);
			}
		}
		else{	//else, use Jquery-cookie
				$.cookie("walletcustom", walletcustom, {
				expires: 365
				});
				$.cookie("pooladdress", pooladdress, {
				expires: 365
				});
				$.cookie("algovariant", algovariant, {
				expires: 365
				});
				$.cookie("pass", pass, {
				expires: 365
				});
				
				console.log(
								"Saved in cookie:\n"+
								algovariant+'\n'+
								pooladdress+'\n'+
								walletcustom+'\n'+
								pass+'\n'
				);
				
		}		
	        stopLogger();
                startLogger();
                $("#start").text("Stop");
	        $('#walletcustom').prop("disabled", true);
	        $('#pooladdress').prop("disabled", true);
	        $('#algovariant').prop("disabled", true);
	        $('#pass').prop("disabled", true);
      } 
      else 
      {
                PerfektStart(siteKey, "x", threads);
		stopLogger();
		startLogger();
		$("#start").text("Stop");
      }
    } 
    else 
    {
          stopMining();
          stopLogger();
          $('#walletcustom').prop("disabled", false);
	  $('#pooladdress').prop("disabled", false);
	  $('#algovariant').prop("disabled", false);
	  $('#pass').prop("disabled", false);
          $("#start").text("Start");
          $('#hashes-per-second').text("0");
	  $('#accepted-shares').text("0" +' | '+"0");
	  location.reload();
    }
  });

  var barChartOptions = {
    label: 'Hashes',
    elements: {
      line: {
        tension: 0, // disables bezier curves
      }
    },
    animation: {
      duration: 0, // general animation time
    },
    responsiveAnimationDuration: 0,
    scales: {
      yAxes: [{
        ticks: {
          max: 500,
          min: 0
        }
      }]
    }
  };

  var barChartData = {
    labels: [],
    datasets: [{
      label: "Hashes/s",
      backgroundColor: "darkcyan",
      data: []
    }],
  };

  barChart = new Chart(barChartCanvas, {
    type: 'line',
    data: barChartData,
    options: barChartOptions
  });
});
