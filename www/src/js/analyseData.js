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

    var activityFieldEneum = {
        other : 1,
        computerScience : 2,
        sell : 3
    }

    var trainingObjectifEnum = {
        reconversion : 1,
        higherQualification : 2,
        enrichKnowledge : 3,
        examination : 4,
        stateDiploma : 5,
        HEIDiploma : 6,
        trainningOrgaDiploma : 7,
        professionalCertificate : 8,
        proSkillsValidation : 9,
        electionSkillsValidation : 10
    }

    var userData = {
        actualContractType : -1,
        actualActivityField : -1,
        actualSalary : -1,
        actualStartDate : -1,

        trainingObjectif : -1,
        trainingActivityField : -1,
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
        userData.actualActivityField = formDataDict["actualActivityField"].value;
        userData.actualSalary = formDataDict["actualSalary"].value;
        userData.actualStartDate = formDataDict["actualStartDate"].value;

        userData.trainingObjectif = formDataDict["trainingObjectif"].value;
        userData.trainingActivityField = formDataDict["trainingActivityField"].value;
        userData.trainingStartDate = formDataDict["trainingDate"].value;
        userData.trainingDuration = formDataDict["trainingDuration"].value;
        userData.trainingTypeTime = formDataDict["trainingTypeTime"].value;

        for(var i = 0; i < numberOfProHistory; i++)
        {
            //numberOfProHistory ne diminue pas quand l'un est supprimé, il faut donc sauter cet index
            // #Quick&Dirty
            if(formDataDict["historyContractType"+i] == null)
            {
                continue;
            }

            var contract = new Object();

            contract.contractType = formDataDict["historyContractType"+i].value;
            contract.activityField = formDataDict["historyActivityField"+i].value;
            contract.startDate = formDataDict["historyContractStartDate"+i].value;
            contract.endDate = formDataDict["historyContractEndDate"+i].value;
        
            userData.contractHistory.push(contract)
        }


        for(var i = 0; i < numberOfTrainingHistory; i++)
        {
            //numberOfTrainingHistory ne diminue pas quand l'un est supprimé, il faut donc sauter cet index
            // #Quick&Dirty
            if(formDataDict["historyTrainingType"+i] == null)
            {
                continue;
            }

            var training = new Object();

            training.trainingType = formDataDict["historyTrainingType"+i].value;
            training.activityField = formDataDict["historyTrainingActivityField"+i].value;
            training.startDate = formDataDict["historyTrainingStartDate"+i].value;
            training.endDate = formDataDict["historyTrainingEndDate"+i].value;
            training.duration = formDataDict["historyTrainingDuration"+i].value;

            userData.trainingHistory.push(training)
        }

        var CIFScore = canUseCIF();
        console.log("CIF : "+CIFScore+"/90");

        var VAEScore = canUseVAE();
        console.log("VAE : "+VAEScore+"/90");

        window.location.replace("./result.html?cif="+CIFScore+"&vae="+VAEScore);
    }

    function canUseCIF()
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
                score += 10;
            }
            else 
            {
                return -1;
            }
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
                var diffActualResult = new Date(userData.actualStartDate).getTime() - Date.now().getTime();
                var dateDiffActual = new Date(diffResult);
                var daysDiffActual = dateDiff.getTime() / 86400000;

                var totalDurationInDay = daysDiffActual;
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

                ////////////////// contrat actuel //////////////////////////

                //calcul du nombre de jour depuis le début du contrat actuel
                var diffActualResult = new Date(userData.actualStartDate).getTime() - Date.now().getTime();
                var dateDiffActual = new Date(diffResult);
                var daysDiffActual = dateDiff.getTime() / 86400000;

                //On ajoute la durée (en jour) du contract actuel au total
                totalDurationInDay += daysDiffActual;
                
                var startOneYearAgo = new Date(Date.now() - 31556952000);
                //Si le contrat à débuté après le début de la denière année
                if(new Date(userData.actualStartDate).getTime() > startOneYearAgo.getTime())
                {
                    //On ajoute sa durée dans le total de la denière année
                    totalCDDInDayDuringLastYear += daysDiffActual;
                }
                else 
                {
                    //Sinon on calcul le temps écouler depuis le début de l'année
                    var diffFromYearStart = startOneYearAgo - Date.now().getTime(); //Total temps passé depuis de début de l'année
                    var dateDiffFromYearStart = new Date(diffFromYearStart);
                    var daysFromYearStart = dateDiffFromYearStart / 86400000;

                    //Et on l'ajoute dans le total de la denière année
                    totalCDDInDayDuringLastYear += daysFromYearStart;
                }

                var startFiveYearAgo = new Date(Date.now() - (315569512000 * 5));
                //Si le contract actuel à débute après le début des 5 dernières année
                if(new Date(userData.actualStartDate).getTime() > startFiveYearAgo.getTime())
                {
                    //On ajoute sa durée dans le total des cinq dernière année
                    totalInDayDuringFiveLastYear += daysDiffActual;
                }
                else 
                {
                    //Sinon on calcul le temps écouler depuis le début des 5 dernières années
                    var diffFrom5YearStart = startFiveYearAgo - Date.now().getTime(); //Total temps passé depuis de début des 5 dernières année
                    var dateDiffFrom5YearStart = new Date(diffFrom5YearStart);
                    var daysFrom5YearStart = dateDiffFrom5YearStart / 86400000;

                    //Et on l'ajoute dans le total des 5 dernières années
                    totalInDayDuringFiveLastYear += dadaysFrom5YearStartysDiffActual;
                }

                ////////////////////// historique des contrats ////////////////////////////

                for (let contractIndex = 0; contractIndex < userData.contractHistory.length; contractIndex++) 
                {
                    const contract = userData.contractHistory[contractIndex];

                    //Calcul de la durée du contrat
                    var diffResult = new Date(contract.endDate).getTime() - new Date(contract.startDate).getTime();
                    var dateDiff = new Date(diffResult);
                    var daysDiff = dateDiff.getTime() / 86400000;

                    //calcul total CDD durant la dernière année
                    if(contract.contractType == contractTypeEnum.CDD)
                    {
                        //Si le CDD à débuter après le début de l'année en cours
                        if(new Date(contract.startDate).getTime() > startOneYearAgo.getTime())
                        {
                            //alors on ajoute sa durée au total de l'année
                            totalCDDInDayDuringLastYear += daysDiff;
                        }
                        else 
                        {
                            //si la fin du CDD se trouve dans l'année en cours
                            if(new Date(contract.endDate).getTime() > startFiveYearAgo.getTime())
                            {
                                //Sinon on calcul la durée entre le début de l'année et la fin du contrat
                                var diffFromEnd = new Date(contract.endDate).getTime() - startOneYearAgo;
                                var dateDiffFromEnd = new Date(diffFromEnd);
                                var daysFromEndDiff = dateDiffFromEnd / 86400000;

                                //Et on l'ajoute au total de jours de l'année précédante
                                totalCDDInDayDuringLastYear += daysFromEndDiff; 
                            }

                        }
                    }

                    //calcul total durant 5 dernières années
                    //Si le contrat à débuté après le début des 5 année précédante
                    if(new Date(contract.startDate).getTime() > startFiveYearAgo.getTime())
                    {
                        //alors on ajoute sa durée au total des 5 année
                        totalInDayDuringFiveLastYear += daysDiff;
                    }
                    else 
                    {
                        //si la fin du contrat se trouve dans les 5 années précédante
                        if(new Date(contract.endDate).getTime() > startFiveYearAgo.getTime())
                        {
                            //Sinon on calcul la durée entre le début des 5 annéee précédante et la fin du contrat
                            var diffFromEnd = new Date(contract.endDate).getTime() - startFiveYearAgo;
                            var dateDiffFromEnd = new Date(diffFromEnd);
                            var daysFromEndDiff = dateDiffFromEnd / 86400000;

                            //Et on l'ajoute au total de jours de l'année précédante
                            totalCDDInDayDuringLastYear += daysFromEndDiff; 
                        }

                    }

                    //dans tout les cas on ajoute sa durée au total
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
                        lastCIF = training;
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

        ////////////////////// Délai acceptation employeur ///////////////
        {
            var diffResult = new Date(userData.trainingStartDate).getTime() - Date.now().getTime();
            var dateDiff = new Date(diffResult);
            var monthDiff = dateDiff.getTime() / 2592000000;
        
            //La demande doit être formulée au plus tard :
            //60 jours si elle dure moins de 6 mois, et si elle s'effectue à temps partiel ou sur plusieurs périodes 
            if(userData.trainingDuration <= 1260 && userData.trainingTypeTime == trainingTimeTypeEnum.partTime)
            {
                if(monthDiff < 2)
                {
                    return -1;
                }
            }
            //ou si la demande concerne un congé pour passer un examen.
            else if (userData.trainingObjectif == trainingObjectifEnum.examination) 
            {
                if(monthDiff <= 2)
                {
                    return -1;
                }
            }
            //120 jours avant le début de la formation si elle dure 6 mois ou plus, et si elle s'effectue en 1 fois à temps plein
            else if(userData.trainingDuration >= 1260 && userData.trainingTypeTime == trainingTimeTypeEnum.fullTime) 
            {
                if(monthDiff <= 4)
                {
                    return -1;
                }
            }
            score += 10
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

    function canUseVAE()
    {
        //+10 si le critère est rempli à 100%
        var score = 0;

        ////////////////////// Type de contrat /////////////////
        {
            //Toute personne, quels que soient son âge, sa nationalité, son statut et son niveau de formation
            score += 10;
        }

        ////////////////////// Pourquoi ? //////////////////////
        {
            /*La VAE permet d’obtenir :
                - un diplôme ou titre professionnel national délivré par l’État ;
                - un diplôme délivré par un établissement d’enseignement supérieur ;
                - un titre délivré par un organisme de formation ou une chambre consulaire ;
                - un certificat de qualification professionnelle créé par la Commission paritaire nationale de l’emploi (CPNE) d’une branche professionnelle.
            */
            /*
            Pour demander la validation des acquis de son expérience il faut :
                - avoir exercé une activité professionnelle salariée (CDI, CDD, intérim), non salariée, bénévole ou de volontariat, ou inscrite sur la liste des sportifs de haut niveau mentionnée au premier alinéa de l’article L. 221-2 du code du sport ;
                - ou avoir exercé des responsabilités syndicales (par exemple, les délégués syndicaux), un mandat électoral local ou une fonction élective locale en rapport direct avec le contenu de la certification (diplôme, titre…) visée.
            */
            if(userData.trainingObjectif == trainingObjectifEnum.stateDiploma ||
               userData.trainingObjectif == trainingObjectifEnum.HEIDiploma ||
               userData.trainingObjectif == trainingObjectifEnum.trainningOrgaDiploma ||
               userData.trainingObjectif == trainingObjectifEnum.professionalCertificate ||
               userData.trainingObjectif == trainingObjectifEnum.proSkillsValidation ||
               userData.trainingObjectif == trainingObjectifEnum.electionSkillsValidation )
            {
                score += 10;
            }
            else
            {
                return -1;
            }
        }

        ////////////////////// Domaine d'activité de la formation //////////////////////
        ////////////////////// Ancienneté //////////////////////
        {
            var totalDurationInTrainingActivityFieldInDay = 0;

            //qui justifie d’au moins un an d’expérience
            //en rapport direct avec la certification visée
            for (let contractIndex = 0; contractIndex < userData.contractHistory.length; contractIndex++) 
            {
                const contract = userData.contractHistory[contractIndex];

                //Si le contrat est dans le même domaine que la VAE
                if(contract.activityField == userData.trainingActivityField)
                {
                    //on calcul la durée de celui-ci
                    var diffResult = new Date(contract.endDate).getTime() - new Date(contract.startDate).getTime();
                    var dateDiff = new Date(diffResult);
                    var daysDiff = dateDiff.getTime() / 86400000;

                    //on l'ajoute au total
                    totalDurationInTrainingActivityFieldInDay += daysDiff;
                }

            }

            //au moins 1 dans dans le dommaine demandé
            if(totalDurationInTrainingActivityFieldInDay < 365)
            {
                return -1;
            }
            
            score += 20; //deux critères d'un coup
        } 

        ////////////////////// Délai de franchise //////////////////////
        {
            var lastVAE = null;

            for (let trainingIndex = 0; trainingIndex < userData.trainingHistory.length; trainingIndex++) 
            {
                const training = userData.trainingHistory[trainingIndex];

                //recuperer la dernière VAE
                if(training.trainingType == trainingTypeEnum.VAE)
                {
                    if(new Date(training.endDate).getTime() > new Date(lastVAE.endDate).getTime())
                    {
                        lastVAE = training;
                    }
                }
            }

            if(lastVAE != null)
            {
                var diffResult = new Date(userData.trainingStartDate).getTime() - new Date(lastVAE.endDate).getTime();
                var dateDiff = new Date(diffResult);
                var monthDiff = dateDiff.getTime() / 2592000000;


                // Le délai de franchise entre 2 congés VAE est d’un an.
                if (monthDiff < 12)
                {
                    return -1;
                }
            }
            score += 10;
        }

        ////////////////////// Délai acceptation employeur ///////////////
        {
            var diffResult = new Date(userData.trainingStartDate).getTime() - Date.now().getTime();
            var dateDiff = new Date(diffResult);
            var monthDiff = dateDiff.getTime() / 2592000000;

            //Sa demande d’autorisation d’absence, adressée à l’employeur au plus tard 60 jours avant le début des actions de validation, 
            if(monthDiff <= 2)
            {
                return -1;
            }
            score += 10;
        }

        ////////////////////// Durée //////////////////////
        {
            //D’une durée équivalente à 24 heures de temps de travail (consécutives ou non), le congé de validation des acquis de l’expérience
            if(userData.trainingDuration <= 24)
            {
                score += 5;
            }
            //L’employeur peut décider d’inscrire des actions de VAE dans le plan de formation de l’entreprise ou au titre de périodes de professionnalisation.
            score += 5;
        }

        ///////////////////// Rémunération Salaire //////////////////////////////
        {
            //le salarié perçoit une rémunération égale à celle qu’il aurait reçue s’il était resté à son poste de travail.
            score += 10;
        }

        ///////////////////// Rémunération formation //////////////////////////////
        {
            //L’organisme financeur de ma démarche de VAE ne prend pas en charge la totalité de mes frais.
            //Vous pouvez, à titre personnel, prendre en charge une partie des frais, 
            //ou bien solliciter votre employeur dans le cadre du plan de formation.
            score += 5;

        }

        return score;
    }

    return analyseData;

})(jQuery);