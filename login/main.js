let $signUpForm = $('form[name=signUp]')
$signUpForm.on('submit', (e) => {
  e.preventDefault()
  let string = $signUpForm.serialize() // 表单序列化
  // check form
  let email = $signUpForm.find('[name=email]').val()
  let password = $signUpForm.find('[name=password]').val()
  let password_confirmation = $signUpForm.find('[name=password_confirmation]').val()

  let errors = {}
  if(email.indexOf('@') < 0) {
    errors.email = '邮箱不合法'
  }
  if(password.length < 6) {
    errors.password = '密码太短'
  }
  if(password_confirmation !== password) {
    errors.password_confirmation = '两次密码输入不匹配'
  }
  if(Object.keys(errors).length !== 0) {
    $signUpForm.find(`span[name$=_error]`).each((index, el) => {
      $(el).text('')
    })
    for(let key in errors) {
      let value = errors[key]
      $signUpForm.find(`span[name=${key}_error]`).text(value)
    }
    return
  }
  $.ajax({
    url: $signUpForm.attr('action'),
    method: $signUpForm.attr('method'),
    data: string,
    success(response) {
      let object = JSON.parse(response)
      console.log(object)
    }
  })
})