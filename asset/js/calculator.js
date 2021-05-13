function ShowVideoList() {
    jQuery('#VideoLists').show();
}
function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
}

function debtPayOffCalculator() {
   // $('#debtPayOffCalculator').submit(function (event) { //say green
        //var BoolError = 1;
        let patt = /^[0-9]*\.?[0-9]+$/;
        let TotalDebt = $('#TotalDebt').val();
        //let TotalDebtResult = patt.test(TotalDebt);

        let MonthlyPaymentVal = $('#totalMonthlyPayment').val();
        //let  MonthlyPaymentResult = patt.test(MonthlyPaymentVal);

        if (TotalDebt != "") {
            if (MonthlyPaymentVal != '') {
                var formData = {
                    'totalDebtAmount': $('input[name=totalDebtAmount]').val(),
                    'monthlyPayment': $('input[name=monthlyPayment]').val(),
                };
                $.ajax({
                    type: 'POST',
                    url:  window.location.origin + '/calculators/debt-payoff-calculator', // https://local.ovlg.com
                    data: formData,
                    crossDomain: true,
                    dataType: 'html',
                    encode: true,
                    success: function (data) {
                        if (data.error) {
                            $('#getData').html(data);
                        } else {
                            window.history.pushState({
                                path: '/calculators/debt-payoff.html.html'
                            }, '', '/calculators/debt-payoff.html?step=2');
                            $('#details_you_need_to_give').hide();
                            $('#intro_text').hide();
                            $('#First_Step').removeAttr('disabled', 'disabled');
                            $('#Second_Step').removeAttr('disabled', 'disabled');
                            $('#Third_Step').removeAttr('disabled', 'disabled');
                            /*$('#First_Step').removeClass('active');*/
                            $('#Second_Step').addClass('active');
                            $('#Third_Step').removeClass('active');
                            $('#FirstStep').hide();
                            $('#SecondStep').show();
                            $("#backbutton").css("display", "block");
                            $('#getData').html(data);
                            initDebtPayOffCalculatorStep2();
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        $('#getData').html(data);
                    }
                });
            } else {
                alert('Please enter valid Monthly Payment');
                $('#totalMonthlyPayment').val('').focus();
            }
        } else {
            alert('Enter a Valid Debt Amount');
            $('#TotalDebt').val('').focus();
        }
        return false;
       //event.preventDefault();
   // });
}

function initDebtPayOffCalculatorStep2() {

    $('#backbutton').click(function () {
        $('#FirstStep').addClass('active');
        $('#Second_Step').removeClass('active');

        $('#SecondStep').hide();
        $('#FirstStep').show();
        $('#backbutton').hide();

        $("#First_Step").removeAttr("disabled", "disabled");
        $("#Second_Step").attr("disabled", "disabled");
        $("#Third_Step").attr("disabled", "disabled");


        window.history.pushState({
            path: '/calculators/debt-payoff-new.html'
        }, '', '/calculators/debt-payoff-new.html?step=1');
    });
    $('#gotostep3').click(function () {
        $("#First_Step").removeAttr("disabled", "disabled");
        $("#Second_Step").removeAttr("disabled", "disabled");
        $("#Third_Step").removeAttr("disabled", "disabled");

        /*$('#First_Step').removeClass('active');
         $('#Second_Step').removeClass('active');*/
        $('#Third_Step').addClass('active');

        $('#SecondStep').hide();
        window.history.pushState({
            path: '/calculators/debt-payoff.html.html'
        }, '', '/calculators/debt-payoff.html?step=3');
        $('#ThirdStep').show();
        get_the_form();
    });
}

function get_the_form() {
    $.ajax({
        type: 'GET',
        url: window.location.origin + '/calculator/debt-payoff-calculator-signup', // https://local.ovlg.com
        dataType: 'html',
        encode: true,
        success: function (data) {
            if (data.error) {
                $('#thirdstepData').html(data);
            } else {
                $('#First_Step').removeAttr('disabled', 'disabled');
                $('#Second_Step').removeAttr('disabled', 'disabled');
                $('#Third_Step').removeAttr('disabled', 'disabled');
                /*$('#First_Step').removeClass('active');
                 $('#Second_Step').removeClass('active');*/
                $('#Third_Step').addClass('active');
                $('#thirdstepData').html(data);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $('#getData').html(data);
        }
    });
}

function calculateIncomeRatio() {
    var incomeOptions = {
        MonthlyRentonDI: $('#MonthlyRentonDI').val(),
        MonthlyCreditCardPayment: $('#MonthlyCreditCardPayment').val(),
        CarLoanPayment: $('#CarLoanPayment').val(),
        OtherLoanObligation: $('#OtherLoanObligation').val(),
        GrossSalary: $('#GrossSalary').val(),
        BonusOvertime: $('#BonusOvertime').val(),
        OtherIncome: $('#OtherIncome').val(),
        AlimonyReceived: $('#AlimonyReceived').val()
    }
    $("#DebtIncomeResults").removeClass("in active");
    $("#DebtIncomeResults").hide();
    $('#log-first').removeClass('active');
    $('#log-second').addClass('active');
    $('#log-second').css('pointer-events', 'inherit');
    $("#2nd-tab").addClass("in active");
    $("#2nd-tab").removeClass("unvisited");
    $('a[href$="#2nd-tab"]').removeClass("inactiveLink");
    console.log(999);
    $.ajax({
        type: 'POST',
        url: window.location.origin + '/calculators/debt-income-ratio', //https://local.ovlg.com
        data: incomeOptions,
        dataType: 'html',
        encode: true,
        success: function (data) {
            if (data.error) {
                $('#2nd-tab').html(data);
            } else {
                $('#2nd-tab').html(data);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $('#result').html(data);
        }
    });
    $('#2nd-tab').on("click", "#VrTotalMonth", function () {

        $(this).hide();
        $('#VrTotalMonthInput').show().focus();
        $('#VrTotalMonthInput').on("blur", function () {
            var VrNoOFMonths = parseInt($(this).val(), 10);
            if (VrNoOFMonths <= 48 && VrNoOFMonths != 0) {
                var TotalMonthlyExpenditure = parseFloat($('#VrTotalBalance').text());
                var VrAmountTobePaid = (TotalMonthlyExpenditure * 5 / 8);
                var VrTotalMonthlyPayment = VrAmountTobePaid / VrNoOFMonths;
                VrTotalMonthlyPayment = VrTotalMonthlyPayment.toFixed(2);
                $('#VrTotalMonthlyPayment').text(VrTotalMonthlyPayment);
                $('#VrTotalMonthlyPaymentInput').val(VrTotalMonthlyPayment);
                $(this).hide();
                $('#VrTotalMonth').show().text(VrNoOFMonths);
            } else {

                alert('Please enter number of months in between 1 to 48');
                $(this).hide().val(parseInt($('#VrTotalMonth').text(), 10));
                $('#VrTotalMonth').show();
            }
        });
    });

    $('#2nd-tab').on("click", "#VrTotalMonthlyPayment", function () {
        $(this).hide();
        $('#VrTotalMonthlyPaymentInput').show().focus();
        $('#VrTotalMonthlyPaymentInput').on("blur", function () {
            var VrTotalMonthlyPayment = parseFloat($(this).val()).toFixed(0);
            var TotalMonthlyExpenditure = parseFloat($('#VrTotalBalance').text());
            var VrAmountTobePaid = (TotalMonthlyExpenditure * 5 / 8);
            var VrNoOFMonths = VrAmountTobePaid / VrTotalMonthlyPayment;
            VrNoOFMonths = Math.ceil(VrNoOFMonths);
            if (VrNoOFMonths <= 48 && VrNoOFMonths != 0) {
                $('#VrTotalMonth').text(VrNoOFMonths);
                $('#VrTotalMonthInput').val(VrNoOFMonths);
                $(this).hide();
                $('#VrTotalMonthlyPayment').show().text($(this).val());
            } else {
                alert('Please increase par month payment value.');
                $(this).hide().val($('#VrTotalMonthlyPayment').text());
                $('#VrTotalMonthlyPayment').show();
            }
        });
    });

    $('#2nd-tab').on("click", "#getProfessionalHelp", function () {
        window.location = window.location.origin + "/contact-us/help.html"
    });

    $("#DI-step-1").click(function () {
        $("#DI-step-2").removeClass("active");
        $(this).addClass("active");
        $("#DebtIncomeResults").show();
        $("#DebtIncomeResults").addClass("in active");
        $("#2nd-tab").hide();
    });

    $("#DI-step-2").click(function () {
        $("#DI-step-1").removeClass("active");
        $(this).addClass("active");
        $("#2nd-tab").show();
        $("#2nd-tab").addClass("in active");
        $("#DebtIncomeResults").hide();
        $("#DebtIncomeResults").removeClass("in active");
    });

}

function calculateIncomeRatioTemplate() {
    var incomeOptions = {
        MonthlyRentonDI: $('#MonthlyRentonDI').val(),
        MonthlyCreditCardPayment: $('#MonthlyCreditCardPayment').val(),
        CarLoanPayment: $('#CarLoanPayment').val(),
        OtherLoanObligation: $('#OtherLoanObligation').val(),
        GrossSalary: $('#GrossSalary').val(),
        BonusOvertime: $('#BonusOvertime').val(),
        OtherIncome: $('#OtherIncome').val(),
        AlimonyReceived: $('#AlimonyReceived').val()
    }

    $("#DebtIncomeResults").removeClass("in active");
    $("#DebtIncomeResults").hide();
    $('#log-first').removeClass('active');
    $('#log-second').addClass('active');
    $('#log-second').css('pointer-events', 'inherit');
    $("#2nd-tab").addClass("in active");
    $("#2nd-tab").removeClass("unvisited");
    $('a[href$="#2nd-tab"]').removeClass("inactiveLink");

    $.ajax({
        type: 'POST',
        url: window.location.origin + '/calculators/debt-income-ratio-template',
        data: incomeOptions,
        dataType: 'html',
        encode: true,
        success: function (data) {
            if (data.error) {
                $('#2nd-tab').html(data);
            } else {
                $('#2nd-tab').html(data);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $('#result').html(data);
        }
    });
}

function calculateApr() {
    PrincipalValue = $('#principal').val();
    RateValue = $('#rate').val();
    AddCostValue = $('#AddCost').val();
    MonthsValue = $('#months').val();
    Old_Rate = $("#old_rate").val();

    var aprValue = {
        principal: PrincipalValue,
        rate: RateValue,
        AddCost: AddCostValue,
        months: MonthsValue,
        old_rates: Old_Rate
    }

    $.ajax({
        type: 'POST',
        url: window.location.origin + '/calculators/debt-apr-calculators', // https://local.ovlg.com
        data: aprValue,
        crossDomain: true,
        dataType: 'html',
        encode: true,
        success: function (data) {
            if (data.error) {
                $('#AprNewCalculate').html(data);
            } else {
                $('#AprNewCalculation').hide();
                $('#AprNewCalculate').show();
                $('#AprNewCalculate').html(data);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $('#AprNewCalculation').html(data);
        }
    });
}

function CalculateCredits() {
    var Principal = 0.0;
    var Rate = calculateCreditAverage();
    var Installment = 0.0;
    for (count = 1; count <= ii - 1; count++) {
        var calCredit = ($('#CreditCardBalance' + count).val() == "" || $('#CreditCardBalance' + count).val() == 0) ? 0 : $('#CreditCardBalance' + count).val()
        var calCard = ($('#CreditCardMonthlyPayments' + count).val() == "" || $('#CreditCardMonthlyPayments' + count).val() == 0) ? 0 : $('#CreditCardMonthlyPayments' + count).val();
        Principal += parseFloat(calCredit);
        Installment += parseFloat(calCard);
    }
    var cardValue = {
        Principal: Principal.toFixed(2),
        Rate: Rate,
        Installment: Installment
    }

    $.ajax({
        type: 'POST',
        url: window.location.origin + '/calculators/credit-card-calculators',
        data: cardValue,
        dataType: 'html',
        encode: true,
        success: function (data) {
            if (data.error) {
                $('#result').html(data);
            } else {
                $('#result').html(data);
            }
        },
        error: function (data, jqXHR, textStatus, errorThrown) {
            $('#result').html(data);
        }
    });
}

function calculateCreditAverage() {
    var totalAvg = 0;
    var totalSum = 0;
    var rate = 0;
    for (var avg = 1; avg <= ii - 1; avg++) {
        if ($('#CreditCardInterestRate' + avg).val() != 0 && $('#CreditCardInterestRate' + avg).val() != "") {
            totalSum += parseFloat($('#CreditCardInterestRate' + avg).val());
            totalAvg++;
        }
    }
    rate = totalSum / totalAvg;
    return rate.toFixed(2);
}

function page_on_load() {
    var MonthlyPayment = 1000;
    var CreditCardBalance1 = 5000;
    var Auto1CurrentBalance = 5000;
    var TotalDebt = CreditCardBalance1 + Auto1CurrentBalance;
    var onloadData = {
        MonthlyPayment: MonthlyPayment,
        TotalDebt: TotalDebt,
        CreditCardBalance1: CreditCardBalance1,
        Auto1CurrentBalance: Auto1CurrentBalance
    };

    $.ajax({
        type: 'POST',
        url: window.location.origin + '/calculators/debt-get-consolidation-types',
        data: onloadData,
        crossDomain: true,
        dataType: 'html',
        encode: true,
        success: function (data) {
            if (data.error) {
                $('#getDebtType').html(data);
            } else {
                $('#getDebtType').html(data);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $('#getDebtType').html(data);
        }
    });
}

function check_and_comp(event) {
    var TotalDebt = $('#TotalDebt').val();
    var MonthlyPayment = $('#MonthlyPayment_new').val();
    var NewLoanInterestRate = $('#NewLoanInterestRate').val();
    var CreditCardBalance1 = $('#CreditCardBalance1').val();
    var CreditCardBalance2 = $('#CreditCardBalance2').val();
    var CreditCardBalance3 = $('#CreditCardBalance3').val();
    var CreditCardBalance4 = $('#CreditCardBalance4').val();
    var CreditCardBalance5 = $('#CreditCardBalance5').val();
    var Auto1CurrentBalance = $('#Auto1CurrentBalance').val();
    var Auto2CurrentBalance = $('#Auto2CurrentBalance').val();
    var BoatCurrentBalance = $('#BoatCurrentBalance').val();
    var PersonalCurrentBalance = $('#PersonalCurrentBalance').val();
    var OtherCurrentBalance = $('#OtherCurrentBalance').val();
    var TotalCreditCardBal = $('#TotalCreditCardBal').val();
    var TotalLoanInsBalance = $('#TotalLoanInsBalance').val();
    var FetchDataDCT_Flag = 1;
    var paymentData = {

        MonthlyPayment: MonthlyPayment,
        TotalDebt: TotalDebt,
        CreditCardBalance1: CreditCardBalance1,
        CreditCardBalance2: CreditCardBalance2,
        CreditCardBalance3: CreditCardBalance3,
        CreditCardBalance4: CreditCardBalance4,
        CreditCardBalance5: CreditCardBalance5,
        Auto1CurrentBalance: Auto1CurrentBalance,
        Auto2CurrentBalance: Auto2CurrentBalance,
        BoatCurrentBalance: BoatCurrentBalance,
        PersonalCurrentBalance: PersonalCurrentBalance,
        OtherCurrentBalance: OtherCurrentBalance,
        TotalCreditCardBal: TotalCreditCardBal,
        TotalLoanInsBalance: TotalLoanInsBalance,
        FetchDataDCTFlag: FetchDataDCT_Flag
    };

    var that = this;
    if (timeout !== null) {
        clearTimeout(timeout);
    }
    timeout = setTimeout(function () {
        $.ajax({
            type: 'POST',
            url: window.location.origin + '/calculators/debt-get-consolidation-types',
            data: paymentData,
            crossDomain: true,
            dataType: 'html',
            encode: true,
            success: function (data) {
                if (data.error) {
                    $('#getDebtType').html(data);
                } else {
                    $('#getDebtType').html(data);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $('#getDebtType').html(data);
            }
        });
    }, 1000);
    event.preventDefault();
}

function changeMonth(){
    //console.log('Changed');
    patt = /^[0-9]*\.?[0-9]+$/;
    var c = document.getElementById('monthlypayment').value;
    if(patt.test(c)) {
        AmountToBePaid = 7 * document.getElementById('DebtAmount').innerHTML / 10;
        NoOfMonth = Math.ceil(AmountToBePaid / c);
        //console.log(AmountToBePaid);
        //console.log(NoOfMonth);
        if(48 < NoOfMonth) {
            alert('Please Increase Your Monthly Payment');
            document.getElementById('monthlypayment').value=c;
            document.getElementById('monthlypayment').focus();
        }
        else
        {
            document.getElementById('NoOFMonths').innerHTML=NoOfMonth;
            document.getElementById('monthlypayment').focus();
        }
    }
}

$(document).ready(function () {

    $(document).on('click','#CalculateDI',function(e) {//say green
        console.log(6666);
        var valid = 0;
        var valid_sec = 0;
        var validAlert = 0, floatRegex = /^\d+(?:\.\d\d?)?$/;
        $("#DI-Form").find('input[type=text]').each(function () {
            var sumVal = parseFloat($(this).val());
            let thisVal = $(this).val();
            //var hethtVal=$(this).parent().parent().children('td:first').html();
            //var getString=hethtVal.split("($)")
            //console.log(thisVal);
            if (thisVal != "") {
                if (!isNaN(sumVal) && (thisVal).match(floatRegex)) {
                    valid += sumVal;
                } else {
                    validAlert = 1;
                    alert(getString[0] + 'accept numeric values only');
                    $(this).focus();
                    return false;
                }
            }
        });
        //console.log(valid, validAlert);

        if (valid <= 0 && validAlert == 0) {
            alert('Your total Annual Income should not be blank or less than 0.');
            $("#annualform").find('input[type=text]:first').focus();
        }
        else {
            var sumAnualVal = 0;
            $("#annualform").find('input[type=text]').each(function () {
                let thisVal = $(this).val();
                let inputAnual = parseFloat($(this).val());
                //var hethtValOp = $(this).parent().parent().children('td:first').html();
                //var getStringOp = hethtValOp.split("($)")
                if (thisVal != "") {
                    if (!isNaN(inputAnual) && thisVal.match(floatRegex)) {
                        valid_sec += inputAnual;

                    } else {
                        if (validAlert == 0) {
                            validAlert = 1;
                            alert(getStringOp[0] + 'accept numeric values only');
                            $(this).focus();
                            return false;
                        }
                    }
                }
            });
            if (valid_sec <= 0 && validAlert == 0) {
                alert("Your total Annual Income should not be blank or less than 0.");
                $("#annualform").find('input[type=text]:first').focus();
            }
            else {
                if (validAlert == 1) {
                    e.preventDefault(e);
                } else {
                    calculateIncomeRatio();
                    $('#DI-step-1').removeClass('active');
                    $("#DI-step-2").removeAttr("disabled", "disabled");
                    $('#DI-step-2').addClass('active');
                    $("#2nd-tab").show();
                }
            }
        }

    });

    $(document).on('click','#SubmitAPR',function(e) {
        var principal = $("#principal").val(),
            rate = $("#rate").val(),
            months = $("#months").val(),
            AddCost = $("#AddCost").val();
        var floatRegex = /^\d+(?:\.\d\d?)?$/;
        if (principal == "" && rate == "" && months == "") {
            alert("Please Enter Principal, Interest Rate & No. of Months");
            $("#principal").focus();
        } else {
            if (principal != "" && principal.match(floatRegex)) {
                if (rate != "" && rate.match(floatRegex)) {
                    if (months != "" && months.match(floatRegex)) {
                        if (AddCost != "" && !AddCost.match(floatRegex)) {
                            alert("Please enter valid additional cost");
                            $("#AddCost").focus();
                        } else {
                            calculateApr();
                        }
                    } else {
                        alert("Please enter No. of Months");
                        $("#months").focus();
                    }
                } else {
                    alert("Please enter valid Interest Rate");
                    $("#rate").focus();
                }
            } else {
                alert("Please enter valid amount for Principal");
                $("#principal").focus();
            }
        }

    });

    $(document).on('click','#CalculateDebtIncome',function(e) {
        var valid = 0;
        var valid_sec = 0;
        $("#DI-Form").find('input[type=text]').each(function () {
            if ($(this).val() != "") {
                valid += 1;
            }
            else {
                valid -= 1;
            }
        });

        if (valid == -8) {
            alert('Your total Annual Income should not be blank or less than 0.');
        }
        else {
            $("#annualform").find('input[type=text]').each(function () {

                if ($(this).val() != "") {
                    valid_sec += 1;
                }
                else {
                    valid_sec -= 1;
                }
            });
            if (valid_sec == -4) {
                alert("Your total Annual Income should not be blank or less than 0.");
            }
            else {
                var sum = 0;
                $('#annualform input').each(function () {
                    sum += Number($(this).val());
                });
                if (sum == 0) {
                    alert("Your total Annual Income should not be blank or less than 0.");
                }
                else {
                    calculateIncomeRatioTemplate();
                    $('#DI-step-1').removeClass('active');
                    $("#DI-step-2").removeAttr("disabled", "disabled");
                    $('#DI-step-2').addClass('active');
                    $("#2nd-tab").show();
                }
            }
        }


    });

    $('#AprNewCalculate').on("change", "#rate", function () {

        PrincipalValue = $('#principal').val();
        RateValue = this.value;
        AddCostValue = $('#AddCost').val();
        MonthsValue = $('#months').val();
        old_rates = $('#old_rates').val();
        SubmitValue = $('#Submit').val();
        url = window.location.origin + "/calculators/debt-apr-calculators";
        jQuery.post(
            url,
            { principal: PrincipalValue, rate: RateValue, AddCost: AddCostValue, months: MonthsValue, old_rates: old_rates },
            function (data, textStatus) {
                jQuery("#AprNewCalculate").html(data);
            }
        );
    });

    $(document).on('click','#First_Step',function(e) {
        $('#details_you_need_to_give').show();
        $('#intro_text').show();
        $("#First_Step").removeAttr("disabled", "disabled");
        $("#Second_Step").attr("disabled", "disabled");
        $("#Third_Step").attr("disabled", "disabled");

        $('#First_Step').addClass('active');
        $('#Second_Step').removeClass('active');
        $('#Third_Step').removeClass('active');

        $('#SecondStep').hide();
        $('#ThirdStep').hide();
        $('#FirstStep').show();
        $('#backbutton').hide();
        window.history.pushState({
            path: '/calculators/debt-payoff.html'
        }, '', '/calculators/debt-payoff.html');
    });

    $(document).on('click','#Second_Step',function(e) {
        $('#details_you_need_to_give').hide();
        $('#intro_text').hide();
        $("#First_Step").removeAttr("disabled", "disabled");
        $("#Second_Step").removeAttr("disabled", "disabled");
        $("#Third_Step").removeAttr("disabled", "disabled");

        /*$('#First_Step').removeClass('active');*/
        $('#Second_Step').addClass('active');
        $('#Third_Step').removeClass('active');

        $('#SecondStep').show();
        $('#ThirdStep').hide();
        $('#FirstStep').hide();
        $('#backbutton').show();
        window.history.pushState({
            path: '/calculators/debt-payoff.html'
        }, '', '/calculators/debt-payoff.html?step=2');
    });

    $(document).on('click','#Third_Step',function(e) {
        $('#details_you_need_to_give').hide();
        $('#intro_text').hide();
        $("#First_Step").removeAttr("disabled", "disabled");
        $("#Second_Step").removeAttr("disabled", "disabled");
        $("#Third_Step").removeAttr("disabled", "disabled");

        /*$('#First_Step').removeClass('active');
         $('#Second_Step').removeClass('active');*/
        $('#Third_Step').addClass('active');

        $('#SecondStep').hide();
        $('#ThirdStep').show();
        $('#FirstStep').hide();
        $('#backbutton').hide();
        window.history.pushState({
            path: '/calculators/debt-payoff.html'
        }, '', '/calculators/debt-payoff.html?step=3');
        get_the_form();
    });

    $(document).on('keyup', "form#creditPayCalculator input[type=text]", function () { //say green
        var floatRegex = /^[+-]?([0-9]*[.])?[0-9]+/;
        $('#errormessage').html('');
        for (j = 1; j <= ii - 1; j++) {
            $('#star' + j).html('');
        }
        var skip = new Array();
        var t = 0;
        for (s = 3; s <= ii - 1; s++) {
            if (parseInt($('#CreditCardBalance' + s).val()) == 0 && parseInt($('#CreditCardInterestRate' + s).val()) == 0 && parseInt($('#CreditCardMonthlyPayments' + s).val()) == 0) {
                skip[t++] = s;
            }
        }
        //    alert(skip);
        var isFuncRun = 0;
        for (j = 1; j <= ii - 1; j++) {

            let crdBlnc = $('#CreditCardBalance' + j);
            let crdIntRt = $('#CreditCardInterestRate' + j);
            let crdMntPay = $('#CreditCardMonthlyPayments' + j);

            if (crdBlnc.val() + crdIntRt.val() + crdMntPay.val() != 0) {
                if (!isNaN(crdBlnc.val()) && (crdBlnc.val()).match(floatRegex) && (crdBlnc.val()).length > 0 && (crdBlnc.val()).length < 16) {
                    if (!isNaN(crdIntRt.val()) && (crdIntRt.val()).match(floatRegex) && parseFloat(crdIntRt.val()) >= 0 && parseFloat(crdIntRt.val()) < 1000) {
                        if (!isNaN(crdMntPay.val()) && (crdMntPay.val()).match(floatRegex) && (crdMntPay.val()).length > 0 && (crdMntPay.val()).length < 16) {
                            if (parseFloat(crdMntPay.val()) > parseFloat(crdBlnc.val())) {
                                $('#errormessage').html('Monthly Payment cannot be greater than Current Balance in row ' + j + ' <br/>');
                                $('#star' + j).html('*');
                                crdMntPay.val('').focus();
                                return false;
                            } else {
                                isFuncRun = 1;
                            }
                        } else {
                            $('#star' + j).html('*');
                            $('#errormessage').append('Monthly Payment amount must be greater than or equal to 0 in row ' + j);
                            crdMntPay.val('').focus();
                            crdMntPay.trigger('change');
                            return false;
                        }
                    } else {
                        $('#star' + j).html('*');
                        $('#errormessage').append('Please enter a  valid Interest amount in row ' + j);
                        crdIntRt.val('').focus();
                        return false;
                    }
                } else {
                    $('#star' + j).html('*');
                    $('#errormessage').append('Current Balance amount must be greater than or equal to 0 in row ' + j);
                    crdBlnc.val('').focus();
                    return false;
                }
            }
        }
        if (isFuncRun == 1) {
            CalculateCredits();
        }
    });

    $(document).on('click','#totalCredit',function(e) {
        CreditCardBalance11 = $('#CreditCardBalance1').val();
        CreditCardBalance21 = $('#CreditCardBalance2').val();
        CreditCardBalance31 = $('#CreditCardBalance3').val();
        CreditCardBalance41 = $('#CreditCardBalance4').val();
        CreditCardBalance51 = $('#CreditCardBalance5').val();

        TotalBalance = (
            CreditCardBalance11 == "" || isNaN(CreditCardBalance11) ? 0 : parseInt(CreditCardBalance11)) +
            (CreditCardBalance21 == "" || isNaN(CreditCardBalance21) ? 0 : parseInt(CreditCardBalance21)) +
            (CreditCardBalance31 == "" || isNaN(CreditCardBalance31) ? 0 : parseInt(CreditCardBalance31)) +
            (CreditCardBalance41 == "" || isNaN(CreditCardBalance41) ? 0 : parseInt(CreditCardBalance41)) +
            (CreditCardBalance51 == "" || isNaN(CreditCardBalance51) ? 0 : parseInt(CreditCardBalance51));
        $('#TotalCreditCardBal').val(TotalBalance);
        $('#TotalDebt').val(TotalBalance + parseInt($('#TotalLoanInsBalance').val()));
        var newval = $('#TotalDebt').val();

        $('#window').fadeOut('1000');
        if (newval != oldval) {
            check_and_comp();
            oldval = newval;
        }


    });

    $(document).on('click','#totalIns',function(e) {

        Auto1CurrentBalance1 = $('#Auto1CurrentBalance').val();
        Auto2CurrentBalance1 = $('#Auto2CurrentBalance').val();
        BoatCurrentBalance1 = $('#BoatCurrentBalance').val();
        PersonalCurrentBalance1 = $('#PersonalCurrentBalance').val();
        OtherCurrentBalance1 = $('#OtherCurrentBalance').val();
        TotalBalance1 = (
            Auto1CurrentBalance1 == "" || isNaN(Auto1CurrentBalance1) ? 0 : parseInt(Auto1CurrentBalance1)) +
            (Auto2CurrentBalance1 == "" || isNaN(Auto2CurrentBalance1) ? 0 : parseInt(Auto2CurrentBalance1)) +
            (BoatCurrentBalance1 == "" || isNaN(BoatCurrentBalance1) ? 0 : parseInt(BoatCurrentBalance1)) +
            (PersonalCurrentBalance1 == "" || isNaN(PersonalCurrentBalance1) ? 0 : parseInt(PersonalCurrentBalance1)) +
            (OtherCurrentBalance1 == "" || isNaN(OtherCurrentBalance1) ? 0 : parseInt(OtherCurrentBalance1));

        $('#TotalLoanInsBalance').val(TotalBalance1);
        TotalBalance = $('#TotalCreditCardBal').val();
        $('#TotalDebt').val(parseInt(TotalBalance) + TotalBalance1);
        var newvalins = $('#TotalDebt').val();

        $('#window1').fadeOut('1000');
        if (newvalins != oldval) {
            check_and_comp();
            oldval = newvalins;
        }
    });

    $(document).on('keyup','#MonthlyPayment_new',function(e) {
        let monthPayVal = $('#MonthlyPayment_new').val();
        if (!isNaN(monthPayVal)) {
            check_and_comp();
        } else {
            $('#MonthlyPayment_new').val('').focus();
        }

    });

    $(document).on('click','#creditcard',function(e) {
        //$('#window').fadeIn('1000');
        var s = document.getElementById('TotalCreditCardBal').value;
        document.getElementById('CreditCardBalance1').value = 5000;
    });

    $(document).on('click','#totalinsurance',function(e) {
        //$('#window1').fadeIn('1000');
        var p = document.getElementById('TotalLoanInsBalance').value;
        document.getElementById('Auto1CurrentBalance').value = 5000;
    });

    // APR CALCULATOR JS
    $(document).on('keyup','#rate',function(e) {
        var get_hidden_rates = $(this).val();
        $("#old_rate").val(get_hidden_rates);
    });

});

(function ($) {

    $(document).ready(function () {
        var queryString = window.location.search;
        if (queryString == '?redirect-from=payday-loan') {
            $('html, body').animate({
                scrollTop: $('#intro_text').offset().top
            }, 'fast');
        }
        var pathname = window.location.pathname;
        if (pathname.includes('debt-payoff.html')) {
            var query_string = getUrlParameter('p');
            if (query_string == 'redirect_from_education') {
                setTimeout(function () { $('#check_how_much_save').trigger('click'); }, 1);
            }
        }
        var oldval = "";
        if (pathname == '/calculators/debt-consolidation-types.html') {
            page_on_load();
            oldval = document.getElementById('TotalDebt').value;
        }

        /*$("#debtPayOffCalculator").keydown(function (e) {
            if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
                (e.keyCode == 65 && e.ctrlKey === true) ||

                (e.keyCode == 67 && e.ctrlKey === true) ||

                (e.keyCode == 88 && e.ctrlKey === true) ||

                (e.keyCode >= 35 && e.keyCode <= 39)) {
                return;
            }
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
                alert('Please enter Numbers only');
            }
        });*/

        var timeout = null;
        
        /// Script of Credit Card Calculator
        /*
                var ii = 2;
                function createRow(n) {
                    for (var r = 1; r <= n; r++) {
                        $("#t1").append('<tr><td align="center"><b>#' + ii + '</b><div id="star' + ii + '" style="text-align:center;color:red;float:left;"></div></td><td align="center"><input type="text" class="form-control" size="15" value="0" name="CreditCardBalance' + ii + '" id="CreditCardBalance' + ii + '"></td><td align="center"><input type="text" size="15" class="form-control" value="0" name="CreditCardInterestRate' + ii + '" id="CreditCardInterestRate' + ii + '"></td><td align="center"><input type="text" size="15" class="form-control" value="0" name="CreditCardMonthlyPayments' + ii + '" id="CreditCardMonthlyPayments' + ii + '"></td></tr>');
                        ii++;
                    }
                }

                createRow(3);
                $('#CreditCardBalance' + 1).attr("value", 5000);
                $('#CreditCardInterestRate' + 1).attr("value", 14);
                $('#CreditCardAnnualFees' + 1).attr("value", 35);
                $('#CreditCardMonthlyPayments' + 1).attr("value", 158);

                $('#CreditCardBalance' + 2).attr("value", 6500);
                $('#CreditCardInterestRate' + 2).attr("value", 8);
                $('#CreditCardAnnualFees' + 2).attr("value", 0);
                $('#CreditCardMonthlyPayments' + 2).attr("value", 250);
                CalculateCredits();

                $('#addRows').click(function () {
                    var Optionvalues = $('#rowOpt').val();
                    createRow(Optionvalues);
                    $('#adLoan').hide();
                });

                $('#printAuth').click(function () {
                    var docToprint = document.getElementById('result');
                    newWin = window.open("");
                    newWin.document.write(docToprint.innerHTML);
                    newWin.print();
                    newWin.close();
                });

                //Debt-income-ratio Calculator JS Started

                $('div').find('.unvisited').each(function () {
                    $('a[href$="' + $(this).attr("id") + '"]').addClass("inactiveLink");
                });

                $("a.selecthref").click(function () {
                    var status_id = $(this).attr('href').split('#');
                    var get_div_id = status_id[1];
                    if ($("#" + get_div_id).hasClass('unvisited')) {

                        return false;
                    }
                });
        */

        // js function for https://local.ovlg.com/admin/banner-videos
        jQuery('.videoUrl').click(function () {
            var video_url = 'https://' + window.location.hostname + '/sites/all/themes/ovlg_bootstrap/ovlg/video/' + jQuery(this).text();
            jQuery('#edit-video-url').val(video_url);
            jQuery('#VideoLists').hide();
            jQuery.ajax({
                type: 'POST',
                url: '/get-video-banner-image-ajax',
                dataType: 'json',
                data: {
                    video_url: video_url,
                },
                success: function (data) {
                    if (data.status == 'OK') {
                        jQuery('#edit-thumb-img').val(data.thumbnail_url);
                    }
                },
            });
        });
    });
})(jQuery);