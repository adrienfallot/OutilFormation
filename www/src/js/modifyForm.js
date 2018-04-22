(function ($){

    "use strict";

    var proHistoryCpt = 0;

    $('#addHistoryProButton').on('click',function()
    {
        $('#historyPro').append(
            `
            <fieldset id="proHistory`+proHistoryCpt+`" class="wrap-input100 contact100-form">			
                <div class="wrap-input100 input100-select bg1">
                    <span class="label-input100">Type de contrat *</span>
                    <div>
                        <select class="js-select2" name="historyContractType`+proHistoryCpt+`">
                            <option value="0">Merci de choisir une valeur</option>
                            <option value="1">CDI</option>
                            <option value="2">CDD</option>
                        </select>
                        <div class="dropDownSelect2"></div>
                    </div>
                </div>

                <div class="wrap-input100 validate-input bg1 rs1-wrap-input100" data-validate="Merci d'entrer la date de début">
                    <span class="label-input100">Date de début *</span>
                    <input class="input100" type="date" name="historyContractStartDate`+proHistoryCpt+`" placeholder="Entrer la date de début">
                </div>

                <div class="wrap-input100 validate-input bg1 rs1-wrap-input100" data-validate="Merci d'entrer la date de fin">
                    <span class="label-input100">Date de fin *</span>
                    <input class="input100" type="date" name="historyContractEndDate`+proHistoryCpt+`" placeholder="Entrer la date de fin">
                </div>

                <button type="button" class="wrap-input100 contact100-form-btn contact100-form-btn-red" onClick="$(this).parent().remove();numberOfProHistory--;">
                    <span>
                        Supprimer
                    </span>
                </button>
            </fieldset>
            `
        );

        $("#proHistory"+proHistoryCpt+" .js-select2").each(function(){

			//dropdown display
			$(this).select2({
				minimumResultsForSearch: 20,
				dropdownParent: $(this).next('.dropDownSelect2')
			});

			//dropdown show details
			$("#proHistory"+proHistoryCpt+" .js-select2").each(function(){
				$(this).on('select2:close', function (e){
					if($(this).val() == "Please chooses") {
						$('.js-show-service').slideUp();
					}
					else {
						$('.js-show-service').slideUp();
						$('.js-show-service').slideDown();
					}
				});
			});
        })
        
        proHistoryCpt++;
        numberOfProHistory++;
    });


    var trainingHistoryCpt = 0;

    $('#addHistoryTrainingButton').on('click',function()
    {
        $('#historyTraining').append(
            `
            <fieldset id="proHistory`+trainingHistoryCpt+`" class="wrap-input100 contact100-form">			
                <div class="wrap-input100 input100-select bg1">
                    <span class="label-input100">Type de formation *</span>
                    <div>
                        <select class="js-select2" name="historyTrainingType`+trainingHistoryCpt+`">
                            <option value="0">Merci de choisir une valeur</option>
                            <option value="1">CIF</option>
                            <option value="2">VAE</option>
                            <option value="3">Bilan de compétences</option>
                        </select>
                        <div class="dropDownSelect2"></div>
                    </div>
                </div>

                <div class="wrap-input100 validate-input bg1 rs1-wrap-input100" data-validate="Merci d'entrer la date de début">
                        <span class="label-input100">Date de début *</span>
                        <input class="input100" type="date" name="historyTrainingStartDate`+trainingHistoryCpt+`" placeholder="Entrer la date de début">
                </div>

                <div class="wrap-input100 validate-input bg1 rs1-wrap-input100" data-validate="Merci d'entrer la date de fin">
                    <span class="label-input100">Date de fin *</span>
                    <input class="input100" type="date" name="historyTrainingEndDate`+trainingHistoryCpt+`" placeholder="Entrer la date de fin">
                </div>

                <div class="wrap-input100 validate-input bg1" data-validate="Merci d'entrer la durée (en heure)">
                    <span class="label-input100">Durée en heure *</span>
                    <input class="input100" type="number" name="historyTrainingDuration`+trainingHistoryCpt+`" placeholder="Entrer la durée">
                </div>

                <button type="button" class="wrap-input100 contact100-form-btn contact100-form-btn-red" onClick="$(this).parent().remove();numberOfTrainingHistory--;">
                    <span>
                        Supprimer
                    </span>
                </button>
            </fieldset>
            `
        );

        $("#proHistory"+trainingHistoryCpt+" .js-select2").each(function(){

			//dropdown display
			$(this).select2({
				minimumResultsForSearch: 20,
				dropdownParent: $(this).next('.dropDownSelect2')
			});

			//dropdown show details
			$("#proHistory"+trainingHistoryCpt+" .js-select2").each(function(){
				$(this).on('select2:close', function (e){
					if($(this).val() == "Please chooses") {
						$('.js-show-service').slideUp();
					}
					else {
						$('.js-show-service').slideUp();
						$('.js-show-service').slideDown();
					}
				});
			});
        })
        
        trainingHistoryCpt++;
        numberOfTrainingHistory++;
    });

})(jQuery);