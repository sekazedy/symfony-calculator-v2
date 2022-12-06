$(function () {
    let operandA = null;
    let operandB = null;
    let operation = null;
    let tempEntry = 0;
    let continuous = 0;
    let controlValue = 0;
    let history = null;

    $(".input-screen").val("READY");
    $("button").on("click", function () {
        let inputValue = this.value;

        //RESET Module
        if (inputValue === "reset") {
            operandA = null;
            operandB = null;
            operation = null;
            tempEntry = 0;
            continuous = 0;
            history = null;
            controlValue = 0;
            $(".input-screen").val("READY");
            $(".history-screen").val("RESET");
        }

        //INPUT Module
        if (/\d/.test(inputValue)) {
            let inputScreenVal = $(".input-screen").val();

            if (inputScreenVal === "READY") {
                $(".input-screen").val("");
            }

            $(".input-screen").val(function () {
                tempEntry = this.value + inputValue;
                if (controlValue !== 0) {
                    operandB = tempEntry;
                }

                return tempEntry;
            });
        }

        //Decimal Module
        if (inputValue === ".") {
            $(".input-screen").val(function () {
                if (/\./.test(this.value) && inputValue === ".") {
                    tempEntry = this.value;
                } else {
                    tempEntry = this.value + inputValue;
                }

                return tempEntry;
            });
        }

        //Operations Module
        if (inputValue === "+" || inputValue === "-" || inputValue === "x" || inputValue === "/" || inputValue === "%") {
            operandA = tempEntry;
            operation = this.value;
            $(".input-screen").val("");
        }

        //Calculations Module
        if (inputValue === "=") {
            if (operandA === null && operandB === null) {
                $(".history-screen").val("RESET");
                $(".input-screen").val("READY");
            } else {
                if (operandB === null && continuous === 0) {
                    operandB = tempEntry;
                    continuous = 1;
                } else {
                    operandA = controlValue;
                }

                let showA = parseFloat(operandA).toFixed(2).toString().replace(".00", "");
                let showB = parseFloat(operandB).toFixed(2).toString().replace(".00", "");

                if (showB < 0 && operation === "-") {
                    history = showB + " " + operation + " " + showA;
                } else {
                    history = showA + " " + operation + " " + showB;
                }

                $(".history-screen").val(history);
                $(".input-screen").val(function () {
                    switch (operation) {
                        case "+":
                            tempEntry = parseFloat(operandA) + parseFloat(operandB);
                            controlValue = tempEntry;
                            tempEntry = parseFloat(tempEntry).toFixed(2).toString().replace(".00", "");

                            break;
                        case "-":
                            tempEntry = parseFloat(operandA) - parseFloat(operandB);
                            controlValue = tempEntry;
                            tempEntry = parseFloat(tempEntry).toFixed(2).toString().replace(".00", "");

                            break;
                        case "x":
                            tempEntry = parseFloat(operandA) * parseFloat(operandB);
                            controlValue = tempEntry;
                            tempEntry = parseFloat(tempEntry).toFixed(2).toString().replace(".00", "");

                            break;
                        case "/":
                            tempEntry = parseFloat(operandA) / parseFloat(operandB);
                            controlValue = tempEntry;
                            tempEntry = parseFloat(tempEntry).toFixed(2).toString().replace(".00", "");

                            break;
                        case "%":
                            tempEntry = parseFloat(operandA) % parseFloat(operandB);
                            controlValue = tempEntry;
                            tempEntry = parseFloat(tempEntry).toFixed(2).toString().replace(".00", "");

                            break;
                    }

                    $.ajax({
                        url: '/save-result',
                        method: 'POST',
                        data: {'result': tempEntry},
                        dataType: 'json',
                    });

                    return tempEntry;
                });
            }
        }

        //Negative module
        if (inputValue === "+-") {
            $(".input-screen").val(function () {
                tempEntry = -tempEntry;

                return tempEntry;
            });
        }
    });

    $('#load-last-results').on('click', function () {
        $.ajax({
            url: 'get-results',
            method: 'GET',
        })
        .done((response) => {
            let ulSelector = '.results-area ul';

            if (response.results.length) {
                if (!$(ulSelector).length) {
                    $('.results-area p').replaceWith('<ul></ul>');
                }

                $(ulSelector).empty();
                $.each(response.results, function (_, result) {
                    $(ulSelector).append(`<li>${result}</li>`);
                });
            }
        });
    });
});
