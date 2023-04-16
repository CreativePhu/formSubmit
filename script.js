function Validator(mainForm){

    var form = document.querySelector(mainForm.form)
    var allRules = {}

    function getParent(element){
        if(element.matches('.form-group')){
            return element
        }else{
            return getParent(element.parentElement)
        }
    }

    function regex(element, inputselect){
        var message = ''
        var parentelement = getParent(inputselect)
        var messageError = parentelement.querySelector('.form-message')

        for(let i = 0; i < element.length; ++i){
            message = element[i](inputselect.value)
            if(message){
                break;
            }
        }

        if(message){
            parentelement.classList.add('invalid');
            messageError.innerText = message;
            return false
        }else{
            parentelement.classList.remove('invalid');
            messageError.innerText = '';
            return true
        }
    }

    if(form){
        var rules = mainForm.rules
        var account = {}

        form.onsubmit = function(e){
            e.preventDefault();
            var checkSubmit = true

            rules.forEach(element => {
                var inputselect = form.querySelector(element.input)

                account[inputselect.name] = inputselect.value
                if(!(regex(allRules[element.input], inputselect))){
                    checkSubmit = false
                }
            });

            if(checkSubmit){
                mainForm.onSubmit(account)
                alert('Đăng Kí Thành Công')

                rules.forEach(element => {
                    form.querySelector(element.input).value = ''
                });
                
            }else{
                alert('Đăng Kí Thất Bại')
            }
        }

        rules.forEach(element => {

            if(Array.isArray(allRules[element.input])){
                allRules[element.input].push(element.test)
            }else{
                allRules[element.input] = [element.test]
            }

            var inputselect = form.querySelector(element.input)

            inputselect.onblur = function(){
                regex(allRules[element.input], inputselect)
            }
            
            inputselect.oninput = function(){
                var parentelement = getParent(inputselect)
                var messageError = parentelement.querySelector('.form-message')
                parentelement.classList.remove('invalid');
                messageError.innerText = '';
            }
        });
    }
}

Validator.isRequired = function(inputSelect){
    return {
        input: inputSelect,
        test: function(values){
            return values ? undefined : 'Vui Lòng Nhập Trường Này'
        }
    }
}

Validator.isEmail = function(inputSelect){
    return {
        input: inputSelect,
        test: function(values){
            return values.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g) ? undefined : 'Trường Này Không Phải Là Email'
        }
    }
}

Validator.isPassWord = function(inputSelect, min){
    return {
        input: inputSelect,
        test: function(values){
            return values.length >= min ? undefined : 'Mật Khẩu Phải Hơn 8 Kí Tự'
        }
    }
}

Validator.isPassWordConfirmation = function(inputSelect, passWord){
    return {
        input: inputSelect,
        test: function(values){
            return values === passWord() ? undefined : 'Mật Khẩu Không Chính Xác'
        }
    }
}
