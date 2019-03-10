//globale variable om hoeveelheid contactpersonen bij te houden
var amountContactPerson = 1;

//collect het geselecteerde bedrijf (voor de edit pagina)
if(localStorage.getItem("bedrijfId") && $(".bedrijfbewerken").length === 1) {
	var bedrijfId = localStorage.getItem("bedrijfId");
	
	vulEditPagina(bedrijfId);
}


$(document).ready(function(){
	
	//ready chosen input
	$(".chzn-select").chosen();

	//hide toevoegen contactPerson on default
	$("#contactPersonen").hide();
	
	//de succes velden
	$(".succesOpslaan").hide();
	
	//de error velden
	$(".nietOpslaan").hide();
	$(".failLoad").hide();
	$(".warningOpslaan").hide();
	$(".postcodeOnjuist").hide();
	$(".telefoonummerOnjuist").hide();
	
	//toggle add contactpersoon informatie, ook required
	$('#checkCP').click(function() {
		$("#contactPersonen").toggle(this.checked);
		if($('#checkCP').prop('checked')) {
			$("#1_cVnaam").attr('required', 'required');
			$("#1_cAnaam").attr('required', 'required');
		}
		else {
			$("#1_cVnaam").removeAttr('required');
			$("#1_cAnaam").removeAttr('required');
		}
	});
	
	//klik de bootstrap alerts weg
	$(function(){
		$("[data-hide]").on("click", function(){
			$("." + $(this).attr("data-hide")).hide();
		});
	});
	
	//zoeken in een tabel
	$("#zoekTable").on("keyup", function () {
        let value = $(this).val().toLowerCase();
        $("#index_bedrijfdetails tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });

});

//simpele functie om te checken of de value empty is
function isEmpty(val){
    return ((val !== '') && (val !== undefined) && (val.length > 0) && (val !== null));
}

//simpele patternfunctie om te checken of de psotcode klopt
function isValidPostcode(bedrijfsPostcode) {
    let pattern = new RegExp("[1-9][0-9]{3}\\s?[a-zA-Z]{2}");
	
    return pattern.test(bedrijfsPostcode);
}

//simpele patternfunctie om te checken of de telefoonnummer klopt
function isValidTelefoonnummer(bedrijfsTelefoonummer) {
    let pattern = new RegExp("[0][0-9]{9}");
	
    return pattern.test(bedrijfsTelefoonummer);
}

//vul de editpagina met de bedrijfsinformatie
function vulEditPagina(bedrijfId) {
	
	jQuery.ajax({
	async: "true",
	crossDomain: "true",
	type: "GET",
	data: { bedrijfId : bedrijfId },
	url: '../../assets/ajax/ajax.bedrijf.php?func=getBedrijfById',
	dataType:'json',
			
	}).done(function(element) {
		
		let target = $(".bedrijfbewerken");
	
		//bedrijf details kan ingevuld zijn dus eerst checken of dat ook zo is
		if((isEmpty(element["bedrijfStraat"] === null))) {
			element["bedrijfStraat"] = '';
		}
		if((isEmpty(element["bedrijfHuisnummer"] === null))) {
			element["bedrijfHuisnummer"] = '';
		}
		if((isEmpty(element["bedrijfToevoeging"] === null))) {
			element["bedrijfToevoeging"] = '';
		}
		if((isEmpty(element["bedrijfPostcode"] === null))) {
			element["bedrijfPostcode"] = '';
		}
		if((isEmpty(element["bedrijfTelefoonnummer"] === null))) {
			element["bedrijfTelefoonnummer"] = '';
		}
		if((isEmpty(element["bedrijfEmailadres"] === null))) {
			element["bedrijfEmailadres"] = '';
		}

		$(target).append('<div class="form-row"><div id="centerenCols" class="offset-md-2 col-sm-7 form-group">' +
					' Bedrijfsnaam <input id="bedrijfsNaam" name="bNaam" value="' + element["bedrijfNaam"] + '" class="form-control" type="textbox" required/></div></div>' +
					'<div class="form-row"><div id="centerenCols" class="form-group col-md-2 offset-md-2">Straatnummer ' +
					'<input id="bedrijfsStrnummer" name="bHn" value="' + element["bedrijfHuisnummer"] + '" class="form-control" type="textbox"/></div>' +
					'<div id="centerenCols" class="form-group col-md-1">Toevoeging <input id="bedrijfsToevoeging" name="bHToe" value="' + element["bedrijfToevoeging"] + '" class="form-control" type="textbox"/></div>' +
					'<div id="centerenCols" class="col-md-2 offset-md-2 form-group">' +
					'Postcode <input id="bedrijfsPostcode" name="bPostcode" value="' + element["bedrijfPostcode"] + '" class="form-control" title="Voer hier postcode in." type="textbox"/></div>' +
					'</div><div class="form-row"><div id="centerenCols" class="col-md-7 offset-md-2 form-group">Adres <input id="bedrijfsStraat" name="bStr" value="' + element["bedrijfStraat"] + '" class="form-control" type="textbox"/>' +
					'</div></div>' +
					'<div class="form-row"><div id="centerenCols" class="col-sm-7 offset-md-2 form-group">' +
					'Telefoonnummer <input id="bedrijfsTelefoonummer" name="bTel" value="' + element["bedrijfTelefoonnummer"] + '" class="form-control" type="tel"/>' +
					'</div></div>' +
					'<div class="form-row"><div id="centerenCols" class="col-sm-7 offset-md-2 form-group">' +
					'Emailadres <input id="bedrijfsEmailadres" name="bMail" value="' + element["bedrijfEmailadres"] + '" class="form-control" type="email"/></div></div>' +
					'</br></br></div>' +
					'<div class="form-row"><div id="centerenCols" class="col-sm-7 offset-md-2 form-group">' +
					'<button class="btn btn-primary" onclick="opslaanEditBedrijf(' + element["bedrijfId"] + ')" name="submit"> Sla de gegevens op </button></div></div>');
					
	}).fail(function() {
		
		$(".failLoad").show();
	});
					
}

//sla de informatie van de edit pagina op
function opslaanEditBedrijf(bedrijfId) {
	
	let bedrijfsNaam = $("#bedrijfsNaam")[0].value;
	let bedrijfsStrnummer = $("#bedrijfsStrnummer")[0].value;
	let bedrijfsToevoeging = $("#bedrijfsToevoeging")[0].value;
	let bedrijfsPostcode = $("#bedrijfsPostcode")[0].value;
	let bedrijfsStraat = $("#bedrijfsStraat")[0].value;
	let bedrijfsTelefoonummer = $("#bedrijfsTelefoonummer")[0].value;
	let bedrijfsEmailadres = $("#bedrijfsEmailadres")[0].value;
	
	//bedrijfsnaam moet ingevuld zijn
	if((isEmpty(bedrijfsNaam))) {
		
		//bedrijf details kan ingevuld zijn dus eerst checken of dat ook zo is
		//accepteer geen straatnummer 0
		if(!(isEmpty(bedrijfsStrnummer)) || bedrijfsStrnummer === 0) {
			bedrijfsStrnummer = '';
		}
		if(!(isEmpty(bedrijfsToevoeging))) {
			bedrijfsToevoeging = '';
		}
		if(!(isEmpty(bedrijfsPostcode))) {
			bedrijfsPostcode = '';
		} else {
			//is het valide postcode?
			if(!(isValidPostcode(bedrijfsPostcode))) {
			
				$(".postcodeOnjuist").show();
				$(window).scrollTop(0);
				
				return false;
			}
		}
		if(!(isEmpty(bedrijfsStraat))) {
			bedrijfsStraat = '';
		}
		if(!(isEmpty(bedrijfsTelefoonummer))) {
			bedrijfsTelefoonummer = '';
		} else {
			//is het valide telefoonummer?
			if(!(isValidTelefoonnummer(bedrijfsTelefoonummer))) {
			
				$(".telefoonummerOnjuist").show();
				$(window).scrollTop(0);
				
				return false;
			}
		}
		if(!(isEmpty(bedrijfsEmailadres))) {
			bedrijfsEmailadres = '';
		}
		
		jQuery.ajax({
		async: "true",
		crossDomain: "true",
		type: "GET",
		data: { bedrijfId : bedrijfId,
				bedrijfsNaam : bedrijfsNaam,
				bedrijfsStrnummer : bedrijfsStrnummer,
				bedrijfsToevoeging : bedrijfsToevoeging,
				bedrijfsPostcode : bedrijfsPostcode,
				bedrijfsStraat : bedrijfsStraat,
				bedrijfsTelefoonummer : bedrijfsTelefoonummer,
				bedrijfsEmailadres: bedrijfsEmailadres
			},
		url: '../../assets/ajax/ajax.bedrijf.php?func=editBedrijf',
				
		}).done(function(element) {
			
			//succes!
			$(".succesOpslaan").show();
			$(window).scrollTop(0);
			
			//delete de localstorage
			localStorage.removeItem("bedrijfId");
			
			//5 seconden timer
			var counter = 0;
			
			var interval = setInterval(function() {
				counter++;
				
				if (counter == 5) {
					// redirect naar de bedrijven index
					clearInterval(interval);
					window.location.href = "/views/bedrijf/";
				}
			}, 1000);
				
		}).fail(function(e) {
			//er is iets fout gegaan bij het opslaan
			$(".nietOpslaan").show();
			$(window).scrollTop(0);
		});
	} else {
		//er is nog iets fout bij het de invoer validatie
		$(".warningOpslaan").show();
		$(window).scrollTop(0);
	}
}

function addExtraContactPersoon() {
	
	let target = $("#contactPerson");
	amountContactPerson++;

	//voornaam, tussenvoegsel en achternaam. moet bij elkaar!
	let voorTussenAchterGedeelte = '<div id="contact_'+ amountContactPerson + '" class="form-row">' +
								//voornaam
								'<div id="centerenCols" class="col-sm-2 offset-md-2 form-group">'+ 
								'Voornaam <input id="' + amountContactPerson + '_cVnaam" name="' + amountContactPerson + '_cVnaam" class="form-control cVnaam" type="textbox"/></div>' +
								
								//voorvoegsel
								'<div id="centerenCols" class="form-group col-md-1">' +
								'Voorvoegsel <select class="chzn-select" id="' + amountContactPerson + '_cTussenvoegsel" name="' + amountContactPerson + '_cTussenvoegsel"><option value="default" selected="selected">(Optioneel)</option>' +
								'</select></div>' +
								
								//achternaam
								'<div id="centerenCols" class="col-sm-3 offset-md-1 form-group">' +
								'Achternaam <input id="' + amountContactPerson + '_cAnaam" name="' + amountContactPerson + '_cAnaam" class="form-control" type="textbox"/></div></div>';
								
	//append het in één keer erin
	$(target).append('<div id="' + amountContactPerson + '_contactPerson" class="contactPerson"><div id="contact_'+ amountContactPerson + '" class="form-row"><div id="centerenCols" class="col-sm-7 offset-md-2 form-group"><h5>Contactpersoon' +
					'<a alt="verwijder contactpersoon" onClick="deleteExtraContactPersoon('+ amountContactPerson +')"><i class="fas fa-minus-circle" style="font-size:15px;color:red"></i>' +
					'</a></h5></div></div>' + voorTussenAchterGedeelte + '' +
					'<div id="contact_'+ amountContactPerson + '" class="form-row"><div id="centerenCols" class="col-sm-7 offset-md-2 form-group">' +
					'Telefoonnummer <input id="' + amountContactPerson + '_cTel" name="' + amountContactPerson + '_cTel" class="form-control" type="textbox"/></div></div>' +
					'<div id="contact_'+ amountContactPerson + '" class="form-row"><div id="centerenCols" class="col-sm-7 offset-md-2 form-group">' +
					'Email <input id="' + amountContactPerson + '_cMail" name="' + amountContactPerson + '_cMail" class="form-control" type="textbox"/></div></div></br></div>');
					
	let dropdownTussenvoegsel = document.getElementById(amountContactPerson + '_cTussenvoegsel');
		
	jQuery.ajax({
	async: "true",
	crossDomain: "true",
	type: "GET",
	url: '../../assets/ajax/ajax.bedrijf.php?func=getTheVoorvoegsels',
	dataType:'json',
			
	}).done(function(element) {
			
		//vul de voorvoegsels in de dropdown
		$(dropdownTussenvoegsel).append(element);
		
		//maak de dropdown chosen
		$(dropdownTussenvoegsel).chosen();
		
	}).fail(function(e) {
		$(dropdownTussenvoegsel).append("<option value='default' selected='selected'>(Optioneel)</option>");
		
		//maak de dropdown chosen
		$(dropdownTussenvoegsel).chosen();
	});
}

function deleteBedrijf(number) {
	//TODO: Delete bedrijf
	
	let x = number;

	console.log("TODO: Delete bedrijf. Staan facturen open etc");
	// $("#" + x + "_contactPerson").remove();
	
	// jQuery.ajax({
	// async: "true",
	// crossDomain: "true",
	// type: "GET",
	// url: '../../assets/ajax/ajax.bedrijf.php?func=deleteBedrijf',
	// dataType:'json',
			
	// }).done(function(element) {
		
		// succes!
		// $(".succesDelete").show();
		// $(window).scrollTop(0);
		
			// let x = number;
		// console.log("TODO: Delete bedrijf");
		// $("#" + x + "_contactPerson").remove();
	
	// }).fail(function(e) {
		
		// $(".nietDelete").show();
		// $(window).scrollTop(0);
	// });
}

function bekijkContactPersonen(id) {
	let bedrijfId = id;
	
    localStorage.setItem("bedrijfId", bedrijfId);
    location.href = "contactpersoon/index.php";
}

function editBedrijf(id) {
	let bedrijfId = id;
	
    localStorage.setItem("bedrijfId", bedrijfId);
    location.href = "edit.php";
}

function deleteExtraContactPersoon(number) {
	let x = number;
	
	$("#" + x + "_contactPerson").remove();
}