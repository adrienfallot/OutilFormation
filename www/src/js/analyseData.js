var AnalyseDataModule = (function ($) 
{
    "use strict";
    var analyseData = {};    
    
    analyseData.numberOfProHistory = 0;
    analyseData.numberOfTrainingHistory = 0;

    var contractTypeEnum = {
        CDI : 1,
        CDD : 2,
        jobseeker : 3,
        interim : 4,
        intermittent : 5
    }

    var trainingTimeTypeEnum = {
        fullTime : 0,
        partTime : 1
    }

    var trainingTypeEnum = {
        CIF : 1,
        VAE : 2,
        skillsAssessment : 3
    }

    var trainingObjectifEnum = {
        reconversion : 1,
        higherQualification : 2,
        enrichKnowledge : 3,
        examination : 4
    }

    var userData = {
        actualContractType : -1,
        actualSalary : -1,

        trainingObjectif : -1,
        trainingIsActivityField : -1,
        trainingStartDate : -1,
        trainingDuration : -1,
        trainingTypeTime : -1,

        contractHistory : [],
        trainingHistory : []
    }
    
    analyseData.analyseFormResult = function(formData) {

        var formDataDict = {};
        for (let dataIndex = 0; dataIndex < formData.length; dataIndex++)
        {
            const data = formData[dataIndex];
            formDataDict[data.name] = data.value;
        }
       

        userData.actualContractType = formDataDict["actualContractType"].value;
        userData.actualSalary = formDataDict["actualSalary"].value;

        userData.trainingIsActivityField = formDataDict["trainingObjectif"].value;
        userData.activityField = formDataDict["activityField"].value;
        userData.trainingStartDate = formDataDict["trainingDate"].value;
        userData.trainingDuration = formDataDict["trainingDuration"].value;
        userData.trainingTypeTime = formDataDict["trainingTypeTime"].value;

        for(var i = 0; i < numberOfProHistory; i++)
        {
            var contract = new Object();

            contract.contractType = formDataDict["historyContractType"+i].value;
            contract.startDate = formDataDict["historyContractStartDate"+i].value;
            contract.endDate = formDataDict["historyContractEndDate"+i].value;
        
            userData.contractHistory.push(contract)
        }


        for(var i = 0; i < numberOfTrainingHistory; i++)
        {
            var training = new Object();

            training.trainingType = formDataDict["historyTrainingType"+i].value;
            training.startDate = formDataDict["historyTrainingStartDate"+i].value;
            training.endDate = formDataDict["historyTrainingEndDate"+i].value;
            training.duration = formDataDict["historyTrainingDuration"+i].value;

            userData.trainingHistory.push(training)
        }

        var CIFScore = CanUseCIF();
        console.log("CIF : "+CIFScore+"/80");
    }

    function CanUseCIF()
    {
        //+10 si le critère est rempli à 100%
        var score = 0;

        ////////////////////// Type de contrat /////////////////
        {
            //Tout salarié peut demander un Cif.
            score += 10;
        }

        ////////////////////// Pourquoi ? //////////////////////
        {
            //La formation suivie dans le cadre du Cif doit permettre :
            if(userData.trainingObjectif == trainingObjectifEnum.reconversion || //de changer de profession ou de secteur d'activité,
            userData.trainingObjectif == trainingObjectifEnum.higherQualification || //d'accéder à un niveau de qualification supérieure,
            userData.trainingObjectif == trainingObjectifEnum.enrichKnowledge || //d'enrichir ses connaissances dans le domaine culturel et social, ou se préparer à l'exercice de responsabilités associatives bénévoles,
            userData.trainingObjectif == trainingObjectifEnum.examination // ou de préparer un examen pour l’obtention d'un titre ou diplôme à finalité professionnelle enregistré dans le répertoire national des certifications professionnelles.
            )
            {
                return -1;
            }
            score += 10;
        }

        ////////////////////// Domaine d'activité de la formation //////////////////////
        {
            //La formation demandée n'a pas besoin d'être en rapport avec l'activité du salarié.
            score += 10;
        }

        ////////////////////// Ancienneté //////////////////////
        {
            //historique CDI
            if(userData.actualContractType == contractTypeEnum.CDI)
            {
                var totalDurationInDay = 0;
                var oneYearContract = false;

                for (let contractIndex = 0; contractIndex < userData.contractHistory.length; contractIndex++) 
                {
                    const contract = userData.contractHistory[contractIndex];

                    var diffResult = new Date(contract.endDate).getTime() - new Date(contract.startDate).getTime();
                    var dateDiff = new Date(diffResult);
                    var daysDiff = dateDiff.getTime() / 86400000;

                    if(daysDiff >= 365){
                        oneYearContract = true;
                    }
                    totalDurationInDay += daysDiff;
                }

                //au moins un contrat d'un an (on suppose qu'il n'y a pas possibilité de faire 1ans dans la même entreprise en plusieurs contrat)
                if(!oneYearContract) 
                {
                    return -1;
                }

                //Activité salarié d'au moins 2 ans consécutifs ou non
                if(totalDurationInDay < (365 * 2))
                {
                    return -1;
                }
            }
            //historique CDD
            else if(userData.actualContractType == contractTypeEnum.CDD)
            {
                var totalDurationInDay = 0;
                var totalCDDInDayDuringLastYear = 0;
                var totalInDayDuringFiveLastYear = 0;

                for (let contractIndex = 0; contractIndex < userData.contractHistory.length; contractIndex++) 
                {
                    const contract = userData.contractHistory[contractIndex];

                    var diffResult = new Date(contract.endDate).getTime() - new Date(contract.startDate).getTime();
                    var dateDiff = new Date(diffResult);
                    var daysDiff = dateDiff.getTime() / 86400000;

                    //calcul total CDD durant la dernière année
                    if(contract.contractType == contractTypeEnum.CDD)
                    {
                        var startOneYearAgo = new Date(Date.now() - 31556952000);
                        if(new Date(contract.startDate).getTime() > startOneYearAgo.getTime())
                        {
                            totalCDDInDayDuringLastYear += daysDiff;
                        }
                        else 
                        {
                            var diffFromEnd = new Date(contract.endDate).getTime() - startOneYearAgo;
                            var dateDiffFromEnd = new Date(diffFromEnd);
                            var daysFromEndDiff = dateDiffFromEnd / 86400000;

                            totalCDDInDayDuringLastYear += daysFromEndDiff;
                        }
                    }

                    //calcul total durant 5 dernières années
                    var startFiveYearAgo = new Date(Date.now() - (31556952000 * 5));
                    if(new Date(contract.startDate).getTime() > startFiveYearAgo.getTime())
                    {
                        if(new Date(contract.startDate).getTime() > startFiveYearAgo.getTime())
                        {
                            totalInDayDuringFiveLastYear += daysDiff;
                        }
                        else 
                        {
                            var diffFromEnd = new Date(contract.endDate).getTime() - startFiveYearAgo;
                            var dateDiffFromEnd = new Date(diffFromEnd);
                            var daysFromEndDiff = dateDiffFromEnd / 86400000;

                            totalInDayDuringFiveLastYear += daysFromEndDiff;
                        }
                    }


                    totalDurationInDay += daysDiff;
                }
                //Activité salarié d'au moins 2 ans consécutifs ou non
                if(totalDurationInDay <= (365 * 2))
                {
                    return -1;
                }

                //au cours des 5 dernières années
                if(totalInDayDuringFiveLastYear <= (365 * 2))
                {
                    return -1;
                }

                //dont 4 mois, consécutifs ou non, sous CDD, au cours de la dernière année.
                if(totalCDDInDayDuringLastYear <= 30 * 4)
                {
                    return -1;
                }
            }
            score += 10;
        }

        ////////////////////// Délai de franchise //////////////////////
        {
            var lastCIFDuration = 0;
            var lastCIF = null;

            for (let trainingIndex = 0; trainingIndex < userData.trainingHistory.length; trainingIndex++) 
            {
                const training = userData.trainingHistory[trainingIndex];

                //recuperer le dernier cif
                if(training.trainingType == trainingTypeEnum.CIF)
                {
                    if(new Date(training.endDate).getTime() > new Date(lastCIF.endDate).getTime())
                    {
                        lastCIFDuration = training.duration();
                    }
                }
            }

            if(lastCIF != null)
            {
                
                var diffResult = new Date(userData.trainingStartDate).getTime() - new Date(lastCIF.endDate).getTime();
                var dateDiff = new Date(diffResult);
                var monthDiff = dateDiff.getTime() / 2592000000;
                

                //Ce délai exprimé en mois est égal à la durée du précédent Cif (en heures) divisé par 12
                var delayInMonth = lastCIFDuration / 12;

                //Il ne peut être inférieur à 6 mois
                if(monthDiff <= 6){
                    return -1;
                }
                //ni supérieur à 6 ans
                if(dalayInMonth > 12 * 6)
                {
                    delayInMonth = 12 * 6;
                }
                //le délai à respecter avant de pouvoir demander un autre Cif
                if(monthDiff < delayInMonth){
                    return -1;
                }
            }

            score += 10;
        }
        
        ////////////////////// Durée //////////////////////
        {
            //La durée minimale d'un Cif est de 30 heures. 
            if(userData.trainingDuration < 30)
            {
                return -1
            }
            
            //La durée du Cif est d'au maximum (Cette durée peut être augmentée par accord de branche ou d'entreprise) :
            //1 an pour une formation à temps plein
            if(userData.trainingTypeTime == trainingTimeTypeEnum.fullTime && userData.trainingDuration > 2555){
                score += 7;
            }
            //ou 1 200 heures pour une formation à temps partiel.
            else if(userData.trainingTypeTime == trainingTimeTypeEnum.partTime && userData.trainingDuration > 1200){
                score += 7;
            }
            //Il a pour vocation de permettre la mise en œuvre de projets nécessitant une formation longue.
            else if(userData.trainingDuration < 800){
                score += 3;
            }
            else {
                score += 10;
            }
        }

        ///////////////////// Rémunération Salaire //////////////////////////////
        {
            //Si le salaire brut est inférieur à 2 996,93 €, la rémunération est égale à 100 % du salaire antérieur.
            if(userData.actualSalary <= 2996.93)
            {
                score += 10;
            }
            //Si le salaire brut est supérieur à 2 996,93 €, la rémunération est égale à :
            else
            {
                //soit 80 % du salaire brut antérieur, si le congé n'excède pas 1 an ou 1 200 heures,
                if(userData.trainingTypeTime == trainingTimeTypeEnum.fullTime && userData.trainingDuration < 2555)
                {
                    score += 8;
                }
                else 
                {
                    score += 6;
                }

                //soit 60 % du salaire brut pour la fraction du congé excédant 1 an ou 1 200 heures.
                if(userData.trainingTypeTime == trainingTimeTypeEnum.partTime && userData.trainingDuration < 1200)
                {
                    score += 8;
                }
                else
                {
                    score += 6;
                }
            }
        
        }

        ///////////////////// Rémunération formation //////////////////////////////
        {
            //La formation est rémunérée pendant toute sa durée si 
            //elle ne dépasse pas 1 an à temps plein
            if(userData.trainingTypeTime == trainingTimeTypeEnum.fullTime && userData.trainingDuration < 2555){
                score += 10;
            }
            //ou 1 200 heures à temps partiel.
            else if(userData.trainingTypeTime == trainingTimeTypeEnum.partTime && userData.trainingDuration < 1200){
                score += 10;
            }
            //Si la formation dépasse ces durées (cas des formations à temps partiel ou discontinue), le salarié doit vérifier auprès de l'organisme collecteur de l'entreprise ou de Opacif qu'il peut obtenir une prise en charge.
            else {
                score += 3;
            }
        }

        return score;
    }


    return analyseData;

})(jQuery);